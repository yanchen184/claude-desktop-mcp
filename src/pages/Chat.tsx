import { useState, useEffect, useRef, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import MessageItem from '../components/MessageItem';
import MessageInput from '../components/MessageInput';
import MCPService from '../services/mcpService';
import { Message, Conversation, StreamingResponse } from '../types';
import { generateId, generateTitle } from '../utils';

const Chat = () => {
  // Get settings from context
  const { settings } = useContext(AppContext);
  
  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mcpServiceRef = useRef<MCPService | null>(null);
  
  // Initialize MCP service when settings change
  useEffect(() => {
    mcpServiceRef.current = new MCPService(settings);
  }, [settings]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Create a new conversation
  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: generateId(),
      title: '新的對話',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    setCurrentConversation(newConversation);
    setMessages([]);
    setError(null);
  };

  // Initialize a new conversation on first load
  useEffect(() => {
    if (!currentConversation) {
      createNewConversation();
    }
  }, []);

  // Save conversation to storage
  const saveConversation = async () => {
    if (!currentConversation || messages.length === 0) return;
    
    // Update conversation with messages and timestamp
    const updatedConversation: Conversation = {
      ...currentConversation,
      messages: [...messages],
      title: currentConversation.title === '新的對話' && messages.length > 0
        ? generateTitle(messages[0].content)
        : currentConversation.title,
      updatedAt: Date.now(),
    };
    
    // Save using Electron API or localStorage
    try {
      if (window.electronAPI) {
        await window.electronAPI.saveConversation(updatedConversation);
      } else {
        const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
        const existingIndex = conversations.findIndex((c: Conversation) => c.id === updatedConversation.id);
        
        if (existingIndex >= 0) {
          conversations[existingIndex] = updatedConversation;
        } else {
          conversations.unshift(updatedConversation);
        }
        
        localStorage.setItem('conversations', JSON.stringify(conversations));
      }
      
      setCurrentConversation(updatedConversation);
    } catch (err) {
      console.error('Failed to save conversation:', err);
    }
  };

  // Save conversation when messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveConversation();
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    // Ignore empty messages
    if (!content.trim()) return;
    
    // Clear any previous errors
    setError(null);
    
    // Create new user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };
    
    // Add user message to the conversation
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    // Create placeholder for assistant response
    const assistantMessageId = generateId();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };
    
    // Add empty assistant message
    setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    
    // Start generating response
    setIsGenerating(true);
    
    // Format messages for API
    const apiMessages = [...messages, userMessage].map(({ role, content }) => ({
      role,
      content,
    }));
    
    // Check if MCP service is initialized
    if (!mcpServiceRef.current) {
      setError('MCP 服務未初始化');
      setIsGenerating(false);
      return;
    }
    
    // Send message to API with streaming response
    mcpServiceRef.current.sendMessageStreaming(
      apiMessages,
      // Handle each chunk of the response
      (chunk: StreamingResponse) => {
        // Update the assistant message with new content
        if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
          setMessages((prevMessages) => 
            prevMessages.map((msg) => 
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + chunk.delta!.text }
                : msg
            )
          );
        }
      },
      // Handle completion
      () => {
        setIsGenerating(false);
      },
      // Handle error
      (error: Error) => {
        setError(`API 錯誤: ${error.message}`);
        setIsGenerating(false);
      }
    );
  };

  // Handle stopping generation
  const handleStopGeneration = () => {
    if (mcpServiceRef.current) {
      mcpServiceRef.current.abortStreaming();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold text-claude-purple">
            {currentConversation?.title || '新的對話'}
          </h1>
          <p className="text-sm text-gray-500">
            使用模型: {settings.model}
          </p>
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-16 h-16 bg-claude-purple bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <div className="w-10 h-10 bg-claude-purple rounded-full flex items-center justify-center text-white font-bold">
                  C
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">Claude Desktop</h2>
              <p className="text-gray-600 mb-4">有什麼可以幫您的嗎？</p>
            </div>
          )}
          
          {/* Messages */}
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
          
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-600 mb-4">
              <p className="font-semibold">發生錯誤</p>
              <p>{error}</p>
            </div>
          )}
          
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <MessageInput 
        onSendMessage={handleSendMessage} 
        onStopGeneration={handleStopGeneration}
        isGenerating={isGenerating}
        isDisabled={!settings.apiKey}
      />
      
      {/* API key not set warning */}
      {!settings.apiKey && (
        <div className="bg-yellow-50 border-t border-yellow-200 p-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-yellow-700 text-sm">
              請先在「設定」頁面設置 API 金鑰才能開始對話。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;