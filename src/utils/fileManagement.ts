import { open } from "@tauri-apps/plugin-dialog"
import { copyFile, mkdir, exists, remove } from "@tauri-apps/plugin-fs"
import { basename, join, appLocalDataDir } from "@tauri-apps/api/path"
import { Command } from "@tauri-apps/plugin-shell"
import type { SaveProcessResult, OpenProcessResult } from "../types/fileTypes"

// Constants for configuration
const SAVE_HANDLING_DIR_NAME = "data" // Directory within appLocalDataDir for backups and temp files
const UESAVE_EXE_PATH = "assets/uesave"

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
          name: "Save File",
          extensions: ["sav"],
        },
      ],
    })

    if (!originalSavPath) {
      return {
        success: false,
        message: "No file selected.",
      }
    }

    const fileName = await basename(originalSavPath)
    const userDataPath = await appLocalDataDir()
    const saveHandlingBasePath = await join(userDataPath, SAVE_HANDLING_DIR_NAME)
    const backupDir = await join(saveHandlingBasePath, "backup")
    const backupDestinationPath = await join(backupDir, `${fileName}.bak`)
    const tempJsonPath = await join(saveHandlingBasePath, fileName.replace(".sav", ".json"))

    // Create backup directory if it doesn't exist
    try {
      console.log("Folder ", backupDir, "exists?:")
      const backupDirExists = await exists(backupDir)
      if (!backupDirExists) {
        await mkdir(backupDir, { recursive: true })
      }
      await copyFile(originalSavPath, backupDestinationPath)
      console.log(`File '${fileName}' backed up to ${backupDestinationPath}`)
    } catch (error: any) {
      console.error("Error backing up file:", error)
      return {
        success: false,
        message: `Failed to back up file: ${error.message || String(error)}`,
      }
    }

    // Run uesave sidecar to convert .sav to .json
    const uesaveArgsSavetoJson = ["to-json", "-i", backupDestinationPath, "-o", tempJsonPath]

    const command = Command.sidecar(UESAVE_EXE_PATH, uesaveArgsSavetoJson)
    console.log("Executing command:", UESAVE_EXE_PATH, uesaveArgsSavetoJson)

    const { stdout, stderr, code } = await command.execute()

    if (code !== 0) {
      console.error(`uesave execution failed with code ${code}. Stderr: ${stderr}, Stdout: ${stdout}`)
      return {
        success: false,
        message: `uesave failed (code ${code}): ${stderr || stdout || "No output from uesave"}`.trim(),
      }
    }

    if (stderr) {
      console.warn(`uesave (to-json) stderr: ${stderr}`)
    }

    if (stdout) {
      console.log(`uesave (to-json) stdout: ${stdout}`)
    }

    return {
      success: true,
      tempJsonPath,
      originalSavPath,
      message: `File '${fileName}' backed up and converted to JSON successfully. Ready for editing.`,
    }
  } catch (error: any) {
    console.error("Error during save file processing:", error)
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
      message: "Temporary JSON file path is invalid or file does not exist.",
    }
  }

  if (!targetSavPath) {
    return {
      success: false,
      message: "Target .sav file path not provided.",
    }
  }

  const userDataPath = await appLocalDataDir()
  const saveHandlingBasePath = await join(userDataPath, SAVE_HANDLING_DIR_NAME)
  const fileName = await basename(targetSavPath)
  const intermediateSavPath = await join(saveHandlingBasePath, `CONVERSION_TEST_${fileName}`)

  const uesaveArgsJsonToSav = ["from-json", "-i", jsonPath, "-o", intermediateSavPath]
  const uesaveArgsVerifyConversion = ["test-resave", intermediateSavPath]

  try {
    // Convert JSON to intermediate .sav
    const command = Command.sidecar(UESAVE_EXE_PATH, uesaveArgsJsonToSav)
    const { stdout, stderr, code } = await command.execute()

    if (code !== 0) {
      return {
        success: false,
        message: `uesave failed (code ${code}): ${stderr || stdout || "No output from uesave"}`,
      }
    }

    if (stderr) console.warn(`uesave from-json stderr: ${stderr}`)
    if (stdout) console.log(`uesave from-json stdout: ${stdout}`)
    console.log(`JSON converted to intermediate SAV: ${intermediateSavPath}`)

    // Verify the intermediate .sav file
    const verifyCommand = Command.sidecar(UESAVE_EXE_PATH, uesaveArgsVerifyConversion)
    const { stdout: verifyStdout, stderr: verifyStderr, code: verifyCode } = await verifyCommand.execute()

    if (verifyCode !== 0) {
      return {
        success: false,
        message: `uesave failed (code ${verifyCode}): ${verifyStderr || verifyStdout || "No output from uesave"}`,
      }
    }

    if (verifyStderr) console.warn(`uesave test-resave stderr: ${verifyStderr}`)
    if (verifyStdout) console.log(`uesave test-resave stdout: ${verifyStdout}`)
    console.log(`Intermediate SAV verified: ${intermediateSavPath}`)

    // Copy intermediate .sav to target .sav path
    await copyFile(intermediateSavPath, targetSavPath)
    console.log(`Verified SAV file copied to: ${targetSavPath}`)

    return {
      success: true,
      message: `File '${fileName}' successfully updated from JSON and saved.`,
    }
  } catch (error: any) {
    console.error(`Error during uesave or file operations: ${error.message}`)
    return {
      success: false,
      message: `Failed to convert JSON back to .sav or validate the file: ${error.message}`,
    }
  } finally {
    // Clean up intermediate .sav file
    if (await exists(intermediateSavPath)) {
      try {
        await remove(intermediateSavPath)
        console.log(`Cleaned up intermediate file: ${intermediateSavPath}`)
      } catch (cleanupError) {
        console.error(`Error cleaning up intermediate file ${intermediateSavPath}: ${cleanupError}`)
      }
    }
  }
}
