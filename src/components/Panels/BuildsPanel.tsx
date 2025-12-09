import { type FC, useState } from 'react'
import type { GeneralPanelProps } from '../../types/panelTypes'
import BuildSection from './BuildSection'

const BuildsPanel: FC<GeneralPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {
    const [globalUpdateTrigger, setGlobalUpdateTrigger] = useState(0)

    const handleGlobalUpdate = () => {
        setGlobalUpdateTrigger(prev => prev + 1)
    }

    if (!jsonMapping || jsonMapping?.root?.properties?.CharactersCollection_0?.Map == null) {
        return (
            <div id='BuildsPanel' className='tab-panel'>
                <h2>Builds</h2>
                <p style={{ color: 'red' }}>
                    The file you opened (if any) doesn't look like a CO:E33 save file
                </p>
            </div>
        )
    }

    const characters = jsonMapping.root.properties.CharactersCollection_0.Map

    return (
        <div id='BuildsPanel' className='tab-panel'>
            <h2>Character Builds</h2>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    overflowX: 'auto',
                    padding: '1rem',
                    gap: '1rem',
                }}
            >
                {characters.map((character, index) => (
                    <BuildSection
                        key={index}
                        character={character}
                        jsonMapping={jsonMapping}
                        triggerSaveNeeded={triggerSaveNeeded}
                        globalUpdateTrigger={globalUpdateTrigger}
                        onGlobalUpdate={handleGlobalUpdate}
                    />
                ))}
            </div>
        </div>
    )
}

export default BuildsPanel
