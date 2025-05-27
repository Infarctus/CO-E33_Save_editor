import { type FC, useState, useMemo } from 'react'
import type { BeginMapping } from '../types/jsonSaveMapping'
import { E_WorldMapExplorationCapacity } from '../types/enums'
import { useInfo } from './InfoContext'
import { createWorldMapCapacities_18_A3C2B46042CDC1AD2B027BB41415D062_0 } from '../utils/jsonSaveMapping'

interface EsquieSkillsPanelProps {
  jsonMapping: BeginMapping | null
  triggerSaveNeeded: () => void
}

interface EsquieSkill {
  name: string
  friendlyName: string
  isUnlocked: boolean
  index: number
}

const esquieabilityenum = "E_WorldMapExplorationCapacity::NewEnumerator"

const EsquieSkillsPanel: FC<EsquieSkillsPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {
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
  const { setInfoMessage } = useInfo()

  function logAndInfo(message: string) {
    console.log(message)
    setInfoMessage(message)
  }

  // Get the current WorldMapCapacities data
  const currworldMapCapacities = useMemo(() => {
    if (
      !jsonMapping?.root?.properties?.ExplorationProgression_0?.Struct?.Struct
        ?.WorldMapCapacities_18_A3C2B46042CDC1AD2B027BB41415D062_0
    ) {
    jsonMapping.root.properties.ExplorationProgression_0.Struct.Struct.WorldMapCapacities_18_A3C2B46042CDC1AD2B027BB41415D062_0 
        = createWorldMapCapacities_18_A3C2B46042CDC1AD2B027BB41415D062_0()
      return []
    }
    return (
      jsonMapping.root.properties.ExplorationProgression_0.Struct.Struct
        .WorldMapCapacities_18_A3C2B46042CDC1AD2B027BB41415D062_0.Array.Base.Byte.Label || []
    )
  }, [jsonMapping])
  logAndInfo(`WorldMapCapacities: ${currworldMapCapacities.join(', ')}`)

  // Build the skills list from the enum and current data
  const initialSkills: EsquieSkill[] = useMemo(() => {
    return Object.entries(E_WorldMapExplorationCapacity).map(([key, friendlyName], index) => ({
      name: key,
      friendlyName,
      isUnlocked: currworldMapCapacities.includes(key),
      index,
    }))
  }, [currworldMapCapacities])

  const [skills, setSkills] = useState<EsquieSkill[]>(initialSkills)

  return (
    <div id='EsquieSkillsPanel' className='tab-panel-esquie-skills overflow-auto'>
      <div className='header'>
        <h2>Esquie Skills (World Map Exploration)</h2>
        {initialSkills.map((skill) => {
            return null
        })}
      </div>
    </div>
  )
}

export default EsquieSkillsPanel
