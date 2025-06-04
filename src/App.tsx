'use client'

import { useState } from 'react'
import { confirm } from '@tauri-apps/plugin-dialog'
import Sidebar from './components/Sidebar'
import HomePanel from './components/Panels/HomePanel'
import CharactersPanel from './components/Panels/CharactersPanel'
import BackupsPanel from './components/Panels/BackupsPanel'
import RawJsonPanel from './components/Panels/RawJsonPanel'
import InfoBanner from './components/InfoBanner'
import MusicDisksPanel from './components/Panels/MusicDisksPanel'
import JournalsPanel from './components/Panels/JournalsPanel'
import PictosPanel from './components/Panels/PictosPanel'
import WeaponsPanel from './components/Panels/WeaponsPanel'
import ResourcesPanel from './components/Panels/ResourcesPanel'
import MonocoSkillsPanel from './components/Panels/MonocoSkillsPanel'
import QuestItemsPanel from './components/Panels/QuestItemsPanel'
import EsquieSkillsPanel from './components/Panels/EsquieSkillsPanel'
import { ErrorBoundary } from './utils/HtmlElement'
import {
  handleSaveFileAndExtractToJson,
  handleJsonAndConvertToSaveFile,
} from './utils/fileManagement'
import { getMappingJsonFromFile, saveMappingJsonToDisk } from './utils/jsonSaveMapping'
import type { OpenProcessResult } from './types/fileTypes'
import type { BeginMapping } from './types/jsonSaveMapping'
import './styles.css'
import { trace, error } from '@tauri-apps/plugin-log'
import { useInfo } from './components/InfoContext'
import { extname } from '@tauri-apps/api/path'

interface NavItem {
  id: string
  label: string
  icon: string
  requiresFile: boolean
  component: React.ComponentType<any>
}

// prettier-ignore
export const navItems: NavItem[] = [
  { id: 'SaveFile', label: 'Home', icon: 'btnHome.png', requiresFile: false, component: HomePanel },
  { id: 'Characters', label: 'Characters', icon: 'btnCharacters.png', requiresFile: true, component: CharactersPanel },
  { id: 'Weapons', label: 'Weapons', icon: 'btnWeapon.png', requiresFile: true, component: WeaponsPanel },
  { id: 'MonocoSkills', label: 'Monoco Skills', icon: 'btnMonocoSkills.png', requiresFile: true, component: MonocoSkillsPanel },
  { id: 'EsquieSkills', label: 'Esquie Skills', icon: 'btnEsquie.png', requiresFile: true, component: EsquieSkillsPanel },
  { id: 'Pictos', label: 'Pictos', icon: 'btnPicto.png', requiresFile: true, component: PictosPanel },
  { id: 'Resources', label: 'Resources & Misc', icon: 'btnResources.png', requiresFile: true, component: ResourcesPanel },
  { id: 'MusicDisks', label: 'Music Disks', icon: 'btnMusicRecordIcon.png', requiresFile: true, component: MusicDisksPanel },
  { id: 'Journals', label: 'Journals', icon: 'btnJournal.png', requiresFile: true, component: JournalsPanel },
  { id: 'QuestItems', label: 'Quest Items', icon: 'btnQuestItems.png', requiresFile: true, component: QuestItemsPanel },
  { id: 'RawJson', label: 'Raw json', icon: 'btnRawEditor.png', requiresFile: true, component: RawJsonPanel },
  { id: 'Backups', label: 'Backups', icon: 'btnBackup.png', requiresFile: false, component: BackupsPanel },
]

function App() {
  const [activeTab, setActiveTab] = useState<string>('SaveFile')
  const [workingFileCurrent, setWorkingFileCurrent] = useState<OpenProcessResult | null>(null)
  const [saveNeeded, setSaveNeeded] = useState<boolean>(false)
  const [jsonMapping, setJsonMapping] = useState<BeginMapping | null>(null)
  const [jsonChangedSinceInit, setJsonChangedSinceInit] = useState(false)
  const [updateKey, setUpdateKey] = useState(0)

  const { infoMessage, setInfoMessage } = useInfo()

  function errorAndInfo(message: string) {
    setInfoMessage(message)
    error(message)
  }

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

  const handleOpenFile = async (forcedPath?: string) => {
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

    const saveProcessResult = await handleSaveFileAndExtractToJson(forcedPath)
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
    if (!workingFileCurrent || !workingFileCurrent.tempJsonPath || !jsonMapping || !workingFileCurrent.originalSavPath) {
      errorAndInfo('No working file (temp JSON path) available.')
      return
    }

    try {
      // First, save the JSON mapping to the working temp path
      if (!(await saveMappingJsonToDisk(workingFileCurrent.tempJsonPath, jsonMapping))) {
        errorAndInfo('Could not serialize in-memory json to disk.')
      }

      // Ask user where to save the save file (either .sav or no extension)
      let currentFileExt: string | null = null
      try {
        const ext = await extname(workingFileCurrent.originalSavPath)
        currentFileExt = ext || null
      } catch (err) {
        if (err === "path does not have an extension") {
          currentFileExt = null
        } else {
          errorAndInfo(`Error getting file extension: ${err}, try to use Overwrite instead.`)
          return
        }
      }
          //? null
          //: workingFileCurrent.originalSavPath?.split('.')[1]
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
            name: `Export File`,
            extensions: currentFileExt ? [currentFileExt] : [],
          },
        ],
      })

      if (!targetSavPath) {
        errorAndInfo('Export canceled or no target save path selected.')
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

  const getComponentProps = (tabId: string) => {
    switch (tabId) {
      case 'SaveFile':
        return {
          openResult: workingFileCurrent,
          jsonMapping,
          key: updateKey,
        }
      case 'RawJson':
        return {
          jsonMapping,
          onJsonChange: handleJsonChange,
          onCommitChanges: commitJsonChanges,
        }
      case 'Backups':
        return {}
      default:
        return {
          jsonMapping,
          triggerSaveNeeded,
        }
    }
  }

  const renderPanels = () => {
    return navItems.map((item) => {
      if (activeTab !== item.id) return null

      const Component = item.component
      const props = getComponentProps(item.id)

      return (
        <ErrorBoundary key={item.id}>
          <Component {...props} />
        </ErrorBoundary>
      )
    })
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

      <main className='content'>{renderPanels()}</main>

      <InfoBanner message={infoMessage} />
    </div>
  )
}

export default App
