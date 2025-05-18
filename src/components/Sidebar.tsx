"use client";

import type { FC } from "react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => Promise<boolean>;
  onOpenFile: () => void;
  onExportFile: () => void;
  onOverwriteFile: () => void;
  anyFileOpen: boolean;
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
      <button
        id="OpenFile"
        className="tab-button"
        onClick={onOpenFile}
        title="Select your save file"
      >
        Open File
      </button>
      <div className="export-overwrite">
        <button
          id="ExportFile"
          className="tab-button fileopen-dependant"
          onClick={onExportFile}
          disabled={!anyFileOpen}
          style={{ width:  "50%", marginRight: "0.3em" }}
          title={
            anyFileOpen
              ? "Export a file to wherever you want.\nYou will be prompted for the target destination."
              : "Open a file before trying to export it\nIt's just over this button"
          }
        >
          Export
        </button>

        <button
          id="OverwriteFile"
          className="tab-button fileopen-dependant"
          onClick={onOverwriteFile}
          disabled={!anyFileOpen}
          style={{ width:  "50%" }}
          title={
            anyFileOpen
              ? "Directly overwrite the file you opened.\nUses the same file location and name."
              : "Open a file before trying to overwrite it\nIt's just over this button"
          }
        >
          Overwrite
        </button>
      </div>

      <div className="spacer"></div>

      <ul className="nav-list">
        <li
          data-tab="SaveFile"
          className={`nav-item ${
            activeTab === "SaveFile" ? "active" : ""
          }`}
          // aria-disabled={!anyFileOpen ? "true" : undefined}
          onClick={() => onTabChange("SaveFile")}
        >
          <img
            src="/iconsidebar/btnHome.png"
            alt="SaveFile"
            className="nav-icon"
          />
          <span>Home</span>
        </li>
        <li
          data-tab="Characters"
          className={`nav-item fileopen-dependant ${
            activeTab === "Characters" ? "active" : ""
          }`}
          aria-disabled={!anyFileOpen ? "true" : undefined}
          onClick={() => anyFileOpen && onTabChange("Characters")}
        >
          <img
            src="/iconsidebar/btnCharacters.png"
            alt="Characters"
            className="nav-icon"
          />
          <span>Characters</span>
        </li>
        <li
          data-tab="Weapons"
          className={`nav-item fileopen-dependant ${
            activeTab === "Weapons" ? "active" : ""
          }`}
          aria-disabled={!anyFileOpen ? "true" : undefined}
          onClick={() => anyFileOpen && onTabChange("Weapons")}
        >
          <img
            src="/iconsidebar/btnWeapon.png"
            alt="Weapons"
            className="nav-icon"
          />
          <span>Weapons</span>
        </li>

        <li
          data-tab="Pictos"
          className={`nav-item fileopen-dependant ${
            activeTab === "Pictos" ? "active" : ""
          }`}
          aria-disabled={!anyFileOpen ? "true" : undefined}
          onClick={() => anyFileOpen && onTabChange("Pictos")}
        >
          <img
            src="/iconsidebar/btnPicto.png"
            alt="Pictos"
            className="nav-icon"
          />
          <span>Pictos</span>
        </li>

        <li
          data-tab="Inventory"
          className={`nav-item fileopen-dependant hidden ${
            activeTab === "Inventory" ? "active" : ""
          }`}
          aria-disabled={!anyFileOpen ? "true" : undefined}
          onClick={() => anyFileOpen && onTabChange("Inventory")}
        >
          <img
            src="/iconsidebar/inventory.svg"
            alt="Inventory"
            className="nav-icon"
          />
          <span>Inventory</span>
        </li>

        <li
          data-tab="MusicDisks"
          className={`nav-item fileopen-dependant ${
            activeTab === "MusicDisks" ? "active" : ""
          }`}
          aria-disabled={!anyFileOpen ? "true" : undefined}
          onClick={() => anyFileOpen && onTabChange("MusicDisks")}
        >
          <img
            src="/iconsidebar/btnMusicRecordIcon.png"
            alt="Music Disks"
            className="nav-icon"
          />
          <span>Music Disks</span>
        </li>

        <li
          data-tab="Journals"
          className={`nav-item fileopen-dependant ${
            activeTab === "Journals" ? "active" : ""
          }`}
          aria-disabled={!anyFileOpen ? "true" : undefined}
          onClick={() => anyFileOpen && onTabChange("Journals")}
        >
          <img
            src="/iconsidebar/btnJournal.png"
            alt="Music Disks"
            className="nav-icon"
          />
          <span>Journals</span>
        </li>

        <li
          data-tab="RawJson"
          className={`nav-item fileopen-dependant ${
            activeTab === "RawJson" ? "active" : ""
          }`}
          aria-disabled={!anyFileOpen ? "true" : undefined}
          onClick={() => anyFileOpen && onTabChange("RawJson")}
        >
          <img
            src="/iconsidebar/btnRawEditor.png"
            alt="Raw json"
            className="nav-icon"
          />
          <span>Raw json</span>
        </li>

        <li
          data-tab="Backups"
          className={`nav-item ${activeTab === "Backups" ? "active" : ""}`}
          onClick={() => onTabChange("Backups")}
        >
          <img
            src="/iconsidebar/btnBackup.png"
            alt="Backups"
            className="nav-icon"
          />
          <span>Backups</span>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
