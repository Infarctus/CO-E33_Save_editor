import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { CharactersCollection_0Mapping } from "./CharactersCollection_0Mapping";
import { workingFileCurrent } from "../filemanagement";

export let jsonMapping: BeginMapping;

export async function getMappingJsonFromFile(jsonptath: string) {
  const stringjson: string = await readTextFile(jsonptath);
  jsonMapping = JSON.parse(stringjson);
  console.debug(jsonMapping);
}

export async function getMappingJsonFromJson(jsonObject: any) {
  jsonMapping = jsonObject;
  console.log("Updated mappings value directly from json")

}

export async function saveMappingJsonToDisk(targetPath: string): Promise<boolean> {
  // This function saves our in-memory json into the target path.
  try {
  await writeTextFile(targetPath, JSON.stringify(jsonMapping, null, 2));
  console.log(`JSON saved to ${targetPath}`);
  return true
  } catch (err) {
  console.error("Failed to save JSON:", err);
  return false;
  throw err;
  }
  }

export interface BeginMapping {
  header: any;
  root: RootMapping;
  extra: any;
}

export interface RootMapping {
  save_game_type: string;
  properties: RootProperties;
}

interface RootProperties {
  CharactersCollection_0: CharactersCollection_0Mapping;
}
