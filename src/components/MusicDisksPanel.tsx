import { useState } from "react";
import { MusicDisckInfo } from "../types/jsonCustomMapping";
import { BeginMapping } from "../types/jsonSaveMapping";
import { getPossibleMusicDisks } from "../utils/gameMappingProvider";
import { useInfo } from "./InfoContext";
import { error, trace } from "@tauri-apps/plugin-log";


interface MusicDisksPanelProps {
  jsonMapping: BeginMapping | null;
  triggerSaveNeeded: () => void;
}

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

  const allMusicDisks = getPossibleMusicDisks();

  const inventoryDict: { [key: string]: boolean } = Object.fromEntries(
    jsonMapping.root.properties.InventoryItems_0.Map.map((el) => [el.key.Name, el.value.Int === 1]) || []
  );

  const initialMusicDisks : MusicDisckInfo[] = allMusicDisks.map(([name, friendlyName]) => {
    const found = !!inventoryDict[name];
    return {name, friendlyName, found};
  });

  const [musicDisks, setMusicDisks] = useState<MusicDisckInfo[]>(initialMusicDisks);

  const handleMusicDiskChange = (musicDisksname: string, newFound: boolean) => {
    let thisMusicDiskWas : MusicDisckInfo | undefined 
    thisMusicDiskWas = musicDisks.find((musicDisk) => musicDisk.name === musicDisksname);
    if(!thisMusicDiskWas) {
        logAndError(`Music disk ${musicDisksname} not found in the list.`);
        return;
    }
    triggerSaveNeeded();

  }
};

export default MusicDisksPanel;
