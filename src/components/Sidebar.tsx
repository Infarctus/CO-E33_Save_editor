'use client'

import { useEffect, useRef, useState, type FC } from 'react'
import { navItems } from '../App'
import { SaveFile, SteamSaveAuto, XBOXSaveAuto } from '../utils/saveAutoExplorer'
import { invoke } from '@tauri-apps/api/core'
import { sep } from '@tauri-apps/api/path'
import { readDir } from '@tauri-apps/plugin-fs'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => Promise<boolean>
  onOpenFile: (forcedPath?: string) => void
  onExportFile: () => void
  onOverwriteFile: () => void
  anyFileOpen: boolean
}

interface NavItem {
  id: string
  label: string
  icon: string
  requiresFile: boolean
}

const Sidebar: FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenFile,
  onExportFile,
  onOverwriteFile,
  anyFileOpen,
}) => {

  const [autoLoadPopupOpen, setAutoLoadPopupOpen] = useState<boolean>(false)
  const [saveFilesSteam, setSaveFilesSteam] = useState<SaveFile[]>([])
  const [indexFileEpicGamePass, setIndexFileEpicGamePass] = useState<string | null>()
  const [outputContainers, setOutputContainers] = useState<[string, string][]>()
  const popupRef = useRef<HTMLDivElement>(null);

  const openFileFree = () => {
    onOpenFile()
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setAutoLoadPopupOpen(false);
    }
  };

  const handleEscapePopupOutside = (event: KeyboardEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node) && event.key == "Escape") {
      setAutoLoadPopupOpen(false);
    }
  };



  useEffect(() => {
    if (indexFileEpicGamePass != null) {
      try {
        // Fetch save files asynchronously
       const fetchData = async () => {
  const result: [string, string][] = await invoke('get_expedition_folder_names_for_tauri', {
    indexPath: indexFileEpicGamePass
  });
  const gamePassFolder = indexFileEpicGamePass.substring(0, indexFileEpicGamePass.lastIndexOf(sep()));
  
  const usableResult: [string, string][] = []; // Create a new array
  for (const pair of result) {
    const containerFolder = gamePassFolder + sep() + pair[1];
    const entries = await readDir(containerFolder);
    let savName = "";
    for (const file of entries) {
      if (file.isFile && file.name.length === 32) {
        savName = file.name;
        break; // Exit the loop once you find the save name
      }
    }
    usableResult.push([pair[0], containerFolder + sep() + savName]);
  }
  setOutputContainers(usableResult); // Set the new array
};

        fetchData()

        // result is an array of [container_name, folder_name]
      } catch (err) {
        console.error(err);
      }
    } else {
      setOutputContainers([])
    }

  }, [indexFileEpicGamePass])

  useEffect(() => {
    // Set up event listeners synchronously
    if (autoLoadPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapePopupOutside);

      // Fetch save files asynchronously
      const fetchData = async () => {
        const saveFilesSteam = await SteamSaveAuto() || [];
        setSaveFilesSteam(saveFilesSteam);
        const indexFileA = await XBOXSaveAuto();
        setIndexFileEpicGamePass(indexFileA);
      };

      fetchData();
    } else {
      // Clean up event listeners synchronously
      document.removeEventListener('keydown', handleEscapePopupOutside);
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleEscapePopupOutside);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [autoLoadPopupOpen]); // Add dependencies if needed



  const renderNavItem = (item: NavItem) => {
    const isDisabled = item.requiresFile && !anyFileOpen
    const handleClick = () => {
      if (!isDisabled) {
        onTabChange(item.id)
      }
    }

    return (
      <li
        key={item.id}
        data-tab={item.id}
        className={`nav-item ${item.requiresFile ? 'fileopen-dependant' : ''} ${
          activeTab === item.id ? 'active' : ''
        }`}
        aria-disabled={isDisabled ? 'true' : undefined}
        onClick={handleClick}
      >
        <img src={'/iconsidebar/' + item.icon} alt={item.label} className='nav-icon' />
        <span>{item.label}</span>
      </li>
    )
  }

  return (
    <><aside className='drawer'>
      <button
        className='tab-button'
        onClick={() => setAutoLoadPopupOpen(true)}
        title='Let the app search for the most common locations your Steam/Game pass saves might be'
      >Autodiscover saves</button>
      <button
        id='OpenFile'
        className='tab-button'
        onClick={openFileFree}
        title='Select your save file'
      >
        Open File
      </button>
      <div className='export-overwrite'>
        <button
          id='ExportFile'
          className='tab-button fileopen-dependant'
          onClick={onExportFile}
          disabled={!anyFileOpen}
          style={{ width: '49%', marginRight: '2%' }}
          title={anyFileOpen
            ? 'Export a file to wherever you want.\nYou will be prompted for the target destination.'
            : "Open a file before trying to export it\nIt's just over this button"}
        >
          Export
        </button>

        <button
          id='OverwriteFile'
          className='tab-button fileopen-dependant'
          onClick={onOverwriteFile}
          disabled={!anyFileOpen}
          style={{ width: '49%' }}
          title={anyFileOpen
            ? 'Directly overwrite the file you opened.\nUses the same file location and name.'
            : "Open a file before trying to overwrite it\nIt's just over this button"}
        >
          Overwrite
        </button>
        

      </div>

      <div className='spacer'></div>

      <ul className='nav-list'>{navItems.map(renderNavItem)}</ul>
    </aside><div
      className={`${autoLoadPopupOpen ? '' : 'hidden'}`}
    >
        <div id='AutoLoadPopup' className='popup' ref={popupRef}>
          <h2>Autodiscovery</h2>

          <table>
            <thead>
              <th>
                <td>
                  Steam Saves
                </td>
              </th>
            </thead>
            <tbody>
              {saveFilesSteam.length == 0 && (
                <tr>
                  Nothing found
                </tr>
              )}
              {saveFilesSteam.map((item) => (
                <tr key={item.path}>
                  <td>
                    <button 
                    onClick={()=>{onOpenFile(item.path); setAutoLoadPopupOpen(false);}}>
                    {item.name}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


          <br />
          <br />
          <table>
            <thead>
              <th>
                <td>
                  Game Pass
                </td>
              </th>
            </thead>
            <tbody>
              {indexFileEpicGamePass === null && (
                <tr>
                  No containers.index file found
                </tr>
              )}
              {outputContainers === undefined && (
                <tr>
                  No EXPEDITION_* found inside the index
                </tr>
              )}

              {outputContainers?.map((item) => (
                <tr key={"container-" + item[0]}>
                  <td>
                    <button
                    onClick={()=>{onOpenFile(item[1]); setAutoLoadPopupOpen(false);}}>
                    
                    {item[0]}</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div></>
  )
}

export default Sidebar
