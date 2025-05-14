import { FC, useState, useMemo } from "react";
import type { BeginMapping, WeaponProgressions_0 } from "../types/jsonSaveMapping";
import { getPossiblePictos } from "../utils/gameMappingProvider";
import { PictoInfo as PictoInfoType } from "../types/jsonCustomMapping";
import {produce} from "immer";

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
  if (!jsonMapping || !jsonMapping?.root?.properties?.InventoryItems_0) {
    return (
    <div id="PictosPanel" className="tab-panel">
        <h2>Pictos</h2>
        <p style={{ color: "red" }}>The file you opened (if any) doesn't look like a CO:E33 save file</p>
      </div>
    )
  }

  const inventoryDict: { [key: string]: boolean } = Object.fromEntries(
    jsonMapping.root.properties.InventoryItems_0.Map.map((el) => [el.key.Name, el.value.Int === 1]) || []
  );


    const masteryDict: { [key: string]: boolean } = Object.fromEntries(
    jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value.map((el) => [el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name, el.Struct.CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0.Int >=4]) || []
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
    var thisPictoWas: PictoInfoType;
    var pictoFound = false;

      pictos.map((picto) =>
      {
        if (picto.name === pictoName) {
          thisPictoWas = picto;
          pictoFound = true;
          return { ...picto, found: newFound, mastered: newMastered };
        } 
        return picto
      }
      )

    if (!pictoFound) {
      console.log("No associated pictos to ",pictoName)
      return;
    }
    // Trigger any external save/update call.
    triggerSaveNeeded();
    // Call any additional logic with provided parameters.
    console.log("old picto" + thisPictoWas!.found, thisPictoWas!.mastered, "|", newFound, newMastered)

    if (thisPictoWas!.mastered && !newMastered) {

      console.log("setting prog val to 0")
      const currentArr = jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value;
      const index = currentArr.findIndex(
        (el) => el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name === pictoName
      );
      if (index !== -1) {
        // Clone the array
        const newArr = currentArr.slice();
        newArr[index].Struct.CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0.Int = 0
        jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value = newArr;
      }
      // set weaponProg to 0

    } else if (thisPictoWas!.found && newFound == false) {

      console.log("removing from WeaponProg")
      const currentArr = jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value;
      const index = currentArr.findIndex(
        (el) => el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name === pictoName
      );
      if (index !== -1) {
        // Clone the array
        const newArr = currentArr.slice();
        newArr.splice(index, 1);
        jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value = newArr;
      }
      //remove from WeaponPregression
      console.log("removing from inventory")
      jsonMapping.root.properties.InventoryItems_0.Map = jsonMapping.root.properties.InventoryItems_0.Map.filter((el => el.key.Name !== pictoName))
      //remove from inventory
    }
    else
      if (!thisPictoWas!.mastered && newMastered == true) {
        console.log("setting prog val to 4")
        const currentArr = jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value;
        const index = currentArr.findIndex(
          (el) => el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name === pictoName
        );
        if (index !== -1) {
          // Clone the array
          const newArr = currentArr.slice();
          newArr[index].Struct.CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0.Int = 4
          jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value = newArr;
        }
      }
      else
        if (!thisPictoWas!.found && newFound) {
          console.log("adding from inventory")
          jsonMapping.root.properties.InventoryItems_0.Map.push({ key: { Name: pictoName }, value: { Int: 1 } })
          // add to inventory
          console.log("adding To WeaponProg")
          jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value.push({
            Struct: {
              DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0: {
                Name: pictoName,
                tag: { data: { Other: "NameProperty" } },
              },
              CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0: {
                Int: 0,
                tag: { data: { Other: "IntProperty" } },
              }
            }
          })
          // add to weaponProg
        }

    setPictos((prev) =>
      prev.map((picto) => {
        if (picto.name === pictoName) {
          return { ...picto, found: newFound, mastered: newMastered };
        }
        return picto
      }
      )
    );

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
        style={{ padding: "0.5em", width: "100%" }}
      />
      {displayedPictos.length != 0 && <sup style={{ padding: "0.7em"}}>{displayedPictos.length} results</sup>}
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
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={picto.found}
                    onChange={(e) =>
                    {
                      handlePictoCheckUpdate(picto.name, e.target.checked, picto.mastered)
                      if (picto.mastered) {
                        
                        picto.mastered = false;}
                    }
                    }
                  />
                  <div className="slider round"></div>
                </label>
              </td>
              <td style={{ padding: "0.5em", borderBottom: "1px solid #eee", textAlign: "center" }}>
                <label className="switch">

                <input
                  type="checkbox"
                  checked={picto.mastered}
                  onChange={(e) =>
                    handlePictoCheckUpdate(picto.name, picto.found, e.target.checked)
                  }
                />
                  <div className="slider round"></div>
                </label>
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
