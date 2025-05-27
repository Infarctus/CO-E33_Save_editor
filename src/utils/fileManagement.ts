import { open } from '@tauri-apps/plugin-dialog'
import { copyFile, mkdir, exists, remove, readDir } from '@tauri-apps/plugin-fs'
import { basename, join, appLocalDataDir } from '@tauri-apps/api/path'
import { Command } from '@tauri-apps/plugin-shell'
import type { SaveProcessResult, OpenProcessResult } from '../types/fileTypes'
import { trace, error, warn } from '@tauri-apps/plugin-log'
import { invoke } from '@tauri-apps/api/core'

// Constants for configuration
const SAVE_HANDLING_DIR_NAME = 'data' // Directory within appLocalDataDir for backups and temp files
const UESAVE_EXE_PATH = 'assets/uesave'

/**
 * Handles the core logic of backing up a .sav file, converting it to .json using uesave,
 * and reading the resulting JSON data.
 */
export async function handleSaveFileAndExtractToJson(): Promise<OpenProcessResult> {
  try {
    const originalSavPath = await open({
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
    let rename = ''
    if (fileName.endsWith('.sav')) {
      rename = fileName.replace('.sav', '.json')
    } else {
      rename = fileName + '.json'
    }
    const tempJsonPath = await join(saveHandlingBasePath, rename)

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

    // Run uesave sidecar to convert .sav to .json
    const uesaveArgsSavetoJson = ['to-json', '-i', backupDestinationPath, '-o', tempJsonPath]

    const command = Command.sidecar(UESAVE_EXE_PATH, uesaveArgsSavetoJson)
    trace('Executing command:' + UESAVE_EXE_PATH + uesaveArgsSavetoJson)

    const { stdout, stderr, code } = await command.execute()

    if (code !== 0) {
      error(`uesave execution failed with code ${code}. Stderr: ${stderr}+ Stdout: ${stdout}`)
      return {
        success: false,
        message:
          `uesave failed (code ${code}): ${stderr || stdout || 'No output from uesave'}`.trim(),
      }
    }

    if (stderr) {
      warn(`uesave (to-json) stderr: ${stderr}`)
    }

    if (stdout) {
      trace(`uesave (to-json) stdout: ${stdout}`)
    }

    return {
      success: true,
      tempJsonPath,
      originalSavPath,
      message: `File '${fileName}' backed up and converted to JSON successfully. Ready for editing.`,
    }
  } catch (error: any) {
    error('Error during save file processing:' + error)
    return {
      success: false,
      message: `An unexpected error occurred: ${error.message || String(error)}`,
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

  const uesaveArgsJsonToSav = ['from-json', '-i', jsonPath, '-o', intermediateSavPath]
  const uesaveArgsVerifyConversion = ['test-resave', intermediateSavPath]

  try {
    // Convert JSON to intermediate .sav
    const command = Command.sidecar(UESAVE_EXE_PATH, uesaveArgsJsonToSav)
    const { stdout, stderr, code } = await command.execute()

    if (code !== 0) {
      return {
        success: false,
        message: `uesave failed (code ${code}): ${stderr || stdout || 'No output from uesave'}`,
      }
    }

    if (stderr) warn(`uesave from-json stderr: ${stderr}`)
    if (stdout) trace(`uesave from-json stdout: ${stdout}`)
    trace(`JSON converted to intermediate SAV: ${intermediateSavPath}`)

    // Verify the intermediate .sav file
    const verifyCommand = Command.sidecar(UESAVE_EXE_PATH, uesaveArgsVerifyConversion)
    const {
      stdout: verifyStdout,
      stderr: verifyStderr,
      code: verifyCode,
    } = await verifyCommand.execute()

    if (verifyCode !== 0) {
      return {
        success: false,
        message: `uesave failed (code ${verifyCode}): ${verifyStderr || verifyStdout || 'No output from uesave'}`,
      }
    }

    if (verifyStderr) warn(`uesave test-resave stderr: ${verifyStderr}`)
    if (verifyStdout) trace(`uesave test-resave stdout: ${verifyStdout}`)
    trace(`Intermediate SAV verified: ${intermediateSavPath}`)

    // Copy intermediate .sav to target .sav path
    await copyFile(intermediateSavPath, targetSavPath)
    trace(`Verified SAV file copied to: ${targetSavPath}`)

    return {
      success: true,
      message: `File '${fileName}' successfully updated from JSON and saved.`,
    }
  } catch (error: any) {
    error(`Error during uesave or file operations: ${error.message}`)
    return {
      success: false,
      message: `Failed to convert JSON back to .sav or validate the file: ${error.message}`,
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
  trace("Opening " + saveHandlingBasePath)

  await invoke('open_explorer', { path: saveHandlingBasePath });
}
