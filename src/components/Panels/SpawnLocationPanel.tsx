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

  const Flags = getPossibleFlags()


  const renderLocationTable = () => {
    return Object.entries(Flags).map(([locationName, locationData]) => {
      // Create array of flags with MainSpawnPoint first (as "Main")
      const flags = [
        { key: 'main', name: 'Main', isMain: true },
        ...Object.entries(locationData.SubFlags).map(([key, flagname]) => ({
          key,
          name: flagname,
          isMain: false
        }))
      ]

      return (
        <div key={locationName} className='location-section'>
          <h3 className='location-header'>{locationName}</h3>
          <div className='flags-container'>
            {flags.map((flag) => (
              <div 
                key={flag.key} 
                className={`flag-item ${flag.isMain ? 'main-flag' : 'sub-flag'}`}
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
      <div className='spawn-location-flags'>
        {renderLocationTable()}
      </div>
    </div>
  )
}

export default SpawnLocationPanel
