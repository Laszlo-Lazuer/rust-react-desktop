// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


#[macro_use]
extern crate lazy_static;

mod db;

use db::{Database, Todo};
use std::sync::Arc;
// use tauri::Manager;

lazy_static! {
    static ref DB: Arc<Database> = Arc::new(Database::new().unwrap());
}

#[tauri::command]
fn get_todos() -> Vec<Todo> {
    DB.get_todos().unwrap()
}

#[tauri::command]
fn add_todo(text: String) {
    DB.add_todo(text).unwrap();
}

#[tauri::command]
fn toggle_todo_completion(id: String) {
    DB.toggle_todo_completion(&id).unwrap()
}

#[tauri::command]
fn delete_todo(id: String) {
    DB.delete_todo(&id).unwrap()
}


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet,
            get_todos,
            add_todo,
            toggle_todo_completion,
            delete_todo
            ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
