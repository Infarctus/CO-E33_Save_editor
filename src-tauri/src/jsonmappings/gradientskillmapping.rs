#[tauri::command]
pub fn getgradientskillmapping() -> Result<String, String> { 
   let json = r#"{"GradientSkills":{"Maelle":["GradientUnlock_Maelle1","GradientUnlock_Maelle2","GradientUnlock_Maelle3"],"Verso":["GradientUnlock_Verso1","GradientUnlock_Verso2","GradientUnlock_Verso3"],"Lune":["GradientUnlock_Lune1","GradientUnlock_Lune2","GradientUnlock_Lune3"],"Sciel":["GradientUnlock_Sciel1","GradientUnlock_Sciel2","GradientUnlock_Sciel3"],"Monoco":["GradientUnlock_Monoco1","GradientUnlock_Monoco2","GradientUnlock_Monoco3"]}}"#;
    Ok(json.to_string())
}
