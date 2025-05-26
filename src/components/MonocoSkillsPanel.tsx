import { useMemo, useState } from 'react'
import { getPossibleMonocoSkills, SetInventoryItem } from '../utils/gameMappingProvider'
import type { GeneralPanelProps } from '../types/panelTypes'

type SkillInfo = { name: string; friendlyName: string; item: string | null; unlocked: boolean }

const MonocoSkillsPanel: React.FC<GeneralPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {
  if (!jsonMapping || !jsonMapping?.root?.properties?.CharactersCollection_0) {
    return (
      <div id='MonocoSkillsPanel' className='tab-panel overflow-auto'>
        <h2>Monoco Skills</h2>
        <p style={{ color: 'red' }}>
          The file you opened (if any) doesn't look like a CO:E33 save file
        </p>
      </div>
    )
  }
  const monocoObj = jsonMapping?.root?.properties?.CharactersCollection_0?.Map.find(
    (el: any) => el.key.Name === 'Monoco',
  )
  if (!monocoObj) {
    return (
      <div id='MonocoSkillsPanel' className='tab-panel overflow-auto'>
        <h2>Monoco Skills</h2>
        <p style={{ color: 'red' }}>You don't currently posess monoco</p>
      </div>
    )
  }
  const unlockedSkillsArr: string[] =
    monocoObj.value.Struct.Struct.UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0.Array.Base
      .Name || []

  const allMonocoSkills = useMemo(() => getPossibleMonocoSkills(), [])
  const unlockedDict = useMemo(
    () => Object.fromEntries(unlockedSkillsArr.map((name) => [name, true])),
    [unlockedSkillsArr],
  )

  const initialSkills: SkillInfo[] = useMemo(
    () =>
      allMonocoSkills.map(([name, { skillname, itemrequirements }]) => {
        return {
          name,
          friendlyName: skillname,
          item: itemrequirements == 'None' ? null : itemrequirements,
          unlocked: !!unlockedDict[name],
        }
      }),
    [allMonocoSkills, unlockedDict],
  )
  const [skills, setSkills] = useState<SkillInfo[]>(initialSkills)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const handleSkillToggle = (
    skillName: string,
    itemrequirements: string | null,
    newUnlocked: boolean,
  ) => {
    // Find the Monoco skills array in the save structure
    const skillsArr =
      monocoObj.value.Struct.Struct.UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0.Array.Base.Name.map(
        (el) => el.toLowerCase(),
      )

    if (newUnlocked) {
      if (itemrequirements !== null) {
        SetInventoryItem(jsonMapping, itemrequirements, 1)
      }
      // Add if not present
      if (!skillsArr.includes(skillName.toLowerCase())) {
        monocoObj.value.Struct.Struct.UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0.Array.Base.Name.push(
          skillName,
        )
      }
    } else {
      if (itemrequirements !== null) {
        SetInventoryItem(jsonMapping, itemrequirements, 0, false)
      }
      // Remove if present
      const idx = skillsArr.indexOf(skillName)
      if (idx !== -1) {
        monocoObj.value.Struct.Struct.UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0.Array.Base.Name.splice(
          idx,
          1,
        )
      }
    }

    setSkills((prev) =>
      prev.map((skill) =>
        skill.name.toLowerCase() === skillName.toLowerCase()
          ? { ...skill, unlocked: newUnlocked }
          : skill,
      ),
    )
    triggerSaveNeeded()
  }
  const displayedSkills = useMemo(() => {
    return skills.filter((skill) =>
      skill.friendlyName.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [skills, searchQuery])

  const handleToggleAll = (unlockAll: boolean) => {
    // Update the Monoco skills array in the save structure
    const skillsArr =
      monocoObj.value.Struct.Struct.UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0.Array.Base
        .Name

    if (unlockAll) {
      // Add all skills if not already present
      allMonocoSkills.forEach(([name, { itemrequirements }]) => {
        if (itemrequirements !== null) {
          SetInventoryItem(jsonMapping, itemrequirements, 1)
        }
        if (!skillsArr.includes(name)) {
          skillsArr.push(name)
        }
      })
    } else {
      allMonocoSkills.forEach(([_name, { itemrequirements }]) => {
        if (itemrequirements !== null) {
          SetInventoryItem(jsonMapping, itemrequirements, 1, false)
        }
      })
      // Remove all skills
      skillsArr.length = 0
    }

    setSkills((prev) => prev.map((skill) => ({ ...skill, unlocked: unlockAll })))
    triggerSaveNeeded()
  }

  return (
    <div id='MonocoSkillsPanel' className='tab-panel overflow-auto'>
      <div className='header'>
        <h2>Monoco Skills</h2>
        {/* Toggle All Buttons */}
        <div>
          <button onClick={() => handleToggleAll(true)} style={{ marginRight: '0.5em' }}>
            Unlock All
          </button>
          <button onClick={() => handleToggleAll(false)}>Lock All</button>
        </div>
      </div>
      {/* Search Bar */}
      <input
        type='text'
        placeholder='Search by name...'
        className='search-bar'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {displayedSkills.length !== 0 && (
        <sup style={{ padding: '0.7em' }}>{displayedSkills.length} results</sup>
      )}
      {/* Table */}
      <table
        style={{
          width: '100%',
          maxWidth: '500px',
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                padding: '0.5em',
              }}
            >
              Name
            </th>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                padding: '0.5em',
              }}
            >
              Unlocked
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedSkills.map((skill) => (
            <tr key={skill.name}>
              <td>{skill.friendlyName}</td>
              <td style={{ textAlign: 'center' }}>
                <label className='switch'>
                  <input
                    type='checkbox'
                    checked={skill.unlocked}
                    onChange={(e) => handleSkillToggle(skill.name, skill.item, e.target.checked)}
                  />
                  <div className='slider round'></div>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MonocoSkillsPanel
