import characterMap from "../../originalGameMapping/E_CharacterList.json";
import characterCanLevelMap from "../../originalGameMapping/DT_QuestsDataTable.json";

const characterListRaw = characterMap as any[];
const displayNameMap = characterListRaw[0].Properties.DisplayNameMap;

export const CharacterMap = Object.fromEntries(
  displayNameMap.map((entry: any) => [entry.Key, entry.Value.SourceString]),
) as Record<string, string>;

export const RelationshipQuestRows = Object.keys((characterCanLevelMap as any[])[0].Rows)
  .filter((row) => row.startsWith("Relationship_"));

export const RelationshipCharacters = RelationshipQuestRows.map((row) =>
  row.replace(/^Relationship_/, ""),
);

const relationshipNameSet = new Set(RelationshipCharacters);

export const RelationshipCharacterMap = Object.fromEntries(
  Object.entries(CharacterMap).filter(([, name]) => relationshipNameSet.has(name)),
) as Record<string, string>;

export function getCharacterNameFromRelationshipKey(enumValue: string): string {
  const enumerator = enumValue.split("::")[1];
  return RelationshipCharacterMap[enumerator] ?? "Unknown";
}

/** "Noah" -> "E_CharacterList::NewEnumerator0" */
export function getRelationshipKeyFromCharacterName(characterName: string): string {
  const entry = Object.entries(CharacterMap).find(([, name]) => name === characterName);
  return entry
    ? `E_CharacterList::${entry[0]}`
    : "E_CharacterList::NewEnumerator6";
}