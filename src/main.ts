import { invoke } from "@tauri-apps/api/core";
import {
  handleSaveFileAndExtractToJson,
  SaveProcessResult,
} from "./SaveHandler.ts";

let SaveFileSelectEl: HTMLInputElement | null;

let InfoBannerEl: HTMLDivElement | null;

window.addEventListener("DOMContentLoaded", () => {
  SaveFileSelectEl = document.querySelector("#SaveFileSelect");
  InfoBannerEl = document.querySelector("#infoBanner");
  if (!SaveFileSelectEl || !InfoBannerEl) {
    alert("Please check the html - some expected elements are not here");
  }
  SaveFileSelectEl?.addEventListener("click", async (e) => {
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
});
