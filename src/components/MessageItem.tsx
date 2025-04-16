import { UserIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
  // Format timestamp to human-readable
  const formattedTime = new Date(message.timestamp).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  return (
    <div className={`message-${message.role} mb-8`}>
      <div className="flex items-start">
        {/* Avatar */}
        <div className="flex-shrink-0 mr-3">
          {message.role === 'assistant' ? (
            <div className="w-8 h-8 bg-claude-purple rounded-full flex items-center justify-center text-white font-bold">
              C
            </div>
          ) : (
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-gray-600" />
            </div>
          )}
        </div>
        
        {/* Message content */}
        <div className="flex-1 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center mb-1">
            <div className="font-medium">
              {message.role === 'assistant' ? 'Claude' : '用戶'}
            </div>
            <div className="text-xs text-gray-500">{formattedTime}</div>
          </div>
          
          {/* Content */}
          <div className="prose max-w-none">
            {message.role === 'assistant' ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;