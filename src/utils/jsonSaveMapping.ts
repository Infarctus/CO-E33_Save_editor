import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import type {
  BeginMapping,
  
  ItemsPassiveEffectsProgressions_0,
  PassiveEffectsProgressions_0,
  InventoryItems_0,
  RootProperties,
} from '../types/jsonSaveMapping'
import type {IntTag,
  DoubleTag,
  BoolTag,
  StringTag,
  StringsArrayTag,} from '../types/Tags'
import { debug, error, trace } from '@tauri-apps/plugin-log'

/**
 * Loads JSON mapping from a file
 */
export async function getMappingJsonFromFile(jsonPath: string): Promise<BeginMapping | null> {
  try {
    const stringJson = await readTextFile(jsonPath)
    const parsedJson = JSON.parse(stringJson) as BeginMapping
    debug('Loaded JSON mapping')
    return parsedJson
  } catch (err) {
    error('Error loading JSON mapping:' + err)
    return null
  }
}

/**
 * Saves JSON mapping to a file
 */
export async function saveMappingJsonToDisk(
  targetPath: string,
  jsonMapping: BeginMapping,
): Promise<boolean> {
  if (!!jsonMapping?.root?.properties?.SaveDateTime_0?.Struct?.DateTime) {
    const now = new Date()
    const ticks = 621355968000000000 + (now.getTime() - now.getTimezoneOffset() * 60000) * 10000
    jsonMapping.root.properties.SaveDateTime_0.Struct.DateTime = ticks
    // trace("Set SaveDateTime_0 to "+ticks)
  } else {
    error("Could not bump date of the save because the structure doesn't exist")
  }
  try {
    await writeTextFile(targetPath, JSON.stringify(jsonMapping, null, 2))
    trace(`JSON saved to ${targetPath}`)
    return true
  } catch (err) {
    error('Failed to save JSON:' + err)
    return false
  }
}

/**
 * Helper function to extract values from different tag types
 */
export function getValueFromTag(
  tag: IntTag | DoubleTag | BoolTag | StringTag | StringsArrayTag | any,
): string {
  if ('Double' in tag) {
    return tag.Double.toString()
  } else if ('Int' in tag) {
    return tag.Int.toString()
  } else if ('Bool' in tag) {
    return tag.Bool.toString()
  } else if ('Name' in tag) {
    return tag.Name.toString()
  } else if ('Array' in tag) {
    return tag.Array.Base.Name.join(', ')
  } else {
    return 'Unknown tag ' + JSON.stringify(tag)
  }
}

/**
 * Helper function to set value for different tag types
 */
export function setValueOfTag(
  tag: IntTag | DoubleTag | BoolTag | StringTag | StringsArrayTag,
  value: number | boolean | string | string[],
): void {
  if ('Double' in tag) {
    tag.Double = typeof value === 'number' ? value : Number.parseFloat(value.toString())
  } else if ('Int' in tag) {
    tag.Int = typeof value === 'number' ? value : Number.parseInt(value.toString())
  } else if ('Bool' in tag) {
    tag.Bool = typeof value === 'boolean' ? value : value.toString().toLowerCase() === 'true'
  } else if ('Name' in tag) {
    tag.Name = value.toString()
  } else if ('Array' in tag) {
    tag.Array.Base.Name = Array.isArray(value) ? value : [value.toString()]
  } else {
    throw new Error('Unknown tag type')
  }
}

// Gen Function
export function generatePassiveEffectProgression(): PassiveEffectsProgressions_0 {
  return {
    tag: {
      data: {
        Array: {
          Struct: {
            struct_type: {
              Struct: '/Game/Gameplay/Lumina/FPassiveEffectProgression.FPassiveEffectProgression',
            },
            id: '25fd746e-4d79-298f-a2b1-aaaa36138cab',
          },
        },
      },
    },
    Array: {
      Struct: {
        type_: 'StructProperty',
        struct_type: {
          Struct: '/Game/Gameplay/Lumina/FPassiveEffectProgression.FPassiveEffectProgression',
        },
        id: '25fd746e-4d79-298f-a2b1-aaaa36138cab',
        value: [],
      },
    },
  }
}

export function generatePictoPassiveEffectProgression(
  pictoName: string,
  islearnt: boolean,
  LearntSteps: number,
): ItemsPassiveEffectsProgressions_0 {
  return {
    Struct: {
      PassiveEffectName_3_A92DB6CC4549450728A867A714ADF6C5_0: {
        Name: pictoName,
        tag: { data: { Other: 'NameProperty' } },
      },
      IsLearnt_9_2561000E49D90653437DE9A45BE2A86D_0: {
        Bool: islearnt,
        tag: { data: { Other: 'BoolProperty' } },
      },
      LearntSteps_6_A14D681549E830249C77BD95F2B4CF3F_0: {
        Int: LearntSteps,
        tag: { data: { Other: 'IntProperty' } },
      },
    },
  }
}

export function generateInventoryItems_0(genname: string, genvalue: number): InventoryItems_0 {
  return {
    key: {
      Name: genname,
    },
    value: {
      Int: genvalue,
    },
  }
}

export function createNewGamePlus(value: number): RootProperties["FinishedGameCount_0"] {
  return {
    Int: value,
    tag: { data: { Other: 'IntProperty' } },
  }
}