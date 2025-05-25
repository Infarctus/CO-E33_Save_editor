import { useMemo, useState } from 'react'
import type { JournalInfo } from '../types/jsonCustomMapping'
import { getPossibleJournals, SetInventoryItem } from '../utils/gameMappingProvider'
import { useInfo } from './InfoContext'
import { error, trace } from '@tauri-apps/plugin-log'
import type { GeneralPanelProps } from '../types/panelTypes'


  const { setInfoMessage } = useInfo()

  function logAndInfo(message: string) {
    setInfoMessage(message)
    trace(message)
  }



const JournalsPanel: React.FC<GeneralPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {
  if (!jsonMapping || !jsonMapping?.root?.properties?.InventoryItems_0) {
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
  function logAndError(message: string) {
    setInfoMessage(message)
    error(message)
  }

  const allJournals = useMemo(() => getPossibleJournals(), [])

  const inventoryDict: { [key: string]: boolean } = useMemo(
    () =>
      Object.fromEntries(
        jsonMapping.root.properties.InventoryItems_0.Map.map((el) => [
          el.key.Name,
          el.value.Int === 1,
        ]) || [],
      ),
    [],
  )

  const initialJournals: JournalInfo[] = useMemo(
    () =>
      allJournals.map(([name, friendlyName]) => {
        const found = !!inventoryDict[name]
        return { name, friendlyName, found }
      }),
    [],
  )

  const [journals, setJournals] = useState<JournalInfo[]>(initialJournals)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortField, setSortField] = useState<SortField>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleMusicDiskChange = (Journalname: string, newFound: boolean) => {


    if (journals.findIndex((journla) => journla.name === Journalname) == -1) {
      logAndError(`Journal ${Journalname} not found in the list.`)
      return
    }
    logAndInfo(SetInventoryItem(jsonMapping, Journalname, 1, newFound))


    setJournals((prev) =>
      prev.map((journal) => {
        if (journal.name === Journalname) {
          return {
            ...journal,
            found: newFound,
          }
        }
        return journal
      }),
    )
    triggerSaveNeeded()
  }

  // Add this function to handle toggling all journals
  const handleToggleAll = (foundAll: boolean) => {
    // Update the InventoryItems_0.Map in the save structure
    const inventoryArr = jsonMapping.root.properties.InventoryItems_0.Map

    if (foundAll) {
      // Add all journals if not already present
      allJournals.forEach(([name]) => {
        if (!inventoryArr.some((el: any) => el.key.Name === name)) {
          inventoryArr.push({
            key: { Name: name },
            value: { Int: 1 },
          })
        }
      })
    } else {
      // Remove all journals
      jsonMapping.root.properties.InventoryItems_0.Map = inventoryArr.filter(
        (el: any) => !allJournals.some(([name]) => el.key.Name === name)
      )
    }

    setJournals((prev) =>
      prev.map((journal) => ({ ...journal, found: foundAll }))
    )
    triggerSaveNeeded()
  }

  type SortField = 'name' | 'found' | null
  type SortDirection = 'asc' | 'desc'

  const handleSort = (field: SortField) => {
    let direction: SortDirection = 'asc'
    if (sortField === field) {
      direction = sortDirection === 'asc' ? 'desc' : 'asc'
    }
    setSortField(field)
    setSortDirection(direction)
  }

  const displayedJournals = useMemo(() => {
    let filtered = journals.filter((journal) =>
      journal.friendlyName.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    if (sortField) {
      filtered.sort((a, b) => {
        let aVal: any
        let bVal: any
        if (sortField === 'name') {
          aVal = a.friendlyName.toLowerCase()
          bVal = b.friendlyName.toLowerCase()
        } else if (sortField === 'found') {
          aVal = a[sortField] ? 1 : 0
          bVal = b[sortField] ? 1 : 0
        }
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }
    return filtered
  }, [journals, searchQuery, sortField, sortDirection])

  return (
    <div id='JournalPanel' className='tab-panel oveflow-auto'>
      <h2>Journals</h2>
      {/* Toggle All Buttons */}
      <div style={{ marginBottom: '1em' }}>
        <button
          onClick={() => handleToggleAll(true)}
          style={{ marginRight: '0.5em' }}
        >
          Mark All as Found
        </button>
        <button onClick={() => handleToggleAll(false)}>
          Mark All as Not Found
        </button>
      </div>
      {/* Search Bar */}
      <input
        type='text'
        placeholder='Search by name...'
        className='search-bar'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {displayedJournals.length != 0 && (
        <sup style={{ padding: '0.7em' }}>{displayedJournals.length} results</sup>
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
                cursor: 'pointer',
                padding: '0.5em',
              }}
              onClick={() => handleSort('name')}
            >
              Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th
              style={{
                borderBottom: '1px solid #ccc',
                cursor: 'pointer',
                padding: '0.5em',
              }}
              onClick={() => handleSort('found')}
            >
              Found {sortField === 'found' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedJournals.map((disk) => (
            <tr key={disk.name}>
              <td>{disk.friendlyName}</td>
              <td
                style={{
                  textAlign: 'center',
                }}
              >
                <label className='switch'>
                  <input
                    type='checkbox'
                    checked={disk.found}
                    onChange={(e) => {
                      handleMusicDiskChange(disk.name, e.target.checked)
                    }}
                  />
                  <div className='slider round'></div>
                </label>
              </td>
            </tr>
          ))}
          {displayedJournals.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }}>
                No pictos found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default JournalsPanel

