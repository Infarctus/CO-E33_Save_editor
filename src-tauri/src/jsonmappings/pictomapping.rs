#[tauri::command]
pub fn getpictomapping() -> Result<String, String> { 
    let json = r#"{
  "AcceleratorHeal": {
    "name": "Accelerating Heal",
    "effect": "Healing an ally also applies Rush for 1 turn.",
    "type": "Support",
    "stats": "Health +329 Speed +65",
    "cost": 5
  },
  "LastStandSpeed": {
    "name": "Accelerating Last Stand",
    "effect": "Gain Rush if fighting alone.",
    "type": "Support",
    "stats": "Health +168 Speed  +34",
    "cost": 3
  },
  "FreeAimSpeed": {
    "name": "Accelerating Shots",
    "effect": "20% chance to gain Rush on Free Aim shot.",
    "type": "Support",
    "stats": "Health  Defense",
    "cost": 3
  },
  "SpeedTint": {
    "name": "Accelerating Tint",
    "effect": "Healing Tints also apply Rush.",
    "type": "Support",
    "stats": "Health  Speed",
    "cost": 5
  },
  "AegisRevival": {
    "name": "Aegis Revival",
    "effect": "+1 Shield on being revived.",
    "type": "Defensive",
    "stats": "Defense  Speed",
    "cost": 5
  },
  "AntiBlight": {
    "name": "Anti-Blight",
    "effect": "Immune to Blight.",
    "type": "Defensive",
    "stats": "Health  Defense",
    "cost": 10
  },
  "AntiBurn": {
    "name": "Anti-Burn",
    "effect": "Immune to Burn.",
    "type": "Defensive",
    "stats": "Health  Defense",
    "cost": 15
  },
  "AntiCharm": {
    "name": "Anti-Charm",
    "effect": "Immune to Charm",
    "type": "Defensive",
    "stats": "Health +599 Defense +240",
    "cost": 10
  },
  "AntiFrozen": {
    "name": "Anti-Freeze",
    "effect": "Immune to Freeze.",
    "type": "Defensive",
    "stats": "Health  Defense",
    "cost": 15
  },
  "AntiStun": {
    "name": "Anti-Stun",
    "effect": "Immune to Stun",
    "type": "Defensive",
    "stats": "Health  Defense",
    "cost": 5
  },
  "LastStand": {
    "name": "At Death's Door",
    "effect": "Deal 50% more damage if Health is below 10%.",
    "type": "Offensive",
    "stats": "Defense +96 Critical Rate +11%",
    "cost": 5
  },
  "AttackLifesteal": {
    "name": "Attack Lifesteal",
    "effect": "Recover 15% Health on Base Attack.",
    "type": "Defensive",
    "stats": "Health +44 Speed +32",
    "cost": 15
  },
  "AugmentedAim": {
    "name": "Augmented Aim",
    "effect": "50% increased Free Aim damage.",
    "type": "Offensive",
    "stats": "Speed +39 Critical Rate +5%",
    "cost": 3
  },
  "AugmentedAttack": {
    "name": "Augmented Attack",
    "effect": "50% increased Base Attack damage.",
    "type": "Offensive",
    "stats": "Defense +8 Speed +10",
    "cost": 7
  },
  "CounterUpdragdeA": {
    "name": "Augmented Counter I",
    "effect": "25% increased Counterattack damage.",
    "type": "Offensive",
    "stats": "Health +90 Critical Rate +4%",
    "cost": 3
  },
  "CounterUpdragdeB": {
    "name": "Augmented Counter II",
    "effect": "50% increased Counterattack damage.",
    "type": "Offensive",
    "stats": "Defense +208 Critical Rate +15%",
    "cost": 5
  },
  "CounterUpdragdeC": {
    "name": "Augmented Counter III",
    "effect": "75% increased Counterattack damage.",
    "type": "Offensive",
    "stats": "Defense  Critical Rate",
    "cost": 7
  },
  "Augmented1stStrike": {
    "name": "Augmented First Strike",
    "effect": "50% increased damage on the first hit. Once per battle.",
    "type": "Offensive",
    "stats": "Speed +51 Critical Rate +5%",
    "cost": 5
  },
  "AutoDeath": {
    "name": "Auto Death",
    "effect": "Kill self on battle start",
    "type": "Support",
    "stats": "Critical Rate +26%",
    "cost": 1
  },
  "AutoPowerful": {
    "name": "Auto Powerful",
    "effect": "Apply Powerful for 3 turns on battle start.",
    "type": "Support",
    "stats": "Speed  Critical Rate",
    "cost": 10
  },
  "AutoRegen": {
    "name": "Auto Regen",
    "effect": "Apply Regen for 3 turns on battle start.",
    "type": "Defensive",
    "stats": "Defense +479 Critical Rate",
    "cost": 10
  },
  "AutoRush": {
    "name": "Auto Rush",
    "effect": "Apply Rush for 3 turns on battle start.",
    "type": "Offensive",
    "stats": "Speed +112 Critical Rate +7%",
    "cost": 10
  },
  "AutoShell": {
    "name": "Auto Shell",
    "effect": "Apply Shell for 3 turns on battle start.",
    "type": "Defensive",
    "stats": "Health +411",
    "cost": 10
  },
  "BaseShield": {
    "name": "Base Shield",
    "effect": "+1 Shield if not affected by any Shield on turn start.",
    "type": "Defensive",
    "stats": "Speed  Critical Rate",
    "cost": 20
  },
  "BeneficialContamination": {
    "name": "Beneficial Contamination",
    "effect": "+2 AP on applying a Status Effect. Once per turn.",
    "type": "Support",
    "stats": "Defense  Speed",
    "cost": 15
  },
  "BreakSpecialist": {
    "name": "Break Specialist",
    "effect": "Break damage is increased by 50%, but base damage is reduced by 20%.",
    "type": "Support",
    "stats": "Health  Speed",
    "cost": 1
  },
  "Breaker": {
    "name": "Breaker",
    "effect": "25% increased Break damage.",
    "type": "Offensive",
    "stats": "Speed +26 Critical Rate +9%",
    "cost": 10
  },
  "BreakingAttack": {
    "name": "Breaking Attack",
    "effect": "Base Attack can Break.",
    "type": "Offensive",
    "stats": "Speed  Critical Rate",
    "cost": 10
  },
  "BreakDamageOnBurn": {
    "name": "Breaking Burn",
    "effect": "25% increased Break damage on Burning enemies.",
    "type": "Offensive",
    "stats": "Speed +243 Critical Rate +9%",
    "cost": 5
  },
  "BreakingCounter": {
    "name": "Breaking Counter",
    "effect": "50% increased Break damage on Counterattack.",
    "type": "Offensive",
    "stats": "Speed +43 Critical Rate +10%",
    "cost": 3
  },
  "BreakingDeath": {
    "name": "Breaking Death",
    "effect": "Fully charge enemy's Break Bar on death.",
    "type": "Support",
    "stats": "Speed +586 Critical Rate +33%",
    "cost": 5
  },
  "BreakShot": {
    "name": "Breaking Shots",
    "effect": "50% increased Break damage with Free Aim Shots.",
    "type": "Offensive",
    "stats": "Speed +43 Critical Rate +10%",
    "cost": 1
  },
  "BreakDamageOnSlow": {
    "name": "Breaking Slow",
    "effect": "25% increased Break damage against Slowed enemies",
    "type": "Offensive",
    "stats": "Speed  Critical Rate",
    "cost": 5
  },
  "BurnAffinity": {
    "name": "Burn Affinity",
    "effect": "25% increased damage on Burning Targets.",
    "type": "Offensive",
    "stats": "Speed  Critical Rate",
    "cost": 10
  },
  "BurningBreak": {
    "name": "Burning Break",
    "effect": "Apply 3 Burn stacks on Breaking a target.",
    "type": "Support",
    "stats": "Health  Critical Rate",
    "cost": 3
  },
  "BurningDeath": {
    "name": "Burning Death",
    "effect": "Apply 3 Burn to all enemies on Death.",
    "type": "Support",
    "stats": "Speed +308 Critical Rate +24%",
    "cost": 5
  },
  "BurningMark": {
    "name": "Burning Mark",
    "effect": "Apply Burn on hitting a Marked enemy.",
    "type": "Support",
    "stats": "Health +44 Defense +32",
    "cost": 15
  },
  "FreeAimBurnShot": {
    "name": "Burning Shots",
    "effect": "20% chance to Burn on Free Aim shot.",
    "type": "Support",
    "stats": "Speed +15 Critical Rate +2%",
    "cost": 3
  },
  "GradientOnBuff": {
    "name": "Charging Alteration",
    "effect": "+10% of a Gradient Charge on applying a Buff. Once per turn.",
    "type": "Support",
    "stats": "Defense  Speed",
    "cost": 10
  },
  "GradientStacker": {
    "name": "Charging Attack",
    "effect": "+15% of a Gradient Charge on Base Attack.",
    "type": "Support",
    "stats": "Speed  Critical Rate",
    "cost": 7
  },
  "GradientOnBurn": {
    "name": "Charging Burn",
    "effect": "+20% of Gradient Charge on applying Burn. Once per turn.",
    "type": "Support",
    "stats": "Health  Speed",
    "cost": 10
  },
  "GradientCounterCharge": {
    "name": "Charging Counter",
    "effect": "+10% of a Gradient Charge on Counterattack.",
    "type": "Support",
    "stats": "Health  Defense",
    "cost": 10
  },
  "GradientOnCrit": {
    "name": "Charging Critical",
    "effect": "+20% of a Gradient Charge on Critical Hit. Once per turn.",
    "type": "Support",
    "stats": "Defense +1891 Critical Rate +35%",
    "cost": 10
  },
  "GradientMark": {
    "name": "Charging Mark",
    "effect": "+20% of a Gradient Charge on hitting a Marked target. Once per turn.",
    "type": "Support",
    "stats": "Speed  Critical Rate",
    "cost": 10
  },
  "GradientOnStun": {
    "name": "Charging Stun",
    "effect": "+5% of a Gradient Charge on hitting a Stunned enemy.",
    "type": "Support",
    "stats": "Health  Speed",
    "cost": 5
  },
  "GradientTint": {
    "name": "Charging Tint",
    "effect": "+5% of a Gradient Charge on using an item.",
    "type": "Support",
    "stats": "Health +329 Defense +112",
    "cost": 2
  },
  "GradientWeakness": {
    "name": "Charging Weakness",
    "effect": "+15% of a Gradient Charge on hitting a Weakness. Once per turn.",
    "type": "Support",
    "stats": "Speed  Critical Rate",
    "cost": 5
  },
  "Cheater": {
    "name": "Cheater",
    "effect": "Always play twice in a row.",
    "type": "Support",
    "stats": "Health +1198 Speed +400",
    "cost": 40
  },
  "CleasLife": {
    "name": "Clea's Life",
    "effect": "On turn start, if no damage taken since last turn, recover 100% Health.",
    "type": "Defensive",
    "stats": "Health",
    "cost": 30
  },
  "CleansingTint": {
    "name": "Cleansing Tint",
    "effect": "Healing Tints also remove all Status Effects from the target.",
    "type": "Support",
    "stats": "Health +35 Defense +6",
    "cost": 5
  },
  "ComboAttack1": {
    "name": "Combo Attack I",
    "effect": "Base Attack has 1 extra hit.",
    "type": "Offensive",
    "stats": "Speed +93 Crit Rate +6%",
    "cost": 10
  },
  "ComboAttack2": {
    "name": "Combo Attack II",
    "effect": "Base Attack has 1 extra hit.",
    "type": "Offensive",
    "stats": "Speed +836 Critical Rate +16%",
    "cost": 20
  },
  "ComboAttack3": {
    "name": "Combo Attack III",
    "effect": "Base Attack has 1 extra hit.",
    "type": "Offensive",
    "stats": "Speed +619 Critical Rate +14%",
    "cost": 30
  },
  "Confident": {
    "name": "Confident",
    "effect": "Take 50% less damage, but can't be Healed.",
    "type": "Defensive",
    "stats": "Speed +41 Crit Rate +10%",
    "cost": 20
  },
  "ConfidentFighter": {
    "name": "Confident Fighter",
    "effect": "30% increased damage, but can't be Healed.",
    "type": "Offensive",
    "stats": "Health  +222 Crit Rate +20%",
    "cost": 15
  },
  "BreakDamageOnCrit": {
    "name": "Critical Break",
    "effect": "25% increased Break damage on Critical Hits.",
    "type": "Offensive",
    "stats": "Speed +203 Crit Rate +8%",
    "cost": 5
  },
  "CritChanceBurn": {
    "name": "Critical Burn",
    "effect": "25% increased Critical Chance on Burning enemies.",
    "type": "Offensive",
    "stats": "Speed +8 Critical Rate +6%",
    "cost": 5
  },
  "CriticalMoment": {
    "name": "Critical Moment",
    "effect": "50% increased Critical Chance if Health is below 30%.",
    "type": "Offensive",
    "stats": "Speed +26 Critical Rate +9%",
    "cost": 5
  },
  "CriticalBreak": {
    "name": "Critical Stun",
    "effect": "100% Critical Chance on hitting a Stunned target.",
    "type": "Offensive",
    "stats": "Defense  Critical Rate",
    "cost": 5
  },
  "CritChanceOnDefenseless": {
    "name": "Critical Vulnerability",
    "effect": "25% increased Critical Chance on Defenceless enemies.",
    "type": "Offensive",
    "stats": "Defense +116 Speed +62",
    "cost": 5
  },
  "CritChanceOnWeak": {
    "name": "Critical Weakness",
    "effect": "25% increased Critical Chance on Weakness",
    "type": "Offensive",
    "stats": "Speed +670 Crit Rate +14%",
    "cost": 5
  },
  "DeadEnergy": {
    "name": "Dead Energy I",
    "effect": "+3 AP on killing an enemy.",
    "type": "Support",
    "stats": "Speed +162 Crit Rate +17%",
    "cost": 2
  },
  "BootyHunter": {
    "name": "Dead Energy II",
    "effect": "+3 AP on killing an enemy.",
    "type": "Support",
    "stats": "Speed +4 Critical Rate +9%",
    "cost": 2
  },
  "DeathBombPhysical": {
    "name": "Death Bomb",
    "effect": "On Death, deal damage to all enemies.",
    "type": "Offensive",
    "stats": "Speed +43 Crit Rate +10%",
    "cost": 5
  },
  "DefensiveMode": {
    "name": "Defensive Mode",
    "effect": "On receiving damage, consume 1 AP to take 30% less damage, if possible.",
    "type": "Defensive",
    "stats": "Health +216 Defense +71",
    "cost": 1
  },
  "Dodger": {
    "name": "Dodger",
    "effect": "Gain 1 AP on Perfect Dodge. Once per turn.",
    "type": "Support",
    "stats": "Speed +12 Critical Rate +3%",
    "cost": 1
  },
  "DoubleBurn": {
    "name": "Double Burn",
    "effect": "On applying a Burn stack, apply a second one.",
    "type": "Offensive/Support",
    "stats": "Speed +132 Crit Rate +7%",
    "cost": 30
  },
  "DoubleMark": {
    "name": "Double Mark",
    "effect": "Mark requires 1 more hit to be removed.",
    "type": "Support",
    "stats": "Speed +236",
    "cost": 20
  },
  "DispelOnAPConsume": {
    "name": "Draining Cleanse",
    "effect": "Consume 1 AP to prevent Status Effects application, if possible.",
    "type": "Support",
    "stats": "Health +2,000 Defense +324",
    "cost": 15
  },
  "EffectiveHeal": {
    "name": "Effective Heal",
    "effect": "Double all Heals received.",
    "type": "Defensive",
    "stats": "Health +284 Defense +341",
    "cost": 30
  },
  "EffectivSupport": {
    "name": "Effective Support",
    "effect": "+2 AP on using an item.",
    "type": "Support",
    "stats": "Health  Speed",
    "cost": 5
  },
  "PowerfulStrike": {
    "name": "Empowering Attack",
    "effect": "Gain Powerful for 1 turn on Base Attack.",
    "type": "Offensive",
    "stats": "Speed +12 Critical Rate +3%",
    "cost": 10
  },
  "BreakingStrong": {
    "name": "Empowering Break",
    "effect": "Gain Powerful on Breaking a target.",
    "type": "Offensive",
    "stats": "Speed +546 Critical Rate +32%",
    "cost": 3
  },
  "PowerDodgeCombo": {
    "name": "Empowering Dodge",
    "effect": "5% increased damage for each consecutive successful Dodge. Can stack up to 10 times.",
    "type": "Offensive",
    "stats": "Speed +162 Critical Rate +17%",
    "cost": 5
  },
  "LastStandPowerful": {
    "name": "Empowering Last Stand",
    "effect": "Gain Powerful if fighting alone.",
    "type": "Offensive",
    "stats": "Health  +168 Critical Rate +10%",
    "cost": 3
  },
  "ReinforcementParade": {
    "name": "Empowering Parry",
    "effect": "Each successful Parry increases damage by 5% until end of the following turn. Taking any damage removes this buff.",
    "type": "Offensive",
    "stats": "Speed +162 Critical Rate +17%",
    "cost": 5
  },
  "PowerfulTint": {
    "name": "Empowering Tint",
    "effect": "Healing Tints also apply Powerful.",
    "type": "Offensive",
    "stats": "Health +270 Speed +54",
    "cost": 5
  },
  "VersatileHealer": {
    "name": "Energetic Healer",
    "effect": "+2 AP on Healing an ally. Once per turn.",
    "type": "Support",
    "stats": "Defense  Speed",
    "cost": 10
  },
  "AP+1Attack": {
    "name": "Energising Attack I",
    "effect": "+1 AP on Base Attack.",
    "type": "Support",
    "stats": "Speed +62 Crit Rate +5%",
    "cost": 10
  },
  "Energy": {
    "name": "Energising Attack II",
    "effect": "+1 AP on Base Attack.",
    "type": "Support",
    "stats": "Defense +120 Speed +177",
    "cost": 15
  },
  "EnergyBreak": {
    "name": "Energising Break",
    "effect": "+3 AP on Breaking a target.",
    "type": "Support",
    "stats": "Speed +14 Critical Rate +7%",
    "cost": 3
  },
  "APOnBurn": {
    "name": "Energising Burn",
    "effect": "+1 AP on applying Burn. Once per turn.",
    "type": "Support",
    "stats": "Defense +401 Speed +321",
    "cost": 10
  },
  "AutoDispelEnergy": {
    "name": "Energising Cleanse",
    "effect": "Dispel the first negative Status Effect received and gain 2 AP.",
    "type": "Support",
    "stats": "Health  +1,166 Defense +160",
    "cost": 10
  },
  "EnergyDeath": {
    "name": "Energising Death",
    "effect": "On death, +4 AP to allies.",
    "type": "Support",
    "stats": "Defense +96 Speed +54",
    "cost": 5
  },
  "GradientEnergy": {
    "name": "Energising Gradient",
    "effect": "+1 AP per Gradient Charge consumed.",
    "type": "Support",
    "stats": "Speed +293 Crit Rate +10%",
    "cost": 10
  },
  "EnergizingHeal": {
    "name": "Energising Heal",
    "effect": "On Healing an ally, also give 2 AP.",
    "type": "Support",
    "stats": "Health +206 Speed +41",
    "cost": 10
  },
  "JumpRecovery": {
    "name": "Energising Jump",
    "effect": "+1 AP on Jump Counterattack.",
    "type": "Support",
    "stats": "Health +44 Speed +29",
    "cost": 5
  },
  "PowerOfPain": {
    "name": "Energising Pain",
    "effect": "No longer gain AP on Parry. +1 AP on getting hit.",
    "type": "Support",
    "stats": "Health +308 Defense +34",
    "cost": 10
  },
  "AP+1Parry": {
    "name": "Energising Parry",
    "effect": "+1 AP on successful Parry.",
    "type": "Support",
    "stats": "Health +626",
    "cost": 15
  },
  "APOnPowerful": {
    "name": "Energising Powerful",
    "effect": "Give 2 AP on applying Powerful.",
    "type": "Support",
    "stats": "Defense +373 Speed +173",
    "cost": 10
  },
  "ReviveCheer": {
    "name": "Energising Revive",
    "effect": "+3 AP to all allies when revived.",
    "type": "Support",
    "stats": "Health +270 Defense +96",
    "cost": 5
  },
  "APOnRush": {
    "name": "Energising Rush",
    "effect": "Give 2 AP on applying Rush.",
    "type": "Support",
    "stats": "Defense +801 Speed +321",
    "cost": 10
  },
  "APOnShell": {
    "name": "Energising Shell",
    "effect": "Give 2 AP on applying Shell.",
    "type": "Support",
    "stats": "Defense +319 Speed +154",
    "cost": 10
  },
  "FreeAimEnergy": {
    "name": "Energising Shots",
    "effect": "20% chance to gain 1 AP on Free Aim shot.",
    "type": "Support",
    "stats": "Speed +779 Crit Rate +16%",
    "cost": 10
  },
  "InitialAp+1A": {
    "name": "Energising Start I",
    "effect": "+1 AP on battle start.",
    "type": "Support",
    "stats": "Health +320",
    "cost": 5
  },
  "InitialAp+1B": {
    "name": "Energising Start II",
    "effect": "+1 AP on battle start.",
    "type": "Support",
    "stats": "Health +175",
    "cost": 10
  },
  "InitialAp+1C": {
    "name": "Energising Start III",
    "effect": "+1 AP on battle start.",
    "type": "Support",
    "stats": "Health +320",
    "cost": 15
  },
  "InitialAp+1D": {
    "name": "Energising Start IV",
    "effect": "+1 AP on battle start.",
    "type": "Support",
    "stats": "Health +513",
    "cost": 20
  },
  "StunEnergy": {
    "name": "Energising Stun",
    "effect": "+1 AP on hitting a Stunned target with a Skill.",
    "type": "Support",
    "stats": "Speed +519 Crit Rate +31%",
    "cost": 10
  },
  "AP+1TurnStart": {
    "name": "Energising Turn",
    "effect": "+1 AP on turn start.",
    "type": "Support",
    "stats": "Speed +270",
    "cost": 20
  },
  "DoubleAP": {
    "name": "Energy Master",
    "effect": "Every AP gain is increased by 1.",
    "type": "Support",
    "stats": "Health +4,970",
    "cost": 40
  },
  "PowerlessStrike": {
    "name": "Enfeebling Attack",
    "effect": "Base Attack applies Powerless for 1 turn.",
    "type": "Defensive/Support",
    "stats": "Health +389 Defense +478",
    "cost": 10
  },
  "WeakeningMark": {
    "name": "Enfeebling Mark",
    "effect": "Marked targets deal 30% less damage.",
    "type": "Defensive/Support",
    "stats": "Defense +102 Speed +21",
    "cost": 10
  },
  "ExhaustAffinity": {
    "name": "Exhausting Power",
    "effect": "50% increased damage if Exhausted.",
    "type": "Offensive",
    "stats": "Health +270 Defense +96",
    "cost": 2
  },
  "DefenslessStrike": {
    "name": "Exposing Attack",
    "effect": "Base Attack applies Defenceless for 1 turn.",
    "type": "Offensive/Support",
    "stats": "Speed +20 Critical Rate +4%",
    "cost": 10
  },
  "DefenselessOnBreak": {
    "name": "Exposing Break",
    "effect": "Apply Defenceless on Break.",
    "type": "Offensive/Support",
    "stats": "Defense +681 Speed +280",
    "cost": 5
  },
  "FasterThanStrong": {
    "name": "Faster Than Strong",
    "effect": "Always play twice in a row, but deal 50% less damage.",
    "type": "Support",
    "stats": "Health +876 Defense +373",
    "cost": 10
  },
  "FirstOffensive": {
    "name": "First Offensive",
    "effect": "First hit dealt and taken deals 50% more damage.",
    "type": "Offensive",
    "stats": "Speed +41 Critical Rate +10%",
    "cost": 5
  },
  "FirstStrike": {
    "name": "First Strike",
    "effect": "Play first.",
    "type": "Support",
    "stats": "Speed +41 Crit Rate +10%",
    "cost": 10
  },
  "GreatFireBreak": {
    "name": "Fueling Break",
    "effect": "Breaking a target doubles its Burn amount.",
    "type": "Support",
    "stats": "Speed +65 Crit Rate +12%",
    "cost": 5
  },
  "Stand": {
    "name": "Full Strength",
    "effect": "25% increased damage on full Health.",
    "type": "Offensive",
    "stats": "Health +876 Defense +373",
    "cost": 15
  },
  "GlassCanon": {
    "name": "Glass Canon",
    "effect": "Deal 25% more damage, but take 25% more damage.",
    "type": "Offensive",
    "stats": "Speed +175",
    "cost": 10
  },
  "GradientBreak": {
    "name": "Gradient Break",
    "effect": "+50% of a Gradient Charge on Breaking a target.",
    "type": "Support",
    "stats": "Speed +434 Crit Rate +28%",
    "cost": 5
  },
  "GradientBreaker": {
    "name": "Gradient Breaker",
    "effect": "50% increased Break damage with Gradient Attacks.",
    "type": "Offensive",
    "stats": "Speed  Critical Rate",
    "cost": 5
  },
  "GradientFighter": {
    "name": "Gradient Fighter",
    "effect": "+25% increased damage with Gradient Attacks.",
    "type": "Offensive",
    "stats": "Speed +182 Crit Rate +18%",
    "cost": 5
  },
  "GreaterDefenseless": {
    "name": "Greater Defenceless",
    "effect": "+15% to Defenceless damage amplification.",
    "type": "Offensive/Support",
    "stats": "Speed +154 Crit Rate +17%",
    "cost": 15
  },
  "GreaterPowerful": {
    "name": "Greater Powerful",
    "effect": "+15% to Powerful damage increase.",
    "type": "Offensive/Support",
    "stats": "Speed +59 Crit Rate +23%",
    "cost": 10
  },
  "GreaterPowerless": {
    "name": "Greater Powerless",
    "effect": "+15% to Powerless damage reduction.",
    "type": "Defensive/Support",
    "stats": "Defense +1,727 Speed +597",
    "cost": 15
  },
  "GreaterSpeed": {
    "name": "Greater Rush",
    "effect": "+25% to Rush Speed increase.",
    "type": "Support",
    "stats": "Speed +439 Crit Rate +12%",
    "cost": 10
  },
  "GreaterShell": {
    "name": "Greater Shell",
    "effect": "+10% to Shell damage reduction.",
    "type": "Defensive/Support",
    "stats": "Health +599 Defense +240",
    "cost": 10
  },
  "GreaterSlow": {
    "name": "Greater Slow",
    "effect": "+15% to Slow Speed reduction.",
    "type": "Support",
    "stats": "Defense +647 Speed +266",
    "cost": 15
  },
  "HealOnBuff": {
    "name": "Healing Boon",
    "effect": "Heal 15% HP on applying a buff.",
    "type": "Defensive/Support",
    "stats": "Defense +647 Speed +266",
    "cost": 10
  },
  "HealingCounter": {
    "name": "Healing Counter",
    "effect": "Recover 25% Health on Counterattack.",
    "type": "Defensive",
    "stats": "Health +751",
    "cost": 10
  },
  "HealingDeath": {
    "name": "Healing Death",
    "effect": "On death, the rest of the Expedition recover all Health.",
    "type": "Defensive/Support",
    "stats": "Speed +78 Critical Rate +13%",
    "cost": 5
  },
  "HealingFire": {
    "name": "Healing Fire",
    "effect": "Recover 25% Health when attacking a Burning target. Once per turn.",
    "type": "Defensive",
    "stats": "Defense +240 Speed +118",
    "cost": 10
  },
  "HealingMark": {
    "name": "Healing Mark",
    "effect": "Recover 25% Health on hitting a Marked enemy. Once per turn.",
    "type": "Defensive/Support",
    "stats": "Defense +65",
    "cost": 20
  },
  "HealingParry": {
    "name": "Healing Parry",
    "effect": "Recover 3% Health on Parry.",
    "type": "Defensive",
    "stats": "Health +127 Defense +34",
    "cost": 5
  },
  "HealingShare": {
    "name": "Healing Share",
    "effect": "Receive 15% of all Heals affecting other characters.",
    "type": "Defensive",
    "stats": "Health +467 Crit Rate +14%",
    "cost": 5
  },
  "HealingStun": {
    "name": "Healing Stun",
    "effect": "Recover 5% Health on hitting a Stunned target.",
    "type": "Defensive",
    "stats": "Health +876 Speed +173",
    "cost": 10
  },
  "HealingTintEnergy": {
    "name": "Healing Tint Energy",
    "effect": "Healing Tints also give 1 AP.",
    "type": "Support",
    "stats": "Health +216 Defense +71",
    "cost": 1
  },
  "Immaculate": {
    "name": "Immaculate",
    "effect": "30% increased damage until a hit is received.",
    "type": "Offensive",
    "stats": "Speed +103 Crit Rate +15%",
    "cost": 10
  },
  "InMediasRes": {
    "name": "In Medias Res",
    "effect": "+3 Shields on Battle Start, but max Health is halved.",
    "type": "Defensive",
    "stats": "Defense +1,310 Crit Rate +13%",
    "cost": 10
  },
  "InvertedAffinity": {
    "name": "Inverted Affinity",
    "effect": "Apply Inverted on self for 3 turns on battle start.  50% increased damage while Inverted.",
    "type": "Offensive",
    "stats": "Health +270 Crit Rate +11%",
    "cost": 5
  },
  "LastStandCritical": {
    "name": "Last Stand Critical",
    "effect": "100% Critical Chance while fighting alone.",
    "type": "Offensive",
    "stats": "Health +168 Defense +50",
    "cost": 3
  },
  "BurnDurationIncrease": {
    "name": "Longer Burn",
    "effect": "Burn duration is increased by 2.",
    "type": "Support",
    "stats": "Health +2,392 Defense +1,292",
    "cost": 15
  },
  "LongerPowerful": {
    "name": "Longer Powerful",
    "effect": "On applying Powerful, its duration is increased by 2.",
    "type": "Offensive/Support",
    "stats": "Health +376 Crit Rate +13%",
    "cost": 10
  },
  "LongerRush": {
    "name": "Longer Rush",
    "effect": "On applying Rush, its duration is increased by 2.",
    "type": "Support",
    "stats": "Health +778 Speed +154",
    "cost": 10
  },
  "LongerShell": {
    "name": "Longer Shell",
    "effect": "On applying Shell, its duration is increased by 2.",
    "type": "Defensive/Support",
    "stats": "Health +313 Defense +116",
    "cost": 10
  },
  "MarkOnBreak": {
    "name": "Marking Break",
    "effect": "Apply Mark on Break.",
    "type": "Support",
    "stats": "Speed +434 Crit Rate +28%",
    "cost": 5
  },
  "FreeAimMarkingShot": {
    "name": "Marking Shots",
    "effect": "20% chance to apply Mark on Free Aim shot.",
    "type": "Support",
    "stats": "Speed +26 Critical Rate +2%",
    "cost": 3
  },
  "OverPowered": {
    "name": "Painted Power",
    "effect": "Damage can exceed 9,999.",
    "type": "Offensive",
    "stats": "Health +1,844",
    "cost": 5
  },
  "Painter": {
    "name": "Painter",
    "effect": "Convert all Physical damage to Void damage.",
    "type": "",
    "stats": "Speed +519 Crit Rate +31%",
    "cost": 10
  },
  "ManOfParry": {
    "name": "Perilous Parry",
    "effect": "+1 AP on Parry, but damage received is doubled.",
    "type": "Support",
    "stats": "Speed +54 Critical Rate +11%",
    "cost": 5
  },
  "PiercingShot": {
    "name": "Piercing Shot",
    "effect": "25% increased Free Aim damage. Free Aim shots ignore Shields.",
    "type": "Offensive",
    "stats": "Health  Critical Rate",
    "cost": 2
  },
  "FullEnergyAttack": {
    "name": "Powered Attack",
    "effect": "On every damage dealt, try to consume 1 AP.   If successful, increase damage by 20%.",
    "type": "Offensive",
    "stats": "Speed +132 Critical Rate +7%",
    "cost": 10
  },
  "PowerfulHeal": {
    "name": "Powerful Heal",
    "effect": "Healing an ally also applies Powerful for 1 turn.",
    "type": "Support",
    "stats": "Health +2,162 Speed +434",
    "cost": 5
  },
  "PowerfulMark": {
    "name": "Powerful Mark",
    "effect": "Gain Powerful on hitting a Marked enemy.",
    "type": "Offensive/Support",
    "stats": "Speed  Critical Rate",
    "cost": 5
  },
  "PowerfulOnShell": {
    "name": "Powerful on Shell",
    "effect": "Apply Powerful on applying Shell.",
    "type": "Offensive/Support",
    "stats": "Defense +240 Critical Rate +16%",
    "cost": 10
  },
  "ReviveWithPower": {
    "name": "Powerful Revive",
    "effect": "Apply Powerful for 3 turns when revived.",
    "type": "Offensive/Support",
    "stats": "Speed +54 Critical Rate +11%",
    "cost": 3
  },
  "PowerfulShield": {
    "name": "Powerful Shield",
    "effect": "10% increased damage per Shield Point on self.",
    "type": "Offensive",
    "stats": "Speed +651 Critical Rate +14%",
    "cost": 5
  },
  "FreeAimPowerful": {
    "name": "Powerful Shots",
    "effect": "20% chance to gain Powerful on Free Aim shot.",
    "type": "Support",
    "stats": "Health +983 Defense +44",
    "cost": 3
  },
  "ProRetreat": {
    "name": "Pro Retreat",
    "effect": "Allows Flee to be instantaneous.",
    "type": "Support",
    "stats": "Health +2,485 Speed +503",
    "cost": 40
  },
  "ShellStrike": {
    "name": "Protecting Attack",
    "effect": "Gain Shell for 1 turn on Base Attack.",
    "type": "Defensive/Support",
    "stats": "Health +3,081 Defense +524",
    "cost": 10
  },
  "ProtectingDeath": {
    "name": "Protecting Death",
    "effect": "On death, allies gain Shell.",
    "type": "Defensive/Support",
    "stats": "Health +599 Speed +118",
    "cost": 5
  },
  "ProtectingHeal": {
    "name": "Protecting Heal",
    "effect": "Healing an ally also applies Shell for 1 turn.",
    "type": "Support",
    "stats": "Health +395 Speed +78",
    "cost": 5
  },
  "LastStandShell": {
    "name": "Protecting Last Stand",
    "effect": "Gain Shell if fighting alone.",
    "type": "Defensive/Support",
    "stats": "Health +168 Defense +50",
    "cost": 3
  },
  "ShellTint": {
    "name": "Protecting Tint",
    "effect": "Healing Tints also apply Shell.",
    "type": "Defensive/Support",
    "stats": "Health +1,403 Defense +681",
    "cost": 5
  },
  "BreakMomentum": {
    "name": "Quick Break",
    "effect": "Play again on Breaking a target.",
    "type": "Support",
    "stats": "Speed +434 Critical Rate +28%",
    "cost": 3
  },
  "RandomDefense": {
    "name": "Random Defense",
    "effect": "Damage taken is randomly multiplied by a value between 50% and 200%.",
    "type": "Defensive",
    "stats": "Critical Rate +34%",
    "cost": 5
  },
  "Recovery": {
    "name": "Recovery",
    "effect": "Recovers 10% Health on turn start.",
    "type": "Defensive",
    "stats": "Health +2,000 Defense +324",
    "cost": 10
  },
  "ReviveWithRegen": {
    "name": "Rejuvenating Revive",
    "effect": "Apply Regen for 3 turns when revived.",
    "type": "Defensive/Support",
    "stats": "Health  Defense",
    "cost": 3
  },
  "ReviveParadox": {
    "name": "Revive Paradox",
    "effect": "Play immediately when revived.",
    "type": "Support",
    "stats": "Speed +92 Critical Rate +14%",
    "cost": 5
  },
  "ReviveTintEnergy": {
    "name": "Revive Tint Energy",
    "effect": "Revive Tints also give 3 AP.",
    "type": "Support",
    "stats": "Health +257 Defense +92",
    "cost": 10
  },
  "RewardingMark": {
    "name": "Rewarding Mark",
    "effect": "+2 AP on dealing damage to a Marked target. Once per turn.",
    "type": "Support",
    "stats": "Defense +20 Speed +7",
    "cost": 5
  },
  "Roulette": {
    "name": "Roulette",
    "effect": "Every hit has a 50% chance to deal either 50% or 200% of its damage.",
    "type": "Offensive",
    "stats": "Defense +34 Critical Rate +9%",
    "cost": 5
  },
  "RushOnPowerful": {
    "name": "Rush on Powerful",
    "effect": "Apply Rush on applying Powerful.",
    "type": "Support",
    "stats": "Speed +557 Critical Rate +32%",
    "cost": 10
  },
  "SecondChance": {
    "name": "Second Chance",
    "effect": "Revive with 100% Health. Once per battle.",
    "type": "Defensive",
    "stats": "Health +1,107 Critical Rate +8%",
    "cost": 40
  },
  "SharedCare": {
    "name": "Shared Care",
    "effect": "When healing an ally, also Heal self for 50% of that value.",
    "type": "Defensive",
    "stats": "Health +206 Defense +68",
    "cost": 10
  },
  "ShellOnRush": {
    "name": "Shell On Rush",
    "effect": "Apply Shell on applying Rush.",
    "type": "Defensive/Support",
    "stats": "Defense +1,048 Speed +413",
    "cost": 10
  },
  "ShieldAffinity": {
    "name": "Shield Affinity",
    "effect": "30% increased damage while having Shields, but receiving any damage always removes all Shields.",
    "type": "Offensive",
    "stats": "Speed +118 Crit Rate +16%",
    "cost": 15
  },
  "ShieldingDeath": {
    "name": "Shielding Death",
    "effect": "On death, allies gain 3 Shield points.",
    "type": "Defensive/Support",
    "stats": "Defense +801 Speed +161",
    "cost": 10
  },
  "ShieldingTint": {
    "name": "Shielding Tint",
    "effect": "Healing Tints also add 2 Shields.",
    "type": "Defensive/Support",
    "stats": "Health +313 Defense +116",
    "cost": 10
  },
  "Shortcut": {
    "name": "Shortcut",
    "effect": "Immediately play when falling below 30% Health. Once per battle.",
    "type": "Support",
    "stats": "Speed +672 Crit Rate +36%",
    "cost": 5
  },
  "SlowOnBreak": {
    "name": "Slowing Break",
    "effect": "Apply Slow on Break.",
    "type": "Support",
    "stats": "Defense  Speed",
    "cost": 5
  },
  "Sniper": {
    "name": "Sniper",
    "effect": "First Free Aim shot each turn deals 200% increased damage and can Break.",
    "type": "Offensive",
    "stats": "Speed +552 Crit Rate +13%",
    "cost": 15
  },
  "Solidifying": {
    "name": "Solidifying",
    "effect": "+2 Shields when the character's Health falls below 50%. Once per battle.",
    "type": "Defensive",
    "stats": "Defense +116 Speed +62",
    "cost": 10
  },
  "SoloFighter": {
    "name": "Solo Fighter",
    "effect": "Deal 50% more damage if fighting alone.",
    "type": "Offensive",
    "stats": "Health +168 Defense +50",
    "cost": 1
  },
  "SosPower": {
    "name": "SOS Power",
    "effect": "Apply Powerful when falling below 50% Health.",
    "type": "Offensive",
    "stats": "Speed +43 Crit Rate +10%",
    "cost": 5
  },
  "SosRush": {
    "name": "SOS Rush",
    "effect": "Apply Rush when falling below 50% Health.",
    "type": "Offensive/Support",
    "stats": "Defense +288 Speed +142",
    "cost": 5
  },
  "SosShell": {
    "name": "SOS Shell",
    "effect": "Apply Shell when falling below 50% Health.",
    "type": "Defensive",
    "stats": "Defense +13 Speed +14",
    "cost": 5
  },
  "SimpleBreaker": {
    "name": "Staggering Attack",
    "effect": "50% increased Break damage on Base Attack.",
    "type": "Offensive",
    "stats": "Speed +21 Critical Rate +4%",
    "cost": 1
  },
  "StayMarked": {
    "name": "Stay Marked",
    "effect": "50% chance to apply Mark when attacking a Marked target.",
    "type": "Support",
    "stats": "Speed +201 Critical Rate +12%",
    "cost": 10
  },
  "StunBoost": {
    "name": "Stun Boost",
    "effect": "30% increased damage on Stunned targets.",
    "type": "Offensive",
    "stats": "Speed +35 Critical Rate +2%",
    "cost": 10
  },
  "Survivor": {
    "name": "Survivor",
    "effect": "Survive fatal damage with 1 Health. Once per battle.",
    "type": "Defensive",
    "stats": "Speed +439 Critical Rate +12%",
    "cost": 20
  },
  "SweetKill": {
    "name": "Sweet Kill",
    "effect": "Recover 50% Health on killing an enemy.",
    "type": "Defensive",
    "stats": "Speed +54 Critical Rate +11%",
    "cost": 5
  },
  "Tainted": {
    "name": "Tainted",
    "effect": "15% increased damage for each Status Effect on self.",
    "type": "Offensive",
    "stats": "Defense +1,022 Critical Rate +12%",
    "cost": 3
  },
  "Teamwork": {
    "name": "Teamwork",
    "effect": "10% increased damage while all allies are alive.",
    "type": "Offensive",
    "stats": "Health +216 Defense +71",
    "cost": 5
  },
  "TheOne": {
    "name": "The One",
    "effect": "Max Health is reduced to 1.",
    "type": "Support",
    "stats": "Critical Rate +108%",
    "cost": 1
  },
  "TimeTint": {
    "name": "Time Tint",
    "effect": "Energy Tints also apply Rush.",
    "type": "Support",
    "stats": "Health +376 Defense +145",
    "cost": 10
  },
  "Versatile": {
    "name": "Versatile",
    "effect": "After a Free Aim hit, Base Attack damage is increased by 50% for 1 turn.",
    "type": "Offensive",
    "stats": "Speed +21 Critical Rate +4%",
    "cost": 5
  },
  "Warming": {
    "name": "Warming Up",
    "effect": "5% increased damage per turn. Can stack up to 5 times.",
    "type": "Offensive",
    "stats": "Health +1,166 Critical Rate +9%",
    "cost": 15
  },
  "WeaknessGain": {
    "name": "Weakness Gain",
    "effect": "+1 AP on hitting an enemy's Weakness. Once per turn.",
    "type": "Support",
    "stats": "Speed +162 Critical Rate +17%",
    "cost": 3
  },
  "FreeAimShell": {
    "name": "Protecting Shots",
    "effect": "Base Attack applies Defenceless for 1 turn.",
    "type": "Offensive",
    "stats": "Speed +20 Critical Rate +4%",
    "cost": 10
  }
}"#;
    Ok(json.to_string())
}
