# Tauri + React

- Pulling data from [gist](https://gist.github.com/Laszlo-Lazuer/d692fe74c651c06deb9e5bb8013811c2)
- Verified we can update we just need to include the file signature metadata in the gist.

## Distributables
- [Latest Release](https://github.com/Laszlo-Lazuer/rust-react-desktop/releases/latest)


## Features
- The Image editor allows you to open an image from your file system, apply a filter and save the new file.
- Version Updating working


## App Signing
- For the purposes of this project the app is unsinged.

### MacOS
- To run the app open the DMG -> Copy the app to your Applications folder then run the following:
```xattr -rc /Applications/rust-react-desktop.app && codesign --force --deep --sign - /Applications/rust-react-desktop.app```
  - This will allow you to run the unsigned app.

### Windows
- The app will run when opening the `msi` build, you might see an alert regarding an unknown developer.

## Demo - Functionality

![app demo](./img/demo_walkthrough.gif)

## Demo - Self Update Demo

![self update demo](./img/rust_app_self_update_demo.gif)

