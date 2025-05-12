import { switchTab, updateNavStates } from "./navigation.ts";
import { handleJsonAndConvertToSaveFile, handleSaveFileAndExtractToJson, OpenProcessResult, SaveProcessResult } from "./SaveHandler.ts";
import { getMappingJsonFromFile, saveMappingJsonToDisk } from "./mappingjson/mappingjson.ts";
import { save } from "@tauri-apps/plugin-dialog";
import { renderCharacterPanel } from "./charactersPanel.ts";

let workingFileCurrent: OpenProcessResult | null;
let saveNeeded: boolean = false;

let openFileBtn: HTMLButtonElement | null;
let exportFileBtn: HTMLButtonElement | null;
let overwriteFileBtn: HTMLButtonElement | null;

function initFileManagement() {
  openFileBtn = document.querySelector("#OpenFile");
  exportFileBtn = document.querySelector("#ExportFile");
  overwriteFileBtn = document.querySelector("#OverwriteFile");

  openFileBtn?.addEventListener("click", async () => {
    switchTab("SaveFile")
    if (workingFileCurrent != null && saveNeeded) {
      if (!confirm("Clicking OK will DISCARD the changes made to the file you're currently editing.\nSave it before opening another one if needed.")) {
        return;
      }
      saveNeeded = false;
    }
    workingFileCurrent = null;
    updateNavStates(false);

    handleSaveFileAndExtractToJson()
      .then((saveProcessResult) => {
        if (saveProcessResult.success) {
          workingFileCurrent = saveProcessResult;
          console.log("Opened save OK: " + workingFileCurrent.message);
          updateNavStates(true);
          if (saveProcessResult.tempJsonPath) {
            getMappingJsonFromFile(saveProcessResult.tempJsonPath)
          }
        } else {
          console.error(saveProcessResult.message);
        }
      })
      .catch(
        (reason) => (console.error(`Open file promise rejected. ${reason}`))
      );
  });

  exportFileBtn?.addEventListener("click", async () => {
    // Ensure we have a workingFileCurrent with a tempJsonPath
    if (!workingFileCurrent || !workingFileCurrent.tempJsonPath) {
      console.error("No working file (temp JSON path) available.");
      return;
    }

    try {
      // First, save the JSON BeginMapping to the working temp path
      await saveMappingJsonToDisk(workingFileCurrent.tempJsonPath);


      // Ask user where to save the .sav file using tauri's dialog save API
      const targetSavPath = await save({
        title: "Select the destination for the exported .sav file",
        filters: [{ name: "SAV File", extensions: ["sav"] }]
      });

      if (!targetSavPath) {
        console.error("Export canceled or no target SAV path selected.");
        return;
      }

      // Now, call the external conversion function.
      const result: SaveProcessResult = await handleJsonAndConvertToSaveFile(workingFileCurrent.tempJsonPath, targetSavPath);
      if (result.success) {
        console.log(result.message);
      } else {
        console.error(result.message);
      }

    } catch (err) {
      console.error("Error during export process:", err);
    }
  });

  overwriteFileBtn?.addEventListener("click", async () => {
    // Ensure we have a workingFileCurrent with an originalSavPath
    if (!workingFileCurrent || !workingFileCurrent.originalSavPath || !workingFileCurrent.tempJsonPath) {
      console.error("No working file (original SAV path or temp JSON path) available.");
      return;
    }

    try {
      // Save JSON to the temp file
      await saveMappingJsonToDisk(workingFileCurrent.tempJsonPath);


      // For overwrite simply use the original save file path
      const targetSavPath = workingFileCurrent.originalSavPath;

      // Call the external conversion function.
      const result: SaveProcessResult = await handleJsonAndConvertToSaveFile(workingFileCurrent.tempJsonPath, targetSavPath);
      if (result.success) {
        console.log(result.message);
      } else {
        console.error(result.message);
      }

    } catch (err) {
      console.error("Error during overwrite process:", err);
    }
  });
}

export { initFileManagement, workingFileCurrent, updateNavStates };
