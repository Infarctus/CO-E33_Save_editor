import { open } from "@tauri-apps/plugin-dialog";
import { copyFile, mkdir, exists, remove } from "@tauri-apps/plugin-fs";
import { basename, join, appLocalDataDir } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/plugin-shell";

// Constants for configuration
const SAVE_HANDLING_DIR_NAME = "data"; // Directory within appLocalDataDir for backups and temp files
const uesaveExePath = "assets/uesave";

export interface OpenProcessResult {
  success: boolean;
  message: string;
  tempJsonPath?: string;
  originalSavPath?: string;
}

export interface SaveProcessResult {
  success: boolean;
  message: string;
  savEdToPath?: string;
}

/**
 * Handles the core logic of backing up a .sav file, converting it to .json using uesave,
 * and reading the resulting JSON data.
 * @returns A promise resolving to a SaveProcessResult object.
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
    });
    if (!originalSavPath) {
      return {
        success: false,
        message: "No file selected.",
      };
    }
    const fileName = await basename(originalSavPath);
    const userDataPath = await appLocalDataDir();
    const saveHandlingBasePath = await join(
      userDataPath,
      SAVE_HANDLING_DIR_NAME
    );
    const backupDir = await join(saveHandlingBasePath, "backup");
    const backupDestinationPath = await join(backupDir, `${fileName}.bak`);
    const tempJsonPath = await join(
      saveHandlingBasePath,
      fileName.replace(".sav", ".json")
    );

    // 2. Copy the file for backup
    try {
      console.log("Folder ", backupDir, "exists?:");
      const backupDirExists = await exists(backupDir);
      if (!backupDirExists) {
        await mkdir(backupDir, { recursive: true });
      }
      await copyFile(originalSavPath, backupDestinationPath);
      console.log(`File '${fileName}' backed up to ${backupDestinationPath}`);
    } catch (error: any) {
      console.error("Error backing up file:", error);
      return {
        success: false,
        message: `Failed to back up file: ${
          (error as Error).message || String(error)
        }`,
      };
    }

    // 3. Run uesave sidecar to convert .sav (from backup) to .json
    const uesaveArgsSavetoJson = [
      "to-json",
      "-i",
      backupDestinationPath, // Convert from the backup
      "-o",
      tempJsonPath,
    ];
    const command = Command.sidecar(uesaveExePath, uesaveArgsSavetoJson);

    console.log("Executing command:", command);
    const { stdout, stderr, code } = await command.execute();

    if (code !== 0) {
      console.error(
        `uesave execution failed with code ${code}. Stderr: ${stderr}, Stdout: ${stdout}`
      );
      return {
        success: false,
        message: `uesave failed (code ${code}): ${
          stderr || stdout || "No output from uesave"
        }`.trim(),
      };
    }

    if (stderr) {
      console.warn(`uesave (to-json) stderr: ${stderr}`); // uesave might output info to stderr
    }
    if (stdout) {
      console.log(`uesave (to-json) stdout: ${stdout}`);
    }

    return {
      success: true,
      tempJsonPath,
      originalSavPath,
      message: `File '${fileName}' backed up and converted to JSON successfully. Ready for editing.`,
    };
  } catch (error: any) {
    console.error("Error during save file processing:", error);
    return {
      success: false,
      message: `An unexpected error occurred: ${
        (error as Error).message || String(error)
      }`,
    };
  }
}



/**
 * Handles converting a JSON file back to a .sav file, validating it, and saving it.
 * @param {string} jsonPath - Path to the JSON file to convert.
 * @param {string} targetSavPath - Path where the final .sav file should be saved (original save file location).
 * @returns {Promise<SaveProcessResult>}
 */
export async function handleJsonAndConvertToSaveFile(
  jsonPath: string,
  targetSavPath: string
): Promise<SaveProcessResult> {
  if (!(await exists(jsonPath))) {
    return {
      success: false,
      message: "Temporary JSON file path is invalid or file does not exist.",
    };
  }
  if (!targetSavPath) {
    return {
      success: false,
      message: "Target .sav file path not provided.",
    };
  }

  const userDataPath = await appLocalDataDir();
  const saveHandlingBasePath = await join(userDataPath, SAVE_HANDLING_DIR_NAME);
  const fileName = await basename(targetSavPath);
  // Intermediate file for conversion and testing
  const intermediateSavPath = await join(saveHandlingBasePath, `CONVERSION_TEST_${fileName}`);

  const uesaveArgsJsonToSav = [
    "from-json",
    "-i",
    jsonPath,
    "-o",
    intermediateSavPath,
  ];

  const uesaveArgsVerifyConversion = ["test-resave", intermediateSavPath];

  try {
    // 1. Convert JSON to intermediate .sav
    const command = Command.sidecar(uesaveExePath, uesaveArgsJsonToSav);
    const { stdout, stderr, code } = await command.execute();
    if (code !== 0) {
      return {
        success: false,
        message: `uesave failed (code ${code}): ${stderr || stdout || "No output from uesave"}`,
      };
    }
    if (stderr) console.warn(`uesave from-json stderr: ${stderr}`);
    if (stdout) console.log(`uesave from-json stdout: ${stdout}`);
    console.log(`JSON converted to intermediate SAV: ${intermediateSavPath}`);

    // 2. Verify the intermediate .sav file
    const verifyCommand = Command.sidecar(uesaveExePath, uesaveArgsVerifyConversion);
    const { stdout: verifyStdout, stderr: verifyStderr, code: verifyCode } = await verifyCommand.execute();
    if (verifyCode !== 0) {
      return {
        success: false,
        message: `uesave failed (code ${verifyCode}): ${verifyStderr || verifyStdout || "No output from uesave"}`,
      };
    }
    if (verifyStderr) console.warn(`uesave test-resave stderr: ${verifyStderr}`);
    if (verifyStdout) console.log(`uesave test-resave stdout: ${verifyStdout}`);
    console.log(`Intermediate SAV verified: ${intermediateSavPath}`);

    // 3. Copy intermediate .sav to target .sav path (overwriting original)
    await copyFile(intermediateSavPath, targetSavPath);
    console.log(`Verified SAV file copied to: ${targetSavPath}`);

    return {
      success: true,
      message: `File '${fileName}' successfully updated from JSON and saved.`,
    };
  } catch (error: any) {
    console.error(`Error during uesave or file operations: ${error.message}`);
    return {
      success: false,
      message: `Failed to convert JSON back to .sav or validate the file: ${error.message}`,
    };
  } finally {
    // 4. Clean up intermediate .sav file
    if (await exists(intermediateSavPath)) {
      try {
        await remove(intermediateSavPath);
        console.log(`Cleaned up intermediate file: ${intermediateSavPath}`);
      } catch (cleanupError) {
        console.error(
          `Error cleaning up intermediate file ${intermediateSavPath}: ${cleanupError}`,
        );
      }
    }
  }
}