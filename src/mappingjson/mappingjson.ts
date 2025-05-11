import { readTextFile } from "@tauri-apps/plugin-fs";
import { CharactersCollection_0Mapping } from "./CharactersCollection_0Mapping";

let json: BeginMapping;

export async function getMappingJson(jsonptath: string) {
  const stringjson: string = await readTextFile(jsonptath);
  json = JSON.parse(stringjson);
  console.log(json);
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
