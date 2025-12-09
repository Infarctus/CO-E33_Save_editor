#[tauri::command]
pub fn getweaponmapping() -> Result<String, String> { 
    let json = r#"{
  "Weapons": {
    "Gustave": {
      "Abysseram": {
        "name": "Abysseram",
        "element": "Physical",
        "power": 3228,
        "attributes": "VitalityS DefenseA",
        "passives": {
          "lvl4": {
            "desc": "50% increased damage on Rank D. No damage increase on other ranks.",
            "id": "Perfection_IncreasedDamageOnRankD"
          },
          "lvl10": {
            "desc": "50% increased Base Attack damage.",
            "id": "AugmentedAttack"
          },
          "lvl20": {
            "desc": "On Rank D, recover 20% Health with Base Attack.",
            "id": "Perfection_AttackLifestealOnD"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/abysseram-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Blodam": {
        "name": "Blodam",
        "element": "Light",
        "power": 3487,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Perfection is now based on current Health. Gain 1 Rank every 20% missing Health.",
            "id": "Perfection_PerfectionBaseOnCurrentHP"
          },
          "lvl10": {
            "desc": "20% increased Light damage with Skills.",
            "id": "SkillsLightDMG+"
          },
          "lvl20": {
            "desc": "+1 AP on Rank Up.",
            "id": "Perfection_GainAPOnRankUp"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/blodam_gustave_weapon_expedition_33_wiki_guide.png"
      },
      "Chevalam": {
        "name": "Chevalam",
        "element": "Physical",
        "power": 3067,
        "attributes": "AgilityS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Start battle at Rank S, but can't be Healed or gain Shields.",
            "id": "Perfection_StartRankSButNoHeal"
          },
          "lvl10": {
            "desc": "20% increased damage for each consecutive turn without taking damage. Can stack up to 5 times.",
            "id": "DMG+WhenNoDMGTaken"
          },
          "lvl20": {
            "desc": "Apply Rush on Rank S.",
            "id": "Perfection_RushOnS"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/chevalam_gustave_weapon_expedition_33_wiki_guide.png"
      },
      "Confuso": {
        "name": "Confuso",
        "element": "Light",
        "power": 3067,
        "attributes": "AgilityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "Light damage can Burn on Critical hits.",
            "id": "LightDMGBurnOnCrit"
          },
          "lvl10": {
            "desc": "Apply 3 Burn instead of Mark.",
            "id": "MarkIsBurn"
          },
          "lvl20": {
            "desc": "Increase Burn damage by 50% per Rank, up to 300% on Rank S.",
            "id": "Perfection_BurnDamagePerRank"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/confuso_gustave_weapon_expedition_33_wiki_guide.png"
      },
      "Contorso": {
        "name": "Contorso",
        "element": "Lightning",
        "power": 2841,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Switch to Rank S on Break. Base Attack can Break.",
            "id": "Perfection_SwitchRankSOnBreak"
          },
          "lvl10": {
            "desc": "100% Critical Chance on Rank S.",
            "id": "Perfection_AlwaysCritOnRankS"
          },
          "lvl20": {
            "desc": "Triggers a lightning strike on Critical hits.",
            "id": "TriggerLightningOnCrit"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/contorso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Corpeso": {
        "name": "Corpeso",
        "element": "Fire",
        "power": 3648,
        "attributes": "VitalityA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Base Attack applies 2 Burn stack per Rank.",
            "id": "Perfection_BurnOnBaseAtkPerRank"
          },
          "lvl10": {
            "desc": "+1 AP on Rank Up.",
            "id": "Perfection_GainAPOnRankUp"
          },
          "lvl20": {
            "desc": "Increase Burn damage by 50% per Rank, up to 300% on Rank S.",
            "id": "Perfection_BurnDamagePerRank"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/corpeso_gustave_weapon_expedition_33_wiki_guide.png"
      },
      "Cruleram": {
        "name": "Cruleram",
        "element": "Ice",
        "power": 3454,
        "attributes": "DefenseS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Don't lose Rank when taking damage from Powerless enemies.",
            "id": "Perfection_NoPerfectionLossOnPowerlessEnemy"
          },
          "lvl10": {
            "desc": "+1 Perfection on hitting a Powerless enemy.",
            "id": "Perfection_Perfection+1OnPowerlessEnemy"
          },
          "lvl20": {
            "desc": "Apply Powerless on Counterattack.",
            "id": "PowerlessOnCounter"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/cruleram-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Cultam": {
        "name": "Cultam",
        "element": "Dark",
        "power": 3132,
        "attributes": "DefenseS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "No Perfection loss on damage taken. Perfection is instead lost on being Healed.",
            "id": "Perfection_PerfectionLostOnHeal"
          },
          "lvl10": {
            "desc": "Gain 2 AP on Counterattack.",
            "id": "APOnCounter"
          },
          "lvl20": {
            "desc": "Gain 1 Rank on Counterattack.",
            "id": "Perfection_RankUpOnCounter"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/cultam_gustave_weapon_expedition_33_wiki_guide.png"
      },
      "Danseso": {
        "name": "Danseso",
        "element": "Fire",
        "power": 2970,
        "attributes": "AgilityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "Base attack gives 1 Perfection per Burn on target.",
            "id": "Perfection_DoublePerfectionVSBurn"
          },
          "lvl10": {
            "desc": "While Powerful, 20% chance to Burn on hit.",
            "id": "PowerfulBurn"
          },
          "lvl20": {
            "desc": "+1 AP on Rank Up.",
            "id": "Perfection_GainAPOnRankUp"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/danseso_gustave_weapon_expedition_33_wiki_guide.png"
      },
      "Delaram": {
        "name": "Delaram",
        "element": "Light",
        "power": 3390,
        "attributes": "VitalityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "Start battle on Rank B, but 50% Health.",
            "id": "Perfection_StartRankBButLessHP"
          },
          "lvl10": {
            "desc": "Recover 15% Health on Base Attack.",
            "id": "AttackLifesteal"
          },
          "lvl20": {
            "desc": "Apply Powerful on Rank B.",
            "id": "Perfection_PowerfulOnB"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/delaram_gustave_weapon_expedition_33_wiki_guide.png"
      },
      "Demonam": {
        "name": "Demonam",
        "element": "Light",
        "power": 2809,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Casting a Light Skill increases damage of next Physical Skill cast by 50% and vice versa.",
            "id": "DMG+OnAlternatingPhysicalLight"
          },
          "lvl10": {
            "desc": "20% increased Physical damage with Skills.",
            "id": "SkillsPhysicalDMG+"
          },
          "lvl20": {
            "desc": "Dealing Light damage with a Skill recovers 3% Health.",
            "id": "LightSkillsRegenHP"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/demonam_gustave_weapon_expedition_33_wiki_guide.png"
      },
      "Dreameso": {
        "name": "Dreameso",
        "element": "Physical",
        "power": 3067,
        "attributes": "AgilityS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Gain 1 Rank on Counterattack",
            "id": "Perfection_RankUpOnCounter"
          },
          "lvl10": {
            "desc": "50% increased Counterattack damage.",
            "id": "AugmentedCounter"
          },
          "lvl20": {
            "desc": "Gain 2 AP on Counterattack.",
            "id": "APOnCounter"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/dreameso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Dualiso": {
        "name": "Dualiso",
        "element": "Lightning",
        "power": 1776,
        "attributes": "VitalityA DefenseS",
        "passives": {
          "lvl4": {
            "desc": "Play again after a Base Attack.",
            "id": "AttackPlayAgain"
          },
          "lvl10": {
            "desc": "50% increased Base Attack damage.",
            "id": "AugmentedAttack"
          },
          "lvl20": {
            "desc": "Base Attack gives 4 Perfection.",
            "id": "Perfection_Attackx2"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/dualiso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Gaulteram": {
        "name": "Gaulteram",
        "element": "Earth",
        "power": 3261,
        "attributes": "AgilityS LuckA",
        "passives": {
          "lvl4": {
            "desc": "When hit, lose 1 Perfection instead of 1 rank.",
            "id": "Perfection_RankLossOneByOne"
          },
          "lvl10": {
            "desc": "Apply Rush on Rank S",
            "id": "Perfection_RushOnS"
          },
          "lvl20": {
            "desc": "Gain 2 Perfection on turn start.",
            "id": "Perfection_OnTurnStart"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/gaulteram_gustave_weapon_expedition_33_wiki_guide.png"
      },
      "Gesam": {
        "name": "Gesam",
        "element": "Physical",
        "power": 3228,
        "attributes": "Attribute 1A Attribute 2S",
        "passives": {
          "lvl4": {
            "desc": "Convert Light damage Skills to Physical damage.",
            "id": "SkillsLightToPhysical"
          },
          "lvl10": {
            "desc": "20% increased Physical damage with Skills.",
            "id": "SkillsPhysicalDMG+"
          },
          "lvl20": {
            "desc": "-1 AP cost for Physical Skills.",
            "id": "PhysicalAPCost-"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/gesam_gustave_weapon_expedition_33_wiki_guide.png"
      },
      "Glaceso": {
        "name": "Glaceso",
        "element": "Ice",
        "power": 2873,
        "attributes": "DefenseA LuckS",
        "passives": {
          "lvl4": {
            "desc": "+1 Perfection on Critical hit.",
            "id": "Perfection_Perfection+1OnCrit"
          },
          "lvl10": {
            "desc": "Self-Heal by 2% Health on dealing a Critical hit.",
            "id": "HealOnCrit"
          },
          "lvl20": {
            "desc": "Countemttack is always a Critical hit.",
            "id": "AlwaysCritOnCounterDamage"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/glaceso_gustave_weapon_expedition_33_wiki_guide.png"
      },
      "Lanceram": {
        "name": "Lanceram",
        "element": "Physical",
        "power": 3713,
        "attributes": "VitalityS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "Rank can't be lower than C.",
            "id": "Perfection_MinC"
          },
          "lvl10": {
            "desc": "Base Attack gives 4 Perfection.",
            "id": "Perfection_Attackx2"
          },
          "lvl20": {
            "desc": "Parrying gives 2 Perfection instead of 1.",
            "id": "Perfection_Parryx2"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/lanceram_gustave_weapon_expedition_33_wiki_guide.png"
      },
      "Liteso": {
        "name": "Liteso",
        "element": "Physical",
        "power": 3551,
        "attributes": "DefenseS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "Base Attack consumes all Shields to deal 100% increased damage per Shield.",
            "id": "AttackConsumeShieldForExtraDMG"
          },
          "lvl10": {
            "desc": "+1 Shield on Counterattack.",
            "id": "CounterShield"
          },
          "lvl20": {
            "desc": "Base Attack gives 4 Perfection.",
            "id": "Perfection_Attackx2"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/liteso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Noahram": {
        "name": "Noahram",
        "element": "Physical",
        "power": 2260,
        "attributes": "VitalityS",
        "passives": {
          "lvl4": {
            "desc": "N/A",
            "id": null
          },
          "lvl10": {
            "desc": "N/A",
            "id": null
          },
          "lvl20": {
            "desc": "N/A",
            "id": null
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/noahram-verleso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Nosaram": {
        "name": "Nosaram",
        "element": "Physical",
        "power": 3551,
        "attributes": "AgilityS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Double Perfection gained on Free Aim shots.",
            "id": "Perfection_DoubleOnFreeAimShots"
          },
          "lvl10": {
            "desc": "Free Aim shots break 2 Shields.",
            "id": "FreeAimBreaksMoreShields"
          },
          "lvl20": {
            "desc": "50% increased Free Aim damage.",
            "id": "AugmentedAim"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/nosaram_gustave_weapon_expedition_33_wiki_guide.png"
      },
      "Sakaram": {
        "name": "Sakaram",
        "element": "Physical",
        "power": 2938,
        "attributes": "AgilityS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Can't lose Perfection. No damage increase from Rank.",
            "id": "Perfection_NoPerfectionLossButNoDamageIncrease"
          },
          "lvl10": {
            "desc": "50% increased Base Attack damage.",
            "id": "AugmentedAttack"
          },
          "lvl20": {
            "desc": "Base Attack gives 4 Perfection.",
            "id": "Perfection_Attackx2"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/sakaram_gustave_weapon_expedition_33_wiki_guide.png"
      },
      "Seeram": {
        "name": "Seeram",
        "element": "Light",
        "power": 3713,
        "attributes": "VitalityC AgilityB",
        "passives": {
          "lvl4": {
            "desc": "-1 to all Perfection gain but can't reach Rank S.",
            "id": "Perfection_Perfection+butDMG+"
          },
          "lvl10": {
            "desc": "Base Attack gives 4 Perfection.",
            "id": "Perfection_Attackx2"
          },
          "lvl20": {
            "desc": "20% increased Light damage with Skills.",
            "id": "SkillsLightDMG+"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/seeram_gustave_weapon_expedition_33_wiki_guide.png"
      },
      "Simoso": {
        "name": "Simoso",
        "element": "Light",
        "power": 3228,
        "attributes": "VitalityA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "An ethereal Sword deals Light damage on any damage dealt with Skills.",
            "id": "DoubleHit"
          },
          "lvl10": {
            "desc": "20% chance to apply Burn on dealing Light damage.",
            "id": "LightDamageBurn"
          },
          "lvl20": {
            "desc": "Can't die if at least Rank A.",
            "id": "Perfection_SurvivorRankA"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/simoso_gustave_weapon_expedition_33_wiki_guide.png"
      },
      "Sireso": {
        "name": "Sireso",
        "element": "Physical",
        "power": 2583,
        "attributes": "VitalityA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Bonus damage from Perfection applies to all allies at half value. Bonus damage no longer applies to Verso.",
            "id": "Perfection_PerfectionBonusDamageShare"
          },
          "lvl10": {
            "desc": "Perfection gained is increased by 1 while Powerful",
            "id": "Perfection_Perfection+1OnPowerful"
          },
          "lvl20": {
            "desc": "Support Skills cost 1 less AP.",
            "id": "SupportSkillsCostReduced"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/sireso_gustave_weapon_expedition_33_wiki_guide.png"
      },
      "Tireso": {
        "name": "Tireso",
        "element": "Earth",
        "power": 3713,
        "attributes": "VitalityS DefenseA",
        "passives": {
          "lvl4": {
            "desc": "Gain 1 Rank on applying Mark.",
            "id": "Perfection_RankUpOnMark"
          },
          "lvl10": {
            "desc": "Mark an enemy on Base Attack.",
            "id": "MarkOnBaseAttack"
          },
          "lvl20": {
            "desc": "Apply Powerless on Marking an enemy.",
            "id": "PowerlessOnMarking"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/tireso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Verleso": {
        "name": "Verleso",
        "element": "Physical",
        "power": 3454,
        "attributes": "VitalityS",
        "passives": {
          "lvl4": {
            "desc": "N/A",
            "id": null
          },
          "lvl10": {
            "desc": "N/A",
            "id": null
          },
          "lvl20": {
            "desc": "N/A",
            "id": null
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/noahram-verleso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "DebugVerso": {
        "name": "Baguette",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      },
      "Velokan": {
        "name": "Velokan*",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      },
      "03_Weapon_Placeholder": {
        "name": "03_Weapon_Placeholder**",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      },
      "GDC_Weapon_Verso": {
        "name": "GDC_Weapon_Verso**",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      },
      "MitigatedPerfection": {
        "name": "MitigatedPerfection**",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      }
    },
    "Lune": {
      "Angerim": {
        "name": "Angerim",
        "element": "Fire",
        "power": 3293,
        "attributes": "DefenseA LuckS",
        "passives": {
          "lvl4": {
            "desc": "Base Attack applies 2 Burn per Fire Stain.",
            "id": "Stains_ApplyBurnStackPerFireStainOnAttack"
          },
          "lvl10": {
            "desc": "Generate one Fire Stain at the beginning of each turn.",
            "id": "Stains_FireStainOnTurnStart"
          },
          "lvl20": {
            "desc": "30% increased Burn damage per Fire Stain.",
            "id": "Stains_IncreaseBurnDMGPerFireStain"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/angerim_lune_weapon_expedition_33_wiki_guide.png"
      },
      "Benisim": {
        "name": "Benisim",
        "element": "Earth",
        "power": 2744,
        "attributes": "VitalityS DefenseA",
        "passives": {
          "lvl4": {
            "desc": "Healing Skills cost 1 less AP.",
            "id": "HealAPCost-"
          },
          "lvl10": {
            "desc": "Generate one Earth Stain at the beginning of each turn.",
            "id": "Stains_EarthStainOnTurnStart"
          },
          "lvl20": {
            "desc": "Replay instantly on consuming Stains with a Healing Skill.",
            "id": "InstantReplayOnOverchargedHealSkills"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/benisim-lune-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Betelim": {
        "name": "Betelim",
        "element": "Earth",
        "power": 3228,
        "attributes": "VitalityA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Using a Skill that consumes Stains increases damage by 20%. Can stack up to 5 times. Resets on using a Skill without consuming Stains.",
            "id": "Stains_OverchargeDMG+"
          },
          "lvl10": {
            "desc": "On turn start, if no Stains, 2 random Stains are generated.",
            "id": "Stains_TurnStart+StainsIfNoStain"
          },
          "lvl20": {
            "desc": "+l AP when Stains are consumed.",
            "id": "Stains_APOnConsumption"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/betelim_lune_weapon_expedition_33_wiki_guide.png"
      },
      "Braselim": {
        "name": "Braselim",
        "element": "Fire",
        "power": 3390,
        "attributes": "VitalityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "30% increased Critical Chance per Ice Stain.",
            "id": "Stains_IncreaseCritChancePerIceStain"
          },
          "lvl10": {
            "desc": "+5% of a Gradient Charge on Critical hit.",
            "id": "GradientPointOnCrit"
          },
          "lvl20": {
            "desc": "20% increased Fire damage with Skills.",
            "id": "SkillsFireDMG+"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/braselim_lune_weapon_expedition_33_wiki_guide.png"
      },
      "Chapelim": {
        "name": "Chapelim",
        "element": "Earth",
        "power": 3164,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "30% increased Break damage per Earth Stain.",
            "id": "Stains_IncreaseBreakDMGPerEarthStain"
          },
          "lvl10": {
            "desc": "Gain 9 AP on Breaking an enemy.",
            "id": "APonBreak"
          },
          "lvl20": {
            "desc": "Generate one Earth Stain at the beginning of each turn.",
            "id": "Stains_EarthStainOnTurnStart"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/chapelim-lune-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Sirenim_1": {
        "name": "Choralim",
        "element": "Fire",
        "power": 3551,
        "attributes": "DefenseS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "100% Critical Chance when 4 Stans are simultaneously active.",
            "id": "Stains_FullCritIfFullStain"
          },
          "lvl10": {
            "desc": "20% increased damage for each consecutive turn without taking damage. Can stack up to 5 times.",
            "id": "DMG+WhenNoDMGTaken"
          },
          "lvl20": {
            "desc": "Critical hits apply Burn.",
            "id": "CritAppliesBurn"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/choralim-lune-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Sirenim_2": {
        "name": "Colim",
        "element": "Light",
        "power": 2583,
        "attributes": "DefenseS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "50% chance to generate a Light Stain when consuming Stains.",
            "id": "Stains_GenerateLightStainRandom"
          },
          "lvl10": {
            "desc": "+1 AP on consuming a Light Stain.",
            "id": "Stains_GainAPOnLightStainConsumption"
          },
          "lvl20": {
            "desc": "20% increased damage with Skills per active Light Stain.",
            "id": "Stains_DamagePerLightStain"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/colim-lune-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Coralim": {
        "name": "Coralim",
        "element": "Ice",
        "power": 2744,
        "attributes": "VitalityA DefenseS",
        "passives": {
          "lvl4": {
            "desc": "Ice Skills cost 1 less AP.",
            "id": "IceAPCost-"
          },
          "lvl10": {
            "desc": "20% increased Ice damage with Skills.",
            "id": "SkillsIceDMG+"
          },
          "lvl20": {
            "desc": "Start battle with 1 Earth Stain.",
            "id": "Stains_EarthStart"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/coralim_lune_weapon_expedition_33_wiki_guide.png"
      },
      "Deminerim": {
        "name": "Deminerim",
        "element": "Lightning",
        "power": 2744,
        "attributes": "AgilityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "Lightning Skills cost 1 less AP.",
            "id": "LightningAPCost-"
          },
          "lvl10": {
            "desc": "20% increased Lightning damage with Skills.",
            "id": "SkillsLightningDMG+"
          },
          "lvl20": {
            "desc": "Start battle with 1 Fire Stain.",
            "id": "Stains_FireStart"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/deminerim_lune_weapon_expedition_33_wiki_guide.png"
      },
      "Elerim": {
        "name": "Elerim",
        "element": "Earth",
        "power": 3551,
        "attributes": "VitalityS DefenseA",
        "passives": {
          "lvl4": {
            "desc": "Consuming an Earth Stain applies 1 Shield to self.",
            "id": "Stains_EarthAppliesShield"
          },
          "lvl10": {
            "desc": "20% increased Earth damage with Skills.",
            "id": "SkillsEarthDMG+"
          },
          "lvl20": {
            "desc": "Base Attack generates an Earth Stain.",
            "id": "Stains_AttackEarth+"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/elerim_lune_weapon_expedition_33_wiki_guide.png"
      },
      "Reacherim_1": {
        "name": "Kralim",
        "element": "Lightning",
        "power": 3390,
        "attributes": "VitalityA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Casting a Skill increases the Skill damage of all other elements by 20%. Resets when casting a Skill of a previous element.",
            "id": "Stains_ElementalCyclingDMG+"
          },
          "lvl10": {
            "desc": "On turn start, if no Stains, 2 random Stains are generated.",
            "id": "Stains_TurnStart+StainsIfNoStain"
          },
          "lvl20": {
            "desc": "+1 AP when Stains are consumed.",
            "id": "Stains_APOnConsumption"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/kralim-lune-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Lighterim": {
        "name": "Lighterim",
        "element": "Fire",
        "power": 2744,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Fire Skills cost 1 less AP.",
            "id": "FireAPCost-"
          },
          "lvl10": {
            "desc": "20% increased Fire damage with Skills.",
            "id": "SkillsFireDMG+"
          },
          "lvl20": {
            "desc": "Start battle with 1 Ice Stain.",
            "id": "Stains_IceStart"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/lighterim_lune_weapon_expedition_33_wiki_guide.png"
      },
      "Reacherim_2": {
        "name": "Lithelim",
        "element": "Void",
        "power": 3099,
        "attributes": "VitalityS",
        "passives": {
          "lvl4": {
            "desc": "5% chance to generate a Dark Stain when consuming Stains. Deal 50% more damage with Skills per active Dark Stain.",
            "id": "Stains_GenerateDarkStainRandom"
          },
          "lvl10": {
            "desc": "+1 AP on consuming a Light Stain.",
            "id": "Stains_GainAPOnLightStainConsumption"
          },
          "lvl20": {
            "desc": "Base Attacks can consume one Dark Stain to deal 200% more damage.",
            "id": "Stains_ConsumeDarkStainsOnAttackDMG+"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/lithelim-lune-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Lunerim": {
        "name": "Lunerim",
        "element": "Fire",
        "power": 2421,
        "attributes": "VitalityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "N/A",
            "id": null
          },
          "lvl10": {
            "desc": "N/A",
            "id": null
          },
          "lvl20": {
            "desc": "N/A",
            "id": null
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/lunerim-lune-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Painerim": {
        "name": "Painerim",
        "element": "Earth",
        "power": 2744,
        "attributes": "VitalityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "Earth Skills cost 1 less AP.",
            "id": "EarthAPCost-"
          },
          "lvl10": {
            "desc": "20% increased Earth damage with Skills.",
            "id": "SkillsEarthDMG+"
          },
          "lvl20": {
            "desc": "Start battle with 1 Lightning Stain.",
            "id": "Stains_LightningStart"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/painerim_lune_weapon_expedition_33_wiki_guide.png"
      },
      "Potierim": {
        "name": "Potierim",
        "element": "Ice",
        "power": 2906,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Healing Skills generate one additional 1 Light stain.",
            "id": "Stains_+RandomStainOnHeal"
          },
          "lvl10": {
            "desc": "Consuming a Light Stain applies Slow to a random enemy.",
            "id": "Stains_IceAppliesSlow"
          },
          "lvl20": {
            "desc": "Base Attack generates a Light Stain.",
            "id": "Stains_AttackLight+"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/potierim_lune_weapon_expedition_33_wiki_guide.png"
      },
      "Redalim": {
        "name": "Redalim",
        "element": "Ice",
        "power": 2583,
        "attributes": "DefenseS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "Healing Skills generate one additional Light stain.",
            "id": "Stains_+RandomStainOnHeal"
          },
          "lvl10": {
            "desc": "Generate one Ice Stain at the beginning of each turn.",
            "id": "Stains_IceStainOnTurnStart"
          },
          "lvl20": {
            "desc": "Replay instantly on consuming Stains with a Healing Skill.",
            "id": "InstantReplayOnOverchargedHealSkills"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/redalim_lune_weapon_expedition_33_wiki_guide.png"
      },
      "Saperim": {
        "name": "Saperim",
        "element": "Lightning",
        "power": 3067,
        "attributes": "DefenseS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Using a Gradient Attack generates 1 additional Light Stain.",
            "id": "Stains_GenerateStainsOnGradientAttack"
          },
          "lvl10": {
            "desc": "When a Fire Stain is generated, a Lightning Stain is also generated. Once per turn.",
            "id": "Stains_LightningOnFire"
          },
          "lvl20": {
            "desc": "Gradient Attacks and Gradient Counters deal 50% more damage.",
            "id": "GradientAttackAndCounterDMG+"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/saperim_lune_weapon_expedition_33_wiki_guide.png"
      },
      "Scaverim": {
        "name": "Scaverim",
        "element": "Dark",
        "power": 4197,
        "attributes": "VitalityS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "50% chance to generate a Dark Stain when consuming Stains. Deal 50% more damage with Skills per active Dark Stain.",
            "id": "Stains_GenerateDarkStainRandom"
          },
          "lvl10": {
            "desc": "Base Attacks can consume one Dark Stain to deal 200% more damage.",
            "id": "Stains_ConsumeDarkStainsOnAttackDMG+"
          },
          "lvl20": {
            "desc": "With 4 active Dark Stains, any Skill can consume them to deal 300% more damage.",
            "id": "Stains_ConsumeFourDarkStainsDMG+OnSkills"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/scaverim_lune_weapon_expedition_33_wiki_guide.png"
      },
      "Snowim": {
        "name": "Snowim",
        "element": "Ice",
        "power": 3874,
        "attributes": "VitalityA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Freeze self when falling below 30% health. Prevent the next instance of damage while Frozen.",
            "id": "FreezeSelfOnLowHP2"
          },
          "lvl10": {
            "desc": "On turn start, if Frozen, remove Freeze and recover 60% Health.",
            "id": "DefreezeAndHealOnTurnStart"
          },
          "lvl20": {
            "desc": "Gain 2 Ice Stains and 3 AP when Frozen.",
            "id": "Stains_Ice+IfSelfFrozen"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/snowim_lune_weapon_expedition_33_wiki_guide.png"
      },
      "Trebuchim": {
        "name": "Trebuchim",
        "element": "Lightning",
        "power": 3067,
        "attributes": "VitalityS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Generate a random Stain on Free Aim shot.",
            "id": "Stains_RandomGeneration"
          },
          "lvl10": {
            "desc": "+1 AP when Stains are consumed.",
            "id": "Stains_APOnConsumption"
          },
          "lvl20": {
            "desc": "Base Attack generates 2 random Stains.",
            "id": "Stains_AttackRandom++"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/trebuchim_lune_weapon_expedition_33_wiki_guide.png"
      },
      "Dualim": {
        "name": "Troubadim",
        "element": "Physical",
        "power": 3067,
        "attributes": "VitalityA DefenseS",
        "passives": {
          "lvl4": {
            "desc": "Free Aim Shots deal damage to an additional random target.",
            "id": "FreeAim+1Shot"
          },
          "lvl10": {
            "desc": "50% increased Free Aim damage.",
            "id": "AugmentedAim"
          },
          "lvl20": {
            "desc": "Generate a random Stain on Free Aim shot.",
            "id": "Stains_RandomGeneration"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/troubadim_lune_weapon_expedition_33_wiki_guide.png"
      },
      "DebugLune": {
        "name": "Baguette",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      },
      "Gelerim": {
        "name": "Gelerim*",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      },
      "Telarim": {
        "name": "Telarim*",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      },
      "GDC_Weapon_Lune": {
        "name": "GDC_Weapon_Lune**",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      }
    },
    "Maelle": {
      "Chainebum": {
        "name": "Barrier Breaker",
        "element": "Void",
        "power": 3616,
        "attributes": "DefenseS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "Steal Shields removed by hitting enemies.",
            "id": "StealShield"
          },
          "lvl10": {
            "desc": "Switch to Virtuose Stance on breaking any Shield.",
            "id": "Stance_VirtuoseOnShieldBreak"
          },
          "lvl20": {
            "desc": "Hitting a Marked enemy breaks all its Shields.",
            "id": "MarkBreakShields"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/barrier-breaker-maelle-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Battlum": {
        "name": "Battlum",
        "element": "Physical",
        "power": 3067,
        "attributes": "DefenseS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Double Gradient generation while in Defensive Stance.",
            "id": "Stance_DefensiveGradientCharges"
          },
          "lvl10": {
            "desc": "lf Stanceless, Base Attack switches to Defensive Stance.",
            "id": "Stance_AttackDefensive"
          },
          "lvl20": {
            "desc": "+5% of a Gradient Charge on Parry.",
            "id": "GradientChargesOnParry"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/battlum_maelle_weapon_expedition_33_wiki_guide.png"
      },
      "Brulerum": {
        "name": "Brulerum",
        "element": "Fire",
        "power": 2744,
        "attributes": "AgilityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "Critical hits apply Burn.",
            "id": "CritAppliesBurn"
          },
          "lvl10": {
            "desc": "Base Attack applies 2 Burn.",
            "id": "AttackBurn"
          },
          "lvl20": {
            "desc": "100% Critical Chance while Stanceless.",
            "id": "Stance_FullCritIfStanceless"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/brulerum_maelle_weapon_expedition_33_wiki_guide.png"
      },
      "Troubadum": {
        "name": "Chalium",
        "element": "Light",
        "power": 3422,
        "attributes": "VitalityA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "On Defensive Stance, gain 1 Shield per Parry. Lose all Shields on turn start.",
            "id": "Stance_ShieldOnParry"
          },
          "lvl10": {
            "desc": "20% increased Light damage with Skills.",
            "id": "SkillsLightDMG+"
          },
          "lvl20": {
            "desc": "50% increased Counter damage per Shield.",
            "id": "CounterDamagePerShield"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/chalium-maelle-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Sirenum_2": {
        "name": "Chantenum",
        "element": "Fire",
        "power": 2841,
        "attributes": "AgilityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "On turn start, if Stanceless, switch to Offensive Stance.",
            "id": "Stance_StancelessSwitchToOStance"
          },
          "lvl10": {
            "desc": "Fire Skills cost 1 less AP.",
            "id": "FireAPCost-"
          },
          "lvl20": {
            "desc": "+1 Shield on switching to Offensive Stance.",
            "id": "Stance_ShieldOnOSstance"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/chantenum-maelle-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Clierum": {
        "name": "Clierum",
        "element": "Lightning",
        "power": 3196,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Critical hits with Skills give 2 AP. Once per turn.",
            "id": "APOnCrit"
          },
          "lvl10": {
            "desc": "20% increased Lightning damage with Skills.",
            "id": "SkillsLightningDMG+"
          },
          "lvl20": {
            "desc": "+50% Critical Chance while in Offensive Stance.",
            "id": "Stance_CritChanceOffensive"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/clierum_maelle_weapon_expedition_33_wiki_guide.png"
      },
      "Coldum": {
        "name": "Coldum",
        "element": "Ice",
        "power": 2583,
        "attributes": "VitalityS DefenseA",
        "passives": {
          "lvl4": {
            "desc": "Self-Heal by 2% Health on dealing a Critical hit.",
            "id": "HealOnCrit"
          },
          "lvl10": {
            "desc": "+50% Critical Chance while in Defensive Stance.",
            "id": "Stance_CritChanceDefensive"
          },
          "lvl20": {
            "desc": "If Stanceless, Base Attack switches to Defensive Stance.",
            "id": "Stance_AttackDefensive"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/coldum_maelle_weapon_expedition_33_wiki_guide.png"
      },
      "Duenum": {
        "name": "Duenum",
        "element": "Physical",
        "power": 2421,
        "attributes": "DefenseS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "In Defensive Stance, gaining AP also gives 1 AP to allies.",
            "id": "Stance_DefensiveSharedAP"
          },
          "lvl10": {
            "desc": "If Stanceless, Base Attack switches to Defensive Stance.",
            "id": "Stance_AttackDefensive"
          },
          "lvl20": {
            "desc": "+1 AP on Stance switch.",
            "id": "Stance_APOnSwitch"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/duenum_maelle_weapon_expedition_33_wiki_guide.png"
      },
      "Facesum": {
        "name": "Facesum",
        "element": "Physical",
        "power": 3519,
        "attributes": "VitalityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "In Offensive Stance, double the amount of Burn applied.",
            "id": "Stance_OffensiveBurnStacks"
          },
          "lvl10": {
            "desc": "50% increased Burn damage.",
            "id": "BurnDamage"
          },
          "lvl20": {
            "desc": "Base Attack propagates Burn.",
            "id": "AttackPropagatesBurn"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/facesum_maelle_weapon_expedition_33_wiki_guide.png"
      },
      "Glaisum": {
        "name": "Glaisum",
        "element": "Physical",
        "power": 3713,
        "attributes": "DefenseS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "Allies recover 20% Health on switching to Virtuose Stance.",
            "id": "Stance_VirtuoseHealAllies"
          },
          "lvl10": {
            "desc": "Gain Shell when switching out of Virtuose Stance.",
            "id": "Stance_ShellOutVStance"
          },
          "lvl20": {
            "desc": "Cleanse self Status Effects when switching to Virtuose Stance.",
            "id": "Stance_CleanseVirtuose"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/glaisum_maelle_weapon_expedition_33_wiki_guide.png"
      },
      "Jarum": {
        "name": "Jarum",
        "element": "Physical",
        "power": 2583,
        "attributes": "DefenseS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Switch to Virtuose Stance on Counterattack.",
            "id": "Stance_CounterSwitchToVStance"
          },
          "lvl10": {
            "desc": "Apply 5 Burn on Counterattack.",
            "id": "CounterBurn"
          },
          "lvl20": {
            "desc": "50% increased Counter damage per Shield.",
            "id": "CounterDamagePerShield"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/jarum_maelle_weapon_expedition_33_wiki_guide.png"
      },
      "Reachum_1": {
        "name": "Lithum",
        "element": "Void",
        "power": 3228,
        "attributes": "AgilityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "In Virtuose Stance, hitting a Marked enemy doesn't remove Mark.",
            "id": "Stance_VirtuoseKeepMark"
          },
          "lvl10": {
            "desc": "Switch to Virtuose Stance on Counterattack.",
            "id": "Stance_CounterSwitchToVStance"
          },
          "lvl20": {
            "desc": "Gain Shell when switching out of Virtuose Stance.",
            "id": "Stance_ShellOutVStance"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/lithum-maelle-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Maellum": {
        "name": "Maellum",
        "element": "Physical",
        "power": 3228,
        "attributes": "VitalityS",
        "passives": {
          "lvl4": {
            "desc": "N/A",
            "id": null
          },
          "lvl10": {
            "desc": "N/A",
            "id": null
          },
          "lvl20": {
            "desc": "N/A",
            "id": null
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/maellum-maelle-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Medalum": {
        "name": "Medalum",
        "element": "Physical",
        "power": 2906,
        "attributes": "DefenseS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "Start in Virtuose Stance.",
            "id": "Stance_StartOnVStance"
          },
          "lvl10": {
            "desc": "In Virtuose Stance, every Burn applied is doubled.",
            "id": "Stance_VirtuoseDoubleBurn"
          },
          "lvl20": {
            "desc": "In Virtuose Stance, Burn deals double damage.",
            "id": "Stance_VirtuoseBurnDamageDouble"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/medalum_maelle_weapon_expedition_33_wiki_guide.png"
      },
      "Melarum": {
        "name": "Melarum",
        "element": "Physical",
        "power": 3584,
        "attributes": "VitalityS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Allies recover 20% Health on switching to Virtuose Stance.",
            "id": "Stance_VirtuoseHealAllies"
          },
          "lvl10": {
            "desc": "Applies Shell when Health is above 80%.",
            "id": "Stance_ShellOnHighHP"
          },
          "lvl20": {
            "desc": "Switch to Virtuose Stance when Health falls below 50%.",
            "id": "Stance_VirtuoseOnLowHP"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/melarum_maelle_weapon_expedition_33_wiki_guide.png"
      },
      "Reachum_2": {
        "name": "Plenum",
        "element": "Ice",
        "power": 3035,
        "attributes": "DefenseA LuckS",
        "passives": {
          "lvl4": {
            "desc": "On turn start, if Stanceless, switch to Defensive Stance.",
            "id": "Stance_StancelessSwitchToDStance"
          },
          "lvl10": {
            "desc": "In Defensive Stance, double Break damage.",
            "id": "Stance_DefensiveBreakDamage"
          },
          "lvl20": {
            "desc": "Support Skills cost 1 less AP.",
            "id": "SupportSkillsCostReduced"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/plenum-maelle-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Seashelum": {
        "name": "Seashelum",
        "element": "Fire",
        "power": 3003,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "+1 Shield on switching to Offesnive Stance.",
            "id": "Stance_ShieldOnOSstance"
          },
          "lvl10": {
            "desc": "If Stanceless, Base Attack switches to Offensive Stance.",
            "id": "Stance_AttackOffensive"
          },
          "lvl20": {
            "desc": "+50% Critical Chance while in Offensive Stance.",
            "id": "Stance_CritChanceOffensive"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/seashellum-maelle-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Sekarum": {
        "name": "Sekarum",
        "element": "Physical",
        "power": 3390,
        "attributes": "VitalityS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "Switch to Virtuose Stance on breaking any Shield.",
            "id": "Stance_VirtuoseOnShieldBreak"
          },
          "lvl10": {
            "desc": "Free Aim shots break 2 shields.",
            "id": "FreeAimBreaksMoreShields"
          },
          "lvl20": {
            "desc": "In Virtuose Stance, all damage pierce Shields.",
            "id": "Stance_VStancePierce"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/sekarum_maelle_weapon_expedition_33_wiki_guide.png"
      },
      "Stalum": {
        "name": "Stalum",
        "element": "Fire",
        "power": 3228,
        "attributes": "DefenseS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Apply Burn on self on turn start. 10% increased damage for each self Burn stack.",
            "id": "SelfBurnButDmg+"
          },
          "lvl10": {
            "desc": "Base Attack applies 2 Burn.",
            "id": "AttackBurn"
          },
          "lvl20": {
            "desc": "While in Defensive Stance, receive Heal instead of Burn damage.",
            "id": "Stance_BurnHealOnDStance"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/stalum-maelle-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Sirenum_1": {
        "name": "Tissenum",
        "element": "Earth",
        "power": 3874,
        "attributes": "VitalityA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "In Defensive Stance, double Break damage.",
            "id": "Stance_DefensiveBreakDamage"
          },
          "lvl10": {
            "desc": "Gain 9 AP on Breaking an enemy.",
            "id": "APonBreak"
          },
          "lvl20": {
            "desc": "Breaking an enemy deals 3 high amount of Earth damage.",
            "id": "BreakEarthBurst"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/tissenum-maelle-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Veremum": {
        "name": "Veremum",
        "element": "Physical",
        "power": 3293,
        "attributes": "VitalityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "If Stanceless, Base Attack switches to Offensive Stance.",
            "id": "Stance_AttackOffensive"
          },
          "lvl10": {
            "desc": "Counterattacks apply Defenceless.",
            "id": "CounterDefenseless"
          },
          "lvl20": {
            "desc": "+50% Critical Chance while in Offensive Stance.",
            "id": "Stance_CritChanceOffensive"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/veremum_maelle_weapon_expedition_33_wiki_guide.png"
      },
      "Volesterum": {
        "name": "Volesterum",
        "element": "Physical",
        "power": 3293,
        "attributes": "VitalityA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "+1 AP on Stance switch.",
            "id": "Stance_APOnSwitch"
          },
          "lvl10": {
            "desc": "If Stanceless, Bast Attack switches to Defensive Stance.",
            "id": "Stance_AttackDefensive"
          },
          "lvl20": {
            "desc": "Recover 5% Health on Stance switch.",
            "id": "Stance_HealOnSwitch"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/volesterum_maelle_weapon_expedition_33_wiki_guide.png"
      },
      "Yeverum": {
        "name": "Yeverum",
        "element": "Physical",
        "power": 3358,
        "attributes": "DefenseS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "Applying Shell also applies 1 Shield.",
            "id": "ShieldOnShell"
          },
          "lvl10": {
            "desc": "On applying Shields, also give 1 AP.",
            "id": "APOnShield"
          },
          "lvl20": {
            "desc": "On switching to Virtuose Stance, double all Shields on allies.",
            "id": "Stance_VirtuoseDoubleShields"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/chainebum-maelle-weapon-expedition-33-wiki-guide-130px.png"
      },
      "DebugMaelle": {
        "name": "Baguette",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      },
      "Beselbum": {
        "name": "Beselbum*",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      },
      "Milerim": {
        "name": "Milerim*",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      },
      "Nibalum": {
        "name": "Nibalum*",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      },
      "GDC_Weapon_Maelle": {
        "name": "GDC_Weapon_Maelle**",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      }
    },
    "Monoco": {
      "Sirenaro_1": {
        "name": "Ballaro",
        "element": "Light",
        "power": 3067,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Reverse Bestial Wheel Order.",
            "id": "Masks_ReverseBestialMeter"
          },
          "lvl10": {
            "desc": "Using an Upgraded Skill gives 1 AP to all other allies.",
            "id": "Masks_Overcharge+APOnAllies"
          },
          "lvl20": {
            "desc": "Almighty Mask gives 2 AP to all allies.",
            "id": "Masks_GainAPAllAlliesOnAlmightySwitch"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/ballaro-monoco-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Boucharo": {
        "name": "Boucharo",
        "element": "Fire",
        "power": 3228,
        "attributes": "AgilityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "Start battle in Agile Mask.",
            "id": "Masks_StartAgile"
          },
          "lvl10": {
            "desc": "Agile Mask applies Rush for 3 turns.",
            "id": "Masks_RushOnAgile"
          },
          "lvl20": {
            "desc": "+50% Critical Chance while in Agile Mask.",
            "id": "Masks_CritChanceOnAgile"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/boucharo-monoco-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Brumaro": {
        "name": "Brumaro",
        "element": "Physical",
        "power": 3390,
        "attributes": "VitalityS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "Replay instantly when in Almighty Mask.",
            "id": "Masks_InstantReplayOnAlmighty"
          },
          "lvl10": {
            "desc": "+3 AP when in Almighty Mask.",
            "id": "Masks_APOnAlmighty"
          },
          "lvl20": {
            "desc": "Revive instantly with full Health if dead while in Almighty Mask. Once per Battle.",
            "id": "Masks_InstantReviveOnDeathOnAlmighty"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/brumaro_monoco_weapon_expedition_33_wiki_guide.png"
      },
      "Chromaro": {
        "name": "Chromaro",
        "element": "Ice",
        "power": 3390,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Start battle in Caster Mask.",
            "id": "Masks_StartCaster"
          },
          "lvl10": {
            "desc": "Caster Mask applies Regen for 3 turns.",
            "id": "Masks_RegenOnCaster"
          },
          "lvl20": {
            "desc": "Skills cost 1 less AP while in Caster Mask.",
            "id": "Masks_CasterAPCost-1"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/chromaro_monoco_weapon_expedition_33_wiki_guide.png"
      },
      "Reacharo_2": {
        "name": "Fragaro",
        "element": "Lightning",
        "power": 4197,
        "attributes": "DefenseA LuckS",
        "passives": {
          "lvl4": {
            "desc": "Free Aim shots spin the Bestial Wheel to a random value.",
            "id": "Masks_WheelSpinOnFreeAimShot"
          },
          "lvl10": {
            "desc": "Free Aim shots deal 100% more damage with all Masks except Almighty.",
            "id": "Masks_DMG+FreeAimIfNotAlmighty"
          },
          "lvl20": {
            "desc": "100% Critical Chance while in Almighty Mask.",
            "id": "Masks_AlwaysCritOnAlmighty"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/fragaro-monoco-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Grandaro": {
        "name": "Grandaro",
        "element": "Earth",
        "power": 3551,
        "attributes": "VitalityS DefenseA",
        "passives": {
          "lvl4": {
            "desc": "Start battle in Heavy Mask.",
            "id": "Masks_StartHeavy"
          },
          "lvl10": {
            "desc": "Heavy Mask applies Shell for 3 turns.",
            "id": "Masks_ShellOnHeavy"
          },
          "lvl20": {
            "desc": "+1 AP per hit taken.",
            "id": "Masks_GainAPOnDMGTakenOnHeavy"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/grandaro_monoco_weapon_expedition_33_wiki_guide.png"
      },
      "Joyaro": {
        "name": "Joyaro",
        "element": "Lightning",
        "power": 3713,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Start battle in Almighty Mask.",
            "id": "Masks_StartAlmighty"
          },
          "lvl10": {
            "desc": "20% increased damage for each consecutive turn without taking damage. Can stack up to 5 times.",
            "id": "DMG+WhenNoDMGTaken"
          },
          "lvl20": {
            "desc": "Break damage is doubled while in Almighty Mask.",
            "id": "Masks_DoubleBreakDMGOnAlmighty"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/joyaro_monoco_weapon_expedition_33_wiki_guide.png"
      },
      "Monocaro": {
        "name": "Monocaro",
        "element": "Physical",
        "power": 2744,
        "attributes": "AgilityS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Start battle in Balanced Mask.",
            "id": "Masks_StartBalanced"
          },
          "lvl10": {
            "desc": "Balanced Mask applies Powerful for 3 turns.",
            "id": "Masks_PowerfulOnBalanced"
          },
          "lvl20": {
            "desc": "Critical hits deal 30% more damage while in Balanced Mask.",
            "id": "Masks_CritDMG+OnBalanced"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/monocaro-monoco-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Reacharo_1": {
        "name": "Nusaro",
        "element": "Dark",
        "power": 4197,
        "attributes": "VitalityA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Parries increase the Bestial Wheel by 1. Taking damage resets the Bestial Wheel.",
            "id": "Masks_BestialMeter+OnParrybutResetOnDMG"
          },
          "lvl10": {
            "desc": "Upgraded Skills deal 30% more damage.",
            "id": "Masks_DMG+OverchargedSkills"
          },
          "lvl20": {
            "desc": "+1 AP on Mask change.",
            "id": "Masks_GainAPOnMaskChange"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/nusaro-monoco-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Sidaro": {
        "name": "Sidaro",
        "element": "Dark",
        "power": 3035,
        "attributes": "MightA LuckS",
        "passives": {
          "lvl4": {
            "desc": "30% increased damage per Upgraded Skill used. Resets upon using a non-Upgraded Skill.",
            "id": "Masks_DMG+BonusStackOnOverchargedSkillsChain"
          },
          "lvl10": {
            "desc": "Base Attack spins the Bestial Wheel to a random value.",
            "id": "Masks_WheelSpinOnAttack"
          },
          "lvl20": {
            "desc": "Using an Upgraded Skill gives 1 AP to all other allies.",
            "id": "Masks_Overcharge+APOnAllies"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/sidaro_monoco_weapon_expedition_33_wiki_guide.png"
      },
      "Sirenaro_2": {
        "name": "Urnaro",
        "element": "Earth",
        "power": 3422,
        "attributes": "VitalityS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Switch to Almighty Mask on Breaking an enemy.",
            "id": "Masks_SwitchToAlmightyOnBreak"
          },
          "lvl10": {
            "desc": "Almighty Mask gives 2 AP to all Allies.",
            "id": "Masks_GainAPAllAlliesOnAlmightySwitch"
          },
          "lvl20": {
            "desc": "50% increased Break damage.",
            "id": "BreakDMG+"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/urnaro-monoco-weapon-expedition-33-wiki-guide-min.png"
      },
      "DebugMonoco": {
        "name": "Baguette",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      },
      "GDC_Weapon_Monoco": {
        "name": "GDC_Weapon_Monoco**",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      }
    },
    "Sciel": {
      "Algueron": {
        "name": "Algueron",
        "element": "Ice",
        "power": 3228,
        "attributes": "VitalityS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Free Aim shots can consume 1 Foretell to deal 100% more damage.",
            "id": "Foretell_FreeAimShotsConsumeForDMG+"
          },
          "lvl10": {
            "desc": "Base Attack applies 3 Foretell.",
            "id": "Foretell_ApplyOnAttack"
          },
          "lvl20": {
            "desc": "During Twilight, Free Aim shots deal double damage.",
            "id": "Foretell_TwilightFreeAimDMG+"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/algueron_sciel_weapon_expedition_33_wiki_guide.png"
      },
      "Blizzon": {
        "name": "Blizzon",
        "element": "Ice",
        "power": 4197,
        "attributes": "LuckS",
        "passives": {
          "lvl4": {
            "desc": "While having at least 1 active Moon charge, Moon Skills are always Critical but damage taken is doubled.",
            "id": "Foretell_MoonSkillsAlwaysCritOnMoon"
          },
          "lvl10": {
            "desc": "25% increased damage per Moon charge.",
            "id": "Foretell_DMG+PerMoonCharge"
          },
          "lvl20": {
            "desc": "Base Attack gives 1 Moon charge.",
            "id": "Foretell_AttackGainMoonCharge"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/blizzon_sciel_weapon_expedition_33_wiki_guide.png"
      },
      "Bourgelon": {
        "name": "Bourgelon",
        "element": "Light",
        "power": 3099,
        "attributes": "VitalityA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Consuming Foretell applies 2 Burn on target per Sun Charge.",
            "id": "Foretell_AttackConsumeBurnToApplyForetell"
          },
          "lvl10": {
            "desc": "100% increased Burn damage in Twilight state.",
            "id": "Foretell_OnTwilightBurnDMG+"
          },
          "lvl20": {
            "desc": "Sun Skills give one more charge.",
            "id": "Foretell_SunSkillsCharge+"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/bourgelon_sciel_weapon_expedition_33_wiki_guide.png"
      },
      "Charnon": {
        "name": "Charnon",
        "element": "Void",
        "power": 2970,
        "attributes": "DefenseA LuckS",
        "passives": {
          "lvl4": {
            "desc": "100% Critical Chance during Twilight.",
            "id": "Foretell_ChangeTwilightAlwaysCrit"
          },
          "lvl10": {
            "desc": "Apply 1 Foretell on Critical hit.",
            "id": "Foretell_ApplyForetellOnCrit"
          },
          "lvl20": {
            "desc": "20% increased damage for each consecutive turn without taking damage. Can stack up to 5 times.",
            "id": "DMG+WhenNoDMGTaken"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/charnon_sciel_weapon_expedition_33_wiki_guide.png"
      },
      "Chation": {
        "name": "Chation",
        "element": "Dark",
        "power": 3551,
        "attributes": "VitalityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "Sun Skills always apply 10 Foretell, but all damage taken is doubled",
            "id": "Foretell_ApplyMaxForetellOnSunSkills"
          },
          "lvl10": {
            "desc": "Base Attack gives 1 Moon charge and consumes all Foretell to apply Burn.",
            "id": "Foretell_AttackConsumeToApplyBurnMoonCharge"
          },
          "lvl20": {
            "desc": "100% increased Burn damage in Twilight state.",
            "id": "Foretell_OnTwilightBurnDMG+"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/chation_sciel_weapon_expedition_33_wiki_guide.png"
      },
      "Corderon": {
        "name": "Corderon",
        "element": "Dark",
        "power": 2744,
        "attributes": "DefenseS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Curse self on battle start. Deal 50% more damage while Cursed.",
            "id": "Foretell_CurseSelfButDMG+"
          },
          "lvl10": {
            "desc": "Reset Curse duration when entering Twilight state.",
            "id": "Foretell_ResetCurseOnTwilight"
          },
          "lvl20": {
            "desc": "Play again when entering Twilight state.",
            "id": "Foretell_InstantReplayOnTwilight"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/corderon_sciel_weapon_expedition_33_wiki_guide.png"
      },
      "Direton": {
        "name": "Direton",
        "element": "Earth",
        "power": 4035,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "+1 AP per Moon charge on turn start.",
            "id": "Foretell_GainAPPerMoonChargeOnTurnStart"
          },
          "lvl10": {
            "desc": "Base Attack gives 1 Moon charge.",
            "id": "Foretell_AttackGainMoonCharge"
          },
          "lvl20": {
            "desc": "During Twilight, Base Attack consumes all AP. Base Attack applies 1 Foretell and deals 50% increased damage per AP consumed.",
            "id": "Foretell_BaseAttackConsumeAllAPOnTwilight"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/direton_sciel_weapon_expedition_33_wiki_guide.png"
      },
      "Garganon": {
        "name": "Garganon",
        "element": "Fire",
        "power": 3132,
        "attributes": "VitalityS DefenseA",
        "passives": {
          "lvl4": {
            "desc": "While having at least 1 active Sun charge, apply one Burn stack per hit taken.",
            "id": "Foretell_ApplyBurnOnHitTakenOnSun"
          },
          "lvl10": {
            "desc": "Counterattacks apply 1 Burn per active Sun charge.",
            "id": "Foretell_ApplyBurnPerSunChargeOnCounterAttack"
          },
          "lvl20": {
            "desc": "Base attack can consume 1 Sun charge to apply 5 Foretell.",
            "id": "Foretell_AttackConsumeSunCharge"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/garganon_sciel_weapon_expedition_33_wiki_guide.png"
      },
      "Gobluson": {
        "name": "Gobluson",
        "element": "Fire",
        "power": 3358,
        "attributes": "DefenseS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "During Twilight, every time Foretell is applied, it also affects another random enemy.",
            "id": "Foretell_PropagateForetellOnApplication"
          },
          "lvl10": {
            "desc": "Apply 1 Burn every 3 Foretell applied with Skills.",
            "id": "Foretell_ApplyBurnEveryXForetell"
          },
          "lvl20": {
            "desc": "20% increased Fire damage with Skills.",
            "id": "SkillsFireDMG+"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/gobluson_sciel_weapon_expedition_33_wiki_guide.png"
      },
      "Reacheron_1": {
        "name": "Guleson",
        "element": "Lightning",
        "power": 3132,
        "attributes": "AgilityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "On Twilight Start, apply Mark to all enemies.",
            "id": "Foretell_OnTwilightSwitchApplyMarkAOE"
          },
          "lvl10": {
            "desc": "Hitting a Marked enemy during Twilight doesn't remove Mark.",
            "id": "Foretell_DontRemoveMarkOnTwilight"
          },
          "lvl20": {
            "desc": "Apply 3 Foretell on applying Mark.",
            "id": "Foretell_ApplyForetellOnApplyMark"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/reacheron-sciel-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Hevason": {
        "name": "Hevasson",
        "element": "Physical",
        "power": 3454,
        "attributes": "VitalityS DefenseA",
        "passives": {
          "lvl4": {
            "desc": "Free Aim shots can consume a Sun charge to apply 5 Foretell and consume a Moon charge to deal 400% more damage.",
            "id": "Foretell_ConsumeChargesOnFreeAim"
          },
          "lvl10": {
            "desc": "Consuming a Sun or Moon charge gives 1 AP.",
            "id": "Foretell_GivesAPOnConsumingCharge"
          },
          "lvl20": {
            "desc": "Baser Attack gives 1 Moon charge.",
            "id": "Foretell_AttackGainMoonCharge"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/hevasson_sciel_weapon_expedition_33_wiki_guide.png"
      },
      "Reacheron_2": {
        "name": "Litheson",
        "element": "Physical",
        "power": 2809,
        "attributes": "AgilityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "During Moon, all allies have Greater Rush. During Sun, all enemies have Greater Slow.",
            "id": "Foretell_ApplyGreaterRushSlowOnSunMoon"
          },
          "lvl10": {
            "desc": "During Twilight, all allies have Greater Rush and all enemies have Greater Slow.",
            "id": "Foretell_ApplyGreaterRushSlowOnTwilight"
          },
          "lvl20": {
            "desc": "+3 AP on applying a Buff or Debuff. Once per turn.",
            "id": "GainAPOnApplyBuffsDebuffs"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/litheson-sciel-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Lusteson": {
        "name": "Lusteson",
        "element": "Dark",
        "power": 3422,
        "attributes": "VitalityS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "Killing an enemy with Foretell applies its Foretell to another random enemy.",
            "id": "Foretell_PropagationOnKill"
          },
          "lvl10": {
            "desc": "Apply Mark on consuming Foretell.",
            "id": "Foretell_MarkOnConsume"
          },
          "lvl20": {
            "desc": "20% increased Dark damage with Skills.",
            "id": "SkillsDarkDMG+"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/lusteson_sciel_weapon_expedition_33_wiki_guide.png"
      },
      "Sirenon_2": {
        "name": "Martenon",
        "element": "Earth",
        "power": 3874,
        "attributes": "VitalityS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "On Twilight Start, deal damage to all enemies based on the amount of charges.",
            "id": "Foretell_DealAOEDamagePerChargeOnTwilightSwitch"
          },
          "lvl10": {
            "desc": "On Twilight Start, apply 2 Foretell per charge to all enemies.",
            "id": "Foretell_ApplyForetellPerChargeOnTwilightSwitch"
          },
          "lvl20": {
            "desc": "Double Sun and Moon charge generation.",
            "id": "Foretell_DoubleChargeGain"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/martenon-sciel-weapon-expedition-33-wiki-guide.png"
      },
      "Minason": {
        "name": "Minason",
        "element": "Physical",
        "power": 2809,
        "attributes": "VitalityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "Sun skills have increased damage for each Foretell on the target. Moon Skills don't generate Moon charges anymore.",
            "id": "Foretell_SunSkillsDMG+PerForetell"
          },
          "lvl10": {
            "desc": "With at least 1 active Sun charge, gain one additional AP per Foretell consumed.",
            "id": "Foretell_SunAPIncrease"
          },
          "lvl20": {
            "desc": "Base attack can consume 1 Sun charge to apply 5 Foretell.",
            "id": "Foretell_AttackConsumeSunCharge"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/minason_sciel_weapon_expedition_33_wiki_guide.png"
      },
      "Contorson": {
        "name": "Moisson",
        "element": "Physical",
        "power": 3325,
        "attributes": "AgilityS LuckA",
        "passives": {
          "lvl4": {
            "desc": "During Twilight, all damage dealt is converted to Dark damage.",
            "id": "Foretell_DarkConversionOnTwilight"
          },
          "lvl10": {
            "desc": "20% increased Dark damage with Skills.",
            "id": "SkillsDarkDMG+"
          },
          "lvl20": {
            "desc": "Apply Shell during Moon, Powerful during Sun, and Rush during Twilight.",
            "id": "Foretell_BuffsOnStates"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/moisson-sciel-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Ramasson": {
        "name": "Ramasson",
        "element": "Physical",
        "power": 3519,
        "attributes": "VitalityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "Can consume 1 Moon charge on turn start to recover 20% of each ally's Health.",
            "id": "Foretell_HealOnTurnStartConsumeMoonCharge"
          },
          "lvl10": {
            "desc": "Base Attack gives 1 Moon charge.",
            "id": "Foretell_AttackGainMoonCharge"
          },
          "lvl20": {
            "desc": "Moon Skills give one more charge.",
            "id": "Foretell_MoonSkillsCharge+"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/ramasson_sciel_weapon_expedition_33_wiki_guide.png"
      },
      "Rangeson": {
        "name": "Rangeson",
        "element": "Dark",
        "power": 3132,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Recover 5% Health per Foretell applied.",
            "id": "Foretell_HealSelfOnConsume"
          },
          "lvl10": {
            "desc": "Healing Skills cost 1 less AP.",
            "id": "HealAPCost-"
          },
          "lvl20": {
            "desc": "30% increased Heal efficiency per Moon charge. Base Attack gives 1 Moon charge",
            "id": "Foretell_HealEfficiencyPerMoonCharge"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/rangeson_sciel_weapon_expedition_33_wiki_guide.png"
      },
      "Sadon": {
        "name": "Sadon",
        "element": "Light",
        "power": 2583,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "On turn start, gain 1 Shield if at least 1 Sun charge is active.",
            "id": "Foretell_ShieldOnTurnStartWhenSunCharge"
          },
          "lvl10": {
            "desc": "Apply 5 Foretell on enemies that break Shields.",
            "id": "Foretell_ApplyForetellOnShieldBreakPerSunCharge"
          },
          "lvl20": {
            "desc": "+2 Sun charges on Counterattack.",
            "id": "Foretell_GivesSunChargesOnCounterAttack"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/sadon_sciel_weapon_expedition_33_wiki_guide.png"
      },
      "Scieleson": {
        "name": "Scieleson",
        "element": "Physical",
        "power": 3454,
        "attributes": "AgilityS LuckA",
        "passives": {
          "lvl4": {
            "desc": "N/A",
            "id": null
          },
          "lvl10": {
            "desc": "N/A",
            "id": null
          },
          "lvl20": {
            "desc": "N/A",
            "id": null
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/scieleson_sciel_weapon_expedition_33_wiki_guide.png"
      },
      "Sirenon_1": {
        "name": "Tisseron",
        "element": "Lightning",
        "power": 3067,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Extend Twilight by one turn on using a Moon Skill. +50% Twilight damage increase on using a Sun Skill.",
            "id": "Foretell_ExtendOrIncreaseTwilight"
          },
          "lvl10": {
            "desc": "Twilight duration is increased by l.",
            "id": "Foretell_ExtendTwilight"
          },
          "lvl20": {
            "desc": "Play again when entering Twilight state.",
            "id": "Foretell_InstantReplayOnTwilight"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/tisseron-sciel-weapon-expedition-33-wiki-guide-130px.png"
      },
      "DebugSciel": {
        "name": "Baguette",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      },
      "GDC_Weapon_Sciel": {
        "name": "GDC_Weapon_Sciel**",
        "element": "Unknown",
        "power": 0,
        "attributes": "",
        "passives": {
          "lvl4": "",
          "lvl10": "",
          "lvl20": ""
        },
        "image": ""
      }
    },
    "Verso": {
      "Abysseram": {
        "name": "Abysseram",
        "element": "Physical",
        "power": 3228,
        "attributes": "VitalityS DefenseA",
        "passives": {
          "lvl4": {
            "desc": "50% increased damage on Rank D. No damage increase on other ranks.",
            "id": "Perfection_IncreasedDamageOnRankD"
          },
          "lvl10": {
            "desc": "50% increased Base Attack damage.",
            "id": "AugmentedAttack"
          },
          "lvl20": {
            "desc": "On Rank D, recover 20% Health with Base Attack.",
            "id": "Perfection_AttackLifestealOnD"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/abysseram-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Blodam": {
        "name": "Blodam",
        "element": "Light",
        "power": 3487,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Perfection is now based on current Health. Gain 1 Rank every 20% missing Health.",
            "id": "Perfection_PerfectionBaseOnCurrentHP"
          },
          "lvl10": {
            "desc": "20% increased Light damage with Skills.",
            "id": "SkillsLightDMG+"
          },
          "lvl20": {
            "desc": "+1 AP on Rank Up.",
            "id": "Perfection_GainAPOnRankUp"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/blodam-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Chevalam": {
        "name": "Chevalam",
        "element": "Physical",
        "power": 3067,
        "attributes": "AgilityS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Start battle at Rank S, but can't be Healed or gain Shields.",
            "id": "Perfection_StartRankSButNoHeal"
          },
          "lvl10": {
            "desc": "20% increased damage for each consecutive turn without taking damage. Can stack up to 5 times.",
            "id": "DMG+WhenNoDMGTaken"
          },
          "lvl20": {
            "desc": "Apply Rush on Rank S.",
            "id": "Perfection_RushOnS"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/chevalam-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Confuso": {
        "name": "Confuso",
        "element": "Light",
        "power": 3067,
        "attributes": "AgilityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "Light damage can Burn on Critical hits.",
            "id": "LightDMGBurnOnCrit"
          },
          "lvl10": {
            "desc": "Apply 3 Burn instead of Mark.",
            "id": "MarkIsBurn"
          },
          "lvl20": {
            "desc": "Increase Burn damage by 50% per Rank, up to 300% on Rank S.",
            "id": "Perfection_BurnDamagePerRank"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/confuso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Moissoso": {
        "name": "Contorso",
        "element": "Lightning",
        "power": 2841,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Switch to Rank S on Break. Base Attack can Break.",
            "id": "Perfection_SwitchRankSOnBreak"
          },
          "lvl10": {
            "desc": "100% Critical Chance on Rank S.",
            "id": "Perfection_AlwaysCritOnRankS"
          },
          "lvl20": {
            "desc": "Triggers a lightning strike on Critical hits.",
            "id": "TriggerLightningOnCrit"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/contorso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Corpeso": {
        "name": "Corpeso",
        "element": "Fire",
        "power": 3648,
        "attributes": "VitalityA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Base Attack applies 2 Burn stack per Rank.",
            "id": "Perfection_BurnOnBaseAtkPerRank"
          },
          "lvl10": {
            "desc": "+1 AP on Rank Up.",
            "id": "Perfection_GainAPOnRankUp"
          },
          "lvl20": {
            "desc": "Increase Burn damage by 50% per Rank, up to 300% on Rank S.",
            "id": "Perfection_BurnDamagePerRank"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/corpeso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Cruleram": {
        "name": "Cruleram",
        "element": "Ice",
        "power": 3454,
        "attributes": "DefenseS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Don't lose Rank when taking damage from Powerless enemies.",
            "id": "Perfection_NoPerfectionLossOnPowerlessEnemy"
          },
          "lvl10": {
            "desc": "+1 Perfection on hitting a Powerless enemy.",
            "id": "Perfection_Perfection+1OnPowerlessEnemy"
          },
          "lvl20": {
            "desc": "Apply Powerless on Counterattack.",
            "id": "PowerlessOnCounter"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/cruleram-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Cultam": {
        "name": "Cultam",
        "element": "Dark",
        "power": 3132,
        "attributes": "DefenseS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "No Perfection loss on damage taken. Perfection is instead lost on being Healed.",
            "id": "Perfection_PerfectionLostOnHeal"
          },
          "lvl10": {
            "desc": "Gain 2 AP on Counterattack.",
            "id": "APOnCounter"
          },
          "lvl20": {
            "desc": "Gain 1 Rank on Counterattack.",
            "id": "Perfection_RankUpOnCounter"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/cultam-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Danseso": {
        "name": "Danseso",
        "element": "Fire",
        "power": 2970,
        "attributes": "AgilityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "Base attack gives 1 Perfection per Burn on target.",
            "id": "Perfection_DoublePerfectionVSBurn"
          },
          "lvl10": {
            "desc": "While Powerful, 20% chance to Burn on hit.",
            "id": "PowerfulBurn"
          },
          "lvl20": {
            "desc": "+1 AP on Rank Up.",
            "id": "Perfection_GainAPOnRankUp"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/daneso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Delaram": {
        "name": "Delaram",
        "element": "Light",
        "power": 3390,
        "attributes": "VitalityA LuckS",
        "passives": {
          "lvl4": {
            "desc": "Start battle on Rank B, but 50% Health.",
            "id": "Perfection_StartRankBButLessHP"
          },
          "lvl10": {
            "desc": "Recover 15% Health on Base Attack.",
            "id": "AttackLifesteal"
          },
          "lvl20": {
            "desc": "Apply Powerful on Rank B.",
            "id": "Perfection_PowerfulOnB"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/delaram-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Demonam": {
        "name": "Demonam",
        "element": "Light",
        "power": 2809,
        "attributes": "DefenseA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Casting a Light Skill increases damage of next Physical Skill cast by 50% and vice versa.",
            "id": "DMG+OnAlternatingPhysicalLight"
          },
          "lvl10": {
            "desc": "20% increased Physical damage with Skills.",
            "id": "SkillsPhysicalDMG+"
          },
          "lvl20": {
            "desc": "Dealing Light damage with a Skill recovers 3% Health.",
            "id": "LightSkillsRegenHP"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/demonam-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Sireso_2": {
        "name": "Dreameso",
        "element": "Physical",
        "power": 3067,
        "attributes": "AgilityS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Gain 1 Rank on Counterattack",
            "id": "Perfection_RankUpOnCounter"
          },
          "lvl10": {
            "desc": "50% increased Counterattack damage.",
            "id": "AugmentedCounter"
          },
          "lvl20": {
            "desc": "Gain 2 AP on Counterattack.",
            "id": "APOnCounter"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/dreameso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Chaliso": {
        "name": "Dualiso",
        "element": "Lightning",
        "power": 1776,
        "attributes": "VitalityA DefenseS",
        "passives": {
          "lvl4": {
            "desc": "Play again after a Base Attack.",
            "id": "AttackPlayAgain"
          },
          "lvl10": {
            "desc": "50% increased Base Attack damage.",
            "id": "AugmentedAttack"
          },
          "lvl20": {
            "desc": "Base Attack gives 4 Perfection.",
            "id": "Perfection_Attackx2"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/dualiso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Gaulteram": {
        "name": "Gaulteram",
        "element": "Earth",
        "power": 3261,
        "attributes": "AgilityS LuckA",
        "passives": {
          "lvl4": {
            "desc": "When hit, lose 1 Perfection instead of 1 rank.",
            "id": "Perfection_RankLossOneByOne"
          },
          "lvl10": {
            "desc": "Apply Rush on Rank S",
            "id": "Perfection_RushOnS"
          },
          "lvl20": {
            "desc": "Gain 2 Perfection on turn start.",
            "id": "Perfection_OnTurnStart"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/gaulteram-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Gesam": {
        "name": "Gesam",
        "element": "Physical",
        "power": 3228,
        "attributes": "Attribute 1A Attribute 2S",
        "passives": {
          "lvl4": {
            "desc": "Convert Light damage Skills to Physical damage.",
            "id": "SkillsLightToPhysical"
          },
          "lvl10": {
            "desc": "20% increased Physical damage with Skills.",
            "id": "SkillsPhysicalDMG+"
          },
          "lvl20": {
            "desc": "-1 AP cost for Physical Skills.",
            "id": "PhysicalAPCost-"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/gesam-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Glaceso": {
        "name": "Glaceso",
        "element": "Ice",
        "power": 2873,
        "attributes": "DefenseA LuckS",
        "passives": {
          "lvl4": {
            "desc": "+1 Perfection on Critical hit.",
            "id": "Perfection_Perfection+1OnCrit"
          },
          "lvl10": {
            "desc": "Self-Heal by 2% Health on dealing a Critical hit.",
            "id": "HealOnCrit"
          },
          "lvl20": {
            "desc": "Countemttack is always a Critical hit.",
            "id": "AlwaysCritOnCounterDamage"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/glaceso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Lanceram": {
        "name": "Lanceram",
        "element": "Physical",
        "power": 3713,
        "attributes": "VitalityS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "Rank can't be lower than C.",
            "id": "Perfection_MinC"
          },
          "lvl10": {
            "desc": "Base Attack gives 4 Perfection.",
            "id": "Perfection_Attackx2"
          },
          "lvl20": {
            "desc": "Parrying gives 2 Perfection instead of 1.",
            "id": "Perfection_Parryx2"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/lanceram-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Reacheso_2": {
        "name": "Liteso",
        "element": "Physical",
        "power": 3551,
        "attributes": "DefenseS AgilityA",
        "passives": {
          "lvl4": {
            "desc": "Base Attack consumes all Shields to deal 100% increased damage per Shield.",
            "id": "AttackConsumeShieldForExtraDMG"
          },
          "lvl10": {
            "desc": "+1 Shield on Counterattack.",
            "id": "CounterShield"
          },
          "lvl20": {
            "desc": "Base Attack gives 4 Perfection.",
            "id": "Perfection_Attackx2"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/liteso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Noahram": {
        "name": "Noahram",
        "element": "Physical",
        "power": 2260,
        "attributes": "VitalityS",
        "passives": {
          "lvl4": {
            "desc": "N/A",
            "id": null
          },
          "lvl10": {
            "desc": "N/A",
            "id": null
          },
          "lvl20": {
            "desc": "N/A",
            "id": null
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/noahram-verleso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Nosaram": {
        "name": "Nosaram",
        "element": "Physical",
        "power": 3551,
        "attributes": "AgilityS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Double Perfection gained on Free Aim shots.",
            "id": "Perfection_DoubleOnFreeAimShots"
          },
          "lvl10": {
            "desc": "Free Aim shots break 2 Shields.",
            "id": "FreeAimBreaksMoreShields"
          },
          "lvl20": {
            "desc": "50% increased Free Aim damage.",
            "id": "AugmentedAim"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/nosaram-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Sakaram": {
        "name": "Sakaram",
        "element": "Physical",
        "power": 2938,
        "attributes": "AgilityS LuckA",
        "passives": {
          "lvl4": {
            "desc": "Can't lose Perfection. No damage increase from Rank.",
            "id": "Perfection_NoPerfectionLossButNoDamageIncrease"
          },
          "lvl10": {
            "desc": "50% increased Base Attack damage.",
            "id": "AugmentedAttack"
          },
          "lvl20": {
            "desc": "Base Attack gives 4 Perfection.",
            "id": "Perfection_Attackx2"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/sakaram-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Seeram": {
        "name": "Seeram",
        "element": "Light",
        "power": 3713,
        "attributes": "VitalityC AgilityB",
        "passives": {
          "lvl4": {
            "desc": "-1 to all Perfection gain but can't reach Rank S.",
            "id": "Perfection_Perfection+butDMG+"
          },
          "lvl10": {
            "desc": "Base Attack gives 4 Perfection.",
            "id": "Perfection_Attackx2"
          },
          "lvl20": {
            "desc": "20% increased Light damage with Skills.",
            "id": "SkillsLightDMG+"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/seeram-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Simoso": {
        "name": "Simoso",
        "element": "Light",
        "power": 3228,
        "attributes": "VitalityA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "An ethereal Sword deals Light damage on any damage dealt with Skills.",
            "id": "DoubleHit"
          },
          "lvl10": {
            "desc": "20% chance to apply Burn on dealing Light damage.",
            "id": "LightDamageBurn"
          },
          "lvl20": {
            "desc": "Can't die if at least Rank A.",
            "id": "Perfection_SurvivorRankA"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/simoso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Sireso_1": {
        "name": "Sireso",
        "element": "Physical",
        "power": 2583,
        "attributes": "VitalityA AgilityS",
        "passives": {
          "lvl4": {
            "desc": "Bonus damage from Perfection applies to all allies at half value. Bonus damage no longer applies to Verso.",
            "id": "Perfection_PerfectionBonusDamageShare"
          },
          "lvl10": {
            "desc": "Perfection gained is increased by 1 while Powerful",
            "id": "Perfection_Perfection+1OnPowerful"
          },
          "lvl20": {
            "desc": "Support Skills cost 1 less AP.",
            "id": "SupportSkillsCostReduced"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/sireso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Reacheso_1": {
        "name": "Tireso",
        "element": "Earth",
        "power": 3713,
        "attributes": "VitalityS DefenseA",
        "passives": {
          "lvl4": {
            "desc": "Gain 1 Rank on applying Mark.",
            "id": "Perfection_RankUpOnMark"
          },
          "lvl10": {
            "desc": "Mark an enemy on Base Attack.",
            "id": "MarkOnBaseAttack"
          },
          "lvl20": {
            "desc": "Apply Powerless on Marking an enemy.",
            "id": "PowerlessOnMarking"
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/tireso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      },
      "Verleso": {
        "name": "Verleso",
        "element": "Physical",
        "power": 3454,
        "attributes": "VitalityS",
        "passives": {
          "lvl4": {
            "desc": "N/A",
            "id": null
          },
          "lvl10": {
            "desc": "N/A",
            "id": null
          },
          "lvl20": {
            "desc": "N/A",
            "id": null
          }
        },
        "image": "https://expedition33.wiki.fextralife.com/file/Expedition-33/noahram-verleso-verso-gustave-weapon-expedition-33-wiki-guide-130px.png"
      }
    }
  }
}"#;
    Ok(json.to_string())
}
