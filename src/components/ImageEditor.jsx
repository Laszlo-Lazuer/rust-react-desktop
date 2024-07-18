import React, { useState, useRef, useCallback, useEffect } from 'react';
import { open, save } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';

const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [history, setHistory] = useState([]);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const loadImage = async () => {
    const selected = await open({
      filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
    });
    if (selected) {
      const imageData = await invoke('load_image', { filePath: selected });
      const imageUrl = URL.createObjectURL(new Blob([new Uint8Array(imageData)]));
      setImage(imageUrl);
      setHistory([imageUrl]);  // Initialize history with the loaded image
    }
  };

  const saveImage = async () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob(async (blob) => {
        const arrayBuffer = await blob.arrayBuffer();
        const imageData = new Uint8Array(arrayBuffer);
        const filePath = await save({ defaultPath: 'edited-image.png' });
        if (filePath) {
          await invoke('save_image', { filePath, imageData: Array.from(imageData) });
          alert('Image saved successfully!');
        }
      });
    }
  };

  const applyFilter = async (filter, args = {}) => {
    if (image) {
      const response = await fetch(image);
      const imageData = new Uint8Array(await response.arrayBuffer());
      const filteredImageData = await invoke(filter, { imageData: Array.from(imageData), ...args });
      const filteredImageUrl = URL.createObjectURL(new Blob([new Uint8Array(filteredImageData)]));
      setImage(filteredImageUrl);
      setHistory((prevHistory) => [...prevHistory, filteredImageUrl]);  // Add new state to history
    }
  };

  const undo = () => {
    setHistory((prevHistory) => {
      if (prevHistory.length > 1) {
        const newHistory = prevHistory.slice(0, -1);
        setImage(newHistory[newHistory.length - 1]);
        return newHistory;
      }
      return prevHistory;
    });
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  return (
    <div>
      <h1>Image Editor</h1>
      <button onClick={loadImage}>Load Image</button>
      <button onClick={saveImage}>Save Image</button>
      <button onClick={() => applyFilter('apply_grayscale')}>Apply Grayscale</button>
      <button onClick={() => applyFilter('apply_invert')}>Apply Invert</button>
      <button onClick={() => applyFilter('apply_blur', { sigma: 2 })}>Apply Blur</button>
      <button onClick={() => applyFilter('apply_brighten', { value: 30 })}>Apply Brighten</button>
      <button onClick={() => applyFilter('apply_contrast', { value: 1.5 })}>Apply Contrast</button>
      <button onClick={() => applyFilter('apply_resize', { width: 200, height: 200 })}>Resize to 200x200</button>
      <button onClick={() => applyFilter('apply_rotate', { degrees: 90 })}>Rotate 90°</button>
      <button onClick={undo} disabled={history.length <= 1}>Undo</button>
      {image && <img ref={imgRef} src={image} alt="Loaded" onLoad={() => onLoad(imgRef.current)} />}
      <canvas
        ref={canvasRef}
        style={{
          display: 'none',
        }}
      />
    </div>
  );
};

export default ImageEditor;