import { invoke } from "@tauri-apps/api/core";
import {handleSaveFileAndExtractToJson} from "./SaveHandler.ts";


let SaveFileSelectEl: HTMLInputElement | null;



window.addEventListener("DOMContentLoaded", () => {
  SaveFileSelectEl = document.querySelector("#SaveFileSelect");
  SaveFileSelectEl?.addEventListener("click", (e) => {
    handleSaveFileAndExtractToJson();
  });
});
