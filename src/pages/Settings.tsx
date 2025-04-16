import { useState, useContext, FormEvent } from 'react';
import { AppContext } from '../contexts/AppContext';
import { getModelDisplayName } from '../utils';

const Settings = () => {
  const { settings, saveSettings } = useContext(AppContext);
  
  // Local state for form values
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [endpoint, setEndpoint] = useState(settings.endpoint);
  const [model, setModel] = useState(settings.model);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Available models
  const availableModels = [
    'claude-3-opus-20240229',
    'claude-3-sonnet-20240229',
    'claude-3-haiku-20240307',
    'claude-2.1',
    'claude-2.0',
    'claude-instant-1.2',
  ];
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      const success = await saveSettings({
        apiKey,
        endpoint,
        model,
      });
      
      if (success) {
        setSaveMessage({ type: 'success', text: '設定已儲存' });
      } else {
        setSaveMessage({ type: 'error', text: '儲存設定時發生錯誤' });
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: '儲存設定時發生錯誤' });
    } finally {
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      if (saveMessage?.type === 'success') {
        setTimeout(() => {
          setSaveMessage(null);
        }, 3000);
      }
    }
  };
  
  return (
    <div className="p-4">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">設定</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* API Key */}
          <div>
            <label htmlFor="apiKey" className="block font-medium mb-1 text-gray-700">
              API 金鑰
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="input-field pr-24"
                placeholder="輸入您的 API 金鑰"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700"
              >
                {showApiKey ? '隱藏' : '顯示'}
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              從 Anthropic 獲取您的 API 金鑰。您的金鑰將安全地存儲在本地。
            </p>
          </div>
          
          {/* Endpoint */}
          <div>
            <label htmlFor="endpoint" className="block font-medium mb-1 text-gray-700">
              API 端點
            </label>
            <input
              type="text"
              id="endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="input-field"
              placeholder="https://api.anthropic.com"
            />
            <p className="mt-1 text-sm text-gray-500">
              API 端點 URL。使用默認值，除非您使用自定義端點或代理。
            </p>
          </div>
          
          {/* Model */}
          <div>
            <label htmlFor="model" className="block font-medium mb-1 text-gray-700">
              模型
            </label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="input-field"
            >
              {availableModels.map((modelId) => (
                <option key={modelId} value={modelId}>
                  {getModelDisplayName(modelId)}
                </option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">
              選擇要使用的 Claude 模型。
            </p>
          </div>
          
          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="btn-primary w-full flex justify-center items-center"
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  儲存中...
                </>
              ) : (
                '儲存設定'
              )}
            </button>
          </div>
          
          {/* Save message */}
          {saveMessage && (
            <div
              className={`p-3 rounded-md ${
                saveMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}
            >
              {saveMessage.text}
            </div>
          )}
        </form>
        
        {/* App info */}
        <div className="mt-12 border-t border-gray-200 pt-6">
          <h2 className="text-lg font-medium mb-4">關於</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Claude Desktop MCP v0.1.0</p>
            <p>一個非官方的 Claude API 客戶端應用程序</p>
            <p className="pt-1">
              <a
                href="https://github.com/yanchen184/claude-desktop-mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-claude-purple hover:underline"
              >
                GitHub 倉庫
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;