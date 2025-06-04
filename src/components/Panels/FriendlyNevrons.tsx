import type { BeginMapping } from '../../types/jsonSaveMapping'
import { trace, debug, error } from '@tauri-apps/plugin-log'
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

  const nevronslist: { [key: string]: { key: string; name: string } }[] = [
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
      const basekey = Object.keys(nevron)[0]
      const { key: questKey, name } = nevron[basekey]
      const isKilled = jsonMapping.root.properties.QuestStatuses_0.Map.some(
        (el) =>
          el.key.Name === questKey &&
          el.value.Struct.Struct.ObjectivesStatus_8_EA1232C14DA1F6DDA84EBA9185000F56_0.Map.some(
            (objective) =>
              objective.key.Name === questKey &&
              objective.value.Byte.Label === 'E_QuestStatus::NewEnumerator2',
          ),
      )
      return { basekey, name, isKilled }
    })
  }, [jsonMapping])

  const handletogglenevron = (basekey: string, newisKilled: boolean) => {
    const nevronItem = nevronslist.find((nevron) => Object.keys(nevron)[0] === basekey)
    const questKey = nevronItem ? nevronItem[basekey]?.key : undefined
    if (!questKey) {
      trace(`No quest key found for basekey: ${basekey}`)
      return
    }
    triggerSaveNeeded()

    const questStatus = jsonMapping.root.properties.QuestStatuses_0.Map.find(
      (el) => el.key.Name === basekey,
    )
    if (!questStatus) {
      error(`Quest status not found for ${basekey} this is not normal`)
      return
    }

    const objectiveStatus =
      questStatus.value.Struct.Struct.ObjectivesStatus_8_EA1232C14DA1F6DDA84EBA9185000F56_0.Map.find(
        (objective) => objective.key.Name === questKey,
      )

    if (objectiveStatus) {
      objectiveStatus.value.Byte.Label = newisKilled
        ? 'E_QuestStatus::NewEnumerator2'
        : 'E_QuestStatus::NewEnumerator0'

      debug(`Toggled ${basekey} to ${newisKilled ? 'killed' : 'not killed'}`)
    } else {
      error(`Objective status not found for ${questKey}`)
    }
  }
}

export default FriendlyNevrons
