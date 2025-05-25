import { FC, useState, useMemo } from 'react'
import type { BeginMapping } from '../types/jsonSaveMapping'
import { getPossibleWeapons } from '../utils/gameMappingProvider'
import { WeaponInfoType } from '../types/jsonCustomMapping'
import { trace } from '@tauri-apps/plugin-log'
import { useInfo } from './InfoContext'
import { clamp } from '../utils/utils'

// Placeholder for a weapons customization editor component
interface WeaponsPanelProps {
  jsonMapping: BeginMapping | null
  triggerSaveNeeded: () => void
}

type SortField = 'friendlyName' | 'found' | 'level' | null
type SortDirection = 'asc' | 'desc'

const WeaponsPanel: FC<WeaponsPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {
  const { setInfoMessage } = useInfo()

  function logAndInfo(message: string) {
    setInfoMessage(message)
    trace(message)
  }

  // Initial global weapons data that uses mapping data from getPossibleWeapons and jsonMapping
  const allWeaponsMapping: [string, { [weaponKey: string]: string }][] = useMemo(() => {
    return getPossibleWeapons()
  }, [])

  // Build an inventory dictionary depending on save data, if available.
  if (!jsonMapping || !jsonMapping?.root?.properties?.InventoryItems_0) {
    return (
      <div id='WeaponsPanel' className='tab-panel oveflow-auto'>
        <h2>Weapons</h2>
        <p style={{ color: 'red' }}>
          The file you opened (if any) doesn't look like a CO:E33 save file
        </p>
      </div>
    )
  }

  const inventoryDict: { [key: string]: boolean } = useMemo(
    () =>
      Object.fromEntries(
        jsonMapping.root.properties.InventoryItems_0.Map.map((el) => [
          el.key.Name,
          el.value.Int === 1,
        ]) || [],
      ),
    [],
  )

  const equippedWeaponsToNotUnown = useMemo(
    () => jsonMapping.root.properties.CharactersCollection_0.Map.flatMap((char) => char.value.Struct.Struct.EquippedItemsPerSlot_183_3B9D37B549426C770DB5E5BE821896E9_0.Map.map((equippedItem) => equippedItem.value.Name))
      //root►properties►CharactersCollection_0►Map►0 (this is the index of the character, you can check its name inside the "key" of this item instead of the value here->)►value►Struct►Struct►EquippedItemsPerSlot_183_3B9D37B549426C770DB5E5BE821896E9_0►Map►1►value►Name:"Scaverim" 
  , [])

  const levelDict: { [key: string]: number } = useMemo(
    () =>
      Object.fromEntries(
        jsonMapping?.root.properties.WeaponProgressions_0.Array.Struct.value.map((el) => [
          el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name,
          el.Struct.CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0.Int,
        ]) || [],
      ),
    [],
  )

  // Build initial weapon info list from available weapons and the inventory info.
  const initialWeaponsDict: { [key: string]: WeaponInfoType[] } = useMemo(
    () =>
      Object.fromEntries(
        allWeaponsMapping.map(([owner, weapons]) => {
          const weaponInfoTypes: WeaponInfoType[] = Object.keys(weapons).map((name) => {
            const friendlyName = weapons[name]
            const found = !!inventoryDict[name]
            const level = levelDict[name] || 1
            return { name, friendlyName, found, level }
          })
          return [owner, weaponInfoTypes]
        }),
      ),
    [],
  )

  // State for weapons, search query, and sorting.
  const [weapons, setWeapons] = useState<{
    [keyOwner: string]: WeaponInfoType[]
  }>(initialWeaponsDict)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Called whenever an input box is toggled.
  // The function receives the weapon's name along with the updated found and mastered values.
  const handleWeaponCheckUpdate = (
    owner: string,
    weaponName: string,
    newFound: boolean,
    newLevel: number,
  ) => {
    // Update local state accordingly.
    var thisWeaponWas: WeaponInfoType = weapons[owner].find((e) => e.name === weaponName)!

    // Trigger any external save/update call.
    triggerSaveNeeded()

    if (thisWeaponWas.found && newFound == false) {
      trace('removing from inventory')
      jsonMapping.root.properties.InventoryItems_0.Map =
        jsonMapping.root.properties.InventoryItems_0.Map.filter((el) => el.key.Name !== weaponName)
      //remove from inventory

      trace('Remove from weaponProg')
      const currentArr = jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value
      const index = currentArr.findIndex(
        (el) => el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name === weaponName,
      )
      if (index !== -1) {
        // Clone the array
        const newArr = currentArr.slice()
        newArr.splice(index, 1)
        jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value = newArr
      }
    } else if (!thisWeaponWas.found && newFound) {
      trace('adding to inventory')
      jsonMapping.root.properties.InventoryItems_0.Map.push({
        key: { Name: weaponName },
        value: { Int: 1 },
      })

      // trace("adding To PassiveEffectsProgressions");
      // jsonMapping.root.properties.PassiveEffectsProgressions_0.Array.Struct.value.push(
      //   generateWeaponPassiveEffectProgression(weaponName, false, 0)
      // );
      trace('adding To weaponProg')
      console.log('adding To WeaponProg')
      jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value.push({
        Struct: {
          DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0: {
            Name: weaponName,
            tag: { data: { Other: 'NameProperty' } },
          },
          CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0: {
            Int: 1,
            tag: { data: { Other: 'IntProperty' } },
          },
        },
      })

      // add to
    } else if (newLevel != thisWeaponWas.level) {
      trace('setting prog level val to ' + newLevel)
      const currentArr = jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value
      const index = currentArr.findIndex(
        (el) => el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name === weaponName,
      )
      if (index !== -1) {
        // Clone the array
        const newArr = currentArr.slice()
        newArr[index].Struct.CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0.Int = newLevel
        jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value = newArr
      }
      // set weaponProg to 0
    }

    const updatedWeapons = { ...weapons }
    updatedWeapons[owner] = updatedWeapons[owner].map((weapon) => {
      if (weapon.name === weaponName) {
        return {
          name: thisWeaponWas.friendlyName,
          friendlyName: thisWeaponWas.friendlyName,
          found: newFound,
          level: newLevel,
        }
      }
      return weapon
    })
    setWeapons(updatedWeapons)

    logAndInfo('Weapon update:' + weaponName + ' ' + newFound + ' ' + newLevel)
  }

  // Handle sorting when headers are clicked.
  const handleSort = (field: SortField) => {
    // Determine new direction. If already sorting by this field, reverse the direction; otherwise, default to ascending.
    let direction: SortDirection = 'asc'
    if (sortField === field) {
      direction = sortDirection === 'asc' ? 'desc' : 'asc'
    }
    setSortField(field)
    setSortDirection(direction)
  }

  // Memoize and compute the final list after filtering and sorting.
  const displayedWeapons = useMemo(() => {
    let filtered = Object.entries(weapons)
      .filter(([, weaponsList]) => {
        return (weaponsList as WeaponInfoType[]).some((weapon) => {
          return weapon.friendlyName.toLowerCase().includes(searchQuery.toLowerCase())
        })
      })
      .map(([keyOwner, weaponsList]) => {
        const filteredWeaponsList = (weaponsList as WeaponInfoType[]).filter((weapon) => {
          return weapon.friendlyName.toLowerCase().includes(searchQuery.toLowerCase())
        })
        return [keyOwner, filteredWeaponsList]
      }) as [string, WeaponInfoType[]][]

    if (sortField) {
      filtered = filtered.map(([keyOwner, weaponsList]) => {
        const sortedWeaponsList = weaponsList.sort((a, b) => {
          let aVal: any
          let bVal: any
          if (sortField === 'friendlyName') {
            aVal = a.friendlyName.toLowerCase()
            bVal = b.friendlyName.toLowerCase()
          } else if (sortField === 'inInventory') {
            aVal = a[sortField] ? 1 : 0
            bVal = b[sortField] ? 1 : 0
          } else if (sortField === 'level') {
            aVal = a.level
            bVal = b.level
          }
          if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
          if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
          return 0
        })
        return [keyOwner, sortedWeaponsList]
      })
    }

    return filtered
  }, [weapons, searchQuery, sortField, sortDirection])

  return (
    <div id='WeaponsPanel' className='tab-panel-weapons oveflow-auto'>
      <h2>Weapons</h2>
      {/* Search Bar */}
      <input
        type='text'
        placeholder='Search by name...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className='search-bar'
      />
      {displayedWeapons.length != 0 && (
        <sup style={{ padding: '0.7em' }}>
          {displayedWeapons.reduce((sum, weaponOwner) => {
            return sum + weaponOwner[1].length
          }, 0)}{' '}
          results
        </sup>
      )}
      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                padding: '0.5em',
                textAlign: 'left',
                width: '10px',
              }}
            >
              Owner
            </th>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                cursor: 'pointer',
                padding: '0.5em',
              }}
              onClick={() => handleSort('friendlyName')}
            >
              Name {sortField === 'friendlyName' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                cursor: 'pointer',
                padding: '0.5em',
              }}
              onClick={() => handleSort('found')}
            >
              Found {sortField === 'found' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                cursor: 'pointer',
                padding: '0.5em',
              }}
              onClick={() => handleSort('level')}
            >
              Level {sortField === 'level' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedWeapons.map((weaponOwner) => (
            <tr 
            key={weaponOwner[0]}
           >
              <td colSpan={4}>
                <details>
                  <summary
                    style={{
                      padding: '0.5em',
                      borderBottom: '1px solid #eee',
                      borderRadius: '4px',
                    }}
                  >
                    {weaponOwner[0]}
                  </summary>
                  <table
                    style={{
                      width: 'calc(100% - 40px)',
                      borderCollapse: 'collapse',
                      marginLeft: '40px',
                    }}
                  >
                    <tbody>
                      {weaponOwner[1].map((weapon) => (
                        <tr 
                        key={weapon.name}
                          >
                          <td></td>
                          <td
                            style={{
                              padding: '1em',
                              borderBottom: '1px solid #eee',
                              borderLeft: '1px solid #eee',
                            }}
                          >
                            {weapon.friendlyName}
                          </td>
                          <td
                            style={{
                              padding: '1em',
                              borderBottom: '1px solid #eee',
                              textAlign: 'center',
                            }}

                          >
                            <label className='switch'>
                              <input
                                type='checkbox'
                                checked={weapon.found}
                        disabled={equippedWeaponsToNotUnown.includes(weapon.name)}
                          // title={equippedWeaponsToNotUnown.includes(weapon.name) ? "You can't un-find this weapon because it is currently equipped and it would break your game" : undefined}

                                onChange={(e) => {
                                  if (!e.target.checked && weapon.level !== 1) {
                                    weapon.level = 1
                                  }
                                  handleWeaponCheckUpdate(
                                    weaponOwner[0],
                                    weapon.name,
                                    e.target.checked,
                                    weapon.level,
                                  )
                                }}
                              />
                              <div className='slider round'
                                                      aria-disabled={equippedWeaponsToNotUnown.includes(weapon.name) ? true:undefined}

                          title={equippedWeaponsToNotUnown.includes(weapon.name) ? "You can't un-find this weapon because it is currently equipped and it would break your game" : undefined}
                              ></div>
                            </label>
                          </td>
                          <td
                            style={{
                              padding: '0.5em',
                              borderBottom: '1px solid #eee',
                              textAlign: 'center',
                            }}
                          >
                            <input
                              type='number'
                              min={1}
                              max={33}
                              value={weapon.level}
                              disabled={!weapon.found}
                              onChange={(e) => {
                                handleWeaponCheckUpdate(
                                  weaponOwner[0],
                                  weapon.name,
                                  weapon.found,
                                  clamp(e.target.valueAsNumber, 1, 33),
                                )
                              }}
                            />
                          </td>
                          <td
                            style={{
                              padding: '1em',
                              borderBottom: '1px solid #eee',
                            }}
                          ></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </details>
              </td>
            </tr>
          ))}
          {displayedWeapons.length === 0 && (
            <tr>
              <td
                colSpan={4}
                style={{
                  padding: '0.5em',
                  textAlign: 'center',
                }}
              >
                No weapons found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default WeaponsPanel
