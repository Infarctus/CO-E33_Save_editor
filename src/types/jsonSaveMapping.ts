import type {
  BoolComponent,
  ByteArrayComponent,
  DoubleComponent,
  IntComponent,
  MapTagKeyStruct,
  MapTagSimple,
  MapTagValueStruct,
  StringComponent,
  StringsArrayComponent,
  StructProperty,
  StrucTypeTag,
  ByteComponent,
} from './Tags'

// Character-related types



interface CharacterActionsRaw {
  Key: string;
  Value: number;
}

interface CharacterActions {
  key: {
    Name: string
  },
  value: {
    Int: number
  };
}

interface EquippedItemsPerSlot {
  Key: {
    ItemType_4_419B69C74E6D605B52FA82A76F128C96: string;
    SlotIndex_7_4AC21CC043F87846335A25B9212005AB: number;
  };
  Value: string;
}

interface CharacterCustomization {
  CharacterSkin_4_D6F8B7E048CBA86E677340839167C4FA: string;
  CharacterFace_6_069193A2473BA2E48EDF77841A8F3AFD: string;
}

export interface Character {
  CharacterHardcodedName_36_FB9BA9294D02CFB5AD3668B0C4FD85A5: string;
  CurrentLevel_49_97AB711D48E18088A93C8DADFD96F854: number;
  CurrentExperience_9_F9C772C9454408DBD6E1269409F37747: number;
  AvailableActionPoints_103_25B963504066FA8FD1210890DD45C001: number;
  CurrentHP_56_2DE67B0A46F5E28BCD6D3CB6D6A88B32: number;
  CurrentMP_57_41D543664CC0A23407A2D4B4D32029F6: number;
  CharacterActions_113_D080F16E432739A28E50959EABF1EEB0: CharacterActionsRaw[];
  CharacterActionsOrder_151_4F0BD1CF4D6D664017CE0CAAF2C1F1FC: string[];
  PassiveEffectProgressions_179_EB0DD7D2437EFED3D549E5BB92A5FF4E: any[];
  EquippedPassiveEffects_176_BE669BB547A1E730FDBF5AB2F0675853: any[];
  EquippedItemsPerSlot_183_3B9D37B549426C770DB5E5BE821896E9: EquippedItemsPerSlot[];
  AssignedAttributePoints_190_4E4BA51441F1E8D8E07ECA95442E0B7E: any[];
  UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592: string[];
  EquippedSkills_201_05B6B5E9490E2586B23751B11CDA521F: string[];
  CharacterCustomization_204_6208BA0E4E743356022DAEB14D88C37C: CharacterCustomization;
  IsExcluded_206_5D433A504D71F6A2FC9057945C23DDFB: boolean;
  LuminaFromConsumables_210_7CAC193144F82258C6A89BB09BB1D226: number;
}

export interface Characters {
  [key: string]: Character;
}


interface CharacterValueStructProperties {
  CurrentLevel_49_97AB711D48E18088A93C8DADFD96F854_0: IntComponent
  CurrentExperience_9_F9C772C9454408DBD6E1269409F37747_0: IntComponent
  CharacterHardcodedName_36_FB9BA9294D02CFB5AD3668B0C4FD85A5_0: StringComponent
  AvailableActionPoints_103_25B963504066FA8FD1210890DD45C001_0: IntComponent
  CurrentHP_56_2DE67B0A46F5E28BCD6D3CB6D6A88B32_0: DoubleComponent
  CurrentMP_57_41D543664CC0A23407A2D4B4D32029F6_0: DoubleComponent
  CharacterActions_113_D080F16E432739A28E50959EABF1EEB0_0: {
    tag: MapTagSimple<'NameProperty', 'IntProperty'>
    Map: CharacterActions[]
  }
  CharacterActionsOrder_151_4F0BD1CF4D6D664017CE0CAAF2C1F1FC_0: StringsArrayComponent
  PassiveEffectProgressions_179_EB0DD7D2437EFED3D549E5BB92A5FF4E_0: {
    tag: MapTagValueStruct<
      'NameProperty',
      StructProperty<
        '/Game/Gameplay/Lumina/FPassiveEffectProgression.FPassiveEffectProgression',
        '25fd746e-4d79-298f-a2b1-aaaa36138cab'
      >
    >
    Map: Array<{
      key: {
        Name: string
      }
      value: any
    }>
  }
  EquippedPassiveEffects_176_BE669BB547A1E730FDBF5AB2F0675853_0: StringsArrayComponent
  EquippedItemsPerSlot_183_3B9D37B549426C770DB5E5BE821896E9_0: {
    tag: MapTagKeyStruct<
      StructProperty<
        '/Game/Gameplay/Inventory/FEquipmentSlot.FEquipmentSlot',
        '4b8ac189-497e-a9e9-aefd-1487d521343a'
      >,
      'NameProperty'
    >
    Map: Array<{
      key: {
        Struct: {
          Struct: {
            ItemType_4_419B69C74E6D605B52FA82A76F128C96_0: {
              tag: {
                data: {
                  Byte: string
                }
              }
              Byte: {
                Label: string
              }
            }
            SlotIndex_7_4AC21CC043F87846335A25B9212005AB_0: IntComponent
          }
        }
      }
      value: {
        Name: string
      }
    }>
  }
  AssignedAttributePoints_190_4E4BA51441F1E8D8E07ECA95442E0B7E_0: {
    tag: any
    Map: Array<{
      key: {
        Byte: {
          Label: string
        }
      }
      value: {
        Int: number
      }
    }>
  }
  UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0: StringsArrayComponent
  EquippedSkills_201_05B6B5E9490E2586B23751B11CDA521F_0: StringsArrayComponent
  CharacterCustomization_204_6208BA0E4E743356022DAEB14D88C37C_0: {
    tag: StrucTypeTag<
      '/Game/Gameplay/CharacterCustomization/Blueprints/S_CharacterCustomizationItemData.S_CharacterCustomizationItemData',
      '325444f7-4490-96e4-be49-5491b251dde7'
    >
    Struct: {
      Struct: {
        CharacterSkin_4_D6F8B7E048CBA86E677340839167C4FA_0: StringComponent
        CharacterFace_6_069193A2473BA2E48EDF77841A8F3AFD_0: StringComponent
      }
    }
  }
  IsExcluded_206_5D433A504D71F6A2FC9057945C23DDFB_0: BoolComponent
  LuminaFromConsumables_210_7CAC193144F82258C6A89BB09BB1D226_0: IntComponent
}

export interface CharactersCollection_0Mapping {
  tag: MapTagValueStruct<
    'NameProperty',
    StructProperty<
      '/Game/jRPGTemplate/Structures/S_jRPG_CharacterSaveState.S_jRPG_CharacterSaveState',
      '2d62e679-419b-7c1b-f99b-178f140c61a6'
    >
  >
  Map: Array<CharactersInCollection0_Mapping>
}

export interface CharactersInCollection0_Mapping {
  key: {
    Name: string
  }
  value: {
    Struct: {
      Struct: CharacterValueStructProperties
    }
  }
}



export interface InventoryItems_0Mapping {
  tag: MapTagSimple<'NameProperty', 'IntProperty'>
  Map: Array<InventoryItems_0>
}

export interface InventoryItems_0 {
  key: { Name: string }
  value: { Int: number }
}

export interface RootProperties {
  VisitedLevelRowNames_0 : StringsArrayComponent
  CurrentParty_0: CurrentParty;
  CharactersCollection_0: CharactersCollection_0Mapping
  MapToLoad_0 : StringComponent
  TimePlayed_0: DoubleComponent
  InventoryItems_0: InventoryItems_0Mapping
  Gold_0: IntComponent
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
  FinishedGameCount_0: IntComponent | null
}

export interface Formation {
  tag: {
    data: {
      Byte: string; // Path to the enumeration
    }
  };
  Byte: {
    Label: string; // Label of the enumeration value
  };
}


export interface PartySlotStruct {
  Struct: {
    CharacterHardcodedName_2_2A63D4C5433428900D69748563F50580_0: StringComponent;
    Formation_5_710E67F044BACE578CEE51AF24DC58B0_0: ByteComponent<"/Game/jRPGTemplate/Enumerations/E_jRPG_FormationType.E_jRPG_FormationType">;
  }
}

export interface PartySlotArray {
  Struct: {
    type_: 'StructProperty';
    struct_type: {
      Struct: string; // Path to the struct type
    };
    id: string;
    value: PartySlotStruct[];
  }
}

export interface CurrentParty {
  tag: StrucTypeTag;
  Array: PartySlotArray;
}

export interface BeginMapping {
  header: any
  root: {
    save_game_type: string
    properties: RootProperties
  }
  extra: any
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
  map : Array<{
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
