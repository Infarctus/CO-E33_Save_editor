import type { FC } from "react"

const SaveFilePanel: FC = () => {
  return (
    <div id="SaveFilePanel">
      <p id="information-msg">    
        This tool allows you to edit your save files for the game. You can modify character attributes, inventory items, and more.
        <br />
        <b>Keep the game open on the main menu while modifying the files to be sure that the cloud saves does not overwrite your changes.</b> (Mostly for gamepass users)
        <br />
        <br />
        Your save file is located at (you can copy-paste the highlighted path): 
        <br />
        Steam : <code style={{ backgroundColor: "green" }}>%LOCALAPPDATA%\Sandfall\Saved\SaveGames\</code> + [user-id]\Expedition_X.sav (There's also a backup folder that you can use)
        <br />
        <br />
        Gamepass : <code style={{ backgroundColor: "green" }}>%LOCALAPPDATA%\Packages\KeplerInteractive.Expedition33_ymj30pw7xe604\SystemAppData\wgs\</code>
        <br />
        If you have any issues, please check :
         <a
          href="https://www.nexusmods.com/clairobscurexpedition33/mods/201?tab=posts"
          target="_blank"
          rel="noopener noreferrer"
          style= {{ color: "lime" }}
        >
           Click here
        </a>
        <br />
        <br />
        <b>Note:</b> When you export or overwrite the save the date will be set to the current date and time.
      </p>
    </div>
  )
}

export default SaveFilePanel
