import type {
  BoolTag,
  ByteArray,
  DoubleTag,
  IntTag,
  MapTagKeyStruct,
  MapTagSimple,
  MapTagValueStruct,
  StringTag,
  StringsArrayTag,
  StructProperty,
  StructypeTag,
} from './Tags'

// Character-related types

interface CharacterValueStructProperties {
  CurrentLevel_49_97AB711D48E18088A93C8DADFD96F854_0: IntTag
  CurrentExperience_9_F9C772C9454408DBD6E1269409F37747_0: IntTag
  CharacterHardcodedName_36_FB9BA9294D02CFB5AD3668B0C4FD85A5_0: StringTag
  AvailableActionPoints_103_25B963504066FA8FD1210890DD45C001_0: IntTag
  CurrentHP_56_2DE67B0A46F5E28BCD6D3CB6D6A88B32_0: DoubleTag
  CurrentMP_57_41D543664CC0A23407A2D4B4D32029F6_0: DoubleTag
  CharacterActions_113_D080F16E432739A28E50959EABF1EEB0_0: {
    tag: MapTagSimple<'NameProperty', 'IntProperty'>
    Map: Array<{
      key: {
        Name: string
      }
      value: {
        Int: number
      }
    }>
  }
  CharacterActionsOrder_151_4F0BD1CF4D6D664017CE0CAAF2C1F1FC_0: StringsArrayTag
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
  EquippedPassiveEffects_176_BE669BB547A1E730FDBF5AB2F0675853_0: StringsArrayTag
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
            SlotIndex_7_4AC21CC043F87846335A25B9212005AB_0: IntTag
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
  UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0: StringsArrayTag
  EquippedSkills_201_05B6B5E9490E2586B23751B11CDA521F_0: StringsArrayTag
  CharacterCustomization_204_6208BA0E4E743356022DAEB14D88C37C_0: {
    tag: StructypeTag<
      '/Game/Gameplay/CharacterCustomization/Blueprints/S_CharacterCustomizationItemData.S_CharacterCustomizationItemData',
      '325444f7-4490-96e4-be49-5491b251dde7'
    >
    Struct: {
      Struct: {
        CharacterSkin_4_D6F8B7E048CBA86E677340839167C4FA_0: StringTag
        CharacterFace_6_069193A2473BA2E48EDF77841A8F3AFD_0: StringTag
      }
    }
  }
  IsExcluded_206_5D433A504D71F6A2FC9057945C23DDFB_0: BoolTag
  LuminaFromConsumables_210_7CAC193144F82258C6A89BB09BB1D226_0: IntTag
}

export interface CharactersCollection_0Mapping {
  tag: MapTagValueStruct<"NameProperty", StructProperty<"/Game/jRPGTemplate/Structures/S_jRPG_CharacterSaveState.S_jRPG_CharacterSaveState","2d62e679-419b-7c1b-f99b-178f140c61a6">>
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
  tag: MapTagSimple<"NameProperty", "IntProperty">
  Map: Array<InventoryItems_0>
}

export interface InventoryItems_0 {
  key: { Name: string }
  value: { Int: number }
}

export interface RootProperties {
  CharactersCollection_0: CharactersCollection_0Mapping
  TimePlayed_0: DoubleTag
  InventoryItems_0: InventoryItems_0Mapping
  Gold_0: IntTag
  ExplorationProgression_0: ExplorationProgression_0
  EquippedConsumableShards_0: StringsArrayTag
  WeaponProgressions_0: WeaponProgressions_0
  SaveDateTime_0: SaveDateTime_0
  PassiveEffectsProgressions_0: PassiveEffectsProgressions_0
  FinishedGameCount_0: IntTag | null
}

export interface BeginMapping {
  header: any
  root: {
    save_game_type: string
    properties: RootProperties
  }
  extra: any
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
          DefinitionID_3_60EB24664894755B19F4EBA18A21AF1A_0: StringTag
          CurrentLevel_6_227A00644D035BDD595B2D86C8455B71_0: IntTag
        }
      }>
    }
  }
}

export interface SaveDateTime_0 {
  tag: {
    data: {
      Struct:{
        struct_type : "DateTime"
        id : "00000000-0000-0000-0000-000000000000"
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
    PassiveEffectName_3_A92DB6CC4549450728A867A714ADF6C5_0: StringTag
    IsLearnt_9_2561000E49D90653437DE9A45BE2A86D_0: BoolTag
    LearntSteps_6_A14D681549E830249C77BD95F2B4CF3F_0: IntTag
  }
}

export interface ExplorationProgression_0 {
  tag: StructypeTag<
    '/Game/Gameplay/Exploration/FExplorationProgression_SaveState.FExplorationProgression_SaveState',
    'cddea10c-44bf-8e85-05f6-38b4d02bb14c'
  >
  Struct: {
    Struct: {
      ExplorationCapacities_22_D278AAE341C821F118686B81FD83BBB0_0: ByteArray<'/Game/Gameplay/Exploration/ExplorationCapacities/E_ExplorationCapacity.E_ExplorationCapacity'>
      WorldMapCapacities_18_A3C2B46042CDC1AD2B027BB41415D062_0? : ByteArray<'/Game/Gameplay/Exploration/ExplorationCapacities/E_WorldMapExplorationCapacity.E_WorldMapExplorationCapacity'>
    }
  }
}
