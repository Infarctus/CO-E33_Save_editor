import { useMemo, useState } from 'react'
import { trace } from '@tauri-apps/plugin-log'
import type { GeneralPanelProps } from '../types/panelTypes'
import { useInfo } from './InfoContext'
import { clamp } from '../utils/utils'
import { generateInventoryItems_0 } from '../utils/jsonSaveMapping'

function renderNumberInput(
  value: number,
  label: string,
  minInput: number,
  maxInput: number,
  onChange: (newValue: number) => void,
) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={label.toLowerCase() + '-input'} style={{ marginRight: '0.5rem' }}>
        {label}
      </label>
      <input
        type='number'
        min={minInput}
        max={maxInput}
        value={value}
        onChange={(e) => onChange(clamp(parseInt(e.target.value, 10), minInput, maxInput) || 0)}
        style={{ width: 'auto' }}
      />
    </div>
  )
}

const RessourcesPanel: React.FC<GeneralPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {
  if (!jsonMapping || !jsonMapping?.root?.properties?.InventoryItems_0) {
    return (
      <div id='RessourcesPanel' className='tab-panel overflow-auto'>
        <h2>Ressources</h2>
        <p style={{ color: 'red' }}>
          The file you opened (if any) doesn't look like a CO:E33 save file
        </p>
      </div>
    )
  }
  const [refresh, setRefreshTintsLvl] = useState(0)
  const { setInfoMessage } = useInfo()
  function logAndInfo(message: string) {
    setInfoMessage(message)
    trace(message)
  }

  // Gold Editor
  const goldValue = jsonMapping.root.properties.Gold_0.Int
  const MiscItemsInv: [string, string][] = [
    ['HealingTint_Shard', 'Healing Tint'],
    ['EnergyTint_Shard', 'Energy Tint'],
    ['ReviveTint_Shard', 'Revive Tint'],
    ['PartyHealShard', 'Party Heal'], // important for lvl mappings to be last
  ]

  const MiscItemsDict = useMemo(() => {
    const itemsSet = new Set(MiscItemsInv.map(([name]) => name))
    const itemMap = Object.fromEntries(
      (jsonMapping.root.properties.InventoryItems_0.Map || [])
        .filter((el) => itemsSet.has(el.key.Name))
        .map((el) => [el.key.Name, el.value.Int]),
    )
    // Return entries in the order of MiscItemsInv
    return Object.fromEntries(MiscItemsInv.map(([name]) => [name, itemMap[name] ?? 0]))
  }, [jsonMapping, refresh])

  const Tintsdef: [string, string][] = [
    ['Consumable_Health_Level', 'Healing Tint Shard Level'],
    ['Consumable_Energy_Level', 'Energy Tint Shard Level'],
    ['Consumable_Revive_Level', 'Revive Tint Shard Level'],
  ]

  const TintsLvl = useMemo(() => {
    const itemsSet = new Set(Tintsdef.map(([name]) => name))
    return Object.fromEntries(
      (jsonMapping.root.properties.InventoryItems_0.Map || [])
        .filter((el) => itemsSet.has(el.key.Name.slice(0, -1)))
        .map((el) => [el.key.Name, Number(el.key.Name.slice(-1))]),
    )
  }, [jsonMapping, refresh])

  const GoldChange = (newValue: number) => {
    jsonMapping.root.properties.Gold_0.Int = newValue
    triggerSaveNeeded()
    logAndInfo(`Gold set to ${newValue}`)
  }

  const SetInventoryItems = (name: string, newValue: number) => {
    // Find the item in the InventoryItems_0.Map array and update its value
    const item = jsonMapping.root.properties.InventoryItems_0.Map.find(
      (el: any) => el.key.Name === name,
    )
    triggerSaveNeeded()
    if (item) {
      item.value.Int = newValue
      logAndInfo(`${name} set to ${newValue}`)
    } else {
      const newvalue = generateInventoryItems_0(name, newValue)
      jsonMapping.root.properties.InventoryItems_0.Map.push(newvalue)
    }
    setRefreshTintsLvl((r: number) => r + 1) // Force re-render
  }
  const SetTintsLvl = (name: string, newValue: number) => {
    const item = jsonMapping.root.properties.InventoryItems_0.Map.find(
      (el: any) => el.key.Name === name,
    )
    if (item) {
      item.key.Name = item.key.Name.slice(0, -1) + newValue
      triggerSaveNeeded()
      trace(`${name} transformed to ${item.key.Name}`)
      setRefreshTintsLvl((r: number) => r + 1) // Force re-render
    }
  }

  const upgradeWeaponMatsdef: [string, string][] = [
    ['UpgradeMaterial_Level1', 'Chroma Catalyst'],
    ['UpgradeMaterial_Level2', 'Polished Chroma Catalyst'],
    ['UpgradeMaterial_Level3', 'Resplendent Chroma Catalyst'],
    ['UpgradeMaterial_Level4', 'Grandiose Chroma Catalyst'],
    ['UpgradeMaterial_Level5', 'Perfect Chroma Catalyst'],
  ]
  const upgradeWeaponMats = useMemo(() => {
    const itemsSet = new Set(upgradeWeaponMatsdef.map(([name]) => name))
    return Object.fromEntries(
      jsonMapping.root.properties.InventoryItems_0.Map.filter((el) =>
        itemsSet.has(el.key.Name),
      ).map((el) => [el.key.Name, el.value.Int]),
    )
  }, [jsonMapping, refresh])
  upgradeWeaponMatsdef.forEach(([name]) => {
    if (!upgradeWeaponMats[name]) {
      upgradeWeaponMats[name] = 0
    }
  })
const upgradeWeaponMatsOrdered = Object.fromEntries(
    upgradeWeaponMatsdef.map(([name]) => [name, upgradeWeaponMats[name] ?? 0])
)

  return (
    <div id='RessourcesPanel' className='tab-panel overflow-auto'>
      <h2>Ressources</h2>

      {renderNumberInput(goldValue, 'Gold', 0, 2147483647, GoldChange)}
      <h3>Tints</h3>
      <table>
        <tbody>
          {Array.from({
            length: Math.max(Object.keys(MiscItemsDict).length, Object.keys(TintsLvl).length),
          }).map((_, idx) => {
            const miscItemEntry = Object.entries(MiscItemsDict)[idx]
            const tintsLvlEntry = Object.entries(TintsLvl)[idx]
            let miscCell = null
            let tintsCell = null

            if (miscItemEntry) {
              const [name, value] = miscItemEntry
              const friendlyName = MiscItemsInv.find(([n]) => n === name)?.[1] || name
              miscCell = renderNumberInput(value, friendlyName, 0, 9999, (newValue) =>
                SetInventoryItems(name, newValue),
              )
            }

            if (tintsLvlEntry) {
              const [name, value] = tintsLvlEntry
              const friendlyName = 'Level'
              tintsCell = renderNumberInput(value, friendlyName, 0, 2, (newValue) =>
                SetTintsLvl(name, newValue),
              )
            }

            return (
              <tr key={idx}>
                <td>{miscCell}</td>
                <td>{tintsCell}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <h3>Upgrade Weapon Materials</h3>

      {Object.entries(upgradeWeaponMatsOrdered).map(([name, level]) => {
        // Find the friendly name from TintsBeg
        const friendlyName =
          upgradeWeaponMatsdef.find(([baseName]) => name.startsWith(baseName))?.[1] || name
        return renderNumberInput(level, friendlyName, 0, 2147483647, (newValue) =>
          SetInventoryItems(name, newValue),
        )
      })}
    </div>
  )
}

export default RessourcesPanel
