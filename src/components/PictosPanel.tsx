import { FC, useState, useMemo } from 'react'
import {
  generateInventoryItems_0,
  generatePassiveEffectProgression,
  generatePictoPassiveEffectProgression,
} from '../utils/jsonSaveMapping'
import { getPossiblePictos } from '../utils/gameMappingProvider'
import { PictoInfo as PictoInfoType } from '../types/jsonCustomMapping'
import { error, trace } from '@tauri-apps/plugin-log'
import { useInfo } from './InfoContext'
import { clamp } from '../utils/utils'
import type { GeneralPanelProps } from '../types/panelTypes'

type SortField = 'friendlyName' | 'found' | 'mastered' | 'level' | null
type SortDirection = 'asc' | 'desc'

const PictosPanel: FC<GeneralPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {

  const { setInfoMessage } = useInfo()

  function logAndInfo(message: string) {
    setInfoMessage(message)
    trace(message)
  }

  function logAndError(message: string) {
    setInfoMessage(message)
    error(message)
  }

  // Build an inventory dictionary depending on save data, if available.
  if (!jsonMapping || !jsonMapping?.root?.properties?.InventoryItems_0) {
    return (
      <div id='PictosPanel' className='tab-panel oveflow-auto'>
        <h2>Pictos</h2>
        <p style={{ color: 'red' }}>
          The file you opened (if any) doesn't look like a CO:E33 save file
        </p>
      </div>
    )
  }
  if (!jsonMapping.root.properties.PassiveEffectsProgressions_0) {
    jsonMapping.root.properties.PassiveEffectsProgressions_0 = generatePassiveEffectProgression()
  }

  // Initial global pictos data that uses mapping data from getPossiblePictos and jsonMapping
  const allPictosMapping: [string, string][] = useMemo(() => {
    return getPossiblePictos() // Call the function once when the component mounts
  }, []) // Empty dependency array means this will only run once

  const inventoryDict: { [key: string]: boolean } = useMemo(
    () =>
      Object.fromEntries(
        jsonMapping.root.properties.InventoryItems_0.Map.map((el) => [
          el.key.Name.toLowerCase(),
          el.value.Int === 1,
        ]) || [],
      ),
    [],
  )

  const masteryDict: { [key: string]: boolean } = useMemo(
    () =>
      Object.fromEntries(
        jsonMapping.root.properties.PassiveEffectsProgressions_0?.Array.Struct.value.map((el) => [
          el.Struct.PassiveEffectName_3_A92DB6CC4549450728A867A714ADF6C5_0.Name.toLowerCase(),
          el.Struct.IsLearnt_9_2561000E49D90653437DE9A45BE2A86D_0.Bool,
        ]) || [],
      ),
    [],
  )

  const levelDict: { [key: string]: number } = useMemo(
    () =>
      Object.fromEntries(
        jsonMapping?.root.properties.WeaponProgressions_0.Array.Struct.value.map((el) => [
          el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name.toLowerCase(),
          el.Struct.CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0.Int,
        ]) || [],
      ),
    [],
  )

  // Build initial picto info list from available pictos and the inventory info.
  const initialPictos: PictoInfoType[] = useMemo(
    () =>
      allPictosMapping.map(([name, friendlyName]) => {
        const found = !!inventoryDict[name.toLowerCase()]
        const mastered = !!masteryDict[name.toLowerCase()]
        const level = levelDict[name.toLowerCase()] || 1
        return { name, friendlyName, found, mastered, level }
      }),
    [],
  )

  // State for pictos, search query, and sorting.
  const [pictos, setPictos] = useState<PictoInfoType[]>(initialPictos)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Called whenever a checkbox is toggled.
  // The function receives the picto's name along with the updated found and mastered values.
  const handlePictoCheckUpdate = (
    pictoName: string,
    newFound: boolean,
    newMastered: boolean,
    newLevel: number,
    updateStateVar = true,
  ) => {
    // Update local state accordingly.
    var thisPictoWas: PictoInfoType
    var pictoFound = false

    pictos.map((picto) => {
      if (picto.name.toLowerCase() === pictoName.toLowerCase()) {
        thisPictoWas = picto
        pictoFound = true
        return { ...picto, found: newFound, mastered: newMastered }
      }
      return picto
    })

    if (!pictoFound) {
      logAndError('No associated pictos to ' + pictoName)
      return
    }
    // Trigger any external save/update call.
    triggerSaveNeeded()

    if (thisPictoWas!.mastered && !newMastered) {
      const currentArrPassEffectProg =
        jsonMapping.root.properties.PassiveEffectsProgressions_0.Array.Struct.value
      const passiveEffectsProgIndex = currentArrPassEffectProg.findIndex(
        (el) =>
          el.Struct.PassiveEffectName_3_A92DB6CC4549450728A867A714ADF6C5_0.Name.toLowerCase() ===
          pictoName.toLowerCase(),
      )
      trace('setting prog val to 0, unmaster')
      if (passiveEffectsProgIndex !== -1) {
        // Clone the array
        const newArr = currentArrPassEffectProg.slice()
        newArr[
          passiveEffectsProgIndex
        ].Struct.LearntSteps_6_A14D681549E830249C77BD95F2B4CF3F_0.Int = 0
        newArr[passiveEffectsProgIndex].Struct.IsLearnt_9_2561000E49D90653437DE9A45BE2A86D_0.Bool =
          false
        jsonMapping.root.properties.PassiveEffectsProgressions_0.Array.Struct.value = newArr
      }
    } else if (thisPictoWas!.found && newFound == false) {
      const currentArrPassEffectProg =
        jsonMapping.root.properties.PassiveEffectsProgressions_0.Array.Struct.value
      const passiveEffectsProgIndex = currentArrPassEffectProg.findIndex(
        (el) =>
          el.Struct.PassiveEffectName_3_A92DB6CC4549450728A867A714ADF6C5_0.Name.toLowerCase() ===
          pictoName.toLowerCase(),
      )
      trace('removing from PassiveEffectsProgressions_0')
      if (passiveEffectsProgIndex !== -1) {
        const newArr = currentArrPassEffectProg.slice()
        newArr.splice(passiveEffectsProgIndex, 1)
        jsonMapping.root.properties.PassiveEffectsProgressions_0.Array.Struct.value = newArr
      }

      trace('removing from inventory')
      jsonMapping.root.properties.InventoryItems_0.Map =
        jsonMapping.root.properties.InventoryItems_0.Map.filter(
          (el) => el.key.Name.toLowerCase() !== pictoName.toLowerCase(),
        )
      //remove from inventory

      trace('Remove from weaponProg')
      const currentArr = jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value
      const index = currentArr.findIndex(
        (el) =>
          el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name.toLowerCase() ===
          pictoName.toLowerCase(),
      )
      if (index !== -1) {
        // Clone the array
        const newArr = currentArr.slice()
        newArr.splice(index, 1)
        jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value = newArr
      }
    } else if (!thisPictoWas!.mastered && newMastered == true) {
      const currentArrPassEffectProg =
        jsonMapping.root.properties.PassiveEffectsProgressions_0.Array.Struct.value
      const passiveEffectsProgIndex = currentArrPassEffectProg.findIndex(
        (el) =>
          el.Struct.PassiveEffectName_3_A92DB6CC4549450728A867A714ADF6C5_0.Name.toLowerCase() ===
          pictoName.toLowerCase(),
      )
      trace('setting mastered to true')
      if (passiveEffectsProgIndex !== -1) {
        const newArr = currentArrPassEffectProg.slice()
        newArr[
          passiveEffectsProgIndex
        ].Struct.LearntSteps_6_A14D681549E830249C77BD95F2B4CF3F_0.Int = 4
        newArr[passiveEffectsProgIndex].Struct.IsLearnt_9_2561000E49D90653437DE9A45BE2A86D_0.Bool =
          true
        jsonMapping.root.properties.PassiveEffectsProgressions_0.Array.Struct.value = newArr
      } else {
        trace('generating new passive effect for picto')
        jsonMapping.root.properties.PassiveEffectsProgressions_0.Array.Struct.value.push(
          generatePictoPassiveEffectProgression(pictoName, true, 4),
        )
      }
    } else if (!thisPictoWas!.found && newFound) {
      trace('adding to inventory')
      jsonMapping.root.properties.InventoryItems_0.Map.push(generateInventoryItems_0(pictoName, 1))

      trace('adding To PassiveEffectsProgressions')
      jsonMapping.root.properties.PassiveEffectsProgressions_0.Array.Struct.value.push(
        generatePictoPassiveEffectProgression(pictoName, false, 0),
      )
      trace('adding To weaponProg')
      jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value.push({
        Struct: {
          DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0: {
            Name: pictoName,
            tag: { data: { Other: 'NameProperty' } },
          },
          CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0: {
            Int: 1,
            tag: { data: { Other: 'IntProperty' } },
          },
        },
      })

      // add to
    } else if (newLevel != thisPictoWas!.level) {
      trace('setting prog level val to ' + newLevel)
      const currentArr = jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value
      const index = currentArr.findIndex(
        (el) =>
          el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name.toLowerCase() ===
          pictoName.toLowerCase(),
      )
      if (index !== -1) {
        // Clone the array
        const newArr = currentArr.slice()
        newArr[index].Struct.CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0.Int = newLevel
        jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value = newArr
      }
      // set weaponProg to 0
    }

    if (updateStateVar) {

      setPictos((prev) =>
        prev.map((picto) => {
          if (picto.name === pictoName) {
            return {
              ...picto,
              found: newFound,
              mastered: newMastered,
              level: newLevel,
            }
          }
          return picto
        }),
      )
      logAndInfo('Picto update:' + pictoName + ' ' + newFound + ' ' + newMastered + ' ' + newLevel)
    }
  }

  function handleFindPictoAllclick(findAll: boolean): void {
    if (jsonMapping == null) {
      error("Null jsonMapping while trying to handleFindPictoAllclick for Pictos")
      return;
    }

    const updatedPictos = pictos.map((picto) => {
      if (!picto.found && findAll) {
        handlePictoCheckUpdate(picto.name, true, picto.mastered, picto.level, false);
        return { ...picto, found: true, level: 1 };
      } else if (picto.found && !findAll) {
        handlePictoCheckUpdate(picto.name, false, false, 1, false);
        return { ...picto, found: false, mastered: false, level: 1 };
      }
      return picto;
    });
    setPictos(updatedPictos);
  }

  function handlePictoAllMasteryfound(masterAll: boolean): void {
    if (jsonMapping == null) {
      error("Null jsonMapping while trying to handlePictoAllMasteryfound for Pictos")
      return;
    }

    const updatedPictos = pictos.map((picto) => {
      if (picto.found && masterAll && !picto.mastered) {
        handlePictoCheckUpdate(picto.name, true, true, picto.level, false);
        return { ...picto, mastered: true };
      } else if (picto.mastered && !masterAll) {
        handlePictoCheckUpdate(picto.name, picto.found, false, picto.level, false);
        return { ...picto, mastered: false };
      }
      return picto;
    });
    setPictos(updatedPictos);
  }

  function handlePictoAllLevelSet(level: number): void {
    if (jsonMapping == null) {
      error("Null jsonMapping while trying to handlePictoAllLevelSet for Pictos")
      return;
    }

    const updatedPictos = pictos.map((picto) => {
      if (picto.found) {
        handlePictoCheckUpdate(picto.name, true, picto.mastered, level, false);
        return { ...picto, level: level };
      }
      return picto;
    });
    setPictos(updatedPictos);
  }

  function handlePictoAllReset(): void {
    if (jsonMapping == null) {
      error("Null jsonMapping while trying to handlePictoAllReset for Pictos")
      return;
    }

    jsonMapping.root.properties.InventoryItems_0.Map =
      jsonMapping.root.properties.InventoryItems_0.Map.filter((el) => !pictos.map((picto) => picto.name).includes(el.key.Name));

    jsonMapping.root.properties.PassiveEffectsProgressions_0.Array.Struct.value =
      jsonMapping.root.properties.PassiveEffectsProgressions_0.Array.Struct.value.filter((el) => !pictos.map((picto) => picto.name).includes(el.Struct.PassiveEffectName_3_A92DB6CC4549450728A867A714ADF6C5_0.Name));

    jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value =
      jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value.filter((el) => !pictos.map((picto) => picto.name).includes(el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name));

    const updatedPictos = pictos.map((picto) => {
      return { ...picto, found: false, mastered: false, level: 1 };
    });
    setPictos(updatedPictos);
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
  const displayedPictos = useMemo(() => {
    let filtered = pictos.filter((picto) =>
      picto.friendlyName.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    if (sortField) {
      filtered.sort((a, b) => {
        let aVal: any
        let bVal: any
        if (sortField === 'friendlyName') {
          aVal = a.friendlyName.toLowerCase()
          bVal = b.friendlyName.toLowerCase()
        } else if (sortField === 'found' || sortField === 'mastered') {
          aVal = a[sortField] ? 1 : 0
          bVal = b[sortField] ? 1 : 0
        } else if (sortField == 'level') {
          aVal = a.level
          bVal = b.level
        }
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }
    return filtered
  }, [pictos, searchQuery, sortField, sortDirection])

  return (
    <div id='PictosPanel' className='tab-panel oveflow-auto'>
      <div className="header">
        <h2>Pictos</h2>
        <div>
          <button onClick={() => handleFindPictoAllclick(true)} >
            Find all
          </button>
          <button onClick={() => handlePictoAllMasteryfound(true)}>
            Master All Found
          </button>
          <button onClick={() => handlePictoAllMasteryfound(false)} >
            Unmaster all
          </button>
          <button onClick={() => handlePictoAllLevelSet((document.getElementById("levelInput")! as HTMLInputElement).valueAsNumber)}>
            Set level to{' ->'}
          </button>
          <input type="number" id="levelInput" />
          <button onClick={() => handlePictoAllReset()}>
            Reset all
          </button>
        </div>
      </div>
      {/* Search Bar */}
      <input
        type='text'
        placeholder='Search by name...'
        value={searchQuery}
        className='search-bar'
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {displayedPictos.length != 0 && (
        <sup style={{ padding: '0.7em' }}>{displayedPictos.length} results</sup>
      )}
      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
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
              onClick={() => handleSort('mastered')}
            >
              Mastered {sortField === 'mastered' && (sortDirection === 'asc' ? '↑' : '↓')}
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
          {displayedPictos.map((picto) => (
            <tr key={picto.name}>
              <td>{picto.friendlyName}</td>
              <td
                style={{
                  textAlign: 'center',
                }}
              >
                <label className='switch'>
                  <input
                    type='checkbox'
                    checked={picto.found}
                    onChange={(e) => {
                      if (!e.target.checked && picto.mastered) {
                        picto.mastered = false
                      }
                      if (!e.target.checked && picto.level !== 1) {
                        picto.level = 1
                      }
                      handlePictoCheckUpdate(
                        picto.name,
                        e.target.checked,
                        picto.mastered,
                        picto.level,
                      )
                    }}
                  />
                  <div className='slider round'></div>
                </label>
              </td>
              <td
                style={{
                  textAlign: 'center',
                }}
              >
                <label className='switch'>
                  <input
                    type='checkbox'
                    checked={picto.mastered}
                    disabled={!picto.found}
                    onChange={(e) =>
                      handlePictoCheckUpdate(picto.name, picto.found, e.target.checked, picto.level)
                    }
                  />
                  <div
                    className='slider round'
                    aria-disabled={!picto.found ? true : undefined}
                  //  aria-disabled={!picto.found}
                  ></div>
                </label>
              </td>

              <td
                style={{
                  textAlign: 'center',
                }}
              >
                <input
                  type='number'
                  min={1}
                  max={33}
                  value={picto.level}
                  disabled={!picto.found}
                  onChange={(e) =>
                    handlePictoCheckUpdate(
                      picto.name,
                      picto.found,
                      picto.mastered,
                      clamp(e.target.valueAsNumber, 1, 33),
                    )
                  }
                />
              </td>
            </tr>
          ))}
          {displayedPictos.length === 0 && (
            <tr>
              <td
                colSpan={3}
                style={{
                  padding: '0.5em',
                  textAlign: 'center',
                }}
              >
                No pictos found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default PictosPanel
