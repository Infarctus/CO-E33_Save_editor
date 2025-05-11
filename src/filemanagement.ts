import { switchTab, updateNavStates } from "./navigation.ts";
import { handleJsonAndConvertToSaveFile, handleSaveFileAndExtractToJson, OpenProcessResult } from "./SaveHandler.ts";

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
    if (workingFileCurrent != null && saveNeeded) {
      if (!confirm("Clicking OK will DISCARD the changes made to the file you're currently editing.\nSave it before opening another one if needed.")) {
        return;
      }
      saveNeeded=false;
    }
    workingFileCurrent=null;
    updateNavStates(false);
    switchTab("SaveFile");

    handleSaveFileAndExtractToJson()
      .then((saveProcessResult) => {
        if (saveProcessResult.success) {
          workingFileCurrent = saveProcessResult;
          console.log("Opened save OK: " + workingFileCurrent.message);
          updateNavStates(true);
        } else {
          console.error(saveProcessResult.message);
        }
      })
      .catch(
        (reason) => (console.error(`Open file promise rejected. ${reason}`))
      );
  });

  exportFileBtn?.addEventListener("click", async () => {
    const jsonPath = "todo"
    const targetSavPath = "todo"
    if (jsonPath && targetSavPath) {
      const result = await handleJsonAndConvertToSaveFile(jsonPath, targetSavPath);
      if (result.success) {
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    } else {
      console.error("Error: JSON path or target SAV path not found.");
    }
  });
}

export { initFileManagement, workingFileCurrent, updateNavStates };
