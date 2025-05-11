import { invoke } from "@tauri-apps/api/core";
import {
  handleJsonAndConvertToSaveFile,
  handleSaveFileAndExtractToJson,
  OpenProcessResult,
} from "./SaveHandler.ts";

let InfoBannerEl: HTMLDivElement | null;
let DebugListEl: HTMLUListElement | null;

let openFileBtn: HTMLButtonElement | null;
let exportFileBtn: HTMLButtonElement | null;
let overwriteFileBtn: HTMLButtonElement | null;



let panels: { [key: string]: HTMLElement } = {};


let workingFileCurrent: OpenProcessResult | null
let saveNeeded: boolean = false;



window.addEventListener("DOMContentLoaded", () => {

  InfoBannerEl = document.querySelector("#infoBanner");
  overrideConsoleAndSetDebug();
  updateNavStates()
  console.log("hi")
  console.warn("this is a warning")
  console.error("this is an error")




  openFileBtn = document.querySelector("#OpenFile");
  exportFileBtn = document.querySelector("#ExportFile");
  overwriteFileBtn = document.querySelector("#OverwriteFile");



  panels = {
    SaveFile: document.querySelector("#SaveFilePanel") as HTMLElement,
    Characters: document.querySelector("#CharactersPanel") as HTMLElement,
    Inventory: document.querySelector("#InventoryPanel") as HTMLElement,
    Backups: document.querySelector("#BackupsPanel") as HTMLElement,
    Debug: document.querySelector("#DebugPanel") as HTMLElement,
  };

  if (!openFileBtn || !InfoBannerEl || !exportFileBtn || !overwriteFileBtn) {
    alert("Please check the html - some expected elements are not here");
  }
  openFileBtn?.addEventListener("click", async () => {
    
    if (workingFileCurrent != null && saveNeeded) {
      if (!confirm("Clicking OK will DISCARD the changes made to the file you're currently editing.\nSave it before opening another one if needed.")) {
        return;
      }
      saveNeeded=false;
    }
    workingFileCurrent=null;
    updateNavStates();
    switchTab("SaveFile");

    handleSaveFileAndExtractToJson()
      .then((saveProcessResult) => {
        
        if (saveProcessResult.success) {
          workingFileCurrent = saveProcessResult;
          console.log("Opened save OK: " + workingFileCurrent.message);
          updateNavStates();
        }
        
        else console.error(saveProcessResult.message);
      })
      .catch(
        (reason) => (console.error(`Open file promise rejected. ${reason}`))
      );
console.log("updating nave after trying to open it")
  });

  exportFileBtn?.addEventListener("click", async () => {
    const jsonPath = panels["SaveFile"].getAttribute("data-json-path");
    const targetSavPath = panels["SaveFile"].getAttribute("data-target-sav-path");
    if (jsonPath && targetSavPath) {
      const result = await handleJsonAndConvertToSaveFile(jsonPath, targetSavPath);
      if (result.success) {
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    } else {
      InfoBannerEl!.innerText = "Error: JSON path or target SAV path not found.";
    }
  });


  openFileBtn?.addEventListener("click", () => {
    InfoBannerEl!.innerText = "Open File clicked";
  });

  exportFileBtn?.addEventListener("click", () => {
    InfoBannerEl!.innerText = "Export File clicked";
  });

  overwriteFileBtn?.addEventListener("click", () => {
    InfoBannerEl!.innerText = "Overwrite File clicked";
  });


  // Attach a click listener to the whole drawer.
  // We'll use event delegation here.
  const drawer = document.querySelector(".drawer");
  drawer?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    // Find the closest .nav-item (in case an inner element was clicked)
    const navItem = target.closest(".nav-item") as HTMLElement | null;
    if (!navItem) return;

    if (navItem.ariaDisabled == "true") return;
    const tab = navItem.getAttribute("data-tab");

    document.querySelectorAll(".nav-item").forEach((item) => {
      item.classList.remove("active");
    });
    // Mark the clicked item as active
    navItem.classList.add("active");

    if (tab) {
      switchTab(tab);
    }
  });



});


/**
 * Hides all panels and then displays the one specified by tabName.
 */
function switchTab(tabName: string): void {
  // Hide all panel elements.
  Object.keys(panels).forEach((key) => {
    const panel = panels[key];
    panel.style.display = "none";
  });

  // Show the target panel if it exists.
  if (panels[tabName]) {
    panels[tabName].style.display = "block";
    InfoBannerEl!.innerText = `${tabName} Tab Activated`;
  } else {
    InfoBannerEl!.innerText = `Panel for ${tabName} not found.`;
  }
}


function overrideConsoleAndSetDebug() {

  DebugListEl = document.querySelector("#logList");
  
  function addDebugLogToDebugPanel(message: string, logLevel: string | null = null) {
    const newLogEntry = document.createElement("div");
    newLogEntry.classList.add("log-message")
    if (logLevel != null) newLogEntry.classList.add("log-"+logLevel)
    newLogEntry.innerText = message;

    DebugListEl?.prepend(newLogEntry);
  
  }

  const originalConsole = console;

console = {
  ...originalConsole,
  log: (...args: any[]) => {
    originalConsole.log(...args);
    addDebugLogToDebugPanel(args.join(' '), "log");
    InfoBannerEl!.innerText = args.join(' ');
  },
  error: (...args: any[]) => {
    originalConsole.error(...args);
    addDebugLogToDebugPanel(args.join(' '), "error");
    InfoBannerEl!.innerText = args.join(' ');
  },
  warn: (...args: any[]) => {
    originalConsole.warn(...args);
    addDebugLogToDebugPanel(args.join(' '), "warn");
    InfoBannerEl!.innerText = args.join(' ');
  },
  // Override other console functions as needed
};
}

function updateNavStates() {
  const anyFileOpen: boolean = (workingFileCurrent != null)
  console.log("Currently any file open:", anyFileOpen)
  document.querySelectorAll(".fileopen-dependant").forEach((item) => {
    if (item.nodeName == "BUTTON") {
      (item as HTMLButtonElement).disabled = !anyFileOpen;
    } else     item.ariaDisabled = anyFileOpen ? null: "true";
  });
}

