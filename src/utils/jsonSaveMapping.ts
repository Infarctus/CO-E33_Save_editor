import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs"
import type { BeginMapping, IntTag, DoubleTag, BoolTag, StringTag, StringsArrayTag } from "../types/jsonSaveMapping"
import { debug, error, trace } from "@tauri-apps/plugin-log"

/**
 * Loads JSON mapping from a file
 */
export async function getMappingJsonFromFile(jsonPath: string): Promise<BeginMapping | null> {
  try {
    const stringJson = await readTextFile(jsonPath)
    const parsedJson = JSON.parse(stringJson) as BeginMapping
    debug("Loaded JSON mapping")
    return parsedJson
  } catch (err) {
    error("Error loading JSON mapping:"+ err)
    return null
  }
}

/**
 * Saves JSON mapping to a file
 */
export async function saveMappingJsonToDisk(targetPath: string, jsonMapping: BeginMapping): Promise<boolean> {
  if (!!jsonMapping?.root?.properties?.SaveDateTime_0?.Struct?.DateTime) {
    const now = new Date();
    const ticks = 621355968000000000n + BigInt((now.getTime() - now.getTimezoneOffset() * 60000) * 10000); 
    jsonMapping.root.properties.SaveDateTime_0.Struct.DateTime = ticks;
  } else {
    error("Could not bump date of the save because the structure doesn't exist")
  }
  try {
    await writeTextFile(targetPath, JSON.stringify(jsonMapping, null, 2))
    trace(`JSON saved to ${targetPath}`)
    return true
  } catch (err) {
    error("Failed to save JSON:"+ err)
    return false
  }
}

/**
 * Helper function to extract values from different tag types
 */
export function getValueFromTag(tag: IntTag | DoubleTag | BoolTag | StringTag | StringsArrayTag | any): string {
  if ("Double" in tag) {
    return tag.Double.toString()
  } else if ("Int" in tag) {
    return tag.Int.toString()
  } else if ("Bool" in tag) {
    return tag.Bool.toString()
  } else if ("Name" in tag) {
    return tag.Name.toString()
  } else if ("Array" in tag) {
    return tag.Array.Base.Name.join(", ")
  } else {
    return "Unknown tag " + JSON.stringify(tag)
  }
}

/**
 * Helper function to set value for different tag types
 */
export function setValueOfTag(
  tag: IntTag | DoubleTag | BoolTag | StringTag | StringsArrayTag,
  value: number | boolean | string | string[],
): void {
  if ("Double" in tag) {
    tag.Double = typeof value === "number" ? value : Number.parseFloat(value.toString())
  } else if ("Int" in tag) {
    tag.Int = typeof value === "number" ? value : Number.parseInt(value.toString())
  } else if ("Bool" in tag) {
    tag.Bool = typeof value === "boolean" ? value : value.toString().toLowerCase() === "true"
  } else if ("Name" in tag) {
    tag.Name = value.toString()
  } else if ("Array" in tag) {
    tag.Array.Base.Name = Array.isArray(value) ? value : [value.toString()]
  } else {
    throw new Error("Unknown tag type")
  }
}


function changedatesaved() {
  // Get .NET ticks (100-nanosecond intervals since 0001-01-01T00:00:00Z)
  
};