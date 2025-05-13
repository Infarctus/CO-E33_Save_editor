import type { FC } from "react"

interface DebugPanelProps {
  logs: { message: string; level?: string }[]
}

const DebugPanel: FC<DebugPanelProps> = ({ logs }) => {
  return (
    <div id="DebugPanel" className="tab-panel">
      <h2>Debugging logs and stuff</h2>
      <div style={{ overflow: "auto" }}>
        <ul className="log-list" id="logList">
          {logs.map((log, index) => (
            <div key={index} className={`log-message ${log.level ? `log-${log.level}` : ""}`}>
              {log.message}
            </div>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DebugPanel
