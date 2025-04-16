import { createContext } from 'react';
import { SettingsType } from '../types';

// Default settings
const defaultSettings: SettingsType = {
  apiKey: '',
  endpoint: 'https://api.anthropic.com',
  model: 'claude-3-opus-20240229',
};

// Define the context type
interface AppContextType {
  settings: SettingsType;
  saveSettings: (settings: SettingsType) => Promise<boolean>;
}

// Create context with default values
export const AppContext = createContext<AppContextType>({
  settings: defaultSettings,
  saveSettings: async () => false,
});
