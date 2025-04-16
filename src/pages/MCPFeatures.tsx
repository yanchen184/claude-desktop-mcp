import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface MCPFeature {
  id: string;
  name: string;
  description: string;
  isSupported: boolean;
  category: 'core' | 'advanced' | 'experimental';
  configOptions?: string[];
  example?: string;
}

const MCPFeatures = () => {
  const { settings } = useContext(AppContext);
  const [features, setFeatures] = useState<MCPFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'core' | 'advanced' | 'experimental' | 'all'>('all');
  const [mcpServerStatus, setMcpServerStatus] = useState<'offline' | 'connecting' | 'online'>('offline');

  // 模擬從 MCP 服務器獲取功能列表
  useEffect(() => {
    const fetchFeatures = async () => {
      setIsLoading(true);
      
      // 在實際應用中，這裡會通過 API 調用獲取 MCP 功能列表
      // 現在我們使用模擬數據
      const mockFeatures: MCPFeature[] = [
        {
          id: 'text-completion',
          name: '文字生成',
          description: '生成自然語言文本回應，基於提供的提示。',
          isSupported: true,
          category: 'core',
          configOptions: ['temperature', 'max_tokens', 'top_p'],
          example: 'prompt: "寫一首關於春天的短詩"\ntemperature: 0.7\nmax_tokens: 100'
        },
        {
          id: 'streaming',
          name: '流式響應',
          description: '以流的形式接收 API 響應，使得界面可以按字或詞逐步顯示回應內容，提供更好的用戶體驗。',
          isSupported: true,
          category: 'core',
          configOptions: ['stream'],
          example: 'stream: true'
        },
        {
          id: 'model-selection',
          name: '模型選擇',
          description: '允許選擇不同的 Claude 模型變體，如 Claude 3 Opus, Sonnet, Haiku 等，根據需求平衡性能和速度。',
          isSupported: true,
          category: 'core',
          configOptions: ['model'],
          example: 'model: "claude-3-opus-20240229"'
        },
        {
          id: 'system-prompt',
          name: '系統提示',
          description: '設置系統指令，指導 Claude 的行為和響應方式，而不消耗用戶對話的上下文空間。',
          isSupported: true,
          category: 'core',
          configOptions: ['system'],
          example: 'system: "你是一位專業的科技新聞編輯，擅長解釋複雜的技術概念。"'
        },
        {
          id: 'temperature-control',
          name: '溫度控制',
          description: '控制響應的隨機性，較高的值產生更創意但可能不太準確的回應，較低的值產生更確定和一致的回應。',
          isSupported: true,
          category: 'advanced',
          configOptions: ['temperature'],
          example: 'temperature: 0.7 // 範圍 0-1，越高越隨機創意'
        },
        {
          id: 'token-control',
          name: '標記數控制',
          description: '設置生成文本的最大標記數，控制響應長度。',
          isSupported: true,
          category: 'advanced',
          configOptions: ['max_tokens'],
          example: 'max_tokens: 4000'
        },
        {
          id: 'top-p-sampling',
          name: 'Top-P 採樣',
          description: '核心採樣（又稱 Top-P）通過只從最有可能的標記子集中採樣來控制響應的隨機性。',
          isSupported: true,
          category: 'advanced',
          configOptions: ['top_p'],
          example: 'top_p: 0.9 // 範圍 0-1'
        },
        {
          id: 'file-upload',
          name: '文件上傳',
          description: '允許用戶上傳文件（如圖片、PDF、文檔等）供 Claude 分析和理解。',
          isSupported: false,
          category: 'experimental',
          configOptions: ['file_ids'],
          example: '// 尚未在此客戶端實現'
        },
        {
          id: 'vision',
          name: '視覺理解',
          description: '使 Claude 能夠接收並分析圖像，結合視覺和文本理解。',
          isSupported: false,
          category: 'experimental',
          configOptions: ['images'],
          example: '// 尚未在此客戶端實現'
        },
        {
          id: 'custom-tool-use',
          name: '自定義工具',
          description: '允許 Claude 使用定義的工具執行操作，例如搜索網絡、獲取數據等。',
          isSupported: false,
          category: 'experimental',
          configOptions: ['tools', 'tool_choice'],
          example: '// 尚未在此客戶端實現，但可通過外部 MCP 服務器提供'
        },
        {
          id: 'self-running-agents',
          name: '自主代理',
          description: '建立能夠自主執行一系列操作的代理，無需用戶干預完成複雜任務。',
          isSupported: false,
          category: 'experimental',
          example: '// 尚未在此客戶端實現，但可通過外部 MCP 服務器提供'
        },
      ];
      
      // 模擬網絡延遲
      setTimeout(() => {
        setFeatures(mockFeatures);
        setIsLoading(false);
      }, 1000);

      // 檢查 MCP 服務器狀態
      checkMcpServerStatus();
    };

    fetchFeatures();
  }, []);

  // 模擬檢查 MCP 服務器狀態
  const checkMcpServerStatus = () => {
    setMcpServerStatus('connecting');
    
    // 模擬檢查過程
    setTimeout(() => {
      // 這裡假設我們檢測到 MCP 服務器離線
      // 在實際應用中，這會基於真實的連接嘗試
      setMcpServerStatus('offline');
    }, 2000);
  };

  // 嘗試連接 MCP 服務器
  const handleConnectMcpServer = () => {
    setMcpServerStatus('connecting');
    
    // 模擬連接過程
    setTimeout(() => {
      // 在實際應用中，這會嘗試建立真實連接
      setMcpServerStatus('online');
    }, 2000);
  };

  // 過濾功能列表
  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || feature.category === activeTab;
    return matchesSearch && matchesTab;
  });

  // 切換功能詳情展開/收起
  const toggleFeatureExpand = (featureId: string) => {
    if (expandedFeature === featureId) {
      setExpandedFeature(null);
    } else {
      setExpandedFeature(featureId);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">MCP 功能</h1>
          
          {/* 搜尋輸入框 */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜尋功能..."
              className="input-field w-64"
            />
          </div>
        </div>

        {/* MCP 服務器狀態和連接按鈕 */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium mb-1">MCP 服務器狀態</h2>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  mcpServerStatus === 'online' ? 'bg-green-500' :
                  mcpServerStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm">
                  {mcpServerStatus === 'online' ? '線上' :
                   mcpServerStatus === 'connecting' ? '連接中...' : '離線'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                MCP 服務器允許 Claude 使用外部工具和執行複雜任務。
              </p>
            </div>
            
            {mcpServerStatus !== 'online' && (
              <button
                onClick={handleConnectMcpServer}
                disabled={mcpServerStatus === 'connecting'}
                className={`btn-primary ${mcpServerStatus === 'connecting' ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {mcpServerStatus === 'connecting' ? '連接中...' : '連接服務器'}
              </button>
            )}
          </div>
          
          {mcpServerStatus === 'offline' && (
            <div className="mt-3 text-sm">
              <p className="text-gray-600">
                要設置 MCP 服務器，您可以：
              </p>
              <ol className="list-decimal list-inside mt-1 text-gray-600 space-y-1">
                <li>安裝 Node.js 和所需依賴</li>
                <li>從 GitHub 克隆 MCP 服務器代碼</li>
                <li>在終端中運行服務器</li>
                <li>使用上方的"連接服務器"按鈕連接</li>
              </ol>
              <p className="mt-2 text-gray-600">
                MCP 服務器代碼路徑（示例）：<code className="bg-gray-100 px-1 py-0.5 rounded">D:\autoGen\mcp-server</code>
              </p>
            </div>
          )}
        </div>

        {/* 分類標籤 */}
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'all' 
                ? 'bg-claude-purple text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setActiveTab('core')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'core' 
                ? 'bg-claude-purple text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            核心功能
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'advanced' 
                ? 'bg-claude-purple text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            進階功能
          </button>
          <button
            onClick={() => setActiveTab('experimental')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'experimental' 
                ? 'bg-claude-purple text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            實驗功能
          </button>
        </div>
        
        {/* 加載狀態 */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-claude-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* 功能列表 */}
            {filteredFeatures.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-600">沒有找到符合條件的 MCP 功能</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFeatures.map((feature) => (
                  <div
                    key={feature.id}
                    className="bg-white rounded-lg shadow overflow-hidden"
                  >
                    <div 
                      className="p-4 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleFeatureExpand(feature.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-medium">{feature.name}</h3>
                          <span className={`ml-3 text-xs px-2 py-0.5 rounded-full ${
                            feature.isSupported
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {feature.isSupported ? '已支持' : '計劃中'}
                          </span>
                          <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                            {feature.category === 'core' ? '核心' : 
                             feature.category === 'advanced' ? '進階' : '實驗性'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                      <div className="ml-4">
                        {expandedFeature === feature.id ? (
                          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                    
                    {/* 詳細信息 */}
                    {expandedFeature === feature.id && (
                      <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
                        {feature.configOptions && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium mb-1">配置選項：</h4>
                            <div className="flex flex-wrap gap-2">
                              {feature.configOptions.map((option) => (
                                <span key={option} className="text-xs bg-gray-200 px-2 py-1 rounded">
                                  {option}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {feature.example && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium mb-1">使用示例：</h4>
                            <pre className="bg-gray-800 text-white p-3 rounded text-xs overflow-x-auto">
                              {feature.example}
                            </pre>
                          </div>
                        )}
                        
                        {!feature.isSupported && (
                          <div className="mt-3 text-sm text-yellow-600">
                            <p>此功能尚未在當前版本中實現。可能需要外部 MCP 服務器來支持。</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {/* MCP 配置信息 */}
        <div className="mt-8 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-3">MCP 配置</h2>
          <p className="text-sm text-gray-600 mb-3">
            MCP（Model Control Protocol）是一個允許與各種 LLM 模型進行標準化交互的協議。您可以通過以下方式配置 MCP：
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium">基本 MCP 配置</h3>
              <div className="bg-gray-800 text-white p-3 rounded text-xs overflow-x-auto mt-2">
                <pre>{`{
  "endpoint": "${settings.endpoint}",
  "model": "${settings.model}",
  "apiKey": "********"
}`}</pre>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium">本地 MCP 服務器</h3>
              <p className="text-sm text-gray-600 mb-2">
                您可以在本地運行 MCP 服務器，為 Claude 提供額外的功能，如網頁抓取、數據處理等。
              </p>
              <div className="bg-gray-800 text-white p-3 rounded text-xs overflow-x-auto">
                <pre>{`// 啟動 MCP 服務器的示例代碼
const mcpServer = StdioServerParams(
  command: "node", 
  args: ["D:\\autoGen\\mcp-server\\dist\\index.js"]
);

// 獲取 MCP 工具
const tools = await mcp_server_tools(mcpServer);`}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCPFeatures;