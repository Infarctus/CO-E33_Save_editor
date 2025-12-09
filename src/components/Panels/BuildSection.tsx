import { type FC, useMemo, useState } from 'react'
import type { CharactersInCollection0_Mapping } from '../../types/jsonSaveMappingsPlus.ts/characters'
import type { BeginMapping } from '../../types/jsonSaveMapping'
import { trace } from '@tauri-apps/plugin-log'
import { getPossibleWeapons, getPossiblePictos, getLuminaCost, getPictoData, getWeaponData } from '../../utils/gameMappingProvider'
import SearchableSelect from '../SearchableSelect'

interface BuildSectionProps {
  character: CharactersInCollection0_Mapping
  jsonMapping: BeginMapping
  triggerSaveNeeded: () => void
  globalUpdateTrigger: number
  onGlobalUpdate: () => void
}

const BuildSection: FC<BuildSectionProps> = ({ character, jsonMapping, triggerSaveNeeded, globalUpdateTrigger, onGlobalUpdate }) => {
  let characterName = character.key.Name
  if (character.key.Name == 'Frey') characterName = 'Gustave'

  // Force re-render on mutation
  const [, forceUpdate] = useState({})

  const equippedItems = character.value.Struct.Struct.EquippedItemsPerSlot_183_3B9D37B549426C770DB5E5BE821896E9_0?.Map || []

  // Weapon: ItemType ends with NewEnumerator0
  const weaponItem = equippedItems.find(item =>
    item.key.Struct.Struct.ItemType_4_419B69C74E6D605B52FA82A76F128C96_0.Byte.Label.endsWith('NewEnumerator0')
  )
  const currentWeaponName = weaponItem?.value.Name || 'None'

  // Get all possible weapons and filter for this character and unlocked status
  const availableWeapons = useMemo(() => {
    const allWeapons = getPossibleWeapons()
    const characterWeaponsEntry = allWeapons.find(([owner]) => owner === characterName)
    const characterWeapons = characterWeaponsEntry ? characterWeaponsEntry[1] : {}

    const inventoryItems = jsonMapping.root.properties.InventoryItems_0?.Map || []
    const inventorySet = new Set(inventoryItems.map(item => item.key.Name))

    return Object.entries(characterWeapons)
      .filter(([key]) => {
        const isUnlocked = inventorySet.has(key) || key === currentWeaponName
        return isUnlocked
      })
      .map(([key, weaponData]) => ({ key, name: weaponData.name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [characterName, jsonMapping, currentWeaponName])

  // Pictos Logic
  const pictoSlots = [0, 1, 2]

  // Find the item entry for a specific picto slot index
  const getPictoItemForSlot = (slotIndex: number) => {
    return equippedItems.find(item =>
      item.key.Struct.Struct.ItemType_4_419B69C74E6D605B52FA82A76F128C96_0.Byte.Label.endsWith('NewEnumerator10') &&
      item.key.Struct.Struct.SlotIndex_7_4AC21CC043F87846335A25B9212005AB_0.Int === slotIndex
    )
  }

  // Get currently equipped pictos for this character
  const currentPictos = pictoSlots.map(slotIndex => {
    const item = getPictoItemForSlot(slotIndex)
    return item?.value.Name || 'None'
  })

  trace(`Render BuildSection ${characterName}: Pictos=${JSON.stringify(currentPictos)}`)

  // Get weapon levels
  const levelDict: { [key: string]: number } = useMemo(
    () =>
      Object.fromEntries(
        jsonMapping?.root.properties.WeaponProgressions_0.Array.Struct.value.map((el) => [
          el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name,
          el.Struct.CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0.Int,
        ]) || [],
      ),
    [jsonMapping],
  )

  // Calculate globally equipped pictos (by OTHER characters)
  const globalEquippedPictos = useMemo(() => {
    const otherCharacters = jsonMapping.root.properties.CharactersCollection_0.Map.filter(c => c.key.Name !== character.key.Name)
    const equipped = new Set<string>()

    otherCharacters.forEach(c => {
      const items = c.value.Struct.Struct.EquippedItemsPerSlot_183_3B9D37B549426C770DB5E5BE821896E9_0?.Map || []
      items.forEach(item => {
        if (item.key.Struct.Struct.ItemType_4_419B69C74E6D605B52FA82A76F128C96_0.Byte.Label.endsWith('NewEnumerator10')) {
          equipped.add(item.value.Name)
        }
      })
    })
    return equipped
  }, [jsonMapping, character.key.Name, globalUpdateTrigger])

  // Get available pictos for dropdowns
  const availablePictos = useMemo(() => {
    const allPictos = getPossiblePictos() // Returns [InternalName, {name, effect, type, stats, cost}][]
    const inventoryItems = jsonMapping.root.properties.InventoryItems_0?.Map || []
    const inventorySet = new Set(inventoryItems.map(item => item.key.Name))

    return allPictos
      .filter(([key]) => inventorySet.has(key)) // Must be unlocked
      .map(([key, pictoData]) => ({ key, name: pictoData.name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [jsonMapping])


  const getDisplayName = (internalName: string) => {
    // Get friendly name from picto mapping
    const pictoData = getPictoData(internalName)
    return pictoData?.name || internalName
  }

  const rawEquippedSkills = character.value.Struct.Struct.EquippedSkills_201_05B6B5E9490E2586B23751B11CDA521F_0?.Array?.Base?.Name || []
  const equippedSkills = Array.from({ length: 6 }, (_, i) => rawEquippedSkills[i] || 'None')

  // Luminas & Passives Logic
  const allEffectsArray = character.value.Struct.Struct.EquippedPassiveEffects_176_BE669BB547A1E730FDBF5AB2F0675853_0?.Array?.Base?.Name || []

  // Create a set of raw picto names for efficient lookup
  const pictoSet = new Set(currentPictos.filter(p => p !== 'None'))

  // Determine all possible weapon passive IDs to correctly identify them
  const weaponPassiveSet = useMemo(() => {
    const set = new Set<string>()
    const allWeapons = getPossibleWeapons()
    allWeapons.forEach(([_, weapons]) => {
      Object.values(weapons).forEach(w => {
        if (w.passives?.lvl4?.id) set.add(w.passives.lvl4.id)
        if (w.passives?.lvl10?.id) set.add(w.passives.lvl10.id)
        if (w.passives?.lvl20?.id) set.add(w.passives.lvl20.id)
      })
    })
    return set
  }, [])

  // Filter Passives and Luminas
  // Note: CounterUpdragde* are actual Pictos (Augmented Counter I/II/III), NOT passives
  const isPassive = (name: string) => {
    if (weaponPassiveSet.has(name)) return true

    // Fallback for character native passives or unmapped ones
    return name.startsWith('Stance_') ||
      name.startsWith('Masks_') ||
      name.startsWith('DMG+') ||
      name.startsWith('Foretell_') ||
      name.startsWith('Perfection_') ||
      name.startsWith('Stains_')
  }

  const passives = allEffectsArray.filter(isPassive)

  // Luminas are effects that are NOT passives
  // Note: Some might be pictos equipped as luminas.
  const luminas = allEffectsArray
    .filter(name => !isPassive(name))
    .sort((a, b) => {
      const isAPicto = pictoSet.has(a)
      const isBPicto = pictoSet.has(b)
      if (isAPicto && !isBPicto) return -1
      if (!isAPicto && isBPicto) return 1
      return a.localeCompare(b)
    })

  // Lumina Capacity Logic
  const currentLevel = character.value.Struct.Struct.CurrentLevel_49_97AB711D48E18088A93C8DADFD96F854_0?.Int || 1
  const luminaFromConsumables = character.value.Struct.Struct.LuminaFromConsumables_210_7CAC193144F82258C6A89BB09BB1D226_0?.Int || 0
  const maxLuminaPoints = currentLevel + luminaFromConsumables

  // Only count Luminas that are NOT also equipped as Pictos
  const currentLuminaCost = luminas.reduce((acc, lumina) => {
    if (pictoSet.has(lumina)) return acc; // Pictos don't count toward Lumina cost
    return acc + getLuminaCost(lumina)
  }, 0)

  // Available Luminas for Dropdown
  const availableLuminas = useMemo(() => {
    const allPictos = getPossiblePictos()
    const masteryMap = jsonMapping.root.properties.PassiveEffectsProgressions_0?.Array.Struct.value || []
    const masteredSet = new Set<string>()

    masteryMap.forEach(el => {
      if (el.Struct.IsLearnt_9_2561000E49D90653437DE9A45BE2A86D_0.Bool) {
        masteredSet.add(el.Struct.PassiveEffectName_3_A92DB6CC4549450728A867A714ADF6C5_0.Name)
      }
    })

    const inventoryItems = jsonMapping.root.properties.InventoryItems_0?.Map || []
    const inventorySet = new Set(inventoryItems.map(item => item.key.Name))

    return allPictos
      .filter(([key]) => {
        // Must be unlocked (Found) AND Mastered (Tier 4)
        // Also exclude "BaseShield" as per user request (Tier 0) - assuming it's not in masteredSet or we filter explicitly
        if (key === 'BaseShield') return false
        return inventorySet.has(key) && masteredSet.has(key)
      })
      .map(([key, pictoData]) => ({ key, name: pictoData.name, cost: pictoData.cost }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [jsonMapping])




  const handlePictoChange = (slotIndex: number, newPicto: string) => {
    triggerSaveNeeded()
    const item = getPictoItemForSlot(slotIndex)
    const oldPicto = item?.value?.Name

    if (item) {
      if (newPicto === 'None') {
        const index = equippedItems.indexOf(item)
        if (index > -1) {
          equippedItems.splice(index, 1)
          trace(`Character ${characterName} picto slot ${slotIndex} removed`)
          // Also remove from Luminas if it was there
          if (oldPicto) removePictoFromLuminas(oldPicto)
        }
      } else {
        // Remove old picto from luminas if changing
        if (oldPicto && oldPicto !== newPicto) {
          removePictoFromLuminas(oldPicto)
        }
        item.value.Name = newPicto
        trace(`Character ${characterName} picto slot ${slotIndex} updated to ${newPicto}`)
        // Sync new picto to Luminas
        syncPictoToLuminas(newPicto)
      }
    } else {
      if (newPicto !== 'None') {
        const newKey = {
          Struct: {
            Struct: {
              ItemType_4_419B69C74E6D605B52FA82A76F128C96_0: {
                tag: { data: { Byte: "/Game/jRPGTemplate/Enumerations/E_jRPG_ItemType.E_jRPG_ItemType" } },
                Byte: { Label: "E_jRPG_ItemType::NewEnumerator10" }
              },
              SlotIndex_7_4AC21CC043F87846335A25B9212005AB_0: {
                tag: { data: { Other: "IntProperty" } },
                Int: slotIndex
              }
            }
          }
        }
        equippedItems.push({ key: newKey, value: { Name: newPicto } })
        trace(`Character ${characterName} picto slot ${slotIndex} created with ${newPicto}`)
        // Sync to Luminas
        syncPictoToLuminas(newPicto)
      }
    }
    forceUpdate({})
    onGlobalUpdate()
  }

  // Sync: When a Picto is added, also add to EquippedPassiveEffects if not already there
  const syncPictoToLuminas = (pictoName: string) => {
    if (pictoName !== 'None' && !allEffectsArray.includes(pictoName)) {
      allEffectsArray.push(pictoName)
    }
  }

  // Sync: When a Picto is removed, also remove from EquippedPassiveEffects
  const removePictoFromLuminas = (pictoName: string) => {
    const index = allEffectsArray.indexOf(pictoName)
    if (index > -1) {
      allEffectsArray.splice(index, 1)
    }
  }

  const handleAddLumina = (luminaKey: string) => {
    if (luminaKey === 'None') return
    triggerSaveNeeded()
    allEffectsArray.push(luminaKey)
    trace(`Character ${characterName} added lumina ${luminaKey}`)
    forceUpdate({})
    onGlobalUpdate()
  }

  const handleRemoveLumina = (luminaName: string) => {
    // Don't allow removing if it's equipped as a Picto
    if (pictoSet.has(luminaName)) return
    triggerSaveNeeded()
    const index = allEffectsArray.indexOf(luminaName)
    if (index > -1) {
      allEffectsArray.splice(index, 1)
      trace(`Character ${characterName} removed lumina ${luminaName}`)
    }
    forceUpdate({})
    onGlobalUpdate()
  }

  const handleWeaponChange = (newWeaponName: string) => {
    triggerSaveNeeded()

    // Update weapon name in save file
    if (weaponItem) {
      weaponItem.value.Name = newWeaponName
      trace(`Character ${characterName} weapon updated to ${newWeaponName}`)
    }

    // Sync Passives
    const oldLevel = levelDict[currentWeaponName] || 1
    const newLevel = levelDict[newWeaponName] || 1

    // Remove old passives
    const oldData = getWeaponData(characterName, currentWeaponName)
    if (oldData?.passives) {
      if (oldData.passives.lvl4.id) removePictoFromLuminas(oldData.passives.lvl4.id)
      if (oldData.passives.lvl10.id) removePictoFromLuminas(oldData.passives.lvl10.id)
      if (oldData.passives.lvl20.id) removePictoFromLuminas(oldData.passives.lvl20.id)
    }

    // Add new passives
    const newData = getWeaponData(characterName, newWeaponName)
    if (newData?.passives) {
      if (newLevel >= 4 && newData.passives.lvl4.id) syncPictoToLuminas(newData.passives.lvl4.id)
      if (newLevel >= 10 && newData.passives.lvl10.id) syncPictoToLuminas(newData.passives.lvl10.id)
      if (newLevel >= 20 && newData.passives.lvl20.id) syncPictoToLuminas(newData.passives.lvl20.id)
    }

    onGlobalUpdate()
    forceUpdate({})
  }

  return (
    <section className='characterBox' style={{ minWidth: '300px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <img
          src={`charactersicon/T_HUD_${characterName}_512x512.png`}
          style={{ width: '80px', height: '80px', objectFit: 'contain' }}
          alt={characterName}
        />
        <h3 style={{ margin: 0 }}>{characterName}</h3>
      </div>

      <div className='build-details'>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Weapon:</strong>
          <div style={{ marginLeft: '0.5rem', display: 'inline-block' }}>
            <select
              value={currentWeaponName}
              onChange={(e) => handleWeaponChange(e.target.value)}
              style={{ padding: '0.25rem' }}
            >
              {availableWeapons.map((w) => (
                <option key={w.key} value={w.key}>
                  {w.name} ({levelDict[w.key] || 1})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Equipped Skills:</strong>
          <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem', listStyle: 'none' }}>
            {equippedSkills.map((currentSkill, idx) => (
              <li key={idx} style={{ marginBottom: '0.25rem' }}>
                {currentSkill === 'None' ? (
                  <span style={{ color: '#888' }}>None</span>
                ) : (
                  currentSkill
                )}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Pictos:</strong>
          <div style={{ margin: '0.25rem 0', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {pictoSlots.map((slotIndex) => {
              const currentPicto = currentPictos[slotIndex]

              const options = [
                { value: 'None', label: 'None' },
                ...availablePictos.map((picto) => {
                  const isEquippedByOther = globalEquippedPictos.has(picto.key)
                  const isEquippedInOtherSlot = currentPictos.some((p, idx) => idx !== slotIndex && p === picto.key)
                  const isDisabled = isEquippedByOther || isEquippedInOtherSlot

                  let label = picto.name
                  if (isEquippedByOther) label += ' (Equipped by other)'
                  if (isEquippedInOtherSlot) label += ' (Equipped)'

                  return { value: picto.key, label, disabled: isDisabled }
                })
              ]

              if (currentPicto !== 'None' && !availablePictos.some(p => p.key === currentPicto)) {
                options.push({ value: currentPicto, label: currentPicto })
              }

              return (
                <div key={slotIndex}>
                  <SearchableSelect
                    value={currentPicto}
                    onChange={(val) => handlePictoChange(slotIndex, val)}
                    options={options}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Luminas:</strong>
            <span style={{
              fontSize: '0.8rem',
              color: currentLuminaCost > maxLuminaPoints ? 'red' : 'inherit',
              fontWeight: currentLuminaCost > maxLuminaPoints ? 'bold' : 'normal'
            }}>
              {currentLuminaCost} / {maxLuminaPoints} Pts
            </span>
          </div>

          <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem', paddingLeft: '1.5rem' }}>
            <SearchableSelect
              value="None"
              onChange={handleAddLumina}
              options={[
                { value: 'None', label: 'Add Lumina...' },
                ...availableLuminas.map((lumina) => {
                  const isEquippedAsPicto = pictoSet.has(lumina.key)
                  const isAlreadyEquipped = luminas.includes(lumina.key)
                  const willExceedCapacity = (currentLuminaCost + lumina.cost) > maxLuminaPoints

                  const isDisabled = isEquippedAsPicto || isAlreadyEquipped

                  let label = `${lumina.name} (${lumina.cost} pts)`
                  if (isEquippedAsPicto) label += ' (Equipped as Picto)'
                  if (isAlreadyEquipped) label += ' (Already Added)'
                  if (willExceedCapacity) label += ' (Exceeds Cap)'

                  return { value: lumina.key, label, disabled: isDisabled }
                })
              ]}
              placeholder="Add Lumina..."
            />
          </div>

          <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem', listStyle: 'none' }}>
            {luminas.map((lumina, idx) => {
              const displayName = getDisplayName(lumina)
              const cost = getLuminaCost(lumina)
              const isEquippedAsPicto = pictoSet.has(lumina)

              return (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <span>
                    {displayName}
                    {isEquippedAsPicto ? (
                      <span style={{ fontSize: '0.8em', color: '#4a9' }}> (via Picto)</span>
                    ) : (
                      <span style={{ fontSize: '0.8em', color: '#888' }}> ({cost} pts)</span>
                    )}
                  </span>
                  {!isEquippedAsPicto && (
                    <button
                      onClick={() => handleRemoveLumina(lumina)}
                      style={{ marginLeft: '0.5rem', padding: '0 0.5rem', cursor: 'pointer' }}
                    >
                      x
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Passives:</strong>
          <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
            {passives.length > 0 ? (
              passives.map((passive, idx) => <li key={idx}>{passive}</li>)
            ) : (
              <li>None</li>
            )}
          </ul>
        </div>
      </div>
    </section >
  )
}

export default BuildSection
