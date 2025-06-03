'use client'

import { type FC, useState, useEffect, useMemo } from 'react'
import { getECharacterAttributeEnumValue } from '../../types/enums'
import type { BeginMapping, CharactersInCollection0_Mapping } from '../../types/jsonSaveMapping'
import { getValueFromTag } from '../../utils/jsonSaveMapping'
import {
  getPossibleSkinsFor,
  getUnlockedSkinsFor,
  getPossibleFacesFor,
  getUnlockedFacesFor,
  getPossibleGrandientSkillsFor,
  SetInventoryItem,
} from '../../utils/gameMappingProvider'
import { trace } from '@tauri-apps/plugin-log'
import { useInfo } from '../InfoContext'
import { clamp } from '../../utils/utils'

interface CharactersPanelProps {
  jsonMapping: BeginMapping | null
  triggerSaveNeeded: () => void
}

const CharactersPanel: FC<CharactersPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {
  // Hard-coded allowed values for dropdowns etc.

  if (!jsonMapping || jsonMapping?.root?.properties?.CharactersCollection_0?.Map == null) {
    return (
      <div id='CharactersPanel' className='tab-panel'>
        <h2>Characters</h2>
        <p style={{ color: 'red' }}>
          The file you opened (if any) doesn't look like a CO:E33 save file
        </p>
      </div>
    )
  }

  return (
    <div id='CharactersPanel' className='tab-panel'>
      <h2>Characters</h2>

      <div
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          padding: '1rem',
          gap: '1rem',
        }}
      >
        {jsonMapping.root.properties.CharactersCollection_0.Map.map((character, index) => (
          <CharacterSection
            key={index}
            character={character}
            characterIndex={index}
            jsonMapping={jsonMapping}
            triggerSaveNeeded={triggerSaveNeeded}
            currentSkins={getUnlockedSkinsFor(
              character.key.Name,
              jsonMapping.root.properties.InventoryItems_0.Map.map((el) => el.key.Name),
            )}
            currentFaces={getUnlockedFacesFor(
              character.key.Name,
              jsonMapping.root.properties.InventoryItems_0.Map.map((el) => el.key.Name),
            )}
            gradientskill={getPossibleGrandientSkillsFor(character.key.Name)}
          />
        ))}
      </div>
    </div>
  )
}

interface CharacterSectionProps {
  character: CharactersInCollection0_Mapping
  characterIndex: number
  jsonMapping: BeginMapping
  triggerSaveNeeded: () => void
  currentSkins: string[]
  currentFaces: string[]
  gradientskill: string[]
}
const CharacterSection: FC<CharacterSectionProps> = ({
  character,
  characterIndex,
  jsonMapping,
  triggerSaveNeeded,
  currentSkins,
  currentFaces,
  gradientskill,
}) => {
  const { setInfoMessage } = useInfo()
  const [isSkillsVisible, setIsSkillsVisible] = useState(false)

  // Initialize local skills state from inventory
  const [localSkills, setLocalSkills] = useState<Set<string>>(() => {
    const inventoryItems = jsonMapping.root.properties.InventoryItems_0.Map.map((el) => el.key.Name)
    return new Set(gradientskill.filter((skill) => inventoryItems.includes(skill)))
  })

  function logAndInfo(message: string) {
    setInfoMessage(message)
    trace(message)
  }

  const allowedCustomizationsFace = useMemo(() => getPossibleFacesFor(character.key.Name), [])

  const allowedSkins = useMemo(() => getPossibleSkinsFor(character.key.Name), [])

  const handleSkillToggle = (skillName: string, isUnlocked: boolean) => {
    triggerSaveNeeded()

    SetInventoryItem(jsonMapping, skillName, 1, isUnlocked)

    // Update local state immediately
    setLocalSkills((prev) => {
      const newSet = new Set(prev)
      if (isUnlocked) {
        newSet.add(skillName)
      } else {
        newSet.delete(skillName)
      }
      return newSet
    })

    trace(`skill ${skillName} ${isUnlocked ? 'unlocked' : 'locked'}`)
  }

  let characterName = character.key.Name
  if (character.key.Name == 'Frey') characterName = 'Gustave'
  return (
    <section className='characterBox'>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <img
          src={`charactersicon/T_HUD_${characterName}_512x512.png`}
          style={{ width: '40%', height: 'auto' }}
        />
        <h3 style={{ margin: 0 }}>{characterName}</h3>
      </div>

      <div style={{ marginTop: '1rem' }}>
        {/* Current Level */}
        <PropertyEditor
          labelText='Current Level'
          value={character.value.Struct.Struct.CurrentLevel_49_97AB711D48E18088A93C8DADFD96F854_0}
          onChange={(newValue) => {
            triggerSaveNeeded()
            jsonMapping.root.properties.CharactersCollection_0.Map[
              characterIndex
            ].value.Struct.Struct.CurrentLevel_49_97AB711D48E18088A93C8DADFD96F854_0.Int = clamp(
              Number(newValue),
              1,
              99,
            )
            logAndInfo(`Character ${characterName} CurrentLevel updated to ${newValue}`)
          }}
        />
        <PropertyEditor
          labelText='Luminae given'
          value={
            character.value.Struct.Struct
              .LuminaFromConsumables_210_7CAC193144F82258C6A89BB09BB1D226_0
          }
          onChange={(newValue) => {

            triggerSaveNeeded()
            jsonMapping.root.properties.CharactersCollection_0.Map[
              characterIndex
            ].value.Struct.Struct.LuminaFromConsumables_210_7CAC193144F82258C6A89BB09BB1D226_0.Int =
              Number(newValue)
            logAndInfo(`Character ${characterName} LuminaFromConsu updated to ${newValue}`)
          }}
        />

        <PropertyEditor
          labelText='Current health'
          value={
            character.value.Struct.Struct
              .CurrentHP_56_2DE67B0A46F5E28BCD6D3CB6D6A88B32_0
          }
          onChange={(newValue) => {


            triggerSaveNeeded()
            jsonMapping.root.properties.CharactersCollection_0.Map[
              characterIndex
            ].value.Struct.Struct.CurrentHP_56_2DE67B0A46F5E28BCD6D3CB6D6A88B32_0.Double =
              Number(newValue)
            logAndInfo(`Character ${characterName} CurrentHP updated to ${newValue}`)
          }}
          positiveOnly={true}
          hoverText={'The game will max out HP at your character\'s max HP.\nO will make them die in the first turn of battle'}
          
        />

        {/* Attribute Points */}
        <div className='characterEditModule' style={{ marginTop: '1rem' }}>
          <div className='header'>
            <h4>Attribute Points</h4>
            {/* Calculate the sum once and store it in a variable */}
            {(() => {
              const totalAssignedPoints = character.value.Struct.Struct.AssignedAttributePoints_190_4E4BA51441F1E8D8E07ECA95442E0B7E_0.Map.reduce((sum, curVal) => {
                return sum + curVal.value.Int;
              }, 0);
              const maxPoints = character.value.Struct.Struct.CurrentLevel_49_97AB711D48E18088A93C8DADFD96F854_0.Int * 3;

              return (
                <p className={totalAssignedPoints > maxPoints ? 'red' : ''}>
                  (max of sum is 3*level, currently {totalAssignedPoints}/{maxPoints})
                </p>
              );
            })()}
          </div>

          {Object.entries(
            character.value.Struct.Struct
              .AssignedAttributePoints_190_4E4BA51441F1E8D8E07ECA95442E0B7E_0.Map,
          ).map(([index, points]: [string, any]) => {
            const currpointlabel = Number.parseInt(points.key.Byte.Label.slice(-1))
            return (
              <PropertyEditor
                key={index}
                labelText={getECharacterAttributeEnumValue(currpointlabel)}
                value={points.value}
                onChange={(newValue) => {
            trace("PropertyEditor for AssignedAttrPoints")
                  triggerSaveNeeded()
                  jsonMapping.root.properties.CharactersCollection_0.Map[
                    characterIndex
                  ].value.Struct.Struct.AssignedAttributePoints_190_4E4BA51441F1E8D8E07ECA95442E0B7E_0.Map[
                    Number(index)
                  ].value.Int = Number(newValue)
                  logAndInfo(`Character ${characterName} Attribute ${index} updated to ${newValue}`)
                }}
              />
            )
          })}
        </div>

        {/* Character Customization (face) */}
        <CharacCustoEditor
          titleText='Hair Customization'
          currentList={currentFaces}
          fullList={allowedCustomizationsFace}
          onUpdateSkin={(newList) => {
            trace("CharacCustoEditor for Hair")

            triggerSaveNeeded()
            const allowedFacesRawNames = allowedCustomizationsFace.map((el) => el[0])
            allowedFacesRawNames.forEach((el) => {
              if (!newList.includes(el)) {
                jsonMapping.root.properties.InventoryItems_0.Map =
                  jsonMapping.root.properties.InventoryItems_0.Map.filter(
                    (el2) => el2.key.Name != el,
                  )
              } else if (
                jsonMapping.root.properties.InventoryItems_0.Map.find(
                  (el2) => el2.key.Name == el,
                ) == null
              ) {
                trace('adding ' + el)
                jsonMapping.root.properties.InventoryItems_0.Map.push({
                  key: { Name: el },
                  value: { Int: 1 },
                })
              }
            })
            trace(`Character ${characterName} faces updated to ${newList.join('+ ')}`)
          }}
        />

        {/* Character Customization (body) */}
        <CharacCustoEditor
          titleText='Body Customization'
          currentList={currentSkins}
          fullList={allowedSkins}
          onUpdateSkin={(newList, firstTime?: boolean) => {
            trace("CharacCustoEditor for Body")
            triggerSaveNeeded()
            const allowedSkinsRawNames = allowedSkins.map((el) => el[0])
            //jsonMapping.root.properties.InventoryItems_0.Map = jsonMapping.root.properties.InventoryItems_0.Map
            //.filter((el) => !(allowedSkinsRawNames.includes(el.key.Name)))
            //trace("We removed some elements from aa+ newlist size is " + newList.length)
            //newList.forEach((el) => {
            //  trace("adding "+el)
            //  jsonMapping.root.properties.InventoryItems_0.Map.push({key: {Name: el}, value: {Int: 1}})
            //})
            allowedSkinsRawNames.forEach((el) => {
              if (!newList.includes(el)) {
                jsonMapping.root.properties.InventoryItems_0.Map =
                  jsonMapping.root.properties.InventoryItems_0.Map.filter(
                    (el2) => el2.key.Name != el,
                  )
              } else if (
                jsonMapping.root.properties.InventoryItems_0.Map.find(
                  (el2) => el2.key.Name == el,
                ) == null
              ) {
                trace('adding ' + el)
                jsonMapping.root.properties.InventoryItems_0.Map.push({
                  key: { Name: el },
                  value: { Int: 1 },
                })
              }
            })
            trace(`Character ${characterName} bodies updated to ${newList.join('+ ')}`)
          }}
        />

        {/* Skills */}
        {gradientskill.length > 0 && gradientskill[0] != 'nothing' && (
          <div className='characterEditModule' style={{ marginTop: '1rem' }}>
            <div className='header'>
              <h4>Skills Gradient</h4>
              <button onClick={() => setIsSkillsVisible(!isSkillsVisible)}>
                {isSkillsVisible ? 'Collapse' : 'Expand'}
              </button>
            </div>

            {isSkillsVisible && (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {gradientskill.map((skill) => {
                    const isUnlocked = localSkills.has(skill)
                    return (
                      <tr key={skill}>
                        <td style={{ padding: '0.5em' }}>{skill.replace('Unlock_', ' ')}</td>
                        <td style={{ textAlign: 'center', padding: '0.5em' }}>
                          <label className='switch'>
                            <input
                              type='checkbox'
                              checked={isUnlocked}
                              onChange={(e) => handleSkillToggle(skill, e.target.checked)}
                            />
                            <div className='slider round'></div>
                          </label>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

interface PropertyEditorProps {
  labelText: string
  value: any
  onChange: (newValue: string | number) => void
  positiveOnly?: boolean
  hoverText?: string
}

const PropertyEditor: FC<PropertyEditorProps> = ({
  labelText,
  value,
  onChange,
  positiveOnly = true,
  hoverText
}) => {
  return (
    <div
      className='characterEditModule'
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.5rem',
      }}
    >
      <label style={{ flex: '1' }}>{labelText}</label>
      <input
        type={'Name' in value ? 'text' : 'number'}
        min={positiveOnly ? '0' : undefined}
        value={getValueFromTag(value)}
        style={{ flex: '1' }}
        onInput={(e) => {
          const target = e.target as HTMLInputElement

          onChange(clamp(target.valueAsNumber, 0, 2147483647 ))
        }}
        title={hoverText ? hoverText : undefined}      />
    </div>
  )
}

interface CharacCustoEditorProps {
  titleText: string
  currentList: string[]
  fullList: [string, string][]
  onUpdateSkin: (newList: string[]) => void
}

const CharacCustoEditor: FC<CharacCustoEditorProps> = ({
  titleText,
  currentList,
  fullList,
  onUpdateSkin,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedSkins, setSelectedSkins] = useState<[string, string][]>(
    fullList.filter((el) => currentList.includes(el[0])),
  )
  const [isFirstTime, setIsFirstTime] = useState(true)

  const [availableSkins, setAvailableSkins] = useState<[string, string][]>(
    fullList.filter((skill) => !currentList.includes(skill[0])),
  )

  useEffect(() => {
    if (!isFirstTime) {
      trace('Updated selectedSkins length: ' + selectedSkins.length)
      onUpdateSkin(selectedSkins.map((el) => el[0]))
    } else setIsFirstTime(false)
  }, [selectedSkins])

  const filteredAvailableSkins = availableSkins.filter((skill) =>
    skill[1].toLowerCase().includes(searchText.toLowerCase()),
  )

  const filteredSelectedSkins = selectedSkins.filter((skill) =>
    skill[1].toLowerCase().includes(searchText.toLowerCase()),
  )

  const handleAddSkin = (skin: string) => {
    trace(
      'adding new skill:' +
        skin +
        ' (' +
        fullList.find((el) => el[0] == skin) +
        ') to list of unlocked size' +
        selectedSkins.length,
    )

    selectedSkins.push(fullList.find((el) => el[0] == skin)!)
    setSelectedSkins([...selectedSkins])
    trace('size after after is' + selectedSkins.length) // Log the new size

    setAvailableSkins(availableSkins.filter((s) => s[0] != skin))
  }

  const handleRemoveSkin = (skin: string) => {
    // trace("removal not implemented for "+skin)
    trace(
      'removing an el from the list. before:' +
        selectedSkins.length +
        '+ after:' +
        selectedSkins.filter((s) => s[0] != skin).length,
    )

    setSelectedSkins(selectedSkins.filter((s) => s[0] != skin))
    trace('size after after is' + selectedSkins.length) // Log the new size

    availableSkins.push(fullList.find((el) => el[0] == skin)!)
  }

  return (
    <div className='characterEditModule' style={{ marginTop: '1rem' }}>
      <div className='header'>
        <h4>{titleText}</h4>
        <button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isVisible && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <td colSpan={2}>
                <input
                  type='search'
                  placeholder='Search items'
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className='skillEditorTitle'>Owned</td>
              <td className='skillEditorTitle'>Not owned</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='skillsEditorSkillsContainer'>
                {filteredSelectedSkins.map((skill) => (
                  <div
                    key={skill[0]}
                    className='skillEditorItem'
                    onClick={() => handleRemoveSkin(skill[0])}
                  >
                    {skill[1]}
                  </div>
                ))}
              </td>
              <td className='skillsEditorSkillsContainer'>
                {filteredAvailableSkins.map((skill) => (
                  <div
                    key={skill[0]}
                    className='skillEditorItem'
                    onClick={() => handleAddSkin(skill[0])}
                  >
                    {skill[1]}
                  </div>
                ))}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  )
}


export default CharactersPanel
