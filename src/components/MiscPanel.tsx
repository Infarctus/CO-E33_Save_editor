import { useMemo } from "react";
import { error, trace } from "@tauri-apps/plugin-log";
import { GeneralPanelProps } from "../types/panelTypes";
import { useInfo } from "./InfoContext";


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
    const { setInfoMessage } = useInfo();
    function logAndError(message: string) {
        setInfoMessage(message);
        error(message);
    }
    function logAndInfo(message: string) {
        setInfoMessage(message);
        trace(message);
    }

    const inventoryDict: { [key: string]: boolean } = useMemo(() => Object.fromEntries(
        jsonMapping.root.properties.InventoryItems_0.Map.map((el) => [el.key.Name, el.value.Int === 1]) || []
      ), []);

    
    // Gold Editor
    const goldValue = jsonMapping.root.properties.Gold_0.Int;

    const handleGoldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value, 10) || 0;
        jsonMapping.root.properties.Gold_0.Int = newValue;
        triggerSaveNeeded();
        logAndInfo(`Gold set to ${newValue}`);
    };

    return (
        <div id="MiscPanel" className="tab-panel overflow-auto">
            <h2>Misc</h2>
            <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="gold-input" style={{ marginRight: "0.5rem" }}>
                    Gold:
                </label>
                <input
                    type="number"
                    min={0}
                    value={goldValue}
                    onChange={handleGoldChange}
                    style={{ width: "100px" }}
                />
            </div>
            {/* Add more misc editors here */}
        </div>
    );

    

}


export default MiscPanel;