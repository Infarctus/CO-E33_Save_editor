"use client"

import { type FC, useState, useEffect } from "react"
import type { OpenProcessResult } from "../types/fileTypes"
import { getECharacterAttributeEnumValue } from "../types/enums"

interface CharactersPanelProps {
  workingFileCurrent: OpenProcessResult | null
  jsonMapping: any
  triggerSaveNeeded: () => void
}

const CharactersPanel: FC<CharactersPanelProps> = ({ workingFileCurrent, jsonMapping, triggerSaveNeeded }) => {
  // Hard-coded allowed values for dropdowns etc.
  const allowedSkills = [
    "Combo1_Gustave",
    "UnleashCharge",
    "Powerful_Gustave",
    "MarkingShot_Gustave",
    "PerfectRecovery_Gustave",
    "PerfectBreak_Gustave",
    "ExtraSkill1",
    "ExtraSkill2",
  ]

  const allowedCustomizationsFace = ["SkinGustave_Default_Red", "SkinGustave_Default_Blue", "SkinGustave_Default_Green"]

  if (!workingFileCurrent || !jsonMapping?.root?.properties?.CharactersCollection_0?.Map) {
    return (
      <div id="CharactersPanel">
        <h2>Characters Tab</h2>
        <p style={{ color: "red" }}>The file you opened (if any) doesn't look like a CO:E33 save file</p>
      </div>
    )
  }

  const getValueFromTag = (tag: any): string => {
    if ("Double" in tag) {
      return tag.Double.toString()
    } else if ("Int" in tag) {
      return tag.Int.toString()
    } else if ("Bool" in tag) {
      return tag.Bool.toString()
    } else if ("Name" in tag) {
      return tag.Name.toString()
    } else if ("Array" in tag) {
      return tag.Array.Base.Name.join(", ")
    } else {
      return "Unknown tag " + JSON.stringify(tag)
    }
  }

  return (
    <div id="CharactersPanel">
      <h2>Characters Tab</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          overflowX: "auto",
          padding: "1rem",
          gap: "1rem",
        }}
      >
        {jsonMapping.root.properties.CharactersCollection_0.Map.map((character: any, index: number) => (
          <CharacterSection
            key={index}
            character={character}
            characterIndex={index}
            jsonMapping={jsonMapping}
            triggerSaveNeeded={triggerSaveNeeded}
            allowedSkills={allowedSkills}
            allowedCustomizationsFace={allowedCustomizationsFace}
          />
        ))}
      </div>
    </div>
  )
}

interface CharacterSectionProps {
  character: any
  characterIndex: number
  jsonMapping: any
  triggerSaveNeeded: () => void
  allowedSkills: string[]
  allowedCustomizationsFace: string[]
}

const CharacterSection: FC<CharacterSectionProps> = ({
  character,
  characterIndex,
  jsonMapping,
  triggerSaveNeeded,
  allowedSkills,
  allowedCustomizationsFace,
}) => {
  return (
    <section className="characterBox">
      <h3>{character.key.Name}</h3>

      <img src="https://via.placeholder.com/150" alt={character.key.Name} style={{ width: "40%", height: "auto" }} />

      <div style={{ marginTop: "1rem" }}>
        {/* Current Level */}
        <PropertyEditor
          labelText="Current Level"
          value={character.value.Struct.Struct.CurrentLevel_49_97AB711D48E18088A93C8DADFD96F854_0}
          onChange={(newValue) => {
            triggerSaveNeeded()
            jsonMapping.root.properties.CharactersCollection_0.Map[
              characterIndex
            ].value.Struct.Struct.CurrentLevel_49_97AB711D48E18088A93C8DADFD96F854_0.Int = Number(newValue)
            console.log(`Character ${character.key.Name} CurrentLevel updated to ${newValue}`)
          }}
        />

        {/* Attribute Points */}
        <div className="characterEditModule" style={{ marginTop: "1rem" }}>
          <div className="header">
            <h4>Attribute Points</h4>
            <p>(max of total is 3*level)</p>
          </div>

          {Object.entries(
            character.value.Struct.Struct.AssignedAttributePoints_190_4E4BA51441F1E8D8E07ECA95442E0B7E_0.Map,
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
                  console.log(`Character ${character.key.Name} Attribute ${index} updated to ${newValue}`)
                }}
              />
            )
          })}
        </div>

        {/* Skills */}
        <SkillsEditor
          titleText="Skills"
          currentList={
            character.value.Struct.Struct.UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0.Array.Base.Name
          }
          availableOptions={allowedSkills}
          onUpdate={(newList) => {
            triggerSaveNeeded()
            jsonMapping.root.properties.CharactersCollection_0.Map[
              characterIndex
            ].value.Struct.Struct.UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0.Array.Base.Name = newList
            console.log(`Character ${character.key.Name} UnlockedSkills updated to ${newList.join(", ")}`)
          }}
        />

        {/* Character Customization (face) */}
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
            console.log(`Character ${character.key.Name} Face Customization updated to ${newValue}`)
          }}
        />

        {/* Character Customization (skin) */}
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
            console.log(`Character ${character.key.Name} Skin Customization updated to ${newValue}`)
          }}
        />
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

const PropertyEditor: FC<PropertyEditorProps> = ({ labelText, value, onChange, positiveOnly = true }) => {
  const getValueFromTag = (tag: any): string => {
    if ("Double" in tag) {
      return tag.Double.toString()
    } else if ("Int" in tag) {
      return tag.Int.toString()
    } else if ("Bool" in tag) {
      return tag.Bool.toString()
    } else if ("Name" in tag) {
      return tag.Name.toString()
    } else if ("Array" in tag) {
      return tag.Array.Base.Name.join(", ")
    } else {
      return "Unknown tag " + JSON.stringify(tag)
    }
  }

  return (
    <div
      className="characterEditModule"
      style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}
    >
      <label style={{ flex: "1" }}>{labelText}</label>
      <input
        type={"Name" in value ? "text" : "number"}
        min={positiveOnly ? "0" : undefined}
        value={getValueFromTag(value)}
        style={{ flex: "1" }}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

interface SkillsEditorProps {
  titleText: string
  currentList: string[]
  availableOptions: string[]
  onUpdate: (newList: string[]) => void
}

const SkillsEditor: FC<SkillsEditorProps> = ({ titleText, currentList, availableOptions, onUpdate }) => {
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
    onUpdate(newSelectedSkills)
  }

  const handleRemoveSkill = (skill: string) => {
    const newSelectedSkills = selectedSkills.filter((s) => s !== skill)
    setSelectedSkills(newSelectedSkills)
    setAvailableSkills([...availableSkills, skill].sort())
    onUpdate(newSelectedSkills)
  }

  return (
    <div className="characterEditModule" style={{ marginTop: "1rem" }}>
      <div className="header">
        <h4>{titleText}</h4>
        <button onClick={() => setIsVisible(!isVisible)}>
          {isVisible ? "Click me to hide section" : "Click me to show section"}
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

interface DropdownEditorProps {
  labelText: string
  currentValue: any
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

export default CharactersPanel
