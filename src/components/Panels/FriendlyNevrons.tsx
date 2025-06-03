import type { BeginMapping } from '../../types/jsonSaveMapping'
import { trace, debug } from '@tauri-apps/plugin-log'
import { useMemo, useState, type FC } from 'react'
import { GeneralPanelProps } from '../../types/panelTypes'

const FriendlyNevrons: FC<GeneralPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {
  if (!jsonMapping || !jsonMapping?.root?.properties?.QuestStatuses_0) {
    return (
      <div id='FriendlyNevronsPanel' className='tab-panel overflow-auto'>
        <h2>Friendly Nevrons</h2>
        <p style={{ color: 'red' }}>
          The file you opened (if any) doesn't look like a CO:E33 save file
        </p>
      </div>
    )
  }

  const nevronslist : { [key: string]: { key: string; name: string } }[] = [
    // they all exist on save creation
    { Nevron_JarNeedLight: { key: 'KilledJar', name: 'Jar' } },
    { Nevron_DemineurMissingMine: { key: 'KillDemineur', name: 'Démineur' } },
    { Nevron_SmallBourgeon: { key: 'KillCompletedBourgeon', name: 'Bourgeon' } },
    { Nevron_PortierDoorMaze: { key: 'KillCompletedPortier', name: 'Portier' } },
    { Nevron_WeaponlessChalier: { key: 'KillChalier', name: 'Chalier' } },
    { Nevron_Benisseur: { key: 'KillCompletedBenisseur', name: 'Bénisseur' } },
    { Nevron_Hexga: { key: 'KillCompletedHexga', name: 'Hexga' } },
    { Nevron_Troubadour: { key: 'KillCompletedTroubadour', name: 'Troubadour' } },
  ]

  const nevrons = useMemo(() => {
    return nevronslist.map((nevron) => {
      const key = Object.keys(nevron)[0]
      const { key: questKey, name } = nevron[key]
      const isKilled = jsonMapping.root.properties.QuestStatuses_0.Map.some(
        (el) => el.key.Name === questKey && 
        el.value.Struct.Struct.QuestStatus_2_4D165F3F428FABC6B00F2BA89749B803_0.Byte.Label == "E_QuestStatus::NewEnumerator2" && // not sure about those 2 which one is important
        el.value.Struct.Struct.ObjectivesStatus_8_EA1232C14DA1F6DDA84EBA9185000F56_0.Map.some(
          (objective) => objective.key.Name === questKey && objective.value.Byte.Label === 'E_ObjectiveStatus::NewEnumerator2'
        )
      )
      return {key, name, isKilled }
    })
  }, [jsonMapping])
}

export default FriendlyNevrons
