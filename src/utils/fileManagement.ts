import { open } from '@tauri-apps/plugin-dialog'
import { copyFile, mkdir, exists, remove, readDir } from '@tauri-apps/plugin-fs'
import { basename, join, appLocalDataDir } from '@tauri-apps/api/path'
//import { Command } from '@tauri-apps/plugin-shell'
import type { SaveProcessResult, OpenProcessResult } from '../types/fileTypes'
import { trace, error } from '@tauri-apps/plugin-log'
import { invoke } from '@tauri-apps/api/core'

// Constants for configuration
const SAVE_HANDLING_DIR_NAME = 'data' // Directory within appLocalDataDir for backups and temp files

/**
 * Handles the core logic of backing up a .sav file, converting it to .json using uesave,
 * and reading the resulting JSON data.
 */
export async function handleSaveFileAndExtractToJson(savefilepath?: string): Promise<OpenProcessResult> {
  try {
    const originalSavPath = savefilepath || await open({
      multiple: false,
      filters: [
        {
          name: 'Save File',
          extensions: ['*'], // Accepts .sav and files with no extension
        },
      ],
    })

    if (!originalSavPath) {
      return {
        success: false,
        message: 'No file selected.',
      }
    }

    const fileName = await basename(originalSavPath)
    const userDataPath = await appLocalDataDir()
    const saveHandlingBasePath = await join(userDataPath, SAVE_HANDLING_DIR_NAME)
    const backupDir = await join(saveHandlingBasePath, 'backup')
    // Generate a timestamp in DD_MM_YY format
    const now = new Date()
    const backupDestinationPath = await join(
      backupDir,
      `${now.toISOString().replace(/:/g, '–')}_${fileName}.bak`,
    )
    const tempJsonPath = await join(saveHandlingBasePath, 'CurrentWorkingSave.json')

    // Create backup directory if it doesn't exist
    try {
      trace('Folder ' + backupDir + 'exists?:')
      const backupDirExists = await exists(backupDir)
      if (!backupDirExists) {
        await mkdir(backupDir, { recursive: true })
      }
      await copyFile(originalSavPath, backupDestinationPath)
      trace(`File '${fileName}' backed up to ${backupDestinationPath}`)
    } catch (tryerror: any) {
      error('Error backing up file:' + tryerror)
      return {
        success: false,
        message: `Failed to back up file: ${tryerror.message || String(tryerror)}`,
      }
    }

    try {
      await invoke("save_to_json", {
        savePath: originalSavPath,
        outputPath: tempJsonPath,
      })
      
      trace(`Save file converted to JSON: ${tempJsonPath}`)
    } catch (invokeError: any) {
      error(`save_to_json invocation failed: ${invokeError}`)
      return {
        success: false,
        message: `Failed to convert save file to JSON: ${invokeError || String(invokeError)}`,
      }
    }

    return {
      success: true,
      tempJsonPath,
      originalSavPath,
      message: `File '${fileName}' backed up and converted to JSON successfully. Ready for editing.`,
    }
  } catch (err: any) {
    error('Error during save file processing:' + err)
    return {
      success: false,
      message: `An unexpected error occurred: ${err.message || String(err)}`,
    }
  }
}

/**
 * Handles converting a JSON file back to a .sav file, validating it, and saving it.
 */
export async function handleJsonAndConvertToSaveFile(
  jsonPath: string,
  targetSavPath: string,
): Promise<SaveProcessResult> {
  if (!(await exists(jsonPath))) {
    return {
      success: false,
      message: 'Temporary JSON file path is invalid or file does not exist.',
    }
  }

  if (!targetSavPath) {
    return {
      success: false,
      message: 'Target .sav or noextension file path not provided.',
    }
  }

  const userDataPath = await appLocalDataDir()
  const saveHandlingBasePath = await join(userDataPath, SAVE_HANDLING_DIR_NAME)
  const fileName = await basename(targetSavPath)
  const intermediateSavPath = await join(saveHandlingBasePath, `CONVERSION_TEST_${fileName}`)

  try {
    try {
      await invoke("json_to_save",{
        jsonPath: jsonPath,
        outputPath: intermediateSavPath,
      })
    } catch (invokeError: any) {
      error(`json_to_save invocation failed: ${invokeError}`)
      throw new Error(`Failed to convert JSON to .sav: ${invokeError || String(invokeError)}`)
    }

    trace(`JSON converted to intermediate SAV: ${intermediateSavPath}`)

    
    // Verify the intermediate .sav file
    try {
      await invoke("test_resave", {
        path: intermediateSavPath,
        noWarn: true,
        debug: false,
      })
    }
    catch (invokeError: any) {
      error(`test_resave invocation failed: ${invokeError}`)
      throw new Error(`Failed to validate the intermediate SAV file: ${invokeError || String(invokeError)}`)
    }
    
    trace(`Intermediate SAV verified: ${intermediateSavPath}`)

    // Copy intermediate .sav to target .sav path
    await copyFile(intermediateSavPath, targetSavPath)
    trace(`Verified SAV file copied to: ${targetSavPath}`)

    return {
      success: true,
      message: `File '${fileName}' successfully updated from JSON and saved.`,
    }
  } catch (err: any) {
    error(`Error during uesave or file operations: ${err.message? err.message : String(err)}`)
    return {
      success: false,
      message: `Failed to convert JSON back to .sav or validate the file: ${err.message || String(err)}`,
    }
  } finally {
    // Clean up intermediate .sav file
    if (await exists(intermediateSavPath)) {
      try {
        await remove(intermediateSavPath)
        trace(`Cleaned up intermediate file: ${intermediateSavPath}`)
      } catch (cleanupError) {
        error(`Error cleaning up intermediate file ${intermediateSavPath}: ${cleanupError}`)
      }
    }
  }
}

export async function getAllBackups(): Promise<string[]> {
  const userDataPath = await appLocalDataDir()
  const saveHandlingBasePath = await join(userDataPath, SAVE_HANDLING_DIR_NAME)
  const backupDir = await join(saveHandlingBasePath, 'backup')
  return (await readDir(backupDir)).map((el) => el.name).filter((el) => el.endsWith('.bak'))
}

export async function openLocalFolder(path: string) {
  const userDataPath = await appLocalDataDir()
  const saveHandlingBasePath = await join(userDataPath, path)
  trace('Opening ' + saveHandlingBasePath)

  await invoke('open_explorer', { path: saveHandlingBasePath })
}
