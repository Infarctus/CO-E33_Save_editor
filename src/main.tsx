import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./styles.css"
import { attachConsole, debug, trace } from "@tauri-apps/plugin-log";
import { initGameMappings } from "./utils/gameMappingProvider";


attachConsole().then(() => {
      debug("debug HellO wOrld f108277c-f5ae-495c-901d-6d6ccf13d55a")
      trace("console debug")
    });



    initGameMappings();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
