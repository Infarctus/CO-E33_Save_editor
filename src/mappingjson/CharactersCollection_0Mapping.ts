import { BoolTag, DoubleTag, IntTag, StringsArrayTag, StringTag } from "./GeneralMappings";

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
  CharacterHardcodedName_36_FB9BA9294D02CFB5AD3668B0C4FD85A5_0: StringTag;
  AvailableActionPoints_103_25B963504066FA8FD1210890DD45C001_0: IntTag;
  CurrentHP_56_2DE67B0A46F5E28BCD6D3CB6D6A88B32_0: DoubleTag;
  CurrentMP_57_41D543664CC0A23407A2D4B4D32029F6_0: DoubleTag;
  CharacterActions_113_D080F16E432739A28E50959EABF1EEB0_0: any;
  // {
  //   tag: {
  //     data: {
  //       Map: {
  //         key_type: {
  //           Other: "NameProperty";
  //         };
  //         value_type: {
  //           Other: "IntProperty";
  //         };
  //       };
  //     };
  //   };
  //   Map: Array<{
  //     key: {
  //       Name: string;
  //     };
  //     value: {
  //       Int: number;
  //     };
  //   }>;
  // };
  CharacterActionsOrder_151_4F0BD1CF4D6D664017CE0CAAF2C1F1FC_0: StringsArrayTag;
  PassiveEffectProgressions_179_EB0DD7D2437EFED3D549E5BB92A5FF4E_0: {
    tag:any;
    // tag: {
    //   data: {
    //     Map: {
    //       key_type: {
    //         Other: "NameProperty";
    //       };
    //       value_type: {
    //         Struct: {
    //           struct_type: {
    //             Struct: string;
    //           };
    //           id: string;
    //         };
    //       };
    //     };
    //   };
    // };
    Map: Array<{
      key: {
        Name: string;
      };
      value: any; // This could be a complex object, but the exact structure is not clear from the provided data
    }>;
  };
  EquippedPassiveEffects_176_BE669BB547A1E730FDBF5AB2F0675853_0: StringsArrayTag;
  EquippedItemsPerSlot_183_3B9D37B549426C770DB5E5BE821896E9_0: {
    tag: {
      data: {
        Map: {
          key_type: {
            Struct: {
              struct_type: {
                Struct: string;
              };
              id: string;
            };
          };
          value_type: {
            Other: "NameProperty";
          };
        };
      };
    };
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
            SlotIndex_7_4AC21CC043F87846335A25B9212005AB_0:IntTag
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
          Label: string; // ECharacterAttribute::NewEnumerator0, 1, etc
        };
      };
      value: {
        Int: number;
      };
    }>;
  };
  UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0: {
    tag: StringTag;
    Array: {
      Base: {
        Name: string[];
      };
    };
  };
  EquippedSkills_201_05B6B5E9490E2586B23751B11CDA521F_0: {
    tag: {
      data: {
        Array: {
          Other: "NameProperty";
        };
      };
    };
    Array: {
      Base: {
        Name: string[];
      };
    };
  };
  CharacterCustomization_204_6208BA0E4E743356022DAEB14D88C37C_0: {
    tag: any;
    // {
    //   data: {
    //     Struct: {
    //       struct_type: {
    //         Struct: string;
    //       };
    //       id: string;
    //     };
    //   };
    // };
    Struct: {
      Struct: {
        CharacterSkin_4_D6F8B7E048CBA86E677340839167C4FA_0: StringTag
        CharacterFace_6_069193A2473BA2E48EDF77841A8F3AFD_0: StringTag;
      };
    };
  };
  IsExcluded_206_5D433A504D71F6A2FC9057945C23DDFB_0: BoolTag;
}
