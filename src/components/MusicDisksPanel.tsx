import { useMemo, useState } from "react";
import { MusicDisckInfo } from "../types/jsonCustomMapping";
import { BeginMapping } from "../types/jsonSaveMapping";
import { getPossibleMusicDisks } from "../utils/gameMappingProvider";
import { useInfo } from "./InfoContext";
import { error, trace } from "@tauri-apps/plugin-log";


interface MusicDisksPanelProps {
  jsonMapping: BeginMapping | null;
  triggerSaveNeeded: () => void;
}

type SortField = "name" | "found" | null;
type SortDirection = "asc" | "desc";


const MusicDisksPanel: React.FC<MusicDisksPanelProps> = ({
  jsonMapping,
  triggerSaveNeeded,
}) => {
  if (!jsonMapping || !jsonMapping?.root?.properties?.InventoryItems_0) {
    return (
      <div id="MusicDisksPanel" className="tab-panel oveflow-auto">
        <h2>Music Disks</h2>
        <p style={{ color: "red" }}>
          The file you opened (if any) doesn't look like a CO:E33 save file
        </p>
      </div>
    );
  }
  const { setInfoMessage } = useInfo();
  function logAndError(message: string) {
      setInfoMessage(message)
      error(message)
    }

  const allMusicDisks = useMemo(() => {
    return getPossibleMusicDisks();
  }, []) 

  const inventoryDict: { [key: string]: boolean } = Object.fromEntries(
    jsonMapping.root.properties.InventoryItems_0.Map.map((el) => [el.key.Name, el.value.Int === 1]) || []
  );

  const initialMusicDisks : MusicDisckInfo[] = allMusicDisks.map(([name, friendlyName]) => {
    const found = !!inventoryDict[name];
    return {name, friendlyName, found};
  });

  const [musicDisks, setMusicDisks] = useState<MusicDisckInfo[]>(initialMusicDisks);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");


  const handleMusicDiskChange = (musicDisksname: string, newFound: boolean) => {
    let thisMusicDiskWas : MusicDisckInfo | undefined 
        thisMusicDiskWas = musicDisks.find((musicDisk) => musicDisk.name === musicDisksname);
    if (!thisMusicDiskWas) {
      logAndError(`Music disk ${musicDisksname} not found in the list.`);
      return;
    } else {
      if (thisMusicDiskWas.found && newFound === false) {
        jsonMapping.root.properties.InventoryItems_0.Map = jsonMapping.root.properties.InventoryItems_0.Map.filter(
          (inventoryEl) => inventoryEl.key.Name === musicDisksname ? false : true)
      } else if (!thisMusicDiskWas.found && newFound === true) {
        jsonMapping.root.properties.InventoryItems_0.Map.push({
          key: {
            Name: musicDisksname
          },
          value: { Int: 1 }
        }
        )
      }
    }

    setMusicDisks((prev) =>
      prev.map((disk) => {
        if (disk.name === musicDisksname) {
          return {
            ...disk,
            found: newFound,
          };
        }
        return disk;
      })
    );
    triggerSaveNeeded();
  }

  // Handle sorting when headers are clicked.
  const handleSort = (field: SortField) => {
    // Determine new direction. If already sorting by this field, reverse the direction; otherwise, default to ascending.
    let direction: SortDirection = "asc";
    if (sortField === field) {
      direction = sortDirection === "asc" ? "desc" : "asc";
    }
    setSortField(field);
    setSortDirection(direction);
  };

  // Memoize and compute the final list after filtering and sorting.
    const displayedDisks = useMemo(() => {
      let filtered = musicDisks.filter((disk) =>
        disk.friendlyName.toLowerCase().includes(searchQuery.toLowerCase())
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
    }, [musicDisks, searchQuery, sortField, sortDirection]);



 return (
    <div id="MusicDisksPanel" className="tab-panel oveflow-auto">
      <h2>Music Disks</h2>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name..."
        className="search-bar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {displayedDisks.length != 0 && (
        <sup style={{ padding: "0.7em" }}>{displayedDisks.length} results</sup>
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
          {displayedDisks.map((disk) => (
            <tr key={disk.name}>
              <td>
                {disk.friendlyName}
              </td>
              <td>
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
          {displayedDisks.length === 0 && (
            <tr>
              <td colSpan={3} style={{ padding: "0.5em", textAlign: "center" }}>
                No pictos found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
    
};

export default MusicDisksPanel;
