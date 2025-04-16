import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import History from './pages/History';
import { AppContext } from './contexts/AppContext';
import { SettingsType } from './types';

// Define default settings
const defaultSettings: SettingsType = {
  apiKey: '',
  endpoint: 'https://api.anthropic.com',
  model: 'claude-3-opus-20240229',
};

const App = () => {
  // State for application settings
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Check if running in Electron
        if (window.electronAPI) {
          const storedSettings = await window.electronAPI.getSettings();
          if (storedSettings) {
            setSettings(storedSettings);
          }
        } else {
          // For web version, use localStorage
          const storedSettings = localStorage.getItem('settings');
          if (storedSettings) {
            setSettings(JSON.parse(storedSettings));
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings
  const saveSettings = async (newSettings: SettingsType) => {
    try {
      setSettings(newSettings);
      
      // Store in Electron or localStorage
      if (window.electronAPI) {
        await window.electronAPI.saveSettings(newSettings);
      } else {
        localStorage.setItem('settings', JSON.stringify(newSettings));
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-claude-purple border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-xl text-claude-purple">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ settings, saveSettings }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Chat />} />
          <Route path="settings" element={<Settings />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </AppContext.Provider>
  );
};

export default App;