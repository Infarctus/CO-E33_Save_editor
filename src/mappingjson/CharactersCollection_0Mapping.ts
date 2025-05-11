import { IntTag } from "./GeneralMappings";
export interface CharactersCollection_0Mapping {
  tag: any;
  Map: Array<{
    key: KeyCharacters;
    value: CharacterValue;
  }>;
}

interface KeyCharacters {
  Name: string;
}

interface CharacterValue {
  Struct: CharacterValueStruct;
}
interface CharacterValueStruct {
  Struct: CharacterValueStructProperties;
}
interface CharacterValueStructProperties {
  LuminaFromConsumables_210_7CAC193144F82258C6A89BB09BB1D226_0: IntTag;
  CurrentLevel_49_97AB711D48E18088A93C8DADFD96F854_0: IntTag;
  CurrentExperience_9_F9C772C9454408DBD6E1269409F37747_0: IntTag;
}
