"use client"

import { useState, useEffect } from "react"
import { open, save, confirm } from "@tauri-apps/plugin-dialog"
import { copyFile, mkdir, exists, remove, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs"
import { basename, join, appLocalDataDir } from "@tauri-apps/api/path"
import { Command } from "@tauri-apps/plugin-shell"
import Sidebar from "./components/Sidebar"
import SaveFilePanel from "./components/SaveFilePanel"
import CharactersPanel from "./components/CharactersPanel"
import InventoryPanel from "./components/InventoryPanel"
import BackupsPanel from "./components/BackupsPanel"
import RawJsonPanel from "./components/RawJsonPanel"
import DebugPanel from "./components/DebugPanel"
import InfoBanner from "./components/InfoBanner"
import type { SaveProcessResult, OpenProcessResult } from "./types/fileTypes"
import "./styles.css"

function App() {
  const [activeTab, setActiveTab] = useState<string>("SaveFile")
  const [workingFileCurrent, setWorkingFileCurrent] = useState<OpenProcessResult | null>(null)
  const [saveNeeded, setSaveNeeded] = useState<boolean>(false)
  const [jsonMapping, setJsonMapping] = useState<any>(null)
  const [logs, setLogs] = useState<{ message: string; level?: string }[]>([])
  const [infoMessage, setInfoMessage] = useState<string>("Welcome. Use the Open File button to get started.")

  // Override console methods to capture logs
  useEffect(() => {
    const originalConsole = { ...console }

    console.log = (...args: any[]) => {
      originalConsole.log(...args)
      const message = args.join(" ")
      setLogs((prev) => [{ message, level: "log" }, ...prev])
      setInfoMessage(message)
    }

    console.error = (...args: any[]) => {
      originalConsole.error(...args)
      const message = args.join(" ")
      setLogs((prev) => [{ message, level: "error" }, ...prev])
      setInfoMessage(message)
    }

    console.warn = (...args: any[]) => {
      originalConsole.warn(...args)
      const message = args.join(" ")
      setLogs((prev) => [{ message, level: "warn" }, ...prev])
      setInfoMessage(message)
    }

    // For debugging
    console.log("App initialized")

    return () => {
      console.log = originalConsole.log
      console.error = originalConsole.error
      console.warn = originalConsole.warn
    }
  }, [])

  const handleSaveFileAndExtractToJson = async (): Promise<OpenProcessResult> => {
    try {
      const originalSavPath = await open({
        multiple: false,
        filters: [
          {
            name: "Save File",
            extensions: ["sav"],
          },
        ],
      })

      if (!originalSavPath) {
        return {
          success: false,
          message: "No file selected.",
        }
      }

      const fileName = await basename(originalSavPath)
      const userDataPath = await appLocalDataDir()
      const saveHandlingBasePath = await join(userDataPath, "data")
      const backupDir = await join(saveHandlingBasePath, "backup")
      const backupDestinationPath = await join(backupDir, `${fileName}.bak`)
      const tempJsonPath = await join(saveHandlingBasePath, fileName.replace(".sav", ".json"))

      // Create backup directory if it doesn't exist
      try {
        console.log("Folder ", backupDir, "exists?:")
        const backupDirExists = await exists(backupDir)
        if (!backupDirExists) {
          await mkdir(backupDir, { recursive: true })
        }
        await copyFile(originalSavPath, backupDestinationPath)
        console.log(`File '${fileName}' backed up to ${backupDestinationPath}`)
      } catch (error: any) {
        console.error("Error backing up file:", error)
        return {
          success: false,
          message: `Failed to back up file: ${error.message || String(error)}`,
        }
      }

      // Run uesave sidecar to convert .sav to .json
      const uesaveArgsSavetoJson = ["to-json", "-i", backupDestinationPath, "-o", tempJsonPath]

      const command = Command.sidecar("assets/uesave", uesaveArgsSavetoJson)
      console.log("Executing command:", "assets/uesave", uesaveArgsSavetoJson)

      const { stdout, stderr, code } = await command.execute()

      if (code !== 0) {
        console.error(`uesave execution failed with code ${code}. Stderr: ${stderr}, Stdout: ${stdout}`)
        return {
          success: false,
          message: `uesave failed (code ${code}): ${stderr || stdout || "No output from uesave"}`.trim(),
        }
      }

      if (stderr) {
        console.warn(`uesave (to-json) stderr: ${stderr}`)
      }

      if (stdout) {
        console.log(`uesave (to-json) stdout: ${stdout}`)
      }

      // Load the JSON mapping
      await getMappingJsonFromFile(tempJsonPath)

      return {
        success: true,
        tempJsonPath,
        originalSavPath,
        message: `File '${fileName}' backed up and converted to JSON successfully. Ready for editing.`,
      }
    } catch (error: any) {
      console.error("Error during save file processing:", error)
      return {
        success: false,
        message: `An unexpected error occurred: ${error.message || String(error)}`,
      }
    }
  }

  const handleJsonAndConvertToSaveFile = async (
    jsonPath: string,
    targetSavPath: string,
  ): Promise<SaveProcessResult> => {
    if (!(await exists(jsonPath))) {
      return {
        success: false,
        message: "Temporary JSON file path is invalid or file does not exist.",
      }
    }

    if (!targetSavPath) {
      return {
        success: false,
        message: "Target .sav file path not provided.",
      }
    }

    const userDataPath = await appLocalDataDir()
    const saveHandlingBasePath = await join(userDataPath, "data")
    const fileName = await basename(targetSavPath)
    const intermediateSavPath = await join(saveHandlingBasePath, `CONVERSION_TEST_${fileName}`)

    // First save the current JSON mapping to disk
    await saveMappingJsonToDisk(jsonPath)

    const uesaveArgsJsonToSav = ["from-json", "-i", jsonPath, "-o", intermediateSavPath]

    const uesaveArgsVerifyConversion = ["test-resave", intermediateSavPath]

    try {
      // Convert JSON to intermediate .sav
      const command = Command.sidecar("assets/uesave", uesaveArgsJsonToSav)
      const { stdout, stderr, code } = await command.execute()

      if (code !== 0) {
        return {
          success: false,
          message: `uesave failed (code ${code}): ${stderr || stdout || "No output from uesave"}`,
        }
      }

      if (stderr) console.warn(`uesave from-json stderr: ${stderr}`)
      if (stdout) console.log(`uesave from-json stdout: ${stdout}`)
      console.log(`JSON converted to intermediate SAV: ${intermediateSavPath}`)

      // Verify the intermediate .sav file
      const verifyCommand = Command.sidecar("assets/uesave", uesaveArgsVerifyConversion)
      const { stdout: verifyStdout, stderr: verifyStderr, code: verifyCode } = await verifyCommand.execute()

      if (verifyCode !== 0) {
        return {
          success: false,
          message: `uesave failed (code ${verifyCode}): ${verifyStderr || verifyStdout || "No output from uesave"}`,
        }
      }

      if (verifyStderr) console.warn(`uesave test-resave stderr: ${verifyStderr}`)
      if (verifyStdout) console.log(`uesave test-resave stdout: ${verifyStdout}`)
      console.log(`Intermediate SAV verified: ${intermediateSavPath}`)

      // Copy intermediate .sav to target .sav path
      await copyFile(intermediateSavPath, targetSavPath)
      console.log(`Verified SAV file copied to: ${targetSavPath}`)

      return {
        success: true,
        message: `File '${fileName}' successfully updated from JSON and saved.`,
      }
    } catch (error: any) {
      console.error(`Error during uesave or file operations: ${error.message}`)
      return {
        success: false,
        message: `Failed to convert JSON back to .sav or validate the file: ${error.message}`,
      }
    } finally {
      // Clean up intermediate .sav file
      if (await exists(intermediateSavPath)) {
        try {
          await remove(intermediateSavPath)
          console.log(`Cleaned up intermediate file: ${intermediateSavPath}`)
        } catch (cleanupError) {
          console.error(`Error cleaning up intermediate file ${intermediateSavPath}: ${cleanupError}`)
        }
      }
    }
  }

  const getMappingJsonFromFile = async (jsonPath: string) => {
    try {
      const stringJson = await readTextFile(jsonPath)
      const parsedJson = JSON.parse(stringJson)
      setJsonMapping(parsedJson)
      console.debug("Loaded JSON mapping")
      return parsedJson
    } catch (error) {
      console.error("Error loading JSON mapping:", error)
      return null
    }
  }

  const saveMappingJsonToDisk = async (targetPath: string): Promise<boolean> => {
    try {
      await writeTextFile(targetPath, JSON.stringify(jsonMapping, null, 2))
      console.log(`JSON saved to ${targetPath}`)
      return true
    } catch (err) {
      console.error("Failed to save JSON:", err)
      return false
    }
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
    } else {
      console.error(saveProcessResult.message)
    }
  }

  const handleExportFile = async () => {
    // Ensure we have a workingFileCurrent with a tempJsonPath
    if (!workingFileCurrent || !workingFileCurrent.tempJsonPath) {
      console.error("No working file (temp JSON path) available.")
      return
    }

    try {
      // First, save the JSON mapping to the working temp path
      await saveMappingJsonToDisk(workingFileCurrent.tempJsonPath)

      // Ask user where to save the .sav file
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
    if (!workingFileCurrent || !workingFileCurrent.originalSavPath || !workingFileCurrent.tempJsonPath) {
      console.error("No working file (original SAV path or temp JSON path) available.")
      return
    }

    try {
      // Save JSON to the temp file
      await saveMappingJsonToDisk(workingFileCurrent.tempJsonPath)

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

  // For RawJsonPanel
  const [jsonChangedSinceInit, setJsonChangedSinceInit] = useState(false)

  const handleJsonChange = () => {
    setJsonChangedSinceInit(true)
  }

  const commitJsonChanges = (jsonData: any) => {
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
