import { join, localDataDir, } from '@tauri-apps/api/path'
import { exists, readDir } from '@tauri-apps/plugin-fs'
import { trace } from '@tauri-apps/plugin-log'

interface SaveFile {
    name: string;
    path: string;
}

export async function SteamSaveAuto(): Promise<SaveFile[] | void> {
    const basesteamsavepath = await join(await localDataDir(), 'Sandfall', 'Saved', 'SaveGames')
    
    if( !(await exists(basesteamsavepath))) {
        trace(`Directory does not exist: ${basesteamsavepath}`)
        return
    }
    try {
        const entriesbasepath = await readDir(basesteamsavepath)
        for (const entry of entriesbasepath) {
            if (!entry.isDirectory) {
                continue;
            }
            const results: SaveFile[] = [];

            const filePath = await join(basesteamsavepath, entry.name)
            const entries = await readDir(filePath)
            for (const file of entries) {
                if (file.isFile && file.name.endsWith('.sav') && file.name.startsWith("EXPEDITION_")) {
                    const saveFile: SaveFile = {
                        name: file.name,
                        path: await join(filePath, file.name)
                    };
                    results.push(saveFile);
                }
            }
            trace(`Found ${JSON.stringify(results)} save files in steam save directory`)
            return results;
        }
    } catch (error) {
        trace(`Error reading directory: ${String(error)}`)
    }
}
