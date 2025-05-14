"use client"

import { useEffect, useState } from "react"
import { confirm } from "@tauri-apps/plugin-dialog"
import Sidebar from "./components/Sidebar"
import SaveFilePanel from "./components/SaveFilePanel"
import CharactersPanel from "./components/CharactersPanel"
import InventoryPanel from "./components/InventoryPanel"
import BackupsPanel from "./components/BackupsPanel"
import RawJsonPanel from "./components/RawJsonPanel"
import DebugPanel from "./components/DebugPanel"
import InfoBanner from "./components/InfoBanner"
import { handleSaveFileAndExtractToJson, handleJsonAndConvertToSaveFile } from "./utils/fileManagement"
import { getMappingJsonFromFile, saveMappingJsonToDisk } from "./utils/jsonSaveMapping"
import { useConsoleOverride } from "./utils/logging"
import type { OpenProcessResult } from "./types/fileTypes"
import type { BeginMapping } from "./types/jsonSaveMapping"
import "./styles.css"
import { initGameMappings } from "./utils/gameMappingProvider"

function App() {
  const [activeTab, setActiveTab] = useState<string>("SaveFile")
  const [workingFileCurrent, setWorkingFileCurrent] = useState<OpenProcessResult | null>(null)
  const [saveNeeded, setSaveNeeded] = useState<boolean>(false)
  const [jsonMapping, setJsonMapping] = useState<BeginMapping | null>(null)
  const [logs, setLogs] = useState<{ message: string; level?: string }[]>([])
  const [infoMessage, setInfoMessage] = useState<string>("Welcome. Use the Open File button to get started.")
  const [jsonChangedSinceInit, setJsonChangedSinceInit] = useState(false)

  
  // Override console methods to capture logs
  useConsoleOverride(setLogs, setInfoMessage)


    // Use useEffect to call initGameMappings once when the component mounts
  useEffect(() => {
    initGameMappings();
  }, []); // Empty dependency array ensures this runs only once


  const switchTab = async (tabName: string): Promise<boolean> => {
    // Check if we're leaving the RawJson tab with unsaved changes
    if (activeTab === "RawJson" && jsonChangedSinceInit) {
      if (
        !(await confirm(
          "Clicking OK will DISCARD the changes made in the json editor.\nClick 'Commit Changes' to save them.",
        ))
      ) {
        return false
      }
    }

    setActiveTab(tabName)
    console.log(`${tabName} Tab Activated`)
    return true
  }

  const updateNavStates = (anyFileOpen: boolean) => {
    console.log("Currently any file open:", anyFileOpen)
    // This function now just updates the state
    // The UI components will use this state to determine if they should be disabled
  }

  const triggerSaveNeeded = () => {
    setSaveNeeded(true)
  }

  const handleOpenFile = async () => {
    if ((await switchTab("SaveFile")) === false) return

    if (workingFileCurrent != null && saveNeeded) {
      if (
        !(await confirm(
          "Clicking OK will DISCARD the changes made to the file you're currently editing.\nSave it before opening another one if needed.",
        ))
      ) {
        return
      }
      setSaveNeeded(false)
    }

    setWorkingFileCurrent(null)
    updateNavStates(false)

    const saveProcessResult = await handleSaveFileAndExtractToJson()
    if (saveProcessResult.success) {
      setWorkingFileCurrent(saveProcessResult)
      console.log("Opened save OK: " + saveProcessResult.message)
      updateNavStates(true)

      // Load the JSON mapping
      if (saveProcessResult.tempJsonPath) {
        const mapping = await getMappingJsonFromFile(saveProcessResult.tempJsonPath)
        setJsonMapping(mapping)
      }
    } else {
      console.error(saveProcessResult.message)
    }
  }

  const handleExportFile = async () => {
    // Ensure we have a workingFileCurrent with a tempJsonPath
    if (!workingFileCurrent || !workingFileCurrent.tempJsonPath || !jsonMapping) {
      console.error("No working file (temp JSON path) available.")
      return
    }

    try {
      // First, save the JSON mapping to the working temp path
      await saveMappingJsonToDisk(workingFileCurrent.tempJsonPath, jsonMapping)

      // Ask user where to save the .sav file
      const { save } = await import("@tauri-apps/plugin-dialog")
      const targetSavPath = await save({
        title: "Select the destination for the exported .sav file",
        filters: [{ name: "SAV File", extensions: ["sav"] }],
      })

      if (!targetSavPath) {
        console.error("Export canceled or no target SAV path selected.")
        return
      }

      // Now, call the conversion function
      const result = await handleJsonAndConvertToSaveFile(workingFileCurrent.tempJsonPath, targetSavPath)
      if (result.success) {
        console.log(result.message)
        setSaveNeeded(false)
      } else {
        console.error(result.message)
      }
    } catch (err) {
      console.error("Error during export process:", err)
    }
  }

  const handleOverwriteFile = async () => {
    // Ensure we have a workingFileCurrent with an originalSavPath
    if (
      !workingFileCurrent ||
      !workingFileCurrent.originalSavPath ||
      !workingFileCurrent.tempJsonPath ||
      !jsonMapping
    ) {
      console.error("No working file (original SAV path or temp JSON path) available.")
      return
    }

    try {
      // Save JSON to the temp file
      await saveMappingJsonToDisk(workingFileCurrent.tempJsonPath, jsonMapping)

      // For overwrite simply use the original save file path
      const targetSavPath = workingFileCurrent.originalSavPath

      // Call the conversion function
      const result = await handleJsonAndConvertToSaveFile(workingFileCurrent.tempJsonPath, targetSavPath)
      if (result.success) {
        console.log(result.message)
        setSaveNeeded(false)
      } else {
        console.error(result.message)
      }
    } catch (err) {
      console.error("Error during overwrite process:", err)
    }
  }

  const handleJsonChange = () => {
    setJsonChangedSinceInit(true)
  }

  const commitJsonChanges = (jsonData: BeginMapping) => {
    if (workingFileCurrent != null) {
      setJsonChangedSinceInit(false)
      triggerSaveNeeded()
      setJsonMapping(jsonData)
      console.log("Committed raw json changes")
    }
  }

  return (
    <div className="layout">
      <Sidebar
        activeTab={activeTab}
        onTabChange={switchTab}
        onOpenFile={handleOpenFile}
        onExportFile={handleExportFile}
        onOverwriteFile={handleOverwriteFile}
        anyFileOpen={workingFileCurrent !== null}
      />

      <main className="content">
        {activeTab === "SaveFile" && <SaveFilePanel />}

        {activeTab === "Characters" && (
          <CharactersPanel
            workingFileCurrent={workingFileCurrent}
            jsonMapping={jsonMapping}
            triggerSaveNeeded={triggerSaveNeeded}
          />
        )}

        {activeTab === "Inventory" && <InventoryPanel />}

        {activeTab === "Backups" && <BackupsPanel />}

        {activeTab === "RawJson" && (
          <RawJsonPanel jsonMapping={jsonMapping} onJsonChange={handleJsonChange} onCommitChanges={commitJsonChanges} />
        )}

        {activeTab === "Debug" && <DebugPanel logs={logs} />}
      </main>

      <InfoBanner message={infoMessage} />
    </div>
  )
}

export default App
