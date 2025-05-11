import { initNavigation, switchTab, updateNavStates } from "./navigation";
import { initFileManagement } from "./filemanagement";
import { renderCharacterPanel } from "./charactersPanel";
import { updateRawJsonEditor } from "./rawEditor";

let InfoBannerEl: HTMLDivElement | null;
let DebugListEl: HTMLUListElement | null;


window.addEventListener("DOMContentLoaded", () => {
  InfoBannerEl = document.querySelector("#infoBanner");
  overrideConsoleAndSetDebug();
  initNavigation();
  initFileManagement();
  renderCharacterPanel();
  updateNavStates(false);
  updateRawJsonEditor();
  switchTab("RawJson");
  console.log("hi")
  console.warn("this is a warning")
  console.error("this is an error")
});


function infoBannerShow(message: string) {
  InfoBannerEl!.innerText = message;
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
    infoBannerShow(args.join(' '));
  },
  error: (...args: any[]) => {
    originalConsole.error(...args);
    addDebugLogToDebugPanel(args.join(' '), "error");
    infoBannerShow( args.join(' '));
  },
  warn: (...args: any[]) => {
    originalConsole.warn(...args);
    addDebugLogToDebugPanel(args.join(' '), "warn");
    infoBannerShow(args.join(' '));
  },
  // Override other console functions as needed
};
}

export { infoBannerShow }