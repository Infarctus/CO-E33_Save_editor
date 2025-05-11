// Define types for our character data
interface CharacterDataEditable {
    Name: string;
    AvailableActionPoints: number;
    CurrentExperience: number;
    CurrentLevel: number;
    AssignedAttributePoints: { [attribute: string]: number };
    UnlockedSkills: string[];
    EquippedSkills: string[];
    CharacterCustomization: string;
    // add more fields if needed
  }
  
  // Hard-coded sample data (normally you'll load this from your JSON)
  const characters: CharacterDataEditable[] = [
    {
      Name: "Frey",
      AvailableActionPoints: 0,
      CurrentExperience: 989,
      CurrentLevel: 12,
      AssignedAttributePoints: {
        Strength: 9,
        Dexterity: 7,
        Intelligence: 9,
        Vitality: 6,
        Luck: 5
      },
      UnlockedSkills: [
        "Combo1_Gustave",
        "UnleashCharge",
        "Powerful_Gustave",
        "MarkingShot_Gustave",
        "PerfectRecovery_Gustave",
        "PerfectBreak_Gustave"
      ],
      EquippedSkills: [
        "Combo1_Gustave",
        "UnleashCharge",
        "Powerful_Gustave"
      ],
      CharacterCustomization: "SkinGustave_Default_Red"
    },
    // You can add more characters
  ];
  
  // Hard-coded allowed values for dropdowns etc.
  const allowedSkills = [
    "Combo1_Gustave",
    "UnleashCharge",
    "Powerful_Gustave",
    "MarkingShot_Gustave",
    "PerfectRecovery_Gustave",
    "PerfectBreak_Gustave",
    "ExtraSkill1",
    "ExtraSkill2"
  ];
  
  const allowedCustomizations = [
    "SkinGustave_Default_Red",
    "SkinGustave_Default_Blue",
    "SkinGustave_Default_Green"
  ];
  
  
  // Render the overall character panel
  export function renderCharacterPanel(): void {
    const panel = document.getElementById("CharactersPanel");
    if (!panel) {
      console.error("CharactersPanel not found in the DOM!");
      return;
    } else {
        console.log("Initializing characters panel!")
    }
    panel.innerHTML = "<h2>Characters Tab</h2>"; // Reset content
  
    // A scrollable container for the character sections.
    const scrollContainer = document.createElement("div");
    scrollContainer.style.display = "flex";
    scrollContainer.style.flexWrap = "nowrap";
    scrollContainer.style.overflowX = "auto";
    scrollContainer.style.padding = "1rem";
    scrollContainer.style.gap = "1rem";
  
    characters.forEach((character, index) => {
      const characterSection = createCharacterSection(character, index);
      scrollContainer.appendChild(characterSection);
    });
  
    panel.appendChild(scrollContainer);
  }
  
  // Create a section (card) for one character
  function createCharacterSection(character: CharacterDataEditable, charIndex: number): HTMLElement {
    const section = document.createElement("section");
    section.style.border = "1px solid #ccc";
    section.style.padding = "1rem";
    section.style.minWidth = "300px";
    section.style.maxWidth = "400px";
    section.style.borderRadius = "4px";
    // section.style.backgroundColor = "#f9f9f9";
  
    // Title and image (here we hard-code a placeholder image)
    const title = document.createElement("h3");
    title.textContent = character.Name;
    section.appendChild(title);
  
    // Image container (replace src with actual image path later)
    const image = document.createElement("img");
    image.src = "https://via.placeholder.com/150"; // placeholder image
    image.alt = character.Name;
    image.style.width = "40%";
    image.style.height = "auto";
    section.appendChild(image);
  
    // Container for property editors
    const propertiesContainer = document.createElement("div");
    propertiesContainer.style.marginTop = "1rem";
  
    // Numeric input for AvailableActionPoints
    propertiesContainer.appendChild(
      createPropertyEditor(
        "Available Action Points",
        character.AvailableActionPoints,
        "number",
        (newValue) => {
          character.AvailableActionPoints = Number(newValue);
          console.log(`Character ${character.Name} AvailableActionPoints updated to ${newValue}`);
        }
      )
    );
  
    // Numeric input for CurrentExperience
    propertiesContainer.appendChild(
      createPropertyEditor(
        "Current Experience",
        character.CurrentExperience,
        "number",
        (newValue) => {
          character.CurrentExperience = Number(newValue);
          console.log(`Character ${character.Name} CurrentExperience updated to ${newValue}`);
        }
      )
    );
  
    // Numeric input for CurrentLevel
    propertiesContainer.appendChild(
      createPropertyEditor(
        "Current Level",
        character.CurrentLevel,
        "number",
        (newValue) => {
          character.CurrentLevel = Number(newValue);
          console.log(`Character ${character.Name} CurrentLevel updated to ${newValue}`);
        }
      )
    );
  
    // For each AssignedAttributePoints (list of key/value pairs)
    const attribContainer = document.createElement("div");
    attribContainer.style.marginTop = "1rem";
    const attribTitle = document.createElement("h4");
    attribTitle.textContent = "Assigned Attribute Points";
    attribContainer.appendChild(attribTitle);
  
    for (const [attrib, points] of Object.entries(character.AssignedAttributePoints)) {
      attribContainer.appendChild(
        createPropertyEditor(
          attrib,
          points,
          "number",
          (newValue) => {
            character.AssignedAttributePoints[attrib] = Number(newValue);
            console.log(`Character ${character.Name} Attribute ${attrib} updated to ${newValue}`);
          }
        )
      );
    }
    propertiesContainer.appendChild(attribContainer);
  
    // Editable list for UnlockedSkills
    propertiesContainer.appendChild(createSkillsEditor("Unlocked Skills", character.UnlockedSkills, allowedSkills, (newList) => {
      character.UnlockedSkills = newList;
      console.log(`Character ${character.Name} UnlockedSkills updated to ${newList.join(", ")}`);
      // Optionally update equipped skills options if needed
    }));
  
    // Editable list for EquippedSkills (max 6)
    propertiesContainer.appendChild(createSkillsEditor("Equipped Skills (Max 6)", character.EquippedSkills, character.UnlockedSkills, (newList) => {
      if (newList.length > 6) {
        alert("You cannot equip more than 6 skills.");
        newList = newList.slice(0, 6);
      }
      character.EquippedSkills = newList;
      console.log(`Character ${character.Name} EquippedSkills updated to ${newList.join(", ")}`);
    }));
  
    // Dropdown for CharacterCustomization
    propertiesContainer.appendChild(
      createDropdownEditor(
        "Character Customization",
        character.CharacterCustomization,
        allowedCustomizations,
        (newValue) => {
          character.CharacterCustomization = newValue;
          console.log(`Character ${character.Name} Customization updated to ${newValue}`);
        }
      )
    );
  
    section.appendChild(propertiesContainer);
    return section;
  }
  
  // Generic function to create a property editor with a label and input field.
  // For number type as default, it creates an input type number
  function createPropertyEditor(
    labelText: string,
    value: number | string,
    inputType: "number" | "text",
    onChange: (newValue: number | string) => void
  ): HTMLElement {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "space-between";
    container.style.marginBottom = "0.5rem";
  
    const label = document.createElement("label");
    label.textContent = labelText;
    label.style.flex = "1";
  
    const input = document.createElement("input");
    input.type = inputType;
    input.value = value.toString();
    input.style.flex = "1";
    input.addEventListener("change", (event) => {
      const target = event.target as HTMLInputElement;
      onChange(target.value);
    });
  
    // Two columns container
    container.appendChild(label);
    container.appendChild(input);
  
    return container;
  }
  
  // Create an editor for a list of skills.
  // This function creates a container that shows the current skills, and allows adding/removing items.
  function createSkillsEditor(
    titleText: string,
    currentList: string[],
    availableOptions: string[],
    onUpdate: (newList: string[]) => void
  ): HTMLElement {
    const container = document.createElement("div");
    container.style.marginTop = "1rem";
  
    const title = document.createElement("h4");
    title.textContent = titleText;
    container.appendChild(title);
  
    const listDiv = document.createElement("div");
    listDiv.style.display = "flex";
    listDiv.style.flexWrap = "wrap";
    listDiv.style.gap = "0.5rem";
    container.appendChild(listDiv);
  
    // Function to refresh the list display
    const refreshList = () => {
      listDiv.innerHTML = "";
      currentList.forEach((skill, index) => {
        const skillItem = document.createElement("div");
        skillItem.style.border = "1px solid #999";
        skillItem.style.padding = "0.25rem 0.5rem";
        skillItem.style.borderRadius = "4px";
        skillItem.style.display = "flex";
        skillItem.style.alignItems = "center";
        skillItem.textContent = skill;
  
        // Remove button
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "x";
        removeBtn.style.marginLeft = "0.5rem";
        removeBtn.addEventListener("click", () => {
          currentList.splice(index, 1);
          refreshList();
          onUpdate([...currentList]);
        });
        skillItem.appendChild(removeBtn);
        listDiv.appendChild(skillItem);
      });
    };
  
    refreshList();
  
    // Dropdown to add a new skill
    const addSkillSelect = document.createElement("select");
    // default empty option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "-- Add Skill --";
    addSkillSelect.appendChild(defaultOption);
  
    availableOptions.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      addSkillSelect.appendChild(opt);
    });
    addSkillSelect.addEventListener("change", (event) => {
      const target = event.target as HTMLSelectElement;
      const selected = target.value;
      if (selected && !currentList.includes(selected)) {
        currentList.push(selected);
        refreshList();
        onUpdate([...currentList]);
      }
      // Reset selection
      target.value = "";
    });
    container.appendChild(addSkillSelect);
  
    return container;
  }
  
  // Create a dropdown editor for simple selection.
  function createDropdownEditor(
    labelText: string,
    currentValue: string,
    options: string[],
    onChange: (newValue: string) => void
  ): HTMLElement {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "space-between";
    container.style.marginTop = "1rem";
  
    const label = document.createElement("label");
    label.textContent = labelText;
    label.style.flex = "1";
  
    const select = document.createElement("select");
    select.style.flex = "1";
    options.forEach((optValue) => {
      const optionEl = document.createElement("option");
      optionEl.value = optValue;
      optionEl.textContent = optValue;
      select.appendChild(optionEl);
    });
    select.value = currentValue;
    select.addEventListener("change", (event) => {
      const target = event.target as HTMLSelectElement;
      onChange(target.value);
    });
  
    container.appendChild(label);
    container.appendChild(select);
  
    return container;
  }
  






// each character has a name and an image we need to put somewhere
/*
what need is one section per character. The section are placed in a row, side by side. The thing should be scrollable if there are too many characters to fit them all on the sscreen.

Each character is represented by this inside a json file; we will have a structure that properly lets us access stuff later on.
{
  "key": {
    "Name": "Frey"
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
          "Name": "Frey"
        },
        "CurrentLevel_49_97AB711D48E18088A93C8DADFD96F854_0": {
          "tag": {
            "data": {
              "Other": "IntProperty"
            }
          },
          "Int": 12
        },
        "CurrentExperience_9_F9C772C9454408DBD6E1269409F37747_0": {
          "tag": {
            "data": {
              "Other": "IntProperty"
            }
          },
          "Int": 989
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
          "Double": 469
        },
        "CurrentMP_57_41D543664CC0A23407A2D4B4D32029F6_0": {
          "tag": {
            "data": {
              "Other": "DoubleProperty"
            }
          },
          "Double": 3
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
          "Map": [
            {
              "key": {
                "Name": "Attack"
              },
              "value": {
                "Int": 1
              }
            },
            {
              "key": {
                "Name": "Defend"
              },
              "value": {
                "Int": 1
              }
            },
            {
              "key": {
                "Name": "Items"
              },
              "value": {
                "Int": 1
              }
            },
            {
              "key": {
                "Name": "Flee"
              },
              "value": {
                "Int": 1
              }
            },
            {
              "key": {
                "Name": "Magic_Fireball"
              },
              "value": {
                "Int": 1
              }
            },
            {
              "key": {
                "Name": "Magic_Thunder"
              },
              "value": {
                "Int": 1
              }
            }
          ]
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
              "Name": [
                "SosShell",
                "RewardingMark",
                "BootyHunter",
                "Dodger",
                "CritChanceBurn",
                "AttackLifesteal",
                "FreeAimMarkingShot"
              ]
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
                "Name": "Sakaram"
              }
            },
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
                        "Label": "E_jRPG_ItemType::NewEnumerator10"
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
                "Name": "SosShell"
              }
            },
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
                        "Label": "E_jRPG_ItemType::NewEnumerator10"
                      }
                    },
                    "SlotIndex_7_4AC21CC043F87846335A25B9212005AB_0": {
                      "tag": {
                        "data": {
                          "Other": "IntProperty"
                        }
                      },
                      "Int": 1
                    }
                  }
                }
              },
              "value": {
                "Name": "RewardingMark"
              }
            },
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
                        "Label": "E_jRPG_ItemType::NewEnumerator10"
                      }
                    },
                    "SlotIndex_7_4AC21CC043F87846335A25B9212005AB_0": {
                      "tag": {
                        "data": {
                          "Other": "IntProperty"
                        }
                      },
                      "Int": 2
                    }
                  }
                }
              },
              "value": {
                "Name": "AttackLifesteal"
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
                "Int": 9
              }
            },
            {
              "key": {
                "Byte": {
                  "Label": "ECharacterAttribute::NewEnumerator1"
                }
              },
              "value": {
                "Int": 7
              }
            },
            {
              "key": {
                "Byte": {
                  "Label": "ECharacterAttribute::NewEnumerator3"
                }
              },
              "value": {
                "Int": 9
              }
            },
            {
              "key": {
                "Byte": {
                  "Label": "ECharacterAttribute::NewEnumerator4"
                }
              },
              "value": {
                "Int": 6
              }
            },
            {
              "key": {
                "Byte": {
                  "Label": "ECharacterAttribute::NewEnumerator5"
                }
              },
              "value": {
                "Int": 5
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
              "Name": [
                "Combo1_Gustave",
                "UnleashCharge",
                "Powerful_Gustave",
                "MarkingShot_Gustave",
                "PerfectRecovery_Gustave",
                "PerfectBreak_Gustave"
              ]
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
              "Name": [
                "Combo1_Gustave",
                "UnleashCharge",
                "Powerful_Gustave",
                "MarkingShot_Gustave",
                "PerfectBreak_Gustave",
                "PerfectRecovery_Gustave"
              ]
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
              "CharacterSkin_4_D6F8B7E048CBA86E677340839167C4FA_0": {
                "tag": {
                  "data": {
                    "Other": "NameProperty"
                  }
                },
                "Name": "SkinGustave_Default_Red"
              },
              "CharacterFace_6_069193A2473BA2E48EDF77841A8F3AFD_0": {
                "tag": {
                  "data": {
                    "Other": "NameProperty"
                  }
                },
                "Name": "FaceGustave_Bun"
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
}



Each section should include character image and name.
Then, I want that we put inside a vertical list elements (depending on the type of the variable), that could be: table of one line, two cols with in col.1 property name, and col2. its value. Or inside col.2, a dropdown menu. or whatever fits
Depending on the type of the value, inside th ecol.2 should vary (i.E. if the value is an int, then use something like <input type="number" step="1"/>, etc, could be a dropdown menu, etc)
What i want there to be (editable) are:
each element of AssignedAttributePoints (as integers) 
AvailableActionPoints (integer)
CurrentExperience (integer)
CurrentLevel (integer)
UnlockedSkills (that's a list of strings, we should be able to add/remove some, from a set list of skills)
EquippedSkills (list of max 6 strings, with values from the list of unlocked skills)
CharacterCustomization (a string selectible from a list of allowed values)


please generate the code (typescript, ) that would make that whole caracterPanel.
make that somewhat modulable, ie. decompose with multiple functions. For now, you can hard-code the values of stuff, I will lik that later.
ALso add for each editable value a listener (that would in the end update the actual values of the characters in the interface that represents the json in the code)
*/