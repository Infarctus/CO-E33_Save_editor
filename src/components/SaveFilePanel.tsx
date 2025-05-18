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
        <div id="SaveFilePanel">
            <div id="information-msg">
                This tool allows you to edit your save files for the game. You
                can modify character attributes, inventory items, and more.
                <br />
                <b>
                    Keep the game open on the main menu while modifying the
                    files to be sure that the cloud saves does not overwrite
                    your changes.
                </b>{' '}
                (Mostly for gamepass users)
                <br />
                <br />
                Your save file is located at (you can copy-paste the highlighted
                path):
                <br />
                Steam :{' '}
                <code style={{ backgroundColor: 'green' }}>
                    %LOCALAPPDATA%\Sandfall\Saved\SaveGames\
                </code>{' '}
                + [user-id]\Expedition_X.sav (There's also a backup folder that
                you can use)
                <br />
                <br />
                Gamepass :{' '}
                <code style={{ backgroundColor: 'green' }}>
                    %LOCALAPPDATA%\Packages\KeplerInteractive.Expedition33_ymj30pw7xe604\SystemAppData\wgs\
                </code>
                <br />
                If you have any issues, please check :
                <a
                    href="https://www.nexusmods.com/clairobscurexpedition33/mods/201?tab=posts"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'lime' }}
                >
                    Click here
                </a>
                <br />
                <b>Note:</b>
                <br />- Items with{' '}
                <code style={{ backgroundColor: 'red' }}>**</code> may not be
                obtainable in the game, and may have unknown effects.
                <br />
                - Some items are not marked with a ** but are not obtainable in
                the game.
                <br />- When you export or overwrite the save the date will be
                set to the current date and time.
                <b>Note:</b> When you export or overwrite the save the date will
                be set to the current date and time.
                <br />
                <br />
                {(openResult !== null && (
                    <div>
                        <div>
                            You have opened the file at{' '}
                            <code>{openResult.originalSavPath}</code>
                            <br />
                            It does{' '}
                            {jsonMapping?.root?.properties
                                ?.CharactersCollection_0?.Map == null
                                ? 'NOT'
                                : ''}{' '}
                            look like a CO:E33 save.
                            {jsonMapping?.root?.properties
                                ?.CharactersCollection_0?.Map && (
                                <>
                                    <br />
                                    It was last saved on{' '}
                                    {ticksToDate(
                                        jsonMapping.root.properties
                                            .SaveDateTime_0.Struct.DateTime
                                    ).toLocaleString()}
                                    <br />
                                    Your playtime is{' '}
                                    {formatPlayTime(
                                        jsonMapping.root.properties.TimePlayed_0
                                            .Double
                                    )}
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
