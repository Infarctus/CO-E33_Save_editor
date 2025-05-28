'use client'

import type { FC } from 'react'
import { navItems } from '../App'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => Promise<boolean>
  onOpenFile: () => void
  onExportFile: () => void
  onOverwriteFile: () => void
  anyFileOpen: boolean
}

interface NavItem {
  id: string
  label: string
  icon: string
  requiresFile: boolean
}

const Sidebar: FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenFile,
  onExportFile,
  onOverwriteFile,
  anyFileOpen,
}) => {
  const renderNavItem = (item: NavItem) => {
    const isDisabled = item.requiresFile && !anyFileOpen
    const handleClick = () => {
      if (!isDisabled) {
        onTabChange(item.id)
      }
    }

    return (
      <li
        key={item.id}
        data-tab={item.id}
        className={`nav-item ${item.requiresFile ? 'fileopen-dependant' : ''} ${
          activeTab === item.id ? 'active' : ''
        }`}
        aria-disabled={isDisabled ? 'true' : undefined}
        onClick={handleClick}
      >
        <img src={"/iconsidebar/"+item.icon} alt={item.label} className='nav-icon' />
        <span>{item.label}</span>
      </li>
    )
  }

  return (
    <aside className='drawer'>
      <button
        id='OpenFile'
        className='tab-button'
        onClick={onOpenFile}
        title='Select your save file'
      >
        Open File
      </button>
      <div className='export-overwrite'>
        <button
          id='ExportFile'
          className='tab-button fileopen-dependant'
          onClick={onExportFile}
          disabled={!anyFileOpen}
          style={{ width: '49%', marginRight: '2%' }}
          title={
            anyFileOpen
              ? 'Export a file to wherever you want.\nYou will be prompted for the target destination.'
              : "Open a file before trying to export it\nIt's just over this button"
          }
        >
          Export
        </button>

        <button
          id='OverwriteFile'
          className='tab-button fileopen-dependant'
          onClick={onOverwriteFile}
          disabled={!anyFileOpen}
          style={{ width: '49%' }}
          title={
            anyFileOpen
              ? 'Directly overwrite the file you opened.\nUses the same file location and name.'
              : "Open a file before trying to overwrite it\nIt's just over this button"
          }
        >
          Overwrite
        </button>
      </div>

      <div className='spacer'></div>

      <ul className='nav-list'>{navItems.map(renderNavItem)}</ul>
    </aside>
  )
}

export default Sidebar
