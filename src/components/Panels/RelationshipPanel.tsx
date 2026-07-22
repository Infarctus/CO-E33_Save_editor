import { type FC, useEffect, useState } from 'react'
import type { GeneralPanelProps } from '../../types/panelTypes'
import { getCharacterNameFromRelationshipKey } from '../../types/maps'
import { trace } from '@tauri-apps/plugin-log'
import { useInfo } from '../InfoContext'

const RelationshipPanel: FC<GeneralPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {
  const { setInfoMessage } = useInfo()
  const [relationships, setRelationships] = useState(
    jsonMapping?.root?.properties?.Relationship_Level_0?.Map ?? [],
  )

  useEffect(() => {
    if (jsonMapping?.root?.properties?.Relationship_Level_0?.Map) {
      setRelationships(jsonMapping.root.properties.Relationship_Level_0.Map)
    }
  }, [jsonMapping])

  if (!jsonMapping || !jsonMapping.root?.properties?.Relationship_Level_0?.Map) {
    return (
      <div id='RelationshipPanel' className='tab-panel overflow-auto'>
        <h2>Relationship</h2>
        <p style={{ color: 'red' }}>
          The file you opened (if any) doesn't look like a CO:E33 save file
        </p>
      </div>
    )
  }

  const handleValueChange = (index: number, rawValue: string) => {
    const value = Number(rawValue)
    if (Number.isNaN(value)) return

    const entry = jsonMapping.root.properties.Relationship_Level_0.Map[index]
    entry.value.Int = value
    setRelationships([...jsonMapping.root.properties.Relationship_Level_0.Map])
    triggerSaveNeeded()
    //trace(`Relationship ${entry.key.Byte.Label} set to ${value}`)
    logAndInfo(`Relationship ${entry.key.Byte.Label} set to ${value}`)
  }

  function logAndInfo(message: string) {
    setInfoMessage(message)
    trace(message)
  }

  return (
    <div id='RelationshipPanel' className='tab-panel overflow-auto'>
      <h2>Relationship</h2>
      
      <p>
        This panel allows you to change the relationship levels of characters. <br />
        Note: Changing a relationship level in the save file does not automatically unlock its rewards. Rewards are granted only after the corresponding relationship dialogue/event is completed in camp. <br />
        e.g. To unlock the level 7 reward, set the relationship to 6, then trigger and complete the in-game relationship event to naturally reach level 7 for the reward. <br />
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {relationships.map((entry, index) => {
          let characterName = getCharacterNameFromRelationshipKey(entry.key.Byte.Label)
          if (characterName === "Unknown") { //commented character in enum set, skip render as no rel level for them
            return null;
          }

          return (
            <section key={entry.key.Byte.Label} className='relationshipCard'>
              
            <div style={{
  width: 64,
  aspectRatio: '1 / 1',
  overflow: 'hidden',
}}>
  <img
    src={`relationshipicon/${characterName}.png`}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
    }}
    alt={characterName}
  />
</div>
            <div>
              <h3 style={{ margin: 0, fontSize: '0.95rem', textAlign: 'center' }}>{characterName}</h3>
            </div>
            <div style={{ width: '100%' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                Level
              </label>
              <input
                type='number'
                min='0'
                value={entry.value.Int}
                onChange={(e) => handleValueChange(index, e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </section>
          )
        })}
      </div>
    </div>
  )
}

export default RelationshipPanel