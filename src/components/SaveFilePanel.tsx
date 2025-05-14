import type { FC } from "react"

const SaveFilePanel: FC = () => {
  return (
    <div id="SaveFilePanel">
      <p id="greet-msg">
        Welcome! Use the <code style={{ backgroundColor: "green" }}>Open File</code> button to get started
      </p>
      <p id="information-msg">    
        This tool allows you to edit your save files for the game. You can modify character attributes, inventory items, and more.
        <br />
        <br />
        <br />
        Your save file is located at (you can copy-paste the highlighted path): 
        <br />
        Steam : <code style={{ backgroundColor: "green" }}>%LOCALAPPDATA%\Sandfall\Saved\SaveGames\</code> + [user-id]\Expedition_X.sav (There's also a backup folder that you can use)
        <br />
        Gamepass : <code style={{ backgroundColor: "green" }}>%LOCALAPPDATA%\Packages\KeplerInteractive.Expedition33_ymj30pw7xe604\SystemAppData\wgs\</code>
      </p>
    </div>
  )
}

export default SaveFilePanel
