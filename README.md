# Tauri + React
- Pulling data from [gist](https://gist.github.com/Laszlo-Lazuer/d692fe74c651c06deb9e5bb8013811c2)
- Verified we can update we just need to include the file signature metadata in the gist.

# How to run the project
- Requirements:
  - Rust installed
  - Node installed
Clone the repo
- nun `npm ci`
- cd into src-tauri
  - run `cargo build` in your terminal
- At project root run `npm run tauri build` to make sure everything is working. You will see the executable pop up if it is.
- Run `npm run tauri dev` to go into dev mode with hot reloading.
  - FYI when in dev mode you can right click in the app to pull up the web inspector.

## Summary
After Exploring a couple of different ways to build a `self-updating` app with the recommended languages. I settled on Tauri as it would allow me to leverage my experience with React. I attempted to use Wails with Go, though the self-updating feature exceeded how much time I allocated for discovery. I found `Tauri` to be a fairly fun framework to work with and I will consider using it in future projects.

### Technical Overview
- Backend
  - Rust
  - Image Crate for image processing.
  - Github
    - Github CI/CD workflow which triggers on push of a new version tag.
    - Generation of distributables and JSON which is hosted in a Github Gist with a static URL.
    - The app will check the JSON on startup and notify the user of an update as seen in the Gif below. If accepted the binary will replace itself and restart itself.
    - Builds for MacOS (Apple Silicon), Windows (latest), and Ubuntu (latest).
    - Leveraging Github Secrets to encrypt and sign the code for builds.

- Frontend
  - React with JS
  - Scss for styling
  - eslinter for code quality
  - Radix UI Design System for primitive elements

- Tradeoffs for delivery
  - The distributables are not signed for delivery and purposes of this project. The packages will run with the information in this README.
  - This was a fun and exciting project and I might have continued to troubleshoot the issues with SQLite3 and Windows builds failing in the Github workflows.

## Summary
This project meets the base case of a self-updating app. I will be writing up a document and recording a YT video to share with others on how to implement the Self Updating process. During my exploration documentation was fragmented or scarce.

## Distributables
- [Latest Release](https://github.com/Laszlo-Lazuer/rust-react-desktop/releases/latest)

## Features
- The Image editor allows you to open an image from your file system, apply a filter and save the new file.
- Version Updating working

## App Signing
- For the purposes of this project the app is unsinged.

### MacOS
- To run the app open the DMG -> Copy the app to your Applications folder then run the following in your terminal:
```xattr -rc /Applications/rust-react-desktop.app && codesign --force --deep --sign - /Applications/rust-react-desktop.app```
  - This will allow you to run the unsigned app.

### Windows
- The app will run when opening the `msi` build, you might see an alert regarding an unknown developer.

## Demo - Functionality

![app demo](./img/demo_walkthrough.gif)

## Demo - Self Update Demo

![self update demo](./img/rust_app_self_update_demo.gif)