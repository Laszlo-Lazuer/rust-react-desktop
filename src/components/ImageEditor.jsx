import React, { useState, useRef, useCallback } from 'react';
import { open, save } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { Button } from '@radix-ui/themes';
import { ResetIcon } from '@radix-ui/react-icons';


const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [history, setHistory] = useState([]);
  const [progress, setProgress] = useState(0); // Progress state
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
      setProgress(0); // Reset progress
      const intervalId = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90)); // Increment progress
      }, 100);

      try {
        const response = await fetch(image);
        const imageData = new Uint8Array(await response.arrayBuffer());
        const filteredImageData = await invoke(filter, { imageData: Array.from(imageData), ...args });
        const filteredImageUrl = URL.createObjectURL(new Blob([new Uint8Array(filteredImageData)]));
        setImage(filteredImageUrl);
        setHistory((prevHistory) => [...prevHistory, filteredImageUrl]);  // Add new state to history
      } finally {
        clearInterval(intervalId);
        setProgress(100); // Set progress to 100%
        setTimeout(() => setProgress(0), 500); // Reset progress after a delay
      }
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

  const compressAndExport = async () => {
    if (image) {
      setProgress(0); // Reset progress
      const intervalId = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90)); // Increment progress
      }, 100);

      try {
        const response = await fetch(image);
        const imageData = new Uint8Array(await response.arrayBuffer());
        const compressedImageData = await invoke('compress_to_webp', { imageData: Array.from(imageData), quality: 75.0 });
        const blob = new Blob([new Uint8Array(compressedImageData)], { type: 'image/webp' });
        const filePath = await save({ defaultPath: 'compressed-image.webp' });
        if (filePath) {
          const arrayBuffer = await blob.arrayBuffer();
          const data = new Uint8Array(arrayBuffer);
          await invoke('save_image', { filePath, imageData: Array.from(data) });
          alert('Image saved as WebP successfully!');
        }
      } finally {
        clearInterval(intervalId);
        setProgress(100); // Set progress to 100%
        setTimeout(() => setProgress(0), 500); // Reset progress after a delay
      }
    }
  };

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  return (
    <div>
      <h1>Image Editor</h1>

      <div>
      <Button onClick={loadImage}>Load Image</Button>
      <Button onClick={saveImage}>Save Image</Button>
      </div>
      <div>
        <Button onClick={() => applyFilter('apply_grayscale')}>Apply Grayscale</Button>
        <Button onClick={() => applyFilter('apply_invert')}>Apply Invert</Button>
        <Button onClick={() => applyFilter('apply_blur', { sigma: 2 })}>Apply Blur</Button>
        <Button onClick={() => applyFilter('apply_brighten', { value: 30 })}>Apply Brighten</Button>
        <Button onClick={() => applyFilter('apply_contrast', { value: 1.5 })}>Apply Contrast</Button>
        <Button onClick={() => applyFilter('apply_resize', { width: 200, height: 200 })}>Resize to 200x200</Button>
        <Button onClick={() => applyFilter('apply_rotate', { degrees: 90 })}>Rotate 90°</Button>
        <Button onClick={compressAndExport}>Compress and Export as WebP</Button>
      </div>
      <Button onClick={undo} disabled={history.length <= 1}>Undo<ResetIcon /></Button>
      <div className='image-wrapper'>
        <div className="progress-bar">
          { (progress>0) && <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
          }
        </div>
        {image && <img style={(progress>0)?{opacity:0.5}:{opacity:1.0}} className="active-image" ref={imgRef} src={image} alt="Loaded" onLoad={() => onLoad(imgRef.current)} />}
        </div>

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