import { join, localDataDir } from '@tauri-apps/api/path'
import { exists, readDir } from '@tauri-apps/plugin-fs'
import { trace } from '@tauri-apps/plugin-log'
import { platform } from '@tauri-apps/plugin-os';

export interface SaveFile {
  name: string
  path: string
}

export async function SteamSaveAuto(): Promise<SaveFile[]> {
  var basesteamsavepath = ""
  const currentOS = platform();
  if (currentOS == "windows") {
    trace("Windos")
    basesteamsavepath = await join(await localDataDir(), 'Sandfall', 'Saved', 'SaveGames')
  } else {
    trace("linux+all")
    basesteamsavepath = await join("/run/media/cat/LINEX/SteamLibrary/steamapps/compatdata/1903340/pfx/drive_c/users/steamuser/AppData/Local/", 'Sandfall', 'Saved', 'SaveGames')
  }
  trace("trying to find saves at " + basesteamsavepath)
  try {
    if (!(await exists(basesteamsavepath))) {
    trace("egzgorzigjzorijgioj")
  
      trace(`Directory steam save does not exist`)
      return []
    }
    
  } catch (error) {
    trace("welp something bad happened "+ error)
  }
  trace("b4 try")

  try {
    const entriesbasepath = await readDir(basesteamsavepath)
    trace("entries to analyse " + entriesbasepath.length)

    for (const entry of entriesbasepath) {
      trace("analysing folder "+ entry.name)
      if (!entry.isDirectory) {
        continue
      }
      const results: SaveFile[] = []

      const filePath = await join(basesteamsavepath, entry.name)
      const entries = await readDir(filePath)
      for (const file of entries) {
        if (file.isFile && file.name.endsWith('.sav') && file.name.startsWith('EXPEDITION_')) {
          const saveFile: SaveFile = {
            name: file.name,
            path: await join(filePath, file.name),
          }
          results.push(saveFile)
        }
      }
      trace(`Found ${JSON.stringify(results)} save files in steam save directory`)
      return results
    }
  } catch (error) {
    trace(`Error reading directory: ${String(error)}`)
  }
  return []
}

export async function XBOXSaveAuto(): Promise<string | null> {

  var xboxSavePath = ""
  const currentOS = platform();
  if (currentOS == "windows") {
    xboxSavePath = await join(
      await localDataDir(),
      'Packages',
      'KeplerInteractive.Expedition33_ymj30pw7xe604',
      'SystemAppData',
      'wgs',
    )
  } else {
    trace("linux+all")
    xboxSavePath = await join("/home/cat/temp/aa/")
  }



  trace(`Xbox save path: ${xboxSavePath}`)

  try {
    if (!(await exists(xboxSavePath))) {
      trace(`Directory xbox save does not exist`)
      return null
    }
    const entriesbasepath = await readDir(xboxSavePath)
    for (const entry of entriesbasepath) {
      trace("reading dir " + entry.name)
      if (!entry.isDirectory) {
        continue
      }
      const container = await join(xboxSavePath, entry.name, 'containers.index')
      if (!(await exists(container))) {
        continue
      }
      trace(`Found container file: ${container}`)
      return container;
    }
  } catch (error) {
    trace(`Error reading directory: ${String(error)}`)
  }
  return null
}
