import { open } from "@tauri-apps/plugin-dialog";
import {
  copyFile,
  mkdir,
  exists,
} from "@tauri-apps/plugin-fs";
import { basename, join, appLocalDataDir, } from "@tauri-apps/api/path";
import { Command } from "@tauri-apps/plugin-shell";

// Constants for configuration
const SAVE_HANDLING_DIR_NAME = "data"; // Directory within appLocalDataDir for backups and temp files

export interface SaveProcessResult {
  success: boolean;
  message: string;
  tempJsonPath?: string;
  originalSavPath?: string;
}

/**
 * Handles the core logic of backing up a .sav file, converting it to .json using uesave,
 * and reading the resulting JSON data.
 * @returns A promise resolving to a SaveProcessResult object.
 */
export async function handleSaveFileAndExtractToJson(): Promise<SaveProcessResult> {
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
      console.log("Folder ",backupDir,"exists?:")
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
    const command = Command.sidecar(
      "assets/uesave",
      uesaveArgsSavetoJson
    );
    
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
