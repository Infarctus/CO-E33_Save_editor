import { type FC } from "react"
import type { BeginMapping, WeaponProgressions_0 } from "../types/jsonSaveMapping"
import { getPossiblePictos } from "../utils/gameMappingProvider"

// Placeholder for a pictos customization editor component
interface PictosPanelProps {
  jsonMapping: BeginMapping | null
  triggerSaveNeeded: () => void
}

const PictosPanel: FC<PictosPanelProps> = ({  jsonMapping, triggerSaveNeeded }) => {
  // Placeholder: Extract unlocked pictos and all possible pictos from jsonMapping
  const unlockedPictos: string[] = [] // TODO: Populate from save data
  const allPictos: [string, string][] = [] // TODO: Populate from mapping (e.g., [id, displayName])

  return (
    <div id="PictosPanel" className="tab-panel">
      <h2>Pictos Tab</h2>
      {/* Placeholder for pictos customization UI */}
      {/* You can use a component similar to CharacCustoEditor for pictos */}
      {/* Example: */}
      {/* 
      <PictosCustoEditor
        currentList={unlockedPictos}
        fullList={allPictos}
        onUpdatePictos={(newList) => {
          // TODO: Update pictos in save data and triggerSaveNeeded()
        }}
      />
      */}
      <p>Pictos customization coming soon...</p>
    </div>
  )
}

export default PictosPanel

