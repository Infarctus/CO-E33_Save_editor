import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { CharactersCollection_0Mapping } from "./CharactersCollection_0Mapping";
import { workingFileCurrent } from "../filemanagement";

export let json: BeginMapping;

export async function getMappingJsonFromFile(jsonptath: string) {
  const stringjson: string = await readTextFile(jsonptath);
  json = JSON.parse(stringjson);
  console.debug(json);
}

export async function getMappingJsonFromJson(jsonObject: any) {
  json = jsonObject;
  console.log("Updated mappings value directly from json")

}

export async function saveMappingJsonToDisk(targetPath: string): Promise<boolean> {
  // This function saves our in-memory json into the target path.
  try {
  await writeTextFile(targetPath, JSON.stringify(json, null, 2));
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
