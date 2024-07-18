// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use image::{ImageOutputFormat};
use std::fs::File;
use std::io::{Cursor, Write};
use std::path::Path;

// Commands

#[tauri::command]
async fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
async fn load_image(file_path: String) -> Result<Vec<u8>, String> {
    let img = image::open(&file_path).map_err(|e| e.to_string())?;
    let mut buffer = vec![];
    img.write_to(&mut Cursor::new(&mut buffer), ImageOutputFormat::Png).map_err(|e| e.to_string())?;
    Ok(buffer)
}

#[tauri::command]
async fn save_image(file_path: String, image_data: Vec<u8>) -> Result<(), String> {
    let path = Path::new(&file_path);
    let mut file = File::create(path).map_err(|e| e.to_string())?;
    file.write_all(&image_data).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn apply_grayscale(image_data: Vec<u8>) -> Result<Vec<u8>, String> {
    let img = image::load_from_memory(&image_data).map_err(|e| e.to_string())?;
    let gray_img = img.grayscale();
    let mut buffer = vec![];
    gray_img.write_to(&mut Cursor::new(&mut buffer), ImageOutputFormat::Png).map_err(|e| e.to_string())?;
    Ok(buffer)
}

// Main function
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            load_image,
            save_image,
            apply_grayscale
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}