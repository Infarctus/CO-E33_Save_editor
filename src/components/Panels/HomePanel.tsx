import { useEffect, useRef, useState, type FC } from 'react'
import { formatPlayTime, ticksToDate } from '../../utils/utils'
import { BeginMapping } from '../../types/jsonSaveMapping'
import { openLocalFolder } from '../../utils/fileManagement'
import { OpenProcessResult } from '../../types/fileTypes'
import { SaveFile, SteamSaveAuto, XBOXSaveAuto } from '../../utils/saveAutoExplorer'
import { invoke } from '@tauri-apps/api/core'
import { trace } from '@tauri-apps/plugin-log'
import { join, sep } from '@tauri-apps/api/path'
import { readDir } from '@tauri-apps/plugin-fs'

interface SaveFilePanelProps {
  openResult: OpenProcessResult | null
  jsonMapping: BeginMapping | null
}

const HomePanel: FC<SaveFilePanelProps> = ({ openResult, jsonMapping }) => {

  const [autoLoadPopupOpen, setAutoLoadPopupOpen] = useState<boolean>(false)
  const [saveFilesSteam, setSaveFilesSteam] = useState<SaveFile[]>([])
  const [indexFileEpicGamePass, setIndexFileEpicGamePass] = useState<string | null>()
  const [outputContainers, setOutputContainers] = useState<[string, string][]>()
  const popupRef = useRef<HTMLDivElement>(null);

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
          })
          const gamePassFolder = indexFileEpicGamePass.substring(0, indexFileEpicGamePass.lastIndexOf(sep()))
          var usableResult : [string, string][] = []
          result.forEach(async (pair) => {
            const containerFolder = gamePassFolder + sep() + pair[1];
            const entries = await readDir(containerFolder)
            var savName = ""
            for (const file of entries) {
              if (file.isFile && file.name.length == 32) {
                savName = file.name
                continue
              }
            }
            usableResult.push([pair[0],  containerFolder + sep() + savName])
          })
          setOutputContainers(usableResult)
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


  return (
    <div id='SaveFilePanel' className='tab-panel oveflow-auto'>
      <div id='information-msg'>
        This tool allows you to edit your save files for the game. You can modify character
        attributes, inventory items, and more.
        <br />
        Steam users can edit/overwrite/hot-reload saves while the game is running, but it is{' '}
        <b>not recommended for GamePass users.</b> They should instead shut off the game and wait a
        bit.
        <br />
        If you don't want cloud saves to overwrite your modifications, easiest method is disabling
        internet.
        <br />
        <br />
        <hr />
        <br />
        Your save file is located at (you can copy-paste the highlighted path):
        <br />
        <ul>
          <li>
            Steam :{' '}
            <code style={{ backgroundColor: 'green' }}>
              %LOCALAPPDATA%\Sandfall\Saved\SaveGames\
            </code>{' '}
            + [user-id]\Expedition_X.sav (There's also a backup folder that you can use)
          </li>

          <li>
            Gamepass :{' '}
            <code style={{ backgroundColor: 'green' }}>
              %LOCALAPPDATA%\Packages\KeplerInteractive.Expedition33_ymj30pw7xe604\SystemAppData\wgs\
            </code>
            <br />
            If you have any issues, please check{' '}
            <a
              href='https://www.nexusmods.com/clairobscurexpedition33/mods/201?tab=posts'
              target='_blank'
              rel='noopener noreferrer'
              style={{ color: 'lime' }}
            >
              the pinned post on our Nexus page
            </a>
          </li>
        </ul>
        <br />
        <hr />
        <br />
        <b>Notes:</b>
        <ul>
          <li>
            Items with <code style={{ backgroundColor: 'red' }}>**</code> may not be obtainable in
            the game, and may have unknown effects.
          </li>
          <li>Some items are not marked with ** but are not obtainable in the game.</li>
          <li>
            When you export or overwrite the save the date will be set to the current date and time.
          </li>
          <li>
            Playing around the Raw Json tab is both powerful and dangerous; use at your own risk
            <br />
            The Quest Items tab may also have unknown effects.
          </li>
        </ul>
        <br />
        <hr />
        <br />
        {(openResult !== null && (
          <div>
            <div>
              You have opened the file at <code>{openResult.originalSavPath}</code>
              <br />
              <b>
                It does{' '}
                {jsonMapping?.root?.properties?.CharactersCollection_0?.Map == null ? 'NOT' : ''}{' '}
                look like a CO:E33 save.
              </b>
              {jsonMapping?.root?.properties?.CharactersCollection_0?.Map && (
                <>
                  <br />
                  It was last saved on{' '}
                  {ticksToDate(
                    jsonMapping.root.properties.SaveDateTime_0.Struct.DateTime,
                  ).toLocaleString()}
                  <br />
                  Your playtime is {formatPlayTime(jsonMapping.root.properties.TimePlayed_0.Double)}
                </>
              )}
            </div>
          </div>
        )) || <div>No file is currently open.</div>}
        <br />
        <hr />
        <br />
        <div style={{ display: 'flex' }}>
          <button onClick={() => openLocalFolder('data')}>Open editor folder</button>
          <button onClick={() => openLocalFolder('logs')}>Open logs folder</button>
          <button onClick={() => setAutoLoadPopupOpen(true)}>Discover saves folders</button>
          {/* <button>Open editor logs</button> */}
        </div>
      </div>
      <div
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
                    {item.name}
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
                  <tr key={"container-"+item[0]}>
                    <td>
                      {item[0]}
                    </td>
                           <td>
                      {item[1]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  )
}

export default HomePanel
