import { FC, useState, useMemo } from 'react'
import { getPossibleQuestItems, SetInventoryItem } from '../../utils/gameMappingProvider'
import { QuestItemsInfo } from '../../types/jsonCustomMapping'
import { error } from '@tauri-apps/plugin-log'
import { useInfo } from '../InfoContext'
import { clamp } from '../../utils/utils'
import type { GeneralPanelProps } from '../../types/panelTypes'

type SortField = 'friendlyName' | 'inInventory' | 'level' | null
type SortDirection = 'asc' | 'desc'

const QuestItemsPanel: FC<GeneralPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {
  const { setInfoMessage } = useInfo()

  function logAndError(message: string) {
    setInfoMessage(message)
    error(message)
  }

  // Build an inventory dictionary depending on save data, if available.
  if (!jsonMapping || !jsonMapping?.root?.properties?.InventoryItems_0) {
    return (
      <div id='QuestItemsPanel' className='tab-panel oveflow-auto'>
        <h2>QuestItems</h2>
        <p style={{ color: 'red' }}>
          The file you opened (if any) doesn't look like a CO:E33 save file
        </p>
      </div>
    )
  }

  // Initial global questItems data that uses mapping data from getPossibleQuestItems and jsonMapping
  const allQuestItemsMapping: [string, string][] = useMemo(() => {
    return getPossibleQuestItems() // Call the function once when the component mounts
  }, []) // Empty dependency array means this will only run once

  const inventoryDict: { [key: string]: number } = useMemo(
    () =>
      Object.fromEntries(
        jsonMapping.root.properties.InventoryItems_0.Map.map((el) => [
          el.key.Name.toLowerCase(),
          el.value.Int,
        ]) || [],
      ),
    [],
  )

  // Build initial questItem info list from available questItems and the inventory info.
  const initialQuestItems: QuestItemsInfo[] = useMemo(
    () =>
      allQuestItemsMapping.map(([name, friendlyName]) => {
        const inInventory = !!inventoryDict[name.toLowerCase()]
        const value = inventoryDict[name.toLowerCase()] || 1
        return { name, friendlyName, inInventory, value }
      }),
    [],
  )

  // State for questItems, search query, and sorting.
  const [questItems, setQuestItems] = useState<QuestItemsInfo[]>(initialQuestItems)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Called whenever a checkbox is toggled.
  // The function receives the questItem's name along with the updated found and mastered values.
  const handlePictoCheckUpdate = (questItemName: string, newFound: boolean, newValue: number) => {
    if (questItems.findIndex((el) => el.name == questItemName) == -1) {
      logAndError('No associated questItem to ' + questItemName)
      return
    }
    // Trigger any external save/update call.
    triggerSaveNeeded()

    SetInventoryItem(jsonMapping, questItemName, newValue, newFound)

    setQuestItems((prev) =>
      prev.map((questItem) => {
        if (questItem.name === questItemName) {
          return {
            ...questItem,
            inInventory: newFound,
            value: newValue,
          }
        }
        return questItem
      }),
    )

    // logAndInfo('Quest Item update:' + questItemName + ' ' + newFound + ' ' + newValue)
  }

  // Handle sorting when headers are clicked.
  const handleSort = (field: SortField) => {
    // Determine new direction. If already sorting by this field, reverse the direction; otherwise, default to ascending.
    let direction: SortDirection = 'asc'
    if (sortField === field) {
      direction = sortDirection === 'asc' ? 'desc' : 'asc'
    }
    setSortField(field)
    setSortDirection(direction)
  }

  // Memoize and compute the final list after filtering and sorting.
  const displayedQuestItems = useMemo(() => {
    let filtered = questItems.filter((questItem) =>
      questItem.friendlyName.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    if (sortField) {
      filtered.sort((a, b) => {
        let aVal: any
        let bVal: any
        if (sortField === 'friendlyName') {
          aVal = a.friendlyName.toLowerCase()
          bVal = b.friendlyName.toLowerCase()
        } else if (sortField === 'inInventory') {
          aVal = a[sortField] ? 1 : 0
          bVal = b[sortField] ? 1 : 0
        } else if (sortField == 'level') {
          aVal = a.value
          bVal = b.value
        }
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }
    return filtered
  }, [questItems, searchQuery, sortField, sortDirection])

  return (
    <div id='QuestItemsPanel' className='tab-panel oveflow-auto'>
      <h2>QuestItems</h2>
      <p style={{ color: 'red' }}>Careful. You're on your own by editing anything from this tab.</p>

      {/* Search Bar */}
      <input
        type='text'
        placeholder='Search by name...'
        value={searchQuery}
        className='search-bar'
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {displayedQuestItems.length != 0 && (
        <sup style={{ padding: '0.7em' }}>{displayedQuestItems.length} results</sup>
      )}
      {/* Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                cursor: 'pointer',
                padding: '0.5em',
              }}
              onClick={() => handleSort('friendlyName')}
            >
              Name {sortField === 'friendlyName' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                cursor: 'pointer',
                padding: '0.5em',
              }}
              onClick={() => handleSort('inInventory')}
            >
              Found {sortField === 'inInventory' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                cursor: 'pointer',
                padding: '0.5em',
              }}
              onClick={() => handleSort('level')}
            >
              Level {sortField === 'level' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedQuestItems.map((questItem) => (
            <tr key={questItem.name}>
              <td>{questItem.friendlyName}</td>
              <td
                style={{
                  textAlign: 'center',
                }}
              >
                <label className='switch'>
                  <input
                    type='checkbox'
                    checked={questItem.inInventory}
                    onChange={(e) => {
                      if (!e.target.checked && questItem.value !== 1) {
                        questItem.value = 1
                      }
                      handlePictoCheckUpdate(questItem.name, e.target.checked, questItem.value)
                    }}
                  />
                  <div className='slider round'></div>
                </label>
              </td>

              <td
                style={{
                  textAlign: 'center',
                }}
              >
                <input
                  type='number'
                  min={1}
                  max={33}
                  value={questItem.value}
                  disabled={!questItem.inInventory}
                  onChange={(e) =>
                    handlePictoCheckUpdate(
                      questItem.name,
                      questItem.inInventory,
                      clamp(e.target.valueAsNumber, 1, 33),
                    )
                  }
                />
              </td>
            </tr>
          ))}
          {displayedQuestItems.length === 0 && (
            <tr>
              <td
                colSpan={3}
                style={{
                  padding: '0.5em',
                  textAlign: 'center',
                }}
              >
                No questItems found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default QuestItemsPanel
