import { useMemo,useState } from "react";
import { error, trace } from "@tauri-apps/plugin-log";
import { GeneralPanelProps } from "../types/panelTypes";
import { useInfo } from "./InfoContext";
import { clamp } from "../utils/utils";

function renderNumberInput(
  value: number,
  label: string,
  onChange: (newValue: number) => void,
  minInput: number = 0,
  maxInput: number = 9999
) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label
        htmlFor={label.toLowerCase() + "-input"}
        style={{ marginRight: "0.5rem" }}
      >
        {label}:
      </label>
      <input
        type="number"
        min={minInput}
        max={maxInput}
        value={value}
        onChange={(e) =>
          onChange(clamp(parseInt(e.target.value, 10), minInput, maxInput) || 0)
        }
        style={{ width: "auto" }}
      />
    </div>
  );
}

const MiscPanel: React.FC<GeneralPanelProps> = ({
  jsonMapping,
  triggerSaveNeeded,
}) => {
  if (!jsonMapping || !jsonMapping?.root?.properties?.InventoryItems_0) {
    return (
      <div id="MiscPanel" className="tab-panel overflow-auto">
        <h2>Misc</h2>
        <p style={{ color: "red" }}>
          The file you opened (if any) doesn't look like a CO:E33 save file
        </p>
      </div>
    );
  }
    const [refresh, setRefresh] = useState(0);
  const { setInfoMessage } = useInfo();
  function logAndError(message: string) {
    setInfoMessage(message);
    error(message);
  }
  function logAndInfo(message: string) {
    setInfoMessage(message);
    trace(message);
  }

  // Gold Editor
  const goldValue = jsonMapping.root.properties.Gold_0.Int;
  const MiscItemsInv: [string, string][] = [
    ["PartyHealShard", "Party Heal Shard"],
    ["HealingTint_Shard", "Healing Tint Shard"],
    ["EnergyTint_Shard", "Energy Tint Shard"],
    ["ReviveTint_Shard", "Revive Tint Shard"],
  ];

  const MiscItemsDict = useMemo(() => {
    const itemsSet = new Set(MiscItemsInv.map(([name]) => name));
    return Object.fromEntries(
      (jsonMapping.root.properties.InventoryItems_0.Map || [])
        .filter((el) => itemsSet.has(el.key.Name))
        .map((el) => [el.key.Name, el.value.Int])
    );
  }, [jsonMapping, refresh]);

  const TintsBeg: [string, string][] = [
    ["Consumable_Health_Level", "Healing Tint Shard Level"],
    ["Consumable_Energy_Level", "Energy Tint Shard Level"],
    ["Consumable_Revive_Level", "Revive Tint Shard Level"],
  ];

  const TintsLvl = useMemo(() => {
    const itemsSet = new Set(TintsBeg.map(([name]) => name));
    return Object.fromEntries(
      (jsonMapping.root.properties.InventoryItems_0.Map || [])
        .filter((el) => itemsSet.has(el.key.Name.slice(0, -1)))
        .map((el) => [el.key.Name, Number(el.key.Name.slice(-1))])
    );
  }, [jsonMapping, refresh]);

  const GoldChange = (newValue: number) => {
    jsonMapping.root.properties.Gold_0.Int = newValue;
    triggerSaveNeeded();
    logAndInfo(`Gold set to ${newValue}`);
  };

  const SetInventoryItems = (name: string, newValue: number) => {
    // Find the item in the InventoryItems_0.Map array and update its value
    const item = jsonMapping.root.properties.InventoryItems_0.Map.find(
      (el: any) => el.key.Name === name
    );
    if (item) {
      item.value.Int = newValue;
      triggerSaveNeeded();
      logAndInfo(`${name} set to ${newValue}`);
    }
  };
  const SetTintsLvl = (name: string, newValue: number) => {
    const item = jsonMapping.root.properties.InventoryItems_0.Map.find(
      (el: any) => el.key.Name === name
    );
    if (item) {
      item.key.Name = item.key.Name.slice(0, -1) + newValue;
      triggerSaveNeeded();
      logAndInfo(`${name} set to ${newValue}`);
      setRefresh((r : any) => r + 1); // Force re-render
    }
  };

  return (
    <div id="MiscPanel" className="tab-panel overflow-auto">
      <h2>Misc</h2>
      {renderNumberInput(goldValue, "Gold", GoldChange, 0, 2147483647)}
      {MiscItemsInv.map(([name, friendlyName]) =>
        renderNumberInput(MiscItemsDict[name], friendlyName, (newValue) =>
          SetInventoryItems(name, newValue)
        )
      )}
    {Object.entries(TintsLvl).map(([name, level]) => {
      // Find the friendly name from TintsBeg
      const friendlyName =
        TintsBeg.find(([baseName]) => name.startsWith(baseName))?.[1] || name;
      return renderNumberInput(
        level,
        friendlyName,
        (newValue) => SetTintsLvl(name, newValue),
        0,
        2
      );
    })}

      {/* Add more misc editors here */}
    </div>
  );
};

export default MiscPanel;
