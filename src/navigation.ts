import { jsonChangedSinceInit } from "./panelRawEditor";
import { confirm } from "@tauri-apps/plugin-dialog";

let panels: { [key: string]: HTMLElement } = {};
let currentlyActivatedPanel: string  = "SaveFile";

function initNavigation() {
  const drawer = document.querySelector(".drawer");

  panels = {
    SaveFile: document.querySelector("#SaveFilePanel") as HTMLElement,
    Characters: document.querySelector("#CharactersPanel") as HTMLElement,
    Inventory: document.querySelector("#InventoryPanel") as HTMLElement,
    RawJson: document.querySelector("#RawJsonPanel") as HTMLElement,
    Backups: document.querySelector("#BackupsPanel") as HTMLElement,
    Debug: document.querySelector("#DebugPanel") as HTMLElement,
  };


  drawer?.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;

    // Find the closest .nav-item (in case an inner element was clicked)
    const navItem = target.closest(".nav-item") as HTMLElement | null;
    if (!navItem) return;

    if (navItem.ariaDisabled == "true") return;
    const tab = navItem.getAttribute("data-tab");

    if (tab) {
      await switchTab(tab);
    }
  });
}

function updateNavStates(anyFileOpen: boolean) {
  console.log("Currently any file open:", anyFileOpen)
  document.querySelectorAll(".fileopen-dependant").forEach((item) => {
    if (item.nodeName == "BUTTON") {
      (item as HTMLButtonElement).disabled = !anyFileOpen;
    } else item.ariaDisabled = anyFileOpen ? null : "true";
  });
}


async function switchTab(tabName: string): Promise<boolean> {


  if (currentlyActivatedPanel == "RawJson") {
    if (jsonChangedSinceInit) {
      if (!await confirm("Clicking OK will DISCARD the changes made in the json editor.\nClick <code>Commit Changes</code> to save them.")) {
        return false;
      }
    }
  }

  document.querySelectorAll(".nav-item").forEach((item) => {
    if (!(item.getAttribute("data-tab") == tabName)) item.classList.remove("active");
    else item.classList.add("active");
  });


  // Hide all panel elements.
  Object.keys(panels).forEach((key) => {
    const panel = panels[key];
    panel.style.display = "none";
  });

  // Show the target panel if it exists.
  if (panels[tabName]) {
    panels[tabName].style.display = "block";
    console.log(`${tabName} Tab Activated`)
  currentlyActivatedPanel = tabName

    const event = new CustomEvent('tabActivated' + tabName);
    document.dispatchEvent(event);

    return true;
  } else {
    console.error(`Panel for ${tabName} not found.`)
  }
  return false;
}




export { initNavigation, updateNavStates, switchTab };
