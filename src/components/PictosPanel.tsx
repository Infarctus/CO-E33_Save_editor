import { FC, useState, useMemo } from "react";
import type { BeginMapping } from "../types/jsonSaveMapping";
import { generatePassiveEffectProgression } from "../types/jsonSaveMapping";
import { getPossiblePictos } from "../utils/gameMappingProvider";
import { PictoInfo as PictoInfoType } from "../types/jsonCustomMapping";
import { error, trace } from "@tauri-apps/plugin-log";
import { useInfo } from "./InfoContext";

// Placeholder for a pictos customization editor component
interface PictosPanelProps {
  jsonMapping: BeginMapping | null;
  triggerSaveNeeded: () => void;
}

type SortField = "friendlyName" | "found" | "mastered" | "level" | null;
type SortDirection = "asc" | "desc";

const PictosPanel: FC<PictosPanelProps> = ({ jsonMapping, triggerSaveNeeded }) => {


  const { setInfoMessage } = useInfo();


  function logAndInfo(message: string) {
    setInfoMessage(message)
    trace(message)
  }

    function logAndError(message: string) {
    setInfoMessage(message)
    error(message)
  }

  // Initial global pictos data that uses mapping data from getPossiblePictos and jsonMapping
  const allPictosMapping: [string, string][] = getPossiblePictos(); // each tuple: [name, friendlyName]
  // Build an inventory dictionary depending on save data, if available.
  if (!jsonMapping || !jsonMapping?.root?.properties?.InventoryItems_0) {
    return (
    <div id="PictosPanel" className="tab-panel oveflow-auto">
      <h2>Pictos</h2>
      <p style={{ color: "red" }}>The file you opened (if any) doesn't look like a CO:E33 save file</p>
    </div>
    )
  }

  const inventoryDict: { [key: string]: boolean } = Object.fromEntries(
    jsonMapping.root.properties.InventoryItems_0.Map.map((el) => [el.key.Name, el.value.Int === 1]) || []
  );


    const masteryDict: { [key: string]: boolean } = Object.fromEntries(
    jsonMapping.root.properties.PassiveEffectsProgressions_0?.Array.Struct.value.map((el) => [el.Struct.PassiveEffectName_3_A92DB6CC4549450728A867A714ADF6C5_0.Name, el.Struct.IsLearnt_9_2561000E49D90653437DE9A45BE2A86D_0.Bool]) || []
  );

      const levelDict: { [key: string]: number } = Object.fromEntries(
    jsonMapping?.root.properties.WeaponProgressions_0.Array.Struct.value.map((el) => [el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name, el.Struct.CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0.Int]) || []
  );

  // Build initial picto info list from available pictos and the inventory info.
  const initialPictos: PictoInfoType[] = allPictosMapping.map(([name, friendlyName]) => {
    const found = !!inventoryDict[name];
    const mastered = !!masteryDict[name];
    const level = levelDict[name] || 0;
    return { name, friendlyName, found, mastered, level};
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
    newMastered: boolean,
    newLevel: number
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
      logAndInfo("No associated pictos to "+pictoName)
      return;
    }
    // Trigger any external save/update call.
    triggerSaveNeeded();
    
    if(!jsonMapping.root.properties.PassiveEffectsProgressions_0){ // if the property doesn't exist, create it
      jsonMapping.root.properties.PassiveEffectsProgressions_0 = generatePassiveEffectProgression();
    }
    const currentArrPassEffectProg = jsonMapping.root.properties.PassiveEffectsProgressions_0.Array.Struct.value;
    const passiveEffectsProgIndex = currentArrPassEffectProg.findIndex(
      (el) => el.Struct.PassiveEffectName_3_A92DB6CC4549450728A867A714ADF6C5_0.Name === pictoName
    );


    if (thisPictoWas!.mastered && !newMastered) {

      trace("setting prog val to 0, unmaster")
      if (passiveEffectsProgIndex !== -1) {
        // Clone the array
        const newArr = currentArrPassEffectProg.slice();
        newArr[passiveEffectsProgIndex].Struct.LearntSteps_6_A14D681549E830249C77BD95F2B4CF3F_0.Int = 0
        newArr[passiveEffectsProgIndex].Struct.IsLearnt_9_2561000E49D90653437DE9A45BE2A86D_0.Bool = false
        jsonMapping.root.properties.PassiveEffectsProgressions_0.Array.Struct.value = newArr;
      }

    } else if (thisPictoWas!.found && newFound == false) {

      trace("removing from PassiveEffectsProgressions_0")
      if (passiveEffectsProgIndex !== -1) {
        const newArr = currentArrPassEffectProg.slice();
        newArr.splice(passiveEffectsProgIndex, 1);
        jsonMapping.root.properties.PassiveEffectsProgressions_0.Array.Struct.value = newArr;
      }

      trace("removing from inventory")
      jsonMapping.root.properties.InventoryItems_0.Map = jsonMapping.root.properties.InventoryItems_0.Map.filter((el => el.key.Name !== pictoName))
      //remove from inventory

      trace("Remove from weaponProg")
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
    }
    else if (!thisPictoWas!.mastered && newMastered == true) {
      trace("setting mastered to true")
      if (passiveEffectsProgIndex !== -1) {
        const newArr = currentArrPassEffectProg.slice();
        newArr[passiveEffectsProgIndex].Struct.IsLearnt_9_2561000E49D90653437DE9A45BE2A86D_0.Bool = true
        jsonMapping.root.properties.PassiveEffectsProgressions_0.Array.Struct.value = newArr;
      }
    }    else if (!thisPictoWas!.found && newFound) {

      trace("adding to inventory")
      jsonMapping.root.properties.InventoryItems_0.Map.push({ key: { Name: pictoName }, value: { Int: 1 } })

      trace("adding To PassiveEffectsProgressions")
      jsonMapping.root.properties.PassiveEffectsProgressions_0.Array.Struct.value.push({
        Struct: {
          PassiveEffectName_3_A92DB6CC4549450728A867A714ADF6C5_0: {
            Name: pictoName,
            tag: { data: { Other: "NameProperty" } },
          },
          IsLearnt_9_2561000E49D90653437DE9A45BE2A86D_0: {
            Bool: false,
            tag: { data: { Other: "BoolProperty" } },
          },
          LearntSteps_6_A14D681549E830249C77BD95F2B4CF3F_0: {
            Int: 0,
            tag: { data: { Other: "IntProperty" } },
          }
        }
      })
      trace("adding To weaponProg")
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

      // add to 
    } else if (newLevel != thisPictoWas!.level) {
      trace("setting prog level val to "+newLevel)
      const currentArr = jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value;
      const index = currentArr.findIndex(
        (el) => el.Struct.DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0.Name === pictoName
      );
      if (index !== -1) {
        // Clone the array
        const newArr = currentArr.slice();
        newArr[index].Struct.CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0.Int = newLevel
        jsonMapping.root.properties.WeaponProgressions_0.Array.Struct.value = newArr;
      }
      // set weaponProg to 0
    }

    setPictos((prev) =>
      prev.map((picto) => {
        if (picto.name === pictoName) {
          return { ...picto, found: newFound, mastered: newMastered, level: newLevel };
        }
        return picto
      }
      )
    );

    logAndInfo("Picto update:" + pictoName +" "+ newFound +" "+ newMastered+" "+newLevel);
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
        } else if (sortField == "level") {
          aVal = a.level
          bVal = b.level
        }
        if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
        if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [pictos, searchQuery, sortField, sortDirection]);

  return (
    <div id="PictosPanel" className="tab-panel oveflow-auto">
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
            <th
              style={{ borderBottom: "1px solid #ccc", cursor: "pointer", padding: "0.5em" }}
              onClick={() => handleSort("level")}
            >
              Level {sortField === "level" && (sortDirection === "asc" ? "↑" : "↓")}
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
                      if (!e.target.checked && picto.mastered) {
                        picto.mastered = false;
                      }
                      if (!e.target.checked && picto.level!==0) {
                        picto.level = 0;
                      }
                      handlePictoCheckUpdate(picto.name, e.target.checked, picto.mastered, picto.level)
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
                    disabled={!picto.found}
                    onChange={(e) =>
                      handlePictoCheckUpdate(picto.name, picto.found, e.target.checked, picto.level)
                    }
                  />
                  <div className="slider round" aria-disabled={!picto.found ? true : undefined}
                  //  aria-disabled={!picto.found}
                  ></div>
                </label>
              </td>


              <td style={{ padding: "0.5em", borderBottom: "1px solid #eee", textAlign: "center" }}>

                  <input
                    type="number"
                    min={0}
                    value={picto.level}
                    disabled={!picto.found}
                    onChange={(e) =>
                      handlePictoCheckUpdate(picto.name, picto.found, picto.mastered, e.target.valueAsNumber)
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
