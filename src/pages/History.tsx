import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Conversation } from '../types';
import { formatDate, truncateText } from '../utils';
import { ChatBubbleLeftRightIcon, TrashIcon } from '@heroicons/react/24/outline';

const History = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load conversation history
  useEffect(() => {
    const loadConversations = async () => {
      try {
        let loadedConversations: Conversation[] = [];
        
        // Load from Electron or localStorage
        if (window.electronAPI) {
          loadedConversations = await window.electronAPI.getConversations();
        } else {
          const storedConversations = localStorage.getItem('conversations');
          if (storedConversations) {
            loadedConversations = JSON.parse(storedConversations);
          }
        }
        
        // Sort by updated time (newest first)
        loadedConversations.sort((a, b) => b.updatedAt - a.updatedAt);
        
        setConversations(loadedConversations);
      } catch (error) {
        console.error('Failed to load conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConversations();
  }, []);
  
  // Filter conversations by search term
  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.messages.some((message) =>
        message.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );
  
  // Handle conversation select
  const handleSelectConversation = (conversation: Conversation) => {
    // In a real implementation, we would:
    // 1. Load the selected conversation
    // 2. Navigate to the chat page with this conversation
    navigate('/');
  };
  
  // Handle conversation delete
  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the conversation select
    
    if (window.confirm('確定要刪除此對話嗎？此操作無法復原。')) {
      try {
        let updatedConversations = conversations.filter((c) => c.id !== id);
        
        // Update storage
        if (window.electronAPI) {
          // For a real implementation, we would add a delete method to the API
          // Here we're just saving the filtered list
        } else {
          localStorage.setItem('conversations', JSON.stringify(updatedConversations));
        }
        
        setConversations(updatedConversations);
      } catch (error) {
        console.error('Failed to delete conversation:', error);
      }
    }
  };
  
  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">歷史記錄</h1>
          
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜尋對話..."
              className="input-field w-64"
            />
          </div>
        </div>
        
        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-claude-purple border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Empty state */}
            {conversations.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">沒有對話歷史</h2>
                <p className="text-gray-600 mb-4">
                  您的對話將會顯示在這裡，方便您之後查閱。
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="btn-primary"
                >
                  開始新對話
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Search results info */}
                {searchTerm && (
                  <p className="text-sm text-gray-600 mb-2">
                    找到 {filteredConversations.length} 個符合「{searchTerm}」的結果
                  </p>
                )}
                
                {/* Conversations list */}
                {filteredConversations.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-600">沒有符合搜尋條件的對話</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => handleSelectConversation(conversation)}
                      className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium mb-1">
                              {truncateText(conversation.title, 70)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {conversation.messages.length} 條訊息 · {formatDate(conversation.updatedAt)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => handleDeleteConversation(conversation.id, e)}
                            className="text-gray-400 hover:text-red-500 p-1"
                            aria-label="刪除對話"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                        
                        {/* Preview of the last message */}
                        {conversation.messages.length > 0 && (
                          <div className="mt-3 text-sm text-gray-600">
                            <p className="line-clamp-2">
                              {truncateText(conversation.messages[conversation.messages.length - 1].content, 150)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default History;