import axios from 'axios';
import { SettingsType, StreamingResponse } from '../types';

/**
 * MCP API client service
 */
class MCPService {
  private apiKey: string;
  private endpoint: string;
  private model: string;
  private abortController: AbortController | null = null;

  /**
   * Initialize the MCP service with settings
   * @param settings API settings
   */
  constructor(settings: SettingsType) {
    this.apiKey = settings.apiKey;
    this.endpoint = settings.endpoint;
    this.model = settings.model;
  }

  /**
   * Update service settings
   * @param settings New settings
   */
  updateSettings(settings: SettingsType) {
    this.apiKey = settings.apiKey;
    this.endpoint = settings.endpoint;
    this.model = settings.model;
  }

  /**
   * Send a message to the MCP API with streaming response
   * @param messages Conversation history
   * @param onChunk Callback for each chunk of the streaming response
   * @param onComplete Callback when streaming is complete
   * @param onError Callback for errors
   */
  async sendMessageStreaming(
    messages: { role: string; content: string }[],
    onChunk: (chunk: StreamingResponse) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ) {
    // Create a new AbortController for this request
    this.abortController = new AbortController();
    
    try {
      // Make API request
      const response = await fetch(`${this.endpoint}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-beta': 'messages-2023-12-15',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          max_tokens: 4000,
          stream: true,
        }),
        signal: this.abortController.signal,
      });

      // Check for errors
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      // Process streaming response
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // Decode the current chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });
          
          // Process complete JSON objects in the buffer
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // Keep the last incomplete line in the buffer
          
          for (const line of lines) {
            if (line.trim() === '') continue;
            if (line === 'data: [DONE]') continue;
            
            try {
              // Parse the JSON string
              const parsed = JSON.parse(line.replace(/^data: /, ''));
              onChunk(parsed);
            } catch (e) {
              console.error('Error parsing JSON from stream:', e);
            }
          }
        }
        
        onComplete();
      }
    } catch (error: any) {
      // Ignore aborted requests
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        onComplete();
      } else {
        console.error('API request failed:', error);
        onError(error);
      }
    } finally {
      this.abortController = null;
    }
  }

  /**
   * Abort the current streaming request
   */
  abortStreaming() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
}

export default MCPService;