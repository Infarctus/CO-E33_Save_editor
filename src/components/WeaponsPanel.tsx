import { FC, useState, useMemo } from "react";
import type { BeginMapping } from "../types/jsonSaveMapping";
import {
  generatePassiveEffectProgression,
  generateWeaponPassiveEffectProgression,
} from "../types/jsonSaveMapping";
import { getPossibleWeapons } from "../utils/gameMappingProvider";
import { WeaponInfoType } from "../types/jsonCustomMapping";
import { error, trace } from "@tauri-apps/plugin-log";
import { useInfo } from "./InfoContext";

// Placeholder for a weapons customization editor component
interface WeaponsPanelProps {
  jsonMapping: BeginMapping | null;
  triggerSaveNeeded: () => void;
}

type SortField = "friendlyName" | "found" | "level" | null;
type SortDirection = "asc" | "desc";

const WeaponsPanel: FC<WeaponsPanelProps> = ({
  jsonMapping,
  triggerSaveNeeded,
}) => {
  const { setInfoMessage } = useInfo();

  function logAndInfo(message: string) {
    setInfoMessage(message);
    trace(message);
  }

  function logAndError(message: string) {
    setInfoMessage(message);
    error(message);
  }

  // Initial global weapons data that uses mapping data from getPossibleWeapons and jsonMapping
  const allWeaponsMapping: [string, string][] = useMemo(() => {
    return getPossibleWeapons(); // Call the function once when the component mounts
  }, []); // Empty dependency array means this will only run once

  // Build an inventory dictionary depending on save data, if available.
  if (!jsonMapping || !jsonMapping?.root?.properties?.InventoryItems_0) {
    return (
      <div id="WeaponsPanel" className="tab-panel oveflow-auto">
        <h2>Weapons</h2>
        <p style={{ color: "red" }}>
          The file you opened (if any) doesn't look like a CO:E33 save file
        </p>
      </div>
    );
  }

  const inventoryDict: { [key: string]: boolean } = Object.fromEntries(
    jsonMapping.root.properties.InventoryItems_0.Map.map((el) => [
      el.key.Name,
      el.value.Int === 1,
    ]) || []
  );


  const levelDict: { [key: string]: number } = Object.fromEntries(
    jsonMapping?.root.properties.WeaponProgressions_0.Array.Struct.value.map(
      (el) => [
        el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name,
        el.Struct.CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0.Int,
      ]
    ) || []
  );

  // Build initial weapon info list from available weapons and the inventory info.
  const initialWeaponsDict: { [key: string]: WeaponInfoType } =
    Object.fromEntries(allWeaponsMapping.map(
      ([name, friendlyName]) => {
        const found = !!inventoryDict[name];
        const level = levelDict[name] || 0;
        const owner= "todo"
        const wit: WeaponInfoType = { friendlyName, found, level,owner }
        return [name, wit];
      }
    )
    );

  // State for weapons, search query, and sorting.
  const [weapons, setWeapons] = useState<{[key: string]: WeaponInfoType}>(initialWeaponsDict);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Called whenever an input box is toggled.
  // The function receives the weapon's name along with the updated found and mastered values.
  const handleWeaponCheckUpdate = (
    weaponName: string,
    newFound: boolean,
    newLevel: number
  ) => {
    // Update local state accordingly.
    var thisWeaponWas: WeaponInfoType = weapons[weaponName]!;


    // Trigger any external save/update call.
    triggerSaveNeeded();



    if (thisWeaponWas.found && newFound == false) {
      trace("removing from inventory");
      jsonMapping.root.properties.InventoryItems_0.Map =
        jsonMapping.root.properties.InventoryItems_0.Map.filter(
          (el) => el.key.Name !== weaponName
        );
      //remove from inventory

      trace("Remove from weaponProg");
      const currentArr =
        jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value;
      const index = currentArr.findIndex(
        (el) =>
          el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name ===
          weaponName
      );
      if (index !== -1) {
        // Clone the array
        const newArr = currentArr.slice();
        newArr.splice(index, 1);
        jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value =
          newArr;
      }
    } else if (!thisWeaponWas.found && newFound) {
      trace("adding to inventory");
      jsonMapping.root.properties.InventoryItems_0.Map.push({
        key: { Name: weaponName },
        value: { Int: 1 },
      });

      trace("adding To PassiveEffectsProgressions");
      jsonMapping.root.properties.PassiveEffectsProgressions_0.Array.Struct.value.push(
        generateWeaponPassiveEffectProgression(weaponName, false, 0)
      );
      trace("adding To weaponProg");
      console.log("adding To WeaponProg");
      jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value.push({
        Struct: {
          DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0: {
            Name: weaponName,
            tag: { data: { Other: "NameProperty" } },
          },
          CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0: {
            Int: 0,
            tag: { data: { Other: "IntProperty" } },
          },
        },
      });

      // add to
    } else if (newLevel != thisWeaponWas.level) {
      trace("setting prog level val to " + newLevel);
      const currentArr =
        jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value;
      const index = currentArr.findIndex(
        (el) =>
          el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name ===
          weaponName
      );
      if (index !== -1) {
        // Clone the array
        const newArr = currentArr.slice();
        newArr[
          index
        ].Struct.CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0.Int =
          newLevel;
        jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value =
          newArr;
      }
      // set weaponProg to 0
    }

    setWeapons(weapons => ({ ...weapons, [weaponName]: { friendlyName: thisWeaponWas.friendlyName, found: newFound, level: newLevel, owner: thisWeaponWas.owner } }));

    logAndInfo(
      "Weapon update:" +
        weaponName +
        " " +
        newFound +
        " " +
        newLevel
    );
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
  const displayedWeapons = useMemo(() => {
    let filtered = Object.entries(weapons).filter((item) => {
      item[1].friendlyName.toLowerCase().includes(searchQuery.toLowerCase())
    })
    if (sortField) {
      filtered.sort((a, b) => {
        let aVal: any;
        let bVal: any;
        if (sortField === "friendlyName") {
          aVal = a[1].friendlyName.toLowerCase();
          bVal = b[1].friendlyName.toLowerCase();
        } else if (sortField === "found") {
          aVal = a[1][sortField] ? 1 : 0;
          bVal = b[1][sortField] ? 1 : 0;
        } else if (sortField == "level") {
          aVal = a[1].level;
          bVal = b[1].level;
        }
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [
    // weapons, // this is a test to not update directly 
      searchQuery, sortField, sortDirection]);

  return (
    <div id="WeaponsPanel" className="tab-panel oveflow-auto">
      <h2>Weapons Tab</h2>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ padding: "0.5em", width: "100%" }}
      />
      {displayedWeapons.length != 0 && (
        <sup style={{ padding: "0.7em" }}>{displayedWeapons.length} results</sup>
      )}
      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                borderBottom: "1px solid #ccc",
                cursor: "pointer",
                padding: "0.5em",
              }}
              onClick={() => handleSort("friendlyName")}
            >
              Name{" "}
              {sortField === "friendlyName" &&
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
            <th
              style={{
                borderBottom: "1px solid #ccc",
                cursor: "pointer",
                padding: "0.5em",
              }}
              onClick={() => handleSort("mastered")}
            >
              Mastered{" "}
              {sortField === "mastered" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              style={{
                borderBottom: "1px solid #ccc",
                cursor: "pointer",
                padding: "0.5em",
              }}
              onClick={() => handleSort("level")}
            >
              Level{" "}
              {sortField === "level" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>
        <tbody>
          {displayedWeapons.map((weapon) => (
            <tr key={weapon.name}>
              <td style={{ padding: "0.5em", borderBottom: "1px solid #eee" }}>
                {weapon.friendlyName}
              </td>
              <td
                style={{
                  padding: "0.5em",
                  borderBottom: "1px solid #eee",
                  textAlign: "center",
                }}
              >
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={weapon.found}
                    onChange={(e) => {
                      if (!e.target.checked && weapon.mastered) {
                        weapon.mastered = false;
                      }
                      if (!e.target.checked && weapon.level !== 0) {
                        weapon.level = 0;
                      }
                      handleWeaponCheckUpdate(
                        weapon.name,
                        e.target.checked,
                        weapon.mastered,
                        weapon.level
                      );
                    }}
                  />
                  <div className="slider round"></div>
                </label>
              </td>
              <td
                style={{
                  padding: "0.5em",
                  borderBottom: "1px solid #eee",
                  textAlign: "center",
                }}
              >
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={weapon.mastered}
                    disabled={!weapon.found}
                    onChange={(e) =>
                      handleWeaponCheckUpdate(
                        weapon.name,
                        weapon.found,
                        e.target.checked,
                        weapon.level
                      )
                    }
                  />
                  <div
                    className="slider round"
                    aria-disabled={!weapon.found ? true : undefined}
                    //  aria-disabled={!weapon.found}
                  ></div>
                </label>
              </td>

              <td
                style={{
                  padding: "0.5em",
                  borderBottom: "1px solid #eee",
                  textAlign: "center",
                }}
              >
                <input
                  type="number"
                  min={0}
                  max={33}
                  value={weapon.level}
                  disabled={!weapon.found}
                  onChange={(e) =>
                    handleWeaponCheckUpdate(
                      weapon.name,
                      weapon.found,
                      weapon.mastered,
                      e.target.valueAsNumber
                    )
                  }
                />
              </td>
            </tr>
          ))}
          {displayedWeapons.length === 0 && (
            <tr>
              <td colSpan={3} style={{ padding: "0.5em", textAlign: "center" }}>
                No weapons found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default WeaponsPanel;
