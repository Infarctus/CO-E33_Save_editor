import { BeginMapping } from './jsonSaveMapping'

export interface GeneralPanelProps {
    jsonMapping: BeginMapping | null
    triggerSaveNeeded: () => void
}
