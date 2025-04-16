// Settings type definitions
export interface SettingsType {
  apiKey: string;
  endpoint: string;
  model: string;
}

// Message types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// Conversation types
export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

// MCP API types
export interface StreamingResponse {
  type: string;
  message: {
    id: string;
    role: string;
    content: string;
    model: string;
    stop_reason: string | null;
    stop_sequence: string | null;
    usage: {
      input_tokens: number;
      output_tokens: number;
    };
  };
  delta?: {
    text?: string;
    stop_reason?: string;
  };
}

// Electron API types
export interface ElectronAPI {
  getConversations: () => Promise<Conversation[]>;
  saveConversation: (conversation: Conversation) => Promise<boolean>;
  getSettings: () => Promise<SettingsType>;
  saveSettings: (settings: SettingsType) => Promise<boolean>;
}

// Window with Electron API
declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}