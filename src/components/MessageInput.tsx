import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { PaperAirplaneIcon, StopIcon } from '@heroicons/react/24/solid';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onStopGeneration: () => void;
  isGenerating: boolean;
  isDisabled?: boolean;
}

const MessageInput = ({
  onSendMessage,
  onStopGeneration,
  isGenerating,
  isDisabled = false,
}: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get correct scrollHeight
      textareaRef.current.style.height = 'auto';
      
      // Set new height
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [message]);

  // Handle send message
  const handleSendMessage = () => {
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // Handle key press
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="輸入訊息..."
            className="input-field min-h-[60px] max-h-[200px] py-3 pr-12 resize-none"
            disabled={isDisabled}
          />
          
          <div className="absolute right-3 bottom-3">
            {isGenerating ? (
              <button
                type="button"
                onClick={onStopGeneration}
                className="rounded-full p-1 bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                aria-label="停止生成"
              >
                <StopIcon className="w-6 h-6" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!message.trim() || isDisabled}
                className={`rounded-full p-1 ${
                  !message.trim() || isDisabled
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-claude-purple text-white hover:bg-opacity-90'
                } transition-colors`}
                aria-label="發送訊息"
              >
                <PaperAirplaneIcon className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          <p>按 Enter 鍵發送，Shift+Enter 換行</p>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;