import { CharactersCollection_0Mapping } from './jsonSaveMappingsPlus.ts/characters';
import type {
  BoolComponent,
  ByteArrayComponent,
  DoubleComponent,
  IntComponent,
  MapTagSimple,
  MapTagValueStruct,
  StringComponent,
  StringsArrayComponent,
  StructProperty,
  StrucTypeTag,
  ByteComponent,
} from './Tags'

export interface BeginMapping {
  header: any
  root: {
    save_game_type: string
    properties: RootProperties
  }
  extra: any
} 

export interface RootProperties {
  VisitedLevelRowNames_0 : StringsArrayComponent
  CurrentParty_0: CurrentParty;
  CharactersCollection_0: CharactersCollection_0Mapping
  MapToLoad_0 : StringComponent
  TimePlayed_0: DoubleComponent
  InventoryItems_0: InventoryItems_0Mapping
  Gold_0: IntComponent
  TransientBattledEnemies_0? : TransientBattledEnemies_0
  BattledEnemies_0 : BattledEnemies_0
  SpawnPointTagToLoadAt_0 : SpawnPointTagToLoadAt_0
  ReturnSpawnPointTag_0 : ReturnSpawnPointTag_0 // unsure of its use
  ExplorationProgression_0: ExplorationProgression_0
  EquippedConsumableShards_0: StringsArrayComponent
  QuestStatuses_0 : QuestStatuses_0
  WeaponProgressions_0: WeaponProgressions_0
  SaveDateTime_0: SaveDateTime_0
  PassiveEffectsProgressions_0: PassiveEffectsProgressions_0
  InteractedObjects_0 : InteractedObjects_0
  EncounteredEnemies_0: BattledEnemies_0 // Not an exact copy but same structure
  FinishedGameCount_0: IntComponent | null
}

export interface TransientBattledEnemies_0 {
  tag: MapTagSimple<'NameProperty', 'BoolProperty'>
  Map: Array<{
    key: { Name: string }
    value: { Bool: boolean }
  }>
}

export interface InventoryItems_0Mapping {
  tag: MapTagSimple<'NameProperty', 'IntProperty'>
  Map: Array<InventoryItems_0>
}

export interface InventoryItems_0 {
  key: { Name: string }
  value: { Int: number }
}


export interface CurrentParty {
  tag: StrucTypeTag;
  Array: PartySlotArray;
}

export interface PartySlotArray {
  Struct: {
    type_: 'StructProperty';
    struct_type: {
      Struct: string;
    };
    id: string;
    value: PartySlotStruct[];
  }
}

export interface PartySlotStruct {
  Struct: {
    CharacterHardcodedName_2_2A63D4C5433428900D69748563F50580_0: StringComponent;
    Formation_5_710E67F044BACE578CEE51AF24DC58B0_0: ByteComponent<"/Game/jRPGTemplate/Enumerations/E_jRPG_FormationType.E_jRPG_FormationType">;
  }
}


export interface SpawnPointTagToLoadAt_0 {
  tag: StrucTypeTag<
    '/Script/GameplayTags.GameplayTag',
    '00000000-0000-0000-0000-000000000000'
  >
  Struct: {
    Struct: {
     TagName_0: StringComponent
    }
  }
}

export interface BattledEnemies_0 {
  tag : MapTagSimple<"NameProperty","BoolProperty">
  Map : Array<{
    key : {
      Name: string
    }
    value : {
      Bool: boolean
    }
  }>
}

export interface ReturnSpawnPointTag_0{
  tag: StrucTypeTag<
    '/Script/GameplayTags.GameplayTag',
    '00000000-0000-0000-0000-000000000000'
  >
  Struct: {
    Struct: {
     TagName_0: StringComponent
    }
  }
}

export interface InteractedObjects_0 {
  tag : MapTagSimple<"NameProperty","BoolProperty">
  Map: Array<{
    key: {
      Name: string
    }
    value: {
      Bool: boolean
    }
  }>
}

export interface QuestStatuses_0 {
  tag: MapTagValueStruct<'NameProperty', StructProperty<"/Game/Gameplay/Quests/System/Runtime/S_QuestStatusData.S_QuestStatusData","779d48b0-4624-52ae-608a-fd8f50211b1a">>
  Map: Array<{
    key: { Name: string }
    value: {
      Struct: {
        Struct: {
          ObjectivesStatus_8_EA1232C14DA1F6DDA84EBA9185000F56_0:{
            tag: any
            Map: Array<{
              key: { Name: string }
              value: { Byte: { Label: string } } 
            }>
          }
          QuestStatus_2_4D165F3F428FABC6B00F2BA89749B803_0: ByteComponent<"/Game/Gameplay/Quests/System/Runtime/E_QuestStatus.E_QuestStatus">
        }
      }
    }
  }>
}

export interface WeaponProgressions_0 {
  tag: any
  Array: {
    Struct: {
      type: any
      struct_type: any
      id: string
      value: Array<{
        Struct: {
          DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0: StringComponent
          CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0: IntComponent
        }
      }>
    }
  }
}

export interface SaveDateTime_0 {
  tag: {
    data: {
      Struct: {
        struct_type: 'DateTime'
        id: '00000000-0000-0000-0000-000000000000'
      }
    }
  }
  Struct: {
    DateTime: number
  }
}

export interface PassiveEffectsProgressions_0 {
  tag: any
  Array: {
    Struct: {
      type_: 'StructProperty'
      struct_type: {
        Struct: '/Game/Gameplay/Lumina/FPassiveEffectProgression.FPassiveEffectProgression'
      }
      id: '25fd746e-4d79-298f-a2b1-aaaa36138cab'
      value: Array<ItemsPassiveEffectsProgressions_0>
    }
  }
}

export interface ItemsPassiveEffectsProgressions_0 {
  Struct: {
    PassiveEffectName_3_A92DB6CC4549450728A867A714ADF6C5_0: StringComponent
    IsLearnt_9_2561000E49D90653437DE9A45BE2A86D_0: BoolComponent
    LearntSteps_6_A14D681549E830249C77BD95F2B4CF3F_0: IntComponent
  }
}

export interface ExplorationProgression_0 {
  tag: StrucTypeTag<
    '/Game/Gameplay/Exploration/FExplorationProgression_SaveState.FExplorationProgression_SaveState',
    'cddea10c-44bf-8e85-05f6-38b4d02bb14c'
  >
  Struct: {
    Struct: {
      ExplorationCapacities_22_D278AAE341C821F118686B81FD83BBB0_0: ByteArrayComponent<'/Game/Gameplay/Exploration/ExplorationCapacities/E_ExplorationCapacity.E_ExplorationCapacity'>
      WorldMapCapacities_18_A3C2B46042CDC1AD2B027BB41415D062_0?: ByteArrayComponent<'/Game/Gameplay/Exploration/ExplorationCapacities/E_WorldMapExplorationCapacity.E_WorldMapExplorationCapacity'>
      FreeAimDamageLevel_4_CE1A4941408FA32FC2731D9BF52F53EC_0?: IntComponent
    }
  }
}
