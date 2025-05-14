import { FC, useState, useMemo } from "react";
import type { BeginMapping, WeaponProgressions_0 } from "../types/jsonSaveMapping";
import { getPossiblePictos } from "../utils/gameMappingProvider";
import { PictoInfo as PictoInfoType } from "../types/jsonCustomMapping";

// Placeholder for a pictos customization editor component
interface PictosPanelProps {
  jsonMapping: BeginMapping | null;
  triggerSaveNeeded: () => void;
}

type SortField = "friendlyName" | "found" | "mastered" | null;
type SortDirection = "asc" | "desc";

const PictosPanel: FC<PictosPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {
  // Initial global pictos data that uses mapping data from getPossiblePictos and jsonMapping
  const allPictosMapping: [string, string][] = getPossiblePictos(); // each tuple: [name, friendlyName]
  // Build an inventory dictionary depending on save data, if available.
  const inventoryDict: { [key: string]: boolean } = Object.fromEntries(
    jsonMapping?.root.properties.InventoryItems_0.Map.map((el) => [el.key.Name, el.value.Int === 1]) || []
  );


    const masteryDict: { [key: string]: boolean } = Object.fromEntries(
    jsonMapping?.root.properties.WeaponProgressions_0.Array.Struct.value.map((el) => [el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name, el.Struct.CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0.Int >=4]) || []
  );

  // Build initial picto info list from available pictos and the inventory info.
  const initialPictos: PictoInfoType[] = allPictosMapping.map(([name, friendlyName]) => {
    const found = !!inventoryDict[name];
    const mastered = !!masteryDict[name];
    return { name, friendlyName, found, mastered };
  });

  // State for pictos, search query, and sorting.
  const [pictos, setPictos] = useState<PictoInfoType[]>(initialPictos);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Called whenever a checkbox is toggled.
  // The function receives the picto's name along with the updated found and mastered values.
  const handlePictoCheckUpdate = (
    pictoName: string,
    newFound: boolean,
    newMastered: boolean
  ) => {
    // Update local state accordingly.
    setPictos((prev) =>
      prev.map((picto) =>
        picto.name === pictoName ? { ...picto, found: newFound, mastered: newMastered } : picto
      )
    );
    // Trigger any external save/update call.
    triggerSaveNeeded();
    // Call any additional logic with provided parameters.
    console.log("Picto update:", pictoName, newFound, newMastered);
  };

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
  const displayedPictos = useMemo(() => {
    let filtered = pictos.filter((picto) =>
      picto.friendlyName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (sortField) {
      filtered.sort((a, b) => {
        let aVal: any;
        let bVal: any;
        if (sortField === "friendlyName") {
          aVal = a.friendlyName.toLowerCase();
          bVal = b.friendlyName.toLowerCase();
        } else if (sortField === "found" || sortField === "mastered") {
          aVal = a[sortField] ? 1 : 0;
          bVal = b[sortField] ? 1 : 0;
        }
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [pictos, searchQuery, sortField, sortDirection]);

  return (
    <div id="PictosPanel" className="tab-panel">
      <h2>Pictos Tab</h2>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: "1em", padding: "0.5em", width: "100%" }}
      />
      {displayedPictos.length != 0 && <sup>{displayedPictos.length} results</sup>}
      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{ borderBottom: "1px solid #ccc", cursor: "pointer", padding: "0.5em" }}
              onClick={() => handleSort("friendlyName")}
            >
              Name {sortField === "friendlyName" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              style={{ borderBottom: "1px solid #ccc", cursor: "pointer", padding: "0.5em" }}
              onClick={() => handleSort("found")}
            >
              Found {sortField === "found" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              style={{ borderBottom: "1px solid #ccc", cursor: "pointer", padding: "0.5em" }}
              onClick={() => handleSort("mastered")}
            >
              Mastered {sortField === "mastered" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedPictos.map((picto) => (
            <tr key={picto.name}>
              <td style={{ padding: "0.5em", borderBottom: "1px solid #eee" }}>{picto.friendlyName}</td>
              <td style={{ padding: "0.5em", borderBottom: "1px solid #eee", textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={picto.found}
                  onChange={(e) =>
                    handlePictoCheckUpdate(picto.name, e.target.checked, picto.mastered)
                  }
                />
              </td>
              <td style={{ padding: "0.5em", borderBottom: "1px solid #eee", textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={picto.mastered}
                  onChange={(e) =>
                    handlePictoCheckUpdate(picto.name, picto.found, e.target.checked)
                  }
                />
              </td>
            </tr>
          ))}
          {displayedPictos.length === 0 && (
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

export default PictosPanel;
