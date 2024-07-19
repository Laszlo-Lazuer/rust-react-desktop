import React, { useState } from 'react';
import { checkUpdate, installUpdate } from '@tauri-apps/api/updater';
import { relaunch } from '@tauri-apps/api/process';
import { Button } from '@radix-ui/themes';
import { SymbolIcon } from '@radix-ui/react-icons';

const UpdateChecker = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');

  const handleCheckForUpdates = async () => {
    try {
      const { shouldUpdate, manifest } = await checkUpdate();
      console.log('Check Update Result:', shouldUpdate, manifest);
      if (shouldUpdate) {
        setUpdateMessage(`Update available: ${manifest?.version}`);
        setUpdateAvailable(true);
      } else {
        setUpdateMessage('No updates available');
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
      setUpdateMessage(`Error checking for updates: ${error}`);
    }
  };

  const handleInstallUpdate = async () => {
    try {
      await installUpdate();
      await relaunch();
    } catch (error) {
      console.error('Error installing update:', error);
      setUpdateMessage(`Error installing update: ${error}`);
    }
  };

  return (
    <div >
      <div className='section-update' style={{display: 'flex', justifyContent: 'right'}}>      <p>{updateMessage}</p>
      <Button style={{width:'17em'}} variant="solid" onClick={handleCheckForUpdates}>Check for Updates (v1.0.10)<SymbolIcon /></Button></div>

      {updateAvailable && <Button variant="solid" onClick={handleInstallUpdate}>Install Update<SymbolIcon /></Button>}
    </div>
  );
};

export default UpdateChecker;