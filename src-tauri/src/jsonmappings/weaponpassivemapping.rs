#[tauri::command]
pub fn getweaponpassivemapping() -> Result<String, String> { 
   let json = r#"{"WeaponPassives":{"Beselbum":["StartBattleInStance_Offensive"],"DEBUGTEST_Lune":["Debug_Lune"],"DEBUGTEST_Maelle":["Debug_Maelle"],"DEBUGTEST_Monoco":["Debug_Monoco"],"DEBUGTEST_Sciel":["Debug_Sciel"],"DEBUGTEST_Verso":["Debug_Verso"]}}"#;
    Ok(json.to_string())
}
