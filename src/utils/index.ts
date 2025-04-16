/**
 * Generate a random ID
 * @returns Random ID string
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Generate a conversation title from the first message
 * @param content First message content
 * @returns Truncated title
 */
export const generateTitle = (content: string): string => {
  // Take first 50 characters, or until the first line break
  const firstLine = content.split('\n')[0] || '';
  return firstLine.length > 50 
    ? firstLine.substring(0, 50) + '...' 
    : firstLine;
};

/**
 * Truncate text to a specified length
 * @param text Text to truncate
 * @param maxLength Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Format a date to local date string
 * @param timestamp Timestamp in milliseconds
 * @returns Formatted date string
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  
  // Get today's date without time
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get yesterday's date
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check if date is today
  if (date.getTime() >= today.getTime()) {
    return '今天 ' + date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  // Check if date is yesterday
  if (date.getTime() >= yesterday.getTime()) {
    return '昨天 ' + date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  // Otherwise return full date
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get the model display name for a given model ID
 * @param modelId Model ID string
 * @returns Human-readable model name
 */
export const getModelDisplayName = (modelId: string): string => {
  const modelMap: Record<string, string> = {
    'claude-3-opus-20240229': 'Claude 3 Opus',
    'claude-3-sonnet-20240229': 'Claude 3 Sonnet',
    'claude-3-haiku-20240307': 'Claude 3 Haiku',
    'claude-2.1': 'Claude 2.1',
    'claude-2.0': 'Claude 2.0',
    'claude-instant-1.2': 'Claude Instant 1.2',
  };
  
  return modelMap[modelId] || modelId;
};