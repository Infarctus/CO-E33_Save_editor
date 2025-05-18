'use client'

import { type FC, useState, useEffect } from 'react'
import type { OpenProcessResult } from '../types/fileTypes'
import { getECharacterAttributeEnumValue } from '../types/enums'
import type { BeginMapping, CharactersInCollection0_Mapping } from '../types/jsonSaveMapping'
import { getValueFromTag } from '../utils/jsonSaveMapping'
import {
  getPossibleSkinsFor,
  getUnlockedSkinsFor,
  getPossibleFacesFor,
  getUnlockedFacesFor,
} from '../utils/gameMappingProvider'
import { trace } from '@tauri-apps/plugin-log'
import { useInfo } from './InfoContext'
import { clamp } from '../utils/utils'

interface CharactersPanelProps {
  workingFileCurrent: OpenProcessResult | null
  jsonMapping: BeginMapping | null
  triggerSaveNeeded: () => void
}

const CharactersPanel: FC<CharactersPanelProps> = ({
  workingFileCurrent,
  jsonMapping,
  triggerSaveNeeded,
}) => {
  // Hard-coded allowed values for dropdowns etc.

  if (
    workingFileCurrent == null ||
    jsonMapping?.root?.properties?.CharactersCollection_0?.Map == null
  ) {
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
            allowedSkins={getPossibleSkinsFor(character.key.Name)}
            allowedCustomizationsFace={getPossibleFacesFor(character.key.Name)}
            currentFaces={getUnlockedFacesFor(
              character.key.Name,
              jsonMapping.root.properties.InventoryItems_0.Map.map((el) => el.key.Name),
            )}
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
  allowedSkins: [string, string][]
  currentFaces: string[]
  allowedCustomizationsFace: [string, string][]
}

const CharacterSection: FC<CharacterSectionProps> = ({
  character,
  characterIndex,
  jsonMapping,
  triggerSaveNeeded,
  currentSkins,
  allowedSkins,
  allowedCustomizationsFace,
  currentFaces,
}) => {
  const { setInfoMessage } = useInfo()

  function logAndInfo(message: string) {
    setInfoMessage(message)
    trace(message)
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

        {/* Attribute Points */}
        <div className='characterEditModule' style={{ marginTop: '1rem' }}>
          <div className='header'>
            <h4>Attribute Points</h4>
            <p>(max of total is 3*level)</p>
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

        {/* Skills */}
        {/*<SkillsEditor
          titleText="Skills"
          currentList={
            character.value.Struct.Struct.UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0.Array.Base.Name
          }
          availableOptions={allowedSkills}
          onUpdateSkill={(newList) => {
            triggerSaveNeeded()
            jsonMapping.root.properties.CharactersCollection_0.Map[
              characterIndex
            ].value.Struct.Struct.UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0.Array.Base.Name = newList
            trace(`Character ${character.key.Name} UnlockedSkills updated to ${newList.join("+ ")}`)
          }}
        />
        */}

        {/* Pictos */}
        {/*<SkillsEditor
          titleText="Pictos"
          currentList={
            character.value.Struct.Struct.UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0.Array.Base.Name
          }
          availableOptions={allowedSkills}
          onUpdate={(newList) => {
            triggerSaveNeeded()
            jsonMapping.root.properties.CharactersCollection_0.Map[
              characterIndex
            ].value.Struct.Struct.UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0.Array.Base.Name = newList
            trace(`Character ${character.key.Name} Pictos updated to ${newList.join("+ ")}`)
          }}
        />
        */}

        {/* Character Customization (face) */}
        <CharacCustoEditor
          titleText='Hair Customization'
          currentList={currentFaces}
          fullList={allowedCustomizationsFace}
          onUpdateSkin={(newList) => {
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
          onUpdateSkin={(newList) => {
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
        {/* 
        <DropdownEditor
          labelText="Character Customization (face)"
          currentValue={
            character.value.Struct.Struct.CharacterCustomization_204_6208BA0E4E743356022DAEB14D88C37C_0.Struct.Struct
              .CharacterFace_6_069193A2473BA2E48EDF77841A8F3AFD_0
          }
          options={allowedCustomizationsFace}
          onChange={(newValue) => {
            triggerSaveNeeded()
            jsonMapping.root.properties.CharactersCollection_0.Map[
              characterIndex
            ].value.Struct.Struct.CharacterCustomization_204_6208BA0E4E743356022DAEB14D88C37C_0.Struct.Struct.CharacterFace_6_069193A2473BA2E48EDF77841A8F3AFD_0.Name =
              newValue
            trace(`Character ${character.key.Name} Face Customization updated to ${newValue}`)
          }}
        />


        <DropdownEditor
          labelText="Character Customization (skin)"
          currentValue={
            character.value.Struct.Struct.CharacterCustomization_204_6208BA0E4E743356022DAEB14D88C37C_0.Struct.Struct
              .CharacterSkin_4_D6F8B7E048CBA86E677340839167C4FA_0
          }
          options={allowedCustomizationsFace}
          onChange={(newValue) => {
            triggerSaveNeeded()
            jsonMapping.root.properties.CharactersCollection_0.Map[
              characterIndex
            ].value.Struct.Struct.CharacterCustomization_204_6208BA0E4E743356022DAEB14D88C37C_0.Struct.Struct.CharacterSkin_4_D6F8B7E048CBA86E677340839167C4FA_0.Name =
              newValue
            trace(`Character ${character.key.Name} Skin Customization updated to ${newValue}`)
          }}
        /> 
*/}
      </div>
    </section>
  )
}

interface PropertyEditorProps {
  labelText: string
  value: any
  onChange: (newValue: string | number) => void
  positiveOnly?: boolean
}

const PropertyEditor: FC<PropertyEditorProps> = ({
  labelText,
  value,
  onChange,
  positiveOnly = true,
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
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
{
  /*
interface SkillsEditorProps {
  titleText: string
  currentList: string[]
  availableOptions: string[]
  onUpdateSkill: (newList: string[]) => void
}

const SkillsEditor: FC<SkillsEditorProps> = ({ titleText, currentList, availableOptions, onUpdateSkill }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>(currentList)
  const [availableSkills, setAvailableSkills] = useState<string[]>(
    availableOptions.filter((skill) => !currentList.includes(skill)),
  )

  useEffect(() => {
    setSelectedSkills(currentList)
    setAvailableSkills(availableOptions.filter((skill) => !currentList.includes(skill)))
  }, [currentList, availableOptions])

  const filteredAvailableSkills = availableSkills.filter((skill) =>
    skill.toLowerCase().includes(searchText.toLowerCase()),
  )

  const filteredSelectedSkills = selectedSkills.filter((skill) =>
    skill.toLowerCase().includes(searchText.toLowerCase()),
  )

  const handleAddSkill = (skill: string) => {
    const newSelectedSkills = [...selectedSkills, skill]
    setSelectedSkills(newSelectedSkills)
    setAvailableSkills(availableSkills.filter((s) => s !== skill))
    onUpdateSkill(newSelectedSkills)
  }

  const handleRemoveSkill = (skill: string) => {
    const newSelectedSkills = selectedSkills.filter((s) => s !== skill)
    setSelectedSkills(newSelectedSkills)
    setAvailableSkills([...availableSkills, skill].sort())
    onUpdateSkill(newSelectedSkills)
  }

  return (
    <div className="characterEditModule" style={{ marginTop: "1rem" }}>
      <div className="header">
        <h4>{titleText}</h4>
        <button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? "Collapse" : "Expand"}
        </button>
      </div>

      {isVisible && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <td colSpan={2}>
                <input
                  type="search"
                  placeholder="Search items"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="skillEditorTitle">Owned</td>
              <td className="skillEditorTitle">Not owned</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="skillsEditorSkillsContainer">
                {filteredSelectedSkills.map((skill) => (
                  <div key={skill} className="skillEditorItem" onClick={() => handleRemoveSkill(skill)}>
                    {skill}
                  </div>
                ))}
              </td>
              <td className="skillsEditorSkillsContainer">
                {filteredAvailableSkills.map((skill) => (
                  <div key={skill} className="skillEditorItem" onClick={() => handleAddSkill(skill)}>
                    {skill}
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
*/
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
  const [availableSkins, setAvailableSkins] = useState<[string, string][]>(
    fullList.filter((skill) => !currentList.includes(skill[0])),
  )

  // useEffect(() => {
  //     const selectedSkins = fullList.filter((el) => currentList.includes(el[0]));
  //     trace("updated selected skins+ now:"+selectedSkins.length)
  //     setSelectedSkins(selectedSkins);
  //     setAvailableSkins(fullList.filter((skill) => !currentList.includes(skill[0])));
  // }, [currentList, fullList]);
  useEffect(() => {
    trace('Updated selectedSkins length: ' + selectedSkins.length)
    onUpdateSkin(selectedSkins.map((el) => el[0]))
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

{
  /*
  }
interface DropdownEditorProps {
  labelText: string
  currentValue: StringTag
  options: string[]
  onChange: (newValue: string) => void
}

const DropdownEditor: FC<DropdownEditorProps> = ({ labelText, currentValue, options, onChange }) => {
  return (
    <div
      className="characterEditModule"
      style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}
    >
      <label style={{ flex: "1" }}>{labelText}</label>
      <select style={{ flex: "1" }} value={currentValue.Name} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
  */
}

export default CharactersPanel
