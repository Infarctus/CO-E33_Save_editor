import { FC, useMemo, useState } from 'react'
import { GeneralPanelProps } from '../../types/panelTypes'
import { getPossibleFlags } from '../../utils/gameMappingProvider'
import { trace } from '@tauri-apps/plugin-log'

const SpawnLocationPanel: FC<GeneralPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {
  if (!jsonMapping || !jsonMapping?.root?.properties?.InventoryItems_0) {
    return (
      <div id='SpawnLocationPanel' className='tab-panel oveflow-auto'>
        <h2>Spawn Location</h2>
        <p style={{ color: 'red' }}>
          The file you opened (if any) doesn't look like a CO:E33 save file
        </p>
      </div>
    )
  }

  const Flags = useMemo(() => getPossibleFlags(), [])

  const [currlevel, setCurrLevel] = useState(jsonMapping.root.properties.MapToLoad_0.Name)
  const [currflag, setCurrFlag] = useState(
    jsonMapping.root.properties.SpawnPointTagToLoadAt_0.Struct.Struct.TagName_0.Name,
  )

  const handleFlagClick = (levelKey: string, flagKey: string) => {
    setCurrLevel(levelKey)
    setCurrFlag(flagKey)
    trace(`Setting current level to ${levelKey} and flag to ${flagKey}`)
    jsonMapping.root.properties.MapToLoad_0.Name = levelKey
    jsonMapping.root.properties.SpawnPointTagToLoadAt_0.Struct.Struct.TagName_0.Name = flagKey
    triggerSaveNeeded()
  }

  const renderLocationTable = () => {
    return Object.entries(Flags).map(([locationName, locationData]) => {
      const flags = [
        { key: locationData.MainSpawnPoint, name: 'Main', isMain: true },
        ...Object.entries(locationData.SubFlags).map(([key, flagname]) => ({
          key,
          name: flagname,
          isMain: false,
        })),
      ]

      return (
        <div
          key={locationName}
          className={`location-section${currlevel === locationData.LevelKey ? ' active' : ''}`}
        >
          <h3 className='location-header'>{locationName}</h3>
          <div className='flags-container'>
            {flags.map((flag) => (
              <div
                key={flag.key}
                className={`flag-item ${currflag === flag.key ? 'active' : ''}`}
                onClick={() => handleFlagClick(locationData.LevelKey, flag.key)}
              >
                {flag.name}
              </div>
            ))}
          </div>
        </div>
      )
    })
  }

  return (
    <div id='SpawnLocationPanel' className='tab-panel overflow-auto'>
      <h2>Spawn Location</h2>
      <p>
        This panel allows you to change the spawn location of your character in the game. <br />
        It is really wonky, so be careful when using it. And some flags dont even exist in the game.
      </p>
      <div className='spawn-location-flags'>{renderLocationTable()}</div>
    </div>
  )
}

export default SpawnLocationPanel
