import { type FC, useState, useMemo } from 'react'
import { E_WorldMapExplorationCapacity } from '../../types/enums'
import { createWorldMapCapacities_18_A3C2B46042CDC1AD2B027BB41415D062_0 } from '../../utils/jsonSaveMapping'
import { GeneralPanelProps } from '../../types/panelTypes'
import { trace } from '@tauri-apps/plugin-log'

interface EsquieSkill {
  name: string
  friendlyName: string
  isUnlocked: boolean
  index: number
}

const esquieabilityenum = 'E_WorldMapExplorationCapacity::NewEnumerator'

const EsquieSkillsPanel: FC<GeneralPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {
  if (!jsonMapping || !jsonMapping?.root?.properties?.ExplorationProgression_0) {
    return (
      <div id='JournalsPanel' className='tab-panel overflow-auto'>
        <h2>Journals</h2>
        <p style={{ color: 'red' }}>
          The file you opened (if any) doesn't look like a CO:E33 save file
        </p>
      </div>
    )
  }

  // Get the current WorldMapCapacities data
  const currworldMapCapacities = useMemo(() => {
    if (
      !jsonMapping?.root?.properties?.ExplorationProgression_0?.Struct?.Struct
        ?.WorldMapCapacities_18_A3C2B46042CDC1AD2B027BB41415D062_0
    ) {
      jsonMapping.root.properties.ExplorationProgression_0.Struct.Struct.WorldMapCapacities_18_A3C2B46042CDC1AD2B027BB41415D062_0 =
        createWorldMapCapacities_18_A3C2B46042CDC1AD2B027BB41415D062_0()
      return []
    }
    return (
      jsonMapping.root.properties.ExplorationProgression_0.Struct.Struct
        .WorldMapCapacities_18_A3C2B46042CDC1AD2B027BB41415D062_0.Array.Base.Byte.Label || []
    )
  }, [jsonMapping])

  // Build the skills list from the enum and current data
  const initialSkills: EsquieSkill[] = useMemo(() => {
    return Object.entries(E_WorldMapExplorationCapacity).map(([key, friendlyName], index) => ({
      name: key,
      friendlyName,
      isUnlocked: currworldMapCapacities.includes(esquieabilityenum + index),
      index,
    }))
  }, [currworldMapCapacities])

  const [skills, setSkills] = useState<EsquieSkill[]>(initialSkills)

  const handleSkillToggle = (skillIndex: number, isUnlocked: boolean) => {
    const updatedSkills = skills.map((skill) =>
      skill.index === skillIndex ? { ...skill, isUnlocked } : skill,
    )
    setSkills(updatedSkills)

    // Update the actual save data
    const currentCapacities = [
      ...(jsonMapping.root.properties.ExplorationProgression_0.Struct.Struct
        .WorldMapCapacities_18_A3C2B46042CDC1AD2B027BB41415D062_0!.Array.Base.Byte.Label || []),
    ]
    const skillKey = esquieabilityenum + skillIndex

    if (isUnlocked && !currentCapacities.includes(skillKey)) {
      currentCapacities.push(skillKey)
    } else if (!isUnlocked && currentCapacities.includes(skillKey)) {
      const indexToRemove = currentCapacities.indexOf(skillKey)
      currentCapacities.splice(indexToRemove, 1)
    }

    jsonMapping.root.properties.ExplorationProgression_0.Struct.Struct.WorldMapCapacities_18_A3C2B46042CDC1AD2B027BB41415D062_0!.Array.Base.Byte.Label =
      currentCapacities || []
    triggerSaveNeeded()

    const skill = updatedSkills.find((s) => s.index === skillIndex)
    trace(`${isUnlocked ? 'Unlocked' : 'Locked'} Esquie skill: ${skill?.friendlyName}`)
  }

  return (
    <div id='EsquieSkillsPanel' className='tab-panel-esquie-skills overflow-auto'>
      <div className='header'>
        <h2>Esquie Skills (World Map Exploration)</h2>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                padding: '0.5em',
                textAlign: 'left',
                width: '70%',
              }}
            >
              Skill
            </th>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                padding: '0.5em',
                textAlign: 'center',
                width: '30%',
              }}
            >
              Unlocked
            </th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill) => (
            <tr key={skill.name}>
              <td
                style={{
                  padding: '0.5em',
                  borderBottom: '1px solid #eee',
                  textAlign: 'left',
                }}
              >
                {skill.friendlyName}
              </td>
              <td
                style={{
                  padding: '0.5em',
                  borderBottom: '1px solid #eee',
                  textAlign: 'center',
                }}
              >
                <label className='switch'>
                  <input
                    type='checkbox'
                    checked={skill.isUnlocked}
                    onChange={(e) => handleSkillToggle(skill.index, e.target.checked)}
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

export default EsquieSkillsPanel
