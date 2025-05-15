"use client"

import type { FC } from "react"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => Promise<boolean>
  onOpenFile: () => void
  onExportFile: () => void
  onOverwriteFile: () => void
  anyFileOpen: boolean
}

const Sidebar: FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  onOpenFile,
  onExportFile,
  onOverwriteFile,
  anyFileOpen,
}) => {
  return (
    <aside className="drawer">
      <button id="OpenFile" className="tab-button" onClick={onOpenFile}>
        Open File
      </button>

      <button id="ExportFile" className="tab-button fileopen-dependant" onClick={onExportFile} disabled={!anyFileOpen}>
        Export File
      </button>

      <button
        id="OverwriteFile"
        className="tab-button fileopen-dependant"
        onClick={onOverwriteFile}
        disabled={!anyFileOpen}
      >
        Overwrite File
      </button>

      <div className="spacer"></div>

      <ul className="nav-list">
        <li
          data-tab="Characters"
          className={`nav-item fileopen-dependant ${activeTab === "Characters" ? "active" : ""}`}
          aria-disabled={!anyFileOpen ? "true" : undefined}
          onClick={() => anyFileOpen && onTabChange("Characters")}
        >
          <img src="/iconsidebar/btnCharacters.png" alt="Characters" className="nav-icon" />
          <span>Characters</span>
        </li>


        <li
          data-tab="Pictos"
          className={`nav-item fileopen-dependant ${activeTab === "Pictos" ? "active" : ""}`}
          aria-disabled={!anyFileOpen ? "true" : undefined}
          onClick={() => anyFileOpen && onTabChange("Pictos")}
        >
          <img src="/iconsidebar/btnPicto.png" alt="Pictos" className="nav-icon" />
          <span>Pictos</span>
        </li>

        <li
          data-tab="Inventory"
          className={`nav-item fileopen-dependant hidden ${activeTab === "Inventory" ? "active" : ""}`}
          aria-disabled={!anyFileOpen ? "true" : undefined}
          onClick={() => anyFileOpen && onTabChange("Inventory")}
        >
          <img src="/iconsidebar/inventory.svg" alt="Inventory" className="nav-icon" />
          <span>Inventory</span>
        </li>

        <li
          data-tab="RawJson"
          className={`nav-item fileopen-dependant ${activeTab === "RawJson" ? "active" : ""}`}
          aria-disabled={!anyFileOpen ? "true" : undefined}
          onClick={() => anyFileOpen && onTabChange("RawJson")}
        >
          <img src="/iconsidebar/btnRawEditor.png" alt="Raw json" className="nav-icon" />
          <span>Raw json</span>
        </li>

        <li
          data-tab="Backups"
          className={`nav-item hidden ${activeTab === "Backups" ? "active" : ""}`}
          onClick={() => onTabChange("Backups")}
        >
          <img src="/iconsidebar/backups.svg" alt="Backups" className="nav-icon" />
          <span>Backups</span>
        </li>

       
      </ul>
    </aside>
  )
}

export default Sidebar
