// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use image::{GenericImageView, ImageOutputFormat};
use std::fs::File;
use std::io::{Cursor, Write};
use std::path::Path;
use webp::Encoder;


// Leveraged the Image crate to handle image processing on the backend
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

#[tauri::command]
async fn apply_invert(image_data: Vec<u8>) -> Result<Vec<u8>, String> {
    let mut img = image::load_from_memory(&image_data).map_err(|e| e.to_string())?;
    img.invert();
    let mut buffer = vec![];
    img.write_to(&mut Cursor::new(&mut buffer), ImageOutputFormat::Png).map_err(|e| e.to_string())?;
    Ok(buffer)
}

#[tauri::command]
async fn apply_blur(image_data: Vec<u8>, sigma: f32) -> Result<Vec<u8>, String> {
    let img = image::load_from_memory(&image_data).map_err(|e| e.to_string())?;
    let blurred_img = img.blur(sigma);
    let mut buffer = vec![];
    blurred_img.write_to(&mut Cursor::new(&mut buffer), ImageOutputFormat::Png).map_err(|e| e.to_string())?;
    Ok(buffer)
}

#[tauri::command]
async fn apply_brighten(image_data: Vec<u8>, value: i32) -> Result<Vec<u8>, String> {
    let img = image::load_from_memory(&image_data).map_err(|e| e.to_string())?;
    let brightened_img = img.brighten(value);
    let mut buffer = vec![];
    brightened_img.write_to(&mut Cursor::new(&mut buffer), ImageOutputFormat::Png).map_err(|e| e.to_string())?;
    Ok(buffer)
}

#[tauri::command]
async fn apply_contrast(image_data: Vec<u8>, value: f32) -> Result<Vec<u8>, String> {
    let img = image::load_from_memory(&image_data).map_err(|e| e.to_string())?;
    let contrasted_img = img.adjust_contrast(value);
    let mut buffer = vec![];
    contrasted_img.write_to(&mut Cursor::new(&mut buffer), ImageOutputFormat::Png).map_err(|e| e.to_string())?;
    Ok(buffer)
}

#[tauri::command]
async fn apply_resize(image_data: Vec<u8>, width: u32, height: u32) -> Result<Vec<u8>, String> {
    let img = image::load_from_memory(&image_data).map_err(|e| e.to_string())?;
    let resized_img = img.resize_exact(width, height, image::imageops::FilterType::Lanczos3);
    let mut buffer = vec![];
    resized_img.write_to(&mut Cursor::new(&mut buffer), ImageOutputFormat::Png).map_err(|e| e.to_string())?;
    Ok(buffer)
}

#[tauri::command]
async fn apply_rotate(image_data: Vec<u8>, degrees: u32) -> Result<Vec<u8>, String> {
    let img = image::load_from_memory(&image_data).map_err(|e| e.to_string())?;
    let rotated_img = match degrees {
        90 => img.rotate90(),
        180 => img.rotate180(),
        270 => img.rotate270(),
        _ => img
    };
    let mut buffer = vec![];
    rotated_img.write_to(&mut Cursor::new(&mut buffer), ImageOutputFormat::Png).map_err(|e| e.to_string())?;
    Ok(buffer)
}

#[tauri::command]
async fn compress_to_webp(image_data: Vec<u8>, quality: f32) -> Result<Vec<u8>, String> {
    let img = image::load_from_memory(&image_data).map_err(|e| e.to_string())?;
    let (width, height) = img.dimensions();
    let rgba = img.to_rgba8(); // Store the result in a variable
    let encoder = Encoder::from_rgba(&rgba, width, height);
    let webp_data = encoder.encode(quality);
    Ok(webp_data.to_vec())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            load_image,
            save_image,
            apply_grayscale,
            apply_invert,
            apply_blur,
            apply_brighten,
            apply_contrast,
            apply_resize,
            apply_rotate,
            compress_to_webp
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}