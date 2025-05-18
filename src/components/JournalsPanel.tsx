import { useMemo, useState } from "react";
import { JournalInfo } from "../types/jsonCustomMapping";
import { getPossibleJournals } from "../utils/gameMappingProvider";
import { useInfo } from "./InfoContext";
import { error } from "@tauri-apps/plugin-log";
import type { GeneralPanelProps } from "../types/panelTypes";


const JournalsPanel: React.FC<GeneralPanelProps> = ({
  jsonMapping,
  triggerSaveNeeded,
}) => {
  if (!jsonMapping || !jsonMapping?.root?.properties?.InventoryItems_0) {
    return (
      <div id="JournalsPanel" className="tab-panel overflow-auto">
        <h2>Journals</h2>
        <p style={{ color: "red" }}>
          The file you opened (if any) doesn't look like a CO:E33 save file
        </p>
      </div>
    );
  }

  const { setInfoMessage } = useInfo();
  function logAndError(message: string) {
    setInfoMessage(message);
    error(message);
  }

  const allJournals = useMemo(() =>getPossibleJournals(), []);

  const inventoryDict: { [key: string]: boolean } = useMemo(() => Object.fromEntries(
    jsonMapping.root.properties.InventoryItems_0.Map.map((el) => [
      el.key.Name,
      el.value.Int === 1,
    ]) || []
  ), []);

  const initialJournals: JournalInfo[] = useMemo(() => allJournals.map(
    ([name, friendlyName]) => {
      const found = !!inventoryDict[name];
      return { name, friendlyName, found };
    }
  ), []);

  const [journals, setJournals] = useState<JournalInfo[]>(initialJournals);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleMusicDiskChange = (Journalname: string, newFound: boolean) => {
      let thisMusicDiskWas : JournalInfo | undefined 
          thisMusicDiskWas = journals.find((journal) => journal.name === Journalname);
      if (!thisMusicDiskWas) {
        logAndError(`Music disk ${Journalname} not found in the list.`);
        return;
      } else {
        if (thisMusicDiskWas.found && newFound === false) {
          jsonMapping.root.properties.InventoryItems_0.Map = jsonMapping.root.properties.InventoryItems_0.Map.filter(
            (inventoryEl) => inventoryEl.key.Name === Journalname ? false : true)
        } else if (!thisMusicDiskWas.found && newFound === true) {
          jsonMapping.root.properties.InventoryItems_0.Map.push({
            key: {
              Name: Journalname
            },
            value: { Int: 1 }
          }
          )
        }
      }
  
      setJournals((prev) =>
        prev.map((journal) => {
          if (journal.name === Journalname) {
            return {
              ...journal,
              found: newFound,
            };
          }
          return journal;
        })
      );
      triggerSaveNeeded();
    }

  type SortField = "name" | "found" | null;
  type SortDirection = "asc" | "desc";

  const handleSort = (field: SortField) => {
    let direction: SortDirection = "asc";
    if (sortField === field) {
      direction = sortDirection === "asc" ? "desc" : "asc";
    }
    setSortField(field);
    setSortDirection(direction);
  };

  const displayedJournals = useMemo(() => {
    let filtered = journals.filter((journal) =>
      journal.friendlyName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortField) {
      filtered.sort((a, b) => {
        let aVal: any;
        let bVal: any;
        if (sortField === "name") {
          aVal = a.friendlyName.toLowerCase();
          bVal = b.friendlyName.toLowerCase();
        } else if (sortField === "found") {
          aVal = a[sortField] ? 1 : 0;
          bVal = b[sortField] ? 1 : 0;
        }
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [journals, searchQuery, sortField, sortDirection]);

  return (
    <div id="JournalPanel" className="tab-panel oveflow-auto">
      <h2>Journals</h2>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name..."
        className="search-bar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {displayedJournals.length != 0 && (
        <sup style={{ padding: "0.7em" }}>{displayedJournals.length} results</sup>
      )}
      {/* Table */}
      <table style={{  width: "100%", maxWidth: "500px", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                borderBottom: "1px solid #ccc",
                cursor: "pointer",
                padding: "0.5em",
              }}
              onClick={() => handleSort("name")}
            >
              Name{" "}
              {sortField === "name" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              style={{
                borderBottom: "1px solid #ccc",
                cursor: "pointer",
                padding: "0.5em",
              }}
              onClick={() => handleSort("found")}
            >
              Found{" "}
              {sortField === "found" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedJournals.map((disk) => (
            <tr key={disk.name}>
              <td>
                {disk.friendlyName}
              </td>
              <td
                style={{
                  textAlign: "center",
                }}
              >
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={disk.found}
                    onChange={(e) => {
                      handleMusicDiskChange(
                        disk.name,
                        e.target.checked,
                      );
                    }}
                  />
                  <div className="slider round"></div>
                </label>
              </td>
            </tr>
          ))}
          {displayedJournals.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                No pictos found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JournalsPanel;
