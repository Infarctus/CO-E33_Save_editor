import type { IntComponent, StringComponent, DoubleComponent, MapTagSimple, StringsArrayComponent, MapTagValueStruct, StructProperty, MapTagKeyStruct, StrucTypeTag, BoolComponent } from "../Tags";


interface CharacterActionsRaw {
  Key: string;
  Value: number;
}
interface CharacterActions {
  key: {
    Name: string;
  };
  value: {
    Int: number;
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
interface CharacterValueStructProperties {
  CurrentLevel_49_97AB711D48E18088A93C8DADFD96F854_0: IntComponent;
  CurrentExperience_9_F9C772C9454408DBD6E1269409F37747_0: IntComponent;
  CharacterHardcodedName_36_FB9BA9294D02CFB5AD3668B0C4FD85A5_0: StringComponent;
  AvailableActionPoints_103_25B963504066FA8FD1210890DD45C001_0: IntComponent;
  CurrentHP_56_2DE67B0A46F5E28BCD6D3CB6D6A88B32_0: DoubleComponent;
  CurrentMP_57_41D543664CC0A23407A2D4B4D32029F6_0: DoubleComponent;
  CharacterActions_113_D080F16E432739A28E50959EABF1EEB0_0: {
    tag: MapTagSimple<'NameProperty', 'IntProperty'>;
    Map: CharacterActions[];
  };
  CharacterActionsOrder_151_4F0BD1CF4D6D664017CE0CAAF2C1F1FC_0: StringsArrayComponent;
  PassiveEffectProgressions_179_EB0DD7D2437EFED3D549E5BB92A5FF4E_0: {
    tag: MapTagValueStruct<
      'NameProperty', StructProperty<
        '/Game/Gameplay/Lumina/FPassiveEffectProgression.FPassiveEffectProgression', '25fd746e-4d79-298f-a2b1-aaaa36138cab'
      >
    >;
    Map: Array<{
      key: {
        Name: string;
      };
      value: any;
    }>;
  };
  EquippedPassiveEffects_176_BE669BB547A1E730FDBF5AB2F0675853_0: StringsArrayComponent;
  EquippedItemsPerSlot_183_3B9D37B549426C770DB5E5BE821896E9_0: {
    tag: MapTagKeyStruct<
      StructProperty<
        '/Game/Gameplay/Inventory/FEquipmentSlot.FEquipmentSlot', '4b8ac189-497e-a9e9-aefd-1487d521343a'
      >, 'NameProperty'
    >;
    Map: Array<{
      key: {
        Struct: {
          Struct: {
            ItemType_4_419B69C74E6D605B52FA82A76F128C96_0: {
              tag: {
                data: {
                  Byte: string;
                };
              };
              Byte: {
                Label: string;
              };
            };
            SlotIndex_7_4AC21CC043F87846335A25B9212005AB_0: IntComponent;
          };
        };
      };
      value: {
        Name: string;
      };
    }>;
  };
  AssignedAttributePoints_190_4E4BA51441F1E8D8E07ECA95442E0B7E_0: {
    tag: any;
    Map: Array<{
      key: {
        Byte: {
          Label: string;
        };
      };
      value: {
        Int: number;
      };
    }>;
  };
  UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0: StringsArrayComponent;
  EquippedSkills_201_05B6B5E9490E2586B23751B11CDA521F_0: StringsArrayComponent;
  CharacterCustomization_204_6208BA0E4E743356022DAEB14D88C37C_0: {
    tag: StrucTypeTag<
      '/Game/Gameplay/CharacterCustomization/Blueprints/S_CharacterCustomizationItemData.S_CharacterCustomizationItemData', '325444f7-4490-96e4-be49-5491b251dde7'
    >;
    Struct: {
      Struct: {
        CharacterSkin_4_D6F8B7E048CBA86E677340839167C4FA_0: StringComponent;
        CharacterFace_6_069193A2473BA2E48EDF77841A8F3AFD_0: StringComponent;
      };
    };
  };
  IsExcluded_206_5D433A504D71F6A2FC9057945C23DDFB_0: BoolComponent;
  LuminaFromConsumables_210_7CAC193144F82258C6A89BB09BB1D226_0: IntComponent;
}

export interface CharactersCollection_0Mapping {
  tag: MapTagValueStruct<
    'NameProperty', StructProperty<
      '/Game/jRPGTemplate/Structures/S_jRPG_CharacterSaveState.S_jRPG_CharacterSaveState', '2d62e679-419b-7c1b-f99b-178f140c61a6'
    >
  >;
  Map: Array<CharactersInCollection0_Mapping>;
}

export interface CharactersInCollection0_Mapping {
  key: {
    Name: string;
  };
  value: {
    Struct: {
      Struct: CharacterValueStructProperties;
    };
  };
}
