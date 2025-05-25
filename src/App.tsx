'use client'

import { useState } from 'react'
import { confirm } from '@tauri-apps/plugin-dialog'
import Sidebar from './components/Sidebar'
import SaveFilePanel from './components/SaveFilePanel'
import CharactersPanel from './components/CharactersPanel'
import BackupsPanel from './components/BackupsPanel'
import RawJsonPanel from './components/RawJsonPanel'
import InfoBanner from './components/InfoBanner'
import MusicDisksPanel from './components/MusicDisksPanel'
import JournalsPanel from './components/JournalsPanel'
import {
  handleSaveFileAndExtractToJson,
  handleJsonAndConvertToSaveFile,
} from './utils/fileManagement'
import { getMappingJsonFromFile, saveMappingJsonToDisk } from './utils/jsonSaveMapping'
import type { OpenProcessResult } from './types/fileTypes'
import type { BeginMapping } from './types/jsonSaveMapping'
import './styles.css'
import PictosPanel from './components/PictosPanel'
import { trace, error } from '@tauri-apps/plugin-log'
import { useInfo } from './components/InfoContext'
import WeaponsPanel from './components/WeaponsPanel'
import RessourcesPanel from './components/RessourcesPanel'
import MonocoSkillsPanel from './components/MonocoSkillsPanel'
import QuestItemsPanel from './components/QuestItemsPanel'

function App() {
  const [activeTab, setActiveTab] = useState<string>('SaveFile')
  const [workingFileCurrent, setWorkingFileCurrent] = useState<OpenProcessResult | null>(null)
  const [saveNeeded, setSaveNeeded] = useState<boolean>(false)
  const [jsonMapping, setJsonMapping] = useState<BeginMapping | null>(null)
  // const [infoMessage, setInfoMessage] = useState<string>("Welcome. Use the Open File button to get started.")
  const [jsonChangedSinceInit, setJsonChangedSinceInit] = useState(false)
  const [updateKey, setUpdateKey] = useState(0) // State to trigger re-render

  const { infoMessage, setInfoMessage } = useInfo()
  function errorAndInfo(message: string) {
    setInfoMessage(message)
    error(message)
  }

  // Override console methods to capture logs
  // useConsoleOverride(setLogs, setInfoMessage)

  // // Use useEffect to call initGameMappings once when the component mounts
  // useEffect(() => {
  //    attachConsole().then(() => {
  //     debug("debug HellO wOrld f108277c-f5ae-495c-901d-6d6ccf13d55a")
  //     trace("console debug")
  //   });

  //   initGameMappings();
  // }, []); // Empty dependency array ensures this runs only once

  const switchTab = async (tabName: string): Promise<boolean> => {
    // Check if we're leaving the RawJson tab with unsaved changes
    if (activeTab === 'RawJson' && jsonChangedSinceInit) {
      if (
        !(await confirm(
          "Clicking OK will DISCARD the changes made in the json editor.\nClick 'Cancel', then 'Commit Changes' to save them.",
        ))
      ) {
        return false
      }
    }

    setActiveTab(tabName)
    trace(`${tabName} Tab Activated`)
    return true
  }

  const updateNavStates = (anyFileOpen: boolean) => {
    trace('Currently any file open:' + anyFileOpen)
    // This function now just updates the state
    // The UI components will use this state to determine if they should be disabled
  }

  const triggerSaveNeeded = () => {
    setSaveNeeded(true)
  }

  const handleOpenFile = async () => {
    if ((await switchTab('SaveFile')) === false) return

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
      setInfoMessage(saveProcessResult.message)
      trace('Opened save OK: ' + saveProcessResult.message)
      updateNavStates(true)

      // Load the JSON mapping
      if (saveProcessResult.tempJsonPath) {
        const mapping = await getMappingJsonFromFile(saveProcessResult.tempJsonPath)
        setJsonMapping(mapping)
      }
    } else {
      errorAndInfo(saveProcessResult.message)
    }

    setUpdateKey((prevKey) => prevKey + 1)
  }

  const handleExportFile = async () => {
    // Ensure we have a workingFileCurrent with a tempJsonPath
    if (!workingFileCurrent || !workingFileCurrent.tempJsonPath || !jsonMapping) {
      errorAndInfo('No working file (temp JSON path) available.')

      return
    }

    try {
      // First, save the JSON mapping to the working temp path
      if (!(await saveMappingJsonToDisk(workingFileCurrent.tempJsonPath, jsonMapping))) {
        errorAndInfo('Could not serialize in-memory json to disk.')
      }

      // Ask user where to save the save file (either .sav or no extension)
      const currentFileExt =
        workingFileCurrent.originalSavPath?.lastIndexOf('.') === -1
          ? '*'
          : workingFileCurrent.originalSavPath?.split('.')[1]
      trace(
        `${
          workingFileCurrent.originalSavPath
        } is the og file path (${currentFileExt}) ${workingFileCurrent.originalSavPath?.split(
          '.',
        )}`,
      )
      const { save } = await import('@tauri-apps/plugin-dialog')
      const targetSavPath = await save({
        title: 'Select the destination for the exported save file',
        filters: [
          {
            name: `${currentFileExt} File`,
            extensions: [currentFileExt ? currentFileExt : '*'],
          },
        ],
      })

      if (!targetSavPath) {
        errorAndInfo('Export canceled or no target SAV path selected.')
        return
      }

      // Now, call the conversion function
      const result = await handleJsonAndConvertToSaveFile(
        workingFileCurrent.tempJsonPath,
        targetSavPath,
      )
      if (result.success) {
        setInfoMessage(result.message)

        trace(result.message)
        setSaveNeeded(false)
      } else {
        errorAndInfo(result.message)
      }
    } catch (err) {
      errorAndInfo('Error during export process:' + err)
    } finally {
      setUpdateKey((prevKey) => prevKey + 1)
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
      errorAndInfo('No working file (original SAV path or temp JSON path) available.')
      return
    }

    try {
      // Save JSON to the temp file
      if (!(await saveMappingJsonToDisk(workingFileCurrent.tempJsonPath, jsonMapping))) {
        errorAndInfo('Could not serialize in-memory json to disk.')
      }

      // For overwrite simply use the original save file path
      const targetSavPath = workingFileCurrent.originalSavPath

      // Call the conversion function
      const result = await handleJsonAndConvertToSaveFile(
        workingFileCurrent.tempJsonPath,
        targetSavPath,
      )
      if (result.success) {
        trace(result.message)
        setInfoMessage(result.message)

        setSaveNeeded(false)
      } else {
        errorAndInfo(result.message)
      }
    } catch (err) {
      errorAndInfo('Error during overwrite process:' + err)
    } finally {
      setUpdateKey((prevKey) => prevKey + 1)
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
      trace('Committed raw json changes')
    }
  }

  return (
    <div className='layout'>
      <Sidebar
        activeTab={activeTab}
        onTabChange={switchTab}
        onOpenFile={handleOpenFile}
        onExportFile={handleExportFile}
        onOverwriteFile={handleOverwriteFile}
        anyFileOpen={workingFileCurrent !== null}
      />

      <main className='content'>
        {activeTab === 'SaveFile' && (
          <SaveFilePanel
            openResult={workingFileCurrent}
            jsonMapping={jsonMapping}
            key={updateKey}
          />
        )}

        {activeTab === 'Characters' && (
          <CharactersPanel
            workingFileCurrent={workingFileCurrent}
            jsonMapping={jsonMapping}
            triggerSaveNeeded={triggerSaveNeeded}
          />
        )}

        {activeTab === 'Pictos' && (
          <PictosPanel jsonMapping={jsonMapping} triggerSaveNeeded={triggerSaveNeeded} />
        )}
        {activeTab === 'MusicDisks' && (
          <MusicDisksPanel jsonMapping={jsonMapping} triggerSaveNeeded={triggerSaveNeeded} />
        )}
        {activeTab === 'Journals' && (
          <JournalsPanel jsonMapping={jsonMapping} triggerSaveNeeded={triggerSaveNeeded} />
        )}

        {activeTab === 'Weapons' && (
          <WeaponsPanel jsonMapping={jsonMapping} triggerSaveNeeded={triggerSaveNeeded} />
        )}
        {activeTab === 'Ressources' && (
          <RessourcesPanel jsonMapping={jsonMapping} triggerSaveNeeded={triggerSaveNeeded} />
        )}
        {activeTab === 'MonocoSkills' && (
          <MonocoSkillsPanel jsonMapping={jsonMapping} triggerSaveNeeded={triggerSaveNeeded} />
        )}
        {activeTab === 'QuestItems' && (
          <QuestItemsPanel jsonMapping={jsonMapping} triggerSaveNeeded={triggerSaveNeeded} />
        )}
        {activeTab === 'Backups' && <BackupsPanel />}

        {activeTab === 'RawJson' && (
          <RawJsonPanel
            jsonMapping={jsonMapping}
            onJsonChange={handleJsonChange}
            onCommitChanges={commitJsonChanges}
          />
        )}
      </main>

      <InfoBanner message={infoMessage} />
    </div>
  )
}

export default App
