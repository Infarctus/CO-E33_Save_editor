import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs"

/**
 * Loads JSON mapping from a file
 */
export async function getMappingJsonFromFile(jsonPath: string) {
  try {
    const stringJson = await readTextFile(jsonPath)
    const parsedJson = JSON.parse(stringJson)
    console.debug("Loaded JSON mapping")
    return parsedJson
  } catch (error) {
    console.error("Error loading JSON mapping:", error)
    return null
  }
}

/**
 * Saves JSON mapping to a file
 */
export async function saveMappingJsonToDisk(targetPath: string, jsonMapping: any): Promise<boolean> {
  try {
    await writeTextFile(targetPath, JSON.stringify(jsonMapping, null, 2))
    console.log(`JSON saved to ${targetPath}`)
    return true
  } catch (err) {
    console.error("Failed to save JSON:", err)
    return false
  }
}

/**
 * Helper function to extract values from different tag types
 */
export function getValueFromTag(tag: any): string {
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
