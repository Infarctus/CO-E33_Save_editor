import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import type {
  BeginMapping,
  ItemsPassiveEffectsProgressions_0,
  PassiveEffectsProgressions_0,
  InventoryItems_0,
  RootProperties,
  ExplorationProgression_0,
  CharactersInCollection0_Mapping,
} from '../types/jsonSaveMapping'
import type { IntComponent, DoubleComponent, BoolComponent, StringComponent, StringsArrayComponent } from '../types/Tags'
import { debug, error, trace } from '@tauri-apps/plugin-log'
import { getBaseCharacterFromName } from './gameMappingProvider'

/**
 * Loads JSON mapping from a file
 */
export async function getMappingJsonFromFile(jsonPath: string): Promise<BeginMapping | null> {
  try {
    const stringJson = await readTextFile(jsonPath)
    const parsedJson = JSON.parse(stringJson) as BeginMapping
    debug('Loaded JSON mapping')
    return parsedJson
  } catch (err) {
    error('Error loading JSON mapping:' + err)
    return null
  }
}

/**
 * Saves JSON mapping to a file
 */
export async function saveMappingJsonToDisk(
  targetPath: string,
  jsonMapping: BeginMapping,
): Promise<boolean> {
  if (!!jsonMapping?.root?.properties?.SaveDateTime_0?.Struct?.DateTime) {
    const now = new Date()
    const ticks = 621355968000000000 + (now.getTime() - now.getTimezoneOffset() * 60000) * 10000
    jsonMapping.root.properties.SaveDateTime_0.Struct.DateTime = ticks
    // trace("Set SaveDateTime_0 to "+ticks)
  } else {
    error("Could not bump date of the save because the structure doesn't exist")
  }
  try {
    await writeTextFile(targetPath, JSON.stringify(jsonMapping, null, 2))
    trace(`JSON saved to ${targetPath}`)
    return true
  } catch (err) {
    error('Failed to save JSON:' + err)
    return false
  }
}

/**
 * Helper function to extract values from different tag types
 */
export function getValueFromTag(
  tag: IntComponent | DoubleComponent | BoolComponent | StringComponent | StringsArrayComponent | any,
): string {
  if ('Double' in tag) {
    return tag.Double.toString()
  } else if ('Int' in tag) {
    return tag.Int.toString()
  } else if ('Bool' in tag) {
    return tag.Bool.toString()
  } else if ('Name' in tag) {
    return tag.Name.toString()
  } else if ('Array' in tag) {
    return tag.Array.Base.Name.join(', ')
  } else {
    return 'Unknown tag ' + JSON.stringify(tag)
  }
}

/**
 * Helper function to set value for different tag types
 */
export function setValueOfTag(
  tag: IntComponent | DoubleComponent | BoolComponent | StringComponent | StringsArrayComponent,
  value: number | boolean | string | string[],
): void {
  if ('Double' in tag) {
    tag.Double = typeof value === 'number' ? value : Number.parseFloat(value.toString())
  } else if ('Int' in tag) {
    tag.Int = typeof value === 'number' ? value : Number.parseInt(value.toString())
  } else if ('Bool' in tag) {
    tag.Bool = typeof value === 'boolean' ? value : value.toString().toLowerCase() === 'true'
  } else if ('Name' in tag) {
    tag.Name = value.toString()
  } else if ('Array' in tag) {
    tag.Array.Base.Name = Array.isArray(value) ? value : [value.toString()]
  } else {
    throw new Error('Unknown tag type')
  }
}

// Gen Function
export function generatePassiveEffectProgression(): PassiveEffectsProgressions_0 {
  return {
    tag: {
      data: {
        Array: {
          Struct: {
            struct_type: {
              Struct: '/Game/Gameplay/Lumina/FPassiveEffectProgression.FPassiveEffectProgression',
            },
            id: '25fd746e-4d79-298f-a2b1-aaaa36138cab',
          },
        },
      },
    },
    Array: {
      Struct: {
        type_: 'StructProperty',
        struct_type: {
          Struct: '/Game/Gameplay/Lumina/FPassiveEffectProgression.FPassiveEffectProgression',
        },
        id: '25fd746e-4d79-298f-a2b1-aaaa36138cab',
        value: [],
      },
    },
  }
}

export function generatePictoPassiveEffectProgression(
  pictoName: string,
  islearnt: boolean,
  LearntSteps: number,
): ItemsPassiveEffectsProgressions_0 {
  return {
    Struct: {
      PassiveEffectName_3_A92DB6CC4549450728A867A714ADF6C5_0: {
        Name: pictoName,
        tag: { data: { Other: 'NameProperty' } },
      },
      IsLearnt_9_2561000E49D90653437DE9A45BE2A86D_0: {
        Bool: islearnt,
        tag: { data: { Other: 'BoolProperty' } },
      },
      LearntSteps_6_A14D681549E830249C77BD95F2B4CF3F_0: {
        Int: LearntSteps,
        tag: { data: { Other: 'IntProperty' } },
      },
    },
  }
}

export function generateInventoryItems_0(genname: string, genvalue: number): InventoryItems_0 {
  return {
    key: {
      Name: genname,
    },
    value: {
      Int: genvalue,
    },
  }
}

export function createNewGamePlus(value: number): RootProperties['FinishedGameCount_0'] {
  return {
    Int: value,
    tag: { data: { Other: 'IntProperty' } },
  }
}

export function createWorldMapCapacities_18_A3C2B46042CDC1AD2B027BB41415D062_0(): ExplorationProgression_0['Struct']['Struct']['WorldMapCapacities_18_A3C2B46042CDC1AD2B027BB41415D062_0'] {
  return {
    tag: {
      data: {
        Array: {
          Byte: '/Game/Gameplay/Exploration/ExplorationCapacities/E_WorldMapExplorationCapacity.E_WorldMapExplorationCapacity',
        },
      },
    },
    Array: {
      Base: {
        Byte: {
          Label: [],
        },
      },
    },
  }
}
export function createNewCharacter(name: string): CharactersInCollection0_Mapping {

  const selectedChar = getBaseCharacterFromName(name)
  const newCharacter: CharactersInCollection0_Mapping = {
    "key": {
      "Name": selectedChar.CharacterHardcodedName_36_FB9BA9294D02CFB5AD3668B0C4FD85A5
    },
    "value": {
      "Struct": {
        "Struct": {
          "CharacterHardcodedName_36_FB9BA9294D02CFB5AD3668B0C4FD85A5_0": {
            "tag": {
              "data": {
                "Other": "NameProperty"
              }
            },
            "Name": selectedChar.CharacterHardcodedName_36_FB9BA9294D02CFB5AD3668B0C4FD85A5
          },
          "CurrentLevel_49_97AB711D48E18088A93C8DADFD96F854_0": {
            "tag": {
              "data": {
                "Other": "IntProperty"
              }
            },
            "Int": selectedChar.CurrentLevel_49_97AB711D48E18088A93C8DADFD96F854
          },
          "CurrentExperience_9_F9C772C9454408DBD6E1269409F37747_0": {
            "tag": {
              "data": {
                "Other": "IntProperty"
              }
            },
            "Int": 0
          },
          "AvailableActionPoints_103_25B963504066FA8FD1210890DD45C001_0": {
            "tag": {
              "data": {
                "Other": "IntProperty"
              }
            },
            "Int": 0
          },
          "CurrentHP_56_2DE67B0A46F5E28BCD6D3CB6D6A88B32_0": {
            "tag": {
              "data": {
                "Other": "DoubleProperty"
              }
            },
            "Double": selectedChar.CurrentHP_56_2DE67B0A46F5E28BCD6D3CB6D6A88B32 != 0 ? selectedChar.CurrentHP_56_2DE67B0A46F5E28BCD6D3CB6D6A88B32 : 2000
          },
          "CurrentMP_57_41D543664CC0A23407A2D4B4D32029F6_0": {
            "tag": {
              "data": {
                "Other": "DoubleProperty"
              }
            },
            "Double": 3.0
          },
          "CharacterActions_113_D080F16E432739A28E50959EABF1EEB0_0": {
            "tag": {
              "data": {
                "Map": {
                  "key_type": {
                    "Other": "NameProperty"
                  },
                  "value_type": {
                    "Other": "IntProperty"
                  }
                }
              }
            },
            "Map": selectedChar.CharacterActions_113_D080F16E432739A28E50959EABF1EEB0
          },
          "CharacterActionsOrder_151_4F0BD1CF4D6D664017CE0CAAF2C1F1FC_0": {
            "tag": {
              "data": {
                "Array": {
                  "Other": "NameProperty"
                }
              }
            },
            "Array": {
              "Base": {
                "Name": []
              }
            }
          },
          "PassiveEffectProgressions_179_EB0DD7D2437EFED3D549E5BB92A5FF4E_0": {
            "tag": {
              "data": {
                "Map": {
                  "key_type": {
                    "Other": "NameProperty"
                  },
                  "value_type": {
                    "Struct": {
                      "struct_type": {
                        "Struct": "/Game/Gameplay/Lumina/FPassiveEffectProgression.FPassiveEffectProgression"
                      },
                      "id": "25fd746e-4d79-298f-a2b1-aaaa36138cab"
                    }
                  }
                }
              }
            },
            "Map": []
          },
          "EquippedPassiveEffects_176_BE669BB547A1E730FDBF5AB2F0675853_0": {
            "tag": {
              "data": {
                "Array": {
                  "Other": "NameProperty"
                }
              }
            },
            "Array": {
              "Base": {
                "Name": []
              }
            }
          },
          "EquippedItemsPerSlot_183_3B9D37B549426C770DB5E5BE821896E9_0": {
            "tag": {
              "data": {
                "Map": {
                  "key_type": {
                    "Struct": {
                      "struct_type": {
                        "Struct": "/Game/Gameplay/Inventory/FEquipmentSlot.FEquipmentSlot"
                      },
                      "id": "4b8ac189-497e-a9e9-aefd-1487d521343a"
                    }
                  },
                  "value_type": {
                    "Other": "NameProperty"
                  }
                }
              }
            },
            "Map": [
              {
                "key": {
                  "Struct": {
                    "Struct": {
                      "ItemType_4_419B69C74E6D605B52FA82A76F128C96_0": {
                        "tag": {
                          "data": {
                            "Byte": "/Game/jRPGTemplate/Enumerations/E_jRPG_ItemType.E_jRPG_ItemType"
                          }
                        },
                        "Byte": {
                          "Label": "E_jRPG_ItemType::NewEnumerator0"
                        }
                      },
                      "SlotIndex_7_4AC21CC043F87846335A25B9212005AB_0": {
                        "tag": {
                          "data": {
                            "Other": "IntProperty"
                          }
                        },
                        "Int": 0
                      }
                    }
                  }
                },
                "value": {
                  "Name": selectedChar.EquippedItemsPerSlot_183_3B9D37B549426C770DB5E5BE821896E9.lastItem?.Value ?? "None"
                }
              }
            ]
          },
          "AssignedAttributePoints_190_4E4BA51441F1E8D8E07ECA95442E0B7E_0": {
            "tag": {
              "data": {
                "Map": {
                  "key_type": {
                    "Byte": "/Game/Gameplay/CharacterData/ECharacterAttribute.ECharacterAttribute"
                  },
                  "value_type": {
                    "Other": "IntProperty"
                  }
                }
              }
            },
            "Map": [
              {
                "key": {
                  "Byte": {
                    "Label": "ECharacterAttribute::NewEnumerator0"
                  }
                },
                "value": {
                  "Int": 0
                }
              },
              {
                "key": {
                  "Byte": {
                    "Label": "ECharacterAttribute::NewEnumerator1"
                  }
                },
                "value": {
                  "Int": 0
                }
              },
              {
                "key": {
                  "Byte": {
                    "Label": "ECharacterAttribute::NewEnumerator3"
                  }
                },
                "value": {
                  "Int": 0
                }
              },
              {
                "key": {
                  "Byte": {
                    "Label": "ECharacterAttribute::NewEnumerator4"
                  }
                },
                "value": {
                  "Int": 0
                }
              },
              {
                "key": {
                  "Byte": {
                    "Label": "ECharacterAttribute::NewEnumerator5"
                  }
                },
                "value": {
                  "Int": 0
                }
              }
            ]
          },
          "UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592_0": {
            "tag": {
              "data": {
                "Array": {
                  "Other": "NameProperty"
                }
              }
            },
            "Array": {
              "Base": {
                "Name": selectedChar.UnlockedSkills_197_FAA1BD934F68CFC542FB048E3C0F3592
              }
            }
          },
          "EquippedSkills_201_05B6B5E9490E2586B23751B11CDA521F_0": {
            "tag": {
              "data": {
                "Array": {
                  "Other": "NameProperty"
                }
              }
            },
            "Array": {
              "Base": {
                "Name": selectedChar.EquippedSkills_201_05B6B5E9490E2586B23751B11CDA521F
              }
            }
          },
          "CharacterCustomization_204_6208BA0E4E743356022DAEB14D88C37C_0": {
            "tag": {
              "data": {
                "Struct": {
                  "struct_type": {
                    "Struct": "/Game/Gameplay/CharacterCustomization/Blueprints/S_CharacterCustomizationItemData.S_CharacterCustomizationItemData"
                  },
                  "id": "325444f7-4490-96e4-be49-5491b251dde7"
                }
              }
            },
            "Struct": {
              "Struct": {
                CharacterSkin_4_D6F8B7E048CBA86E677340839167C4FA_0: {
                  Name: selectedChar.CharacterCustomization_204_6208BA0E4E743356022DAEB14D88C37C.CharacterSkin_4_D6F8B7E048CBA86E677340839167C4FA,
                  tag: {
                    data: {
                      Other: 'NameProperty'
                    }
                  }
                },
                CharacterFace_6_069193A2473BA2E48EDF77841A8F3AFD_0: {
                  Name: selectedChar.CharacterCustomization_204_6208BA0E4E743356022DAEB14D88C37C.CharacterFace_6_069193A2473BA2E48EDF77841A8F3AFD,
                  tag: {
                    data: {
                      Other: 'NameProperty'
                    }
                  }
        }
      }
            }
          },
          "IsExcluded_206_5D433A504D71F6A2FC9057945C23DDFB_0": {
            "tag": {
              "data": {
                "Other": "BoolProperty"
              }
            },
            "Bool": false
          },
          "LuminaFromConsumables_210_7CAC193144F82258C6A89BB09BB1D226_0": {
            "tag": {
              "data": {
                "Other": "IntProperty"
              }
            },
            "Int": 0
          }
        }
      }
    }
  };
  return newCharacter;
}