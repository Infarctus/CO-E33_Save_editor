import { invoke } from "@tauri-apps/api/core";
import {
  handleSaveFileAndExtractToJson,
  SaveProcessResult,
} from "./SaveHandler.ts";

let InfoBannerEl: HTMLDivElement | null;

let openFileBtn: HTMLButtonElement | null;
let exportFileBtn: HTMLButtonElement | null;
let overwriteFileBtn: HTMLButtonElement | null;
let charactersTabBtn: HTMLButtonElement | null;
let inventoryTabBtn: HTMLButtonElement | null;
let backupsTabBtn: HTMLButtonElement | null;


let panels: { [key: string]: HTMLElement } = {};


window.addEventListener("DOMContentLoaded", () => {
  InfoBannerEl = document.querySelector("#infoBanner");
  
  openFileBtn = document.querySelector("#OpenFile");
  exportFileBtn = document.querySelector("#ExportFile");
  overwriteFileBtn = document.querySelector("#OverwriteFile");





  panels = {
    SaveFile: document.querySelector("#SaveFilePanel") as HTMLElement,
    Characters: document.querySelector("#CharactersPanel") as HTMLElement,
    Inventory: document.querySelector("#InventoryPanel") as HTMLElement,
    Backups: document.querySelector("#BackupsPanel") as HTMLElement,
  };

  if (!openFileBtn || !InfoBannerEl || !exportFileBtn || !overwriteFileBtn) {
    alert("Please check the html - some expected elements are not here");
  }
  openFileBtn?.addEventListener("click", async (e) => {
    handleSaveFileAndExtractToJson()
      .then((saveProcessResult) => {
        if (!saveProcessResult.success)
          InfoBannerEl!.innerText = saveProcessResult.message;
        else InfoBannerEl!.innerText = `OK`;
      })
      .catch(
        (reason) => (InfoBannerEl!.innerText = `Promise rejected. ${reason}`)
      );
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


