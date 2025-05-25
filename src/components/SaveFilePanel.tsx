import type { FC } from 'react'
import { OpenProcessResult } from '../types/fileTypes'
import { formatPlayTime, ticksToDate } from '../utils/utils'
import { BeginMapping } from '../types/jsonSaveMapping'

interface SaveFilePanelProps {
  openResult: OpenProcessResult | null
  jsonMapping: BeginMapping | null
}

const SaveFilePanel: FC<SaveFilePanelProps> = ({ openResult, jsonMapping }) => {
  return (
    <div id='SaveFilePanel'>
      <div id='information-msg'>
        This tool allows you to edit your save files for the game. You can modify character
        attributes, inventory items, and more.
        <br />
        Steam users can edit/overwrite/hot-reload saves while the game is running, but it is{' '}
        <b>
          not recommended for GamePass users.
        </b>{' '}
         They should instead shut off the game and wait a bit.
         <br />
         If you don't want cloud saves to overwrite your modifications, easiest method is disabling internet.
        <br />
        <br />
        <hr />
        <br />
        Your save file is located at (you can copy-paste the highlighted path):
        <br />
        <ul>
          <li>
            Steam :{' '}
            <code style={{ backgroundColor: 'green' }}>%LOCALAPPDATA%\Sandfall\Saved\SaveGames\</code> +
            [user-id]\Expedition_X.sav (There's also a backup folder that you can use)

          </li>

          <li>
            Gamepass :{' '}
            <code style={{ backgroundColor: 'green' }}>
              %LOCALAPPDATA%\Packages\KeplerInteractive.Expedition33_ymj30pw7xe604\SystemAppData\wgs\
            </code>
            <br />
            If you have any issues, please check {' '}
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
            Items with <code style={{ backgroundColor: 'red' }}>**</code> may not be obtainable
            in the game, and may have unknown effects.
          </li>
          <li>
            Some items are not marked with ** but are not obtainable in the game.
          </li>
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
              It does{' '}
              {jsonMapping?.root?.properties?.CharactersCollection_0?.Map == null ? 'NOT' : ''} look
              like a CO:E33 save.
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
      </div>
    </div>
  )
}

export default SaveFilePanel
