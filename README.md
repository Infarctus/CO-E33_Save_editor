# [CO E33 Save Editor](https://www.nexusmods.com/clairobscurexpedition33/mods/201?tab=description)
Clair Obscur Expedition 33 Save Editor

Allows you to painlessly edit certain elements of your save files.
This program is compatible with Windows and Linux and requires little to no configuration.
You can get a minimal version (<10Mb) that uses your device's WebView, or a standalone version (120Mb~)

Usage:
You simply need to launch co-e33-save-editor and then everything is done within the app.

Installation :
1. Get the file you want for your OS
2. Unzip it
3. Depending on the file type, install or run. Some files have specific instructions in their descriptions.

Available editors include:
- Characters editor (level, attribute points & luminae, unlocked skins (hair and body))
- Pictos editor (unlock, master, set level)
- Weapons (unlock, set level, per character sorting)
- Monoco skills unlocker
- Ressourcetab : Chroma / Gold , Tints amount, Tints lvl, gear item upgrade
- NG+ edit
- Esquie skills
- Music disks (unlock)
- Journals (unlock)
- A powerful json editor for advanced users
- A backup tab

Will be done in the future (not in order):
- Add, remove chars for a save ?
- Unkill friendly Nevrons ?
- Relations
- Auto save discovery
- Backup clean
- Teleport to a specific flag from anywhere to anywhere
- Unkill bosses

Disclaimer :
Might break your files (even if very unlikely unless said otherwise, you will be able to get them back with the backup tab)

App logs :
- Linux : $HOME/.local/share/com.co-e33-save-editor.app/logs/logs.log or $XDG_DATA_HOME/﻿com.co-e33-save-editor.app/logs
- Windows : %LOCALAPPDATA%\com.co-e33-save-editor.app\logs\logs.log

Epic Game Pass users
Read the pinned comment about where to find your save file !


Additional info
- When opening a file, our tool is able to correclty parse any Uneral Engine Save file (commonly referred to as GVAS).
- If you tried opening something else, none of the tabs will be available. If it opens correctly, you can view its contents inside the Raw Json tab.
- If any of the regular tab show something along the lines of "The file you opened (if any) doesn't look like a CO:E33 save file", this means that the structure of the properties inside the sav is not the one a regular CO:E33 save file is expected to have
- When you save a filed edited with the editor, the date/time associated with it in-game will match your current date/time
- In most tabs where there are tables, you can sort by clicking on a table header, i.e. on the Pictos tab you can click on level to order by level (asc), click again on the table header to sort by desc. You can also sort booleans (found, mastered, etc)
