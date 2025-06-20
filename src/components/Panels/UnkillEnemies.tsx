import { type FC, useMemo, useState } from 'react'
import type { GeneralPanelProps } from '../../types/panelTypes'
import { renderToggle } from '../../utils/HtmlElement'
import { error } from '@tauri-apps/plugin-log'
import { useInfo } from '../InfoContext'

const UnkillEnemies: FC<GeneralPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {
  if (!jsonMapping || !jsonMapping?.root?.properties?.BattledEnemies_0) {
    return (
      <div id='UnkillEnemies' className='tab-panel oveflow-auto'>
        <h2>Unkill Enemies</h2>
        <p style={{ color: 'red' }}>
          The file you opened (if any) doesn't look like a CO:E33 save file
        </p>
      </div>
    )
  }
  const { setInfoMessage } = useInfo()
  function logAndError(message: string) {
    setInfoMessage(message)
    error(message)
  }

  const { regularEnemies, objectIdEnemies } = useMemo(() => {
    const allEnemies = jsonMapping.root.properties.BattledEnemies_0.Map.map((enemy) => ({
      name: enemy.key.Name,
      value: enemy.value.Bool,
    }))

    const bossOrSpecial = allEnemies.filter(
      (enemy) =>
        !enemy.name.includes('ObjectID_Enemy_Level_') ||
        enemy.name.includes('EnemyWorld_Mime') ||
        enemy.name.includes('EnemyWorld_Petank'),
    )
    const objectId = allEnemies.filter(
      (enemy) =>
        enemy.name.includes('ObjectID_Enemy_Level_') &&
        !enemy.name.includes('EnemyWorld_Mime') &&
        !enemy.name.includes('EnemyWorld_Petank'),
    )

    return { regularEnemies: bossOrSpecial, objectIdEnemies: objectId }
  }, [jsonMapping])

  const [enemies, setEnemies] = useState([...regularEnemies, ...objectIdEnemies])
  const [showObjectIdEnemies, setShowObjectIdEnemies] = useState(false)
  const [searchString, setSearchString] = useState<string>('')

  // Filter enemies based on search string
  const filteredRegularEnemies = useMemo(() => {
    if (!searchString) return regularEnemies
    return regularEnemies.filter((enemy) =>
      enemy.name.toLowerCase().includes(searchString.toLowerCase()),
    )
  }, [regularEnemies, searchString])

  const filteredObjectIdEnemies = useMemo(() => {
    if (!searchString) return objectIdEnemies
    return objectIdEnemies.filter((enemy) =>
      enemy.name.toLowerCase().includes(searchString.toLowerCase()),
    )
  }, [objectIdEnemies, searchString])

  function handleToggleEnemy(enemyName: string,newBool: boolean) {
    if (enemies.findIndex((enemy) => enemy.name === enemyName) === -1) {
      logAndError(`Enemy ${enemyName} not found in the list.`)
      return
    }
    setEnemies((prev) =>
      prev.map((enemy) => {
        if (enemy.name === enemyName) {
          return { ...enemy, value: newBool }
        }
        return enemy
      }),
    )
    jsonMapping!.root.properties.BattledEnemies_0.Map.forEach((enemy) => {
      if (enemy.key.Name === enemyName) {
        enemy.value.Bool = newBool
      }
    })
    jsonMapping!.root.properties.EncounteredEnemies_0.Map.forEach((enemy) => {
      if (enemy.key.Name === enemyName) {
        enemy.value.Bool = newBool
      }
    })
    jsonMapping!.root.properties.TransientBattledEnemies_0.Map.forEach((enemy) => {
      if (enemy.key.Name === enemyName) {
        enemy.value.Bool = newBool
      }
    })


    triggerSaveNeeded()
  }

  return (
    <div id='UnkillEnemies' className='tab-panel overflow-auto'>
      <h2>Unkill Enemies</h2>

      {/* Search Bar */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type='text'
          placeholder='Search enemies...'
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#2d2d2d',
            color: 'white',
          }}
        />
      </div>

      {/* Regular Enemies */}
      <div>
        <h3>Supposed Boss Enemies ({filteredRegularEnemies.length})</h3>
        {filteredRegularEnemies.map((enemy) => (
          <div key={enemy.name}>
            {renderToggle(
              enemies.find((e) => e.name === enemy.name)?.value || false,
              (newBool) => handleToggleEnemy(enemy.name,newBool),
              enemy.name,
            )}
          </div>
        ))}
      </div>

      {/* ObjectID Enemies - Toggleable Section */}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => setShowObjectIdEnemies(!showObjectIdEnemies)}
          style={{
            marginBottom: '10px',
            padding: '5px 10px',
            backgroundColor: '#444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showObjectIdEnemies ? 'Hide' : 'Show'} Group Enemies ({filteredObjectIdEnemies.length})
        </button>

        {showObjectIdEnemies && (
          <div>
            {filteredObjectIdEnemies.map((enemy) => (
              <div key={enemy.name}>
                {renderToggle(
                  enemies.find((e) => e.name === enemy.name)?.value || false,
                  (newBool) => handleToggleEnemy(enemy.name,newBool),
                  enemy.name,
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UnkillEnemies
