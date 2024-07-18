import React, { useState } from 'react';
import { open, save } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';

const ImageEditor = () => {
  const [image, setImage] = useState(null);

  const loadImage = async () => {
    const selected = await open({
      filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
    });
    if (selected) {
      const imageData = await invoke('load_image', { filePath: selected });
      setImage(URL.createObjectURL(new Blob([new Uint8Array(imageData)])));
    }
  };

  const saveImage = async () => {
    if (image) {
      const response = await fetch(image);
      const imageData = new Uint8Array(await response.arrayBuffer());
      const filePath = await save({ defaultPath: 'edited-image.png' });
      if (filePath) {
        await invoke('save_image', { filePath, imageData: Array.from(imageData) });
        alert('Image saved successfully!');
      }
    }
  };

  const applyGrayscale = async () => {
    if (image) {
      const response = await fetch(image);
      const imageData = new Uint8Array(await response.arrayBuffer());
      const grayImageData = await invoke('apply_grayscale', { imageData: Array.from(imageData) });
      setImage(URL.createObjectURL(new Blob([new Uint8Array(grayImageData)])));
    }
  };

  return (
    <div>
      <h1>Image Editor</h1>
      <button onClick={loadImage}>Load Image</button>
      <button onClick={saveImage}>Save Image</button>
      <button onClick={applyGrayscale}>Apply Grayscale</button>
      {image && <img src={image} alt="Loaded" style={{ maxWidth: '100%', marginTop: '20px' }} />}
    </div>
  );
};

export default ImageEditor;