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
  private externalMcpServer: string | null = null;
  private mcpServerSocket: WebSocket | null = null;

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
   * Connect to an external MCP server
   * @param serverUrl URL to the MCP server
   * @returns Promise that resolves when connected
   */
  async connectToMcpServer(serverUrl: string): Promise<boolean> {
    try {
      // Close existing connection if any
      if (this.mcpServerSocket) {
        this.mcpServerSocket.close();
        this.mcpServerSocket = null;
      }
      
      // For WebSocket connections (can be implemented later)
      // For now, we'll just store the server URL
      this.externalMcpServer = serverUrl;
      console.log(`Connected to MCP server at ${serverUrl}`);
      
      // In a real implementation, we would establish a connection
      // to the MCP server and validate it
      
      return true;
    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
      this.externalMcpServer = null;
      return false;
    }
  }

  /**
   * Disconnect from the external MCP server
   */
  disconnectFromMcpServer() {
    if (this.mcpServerSocket) {
      this.mcpServerSocket.close();
      this.mcpServerSocket = null;
    }
    this.externalMcpServer = null;
  }

  /**
   * Check if connected to MCP server
   * @returns True if connected
   */
  isConnectedToMcpServer(): boolean {
    return this.externalMcpServer !== null;
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
      // Check if using external MCP server
      if (this.externalMcpServer) {
        await this.sendMessageViaExternalMcp(messages, onChunk, onComplete, onError);
        return;
      }
      
      // Make API request to standard Anthropic API
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
   * Send a message via external MCP server
   * @param messages Message history
   * @param onChunk Callback for each response chunk
   * @param onComplete Callback when complete
   * @param onError Callback for errors
   */
  private async sendMessageViaExternalMcp(
    messages: { role: string; content: string }[],
    onChunk: (chunk: StreamingResponse) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ) {
    // This is a simplified simulation of external MCP server communication
    // In a real implementation, this would need to handle the specific protocol
    // of the external MCP server
    
    try {
      // Simulate communication with external MCP server
      console.log('Sending message via external MCP server:', this.externalMcpServer);
      
      // Simulate a delayed response
      setTimeout(() => {
        // Create a fake initial message
        const initialResponse: StreamingResponse = {
          type: 'message_start',
          message: {
            id: 'msg_' + Date.now(),
            role: 'assistant',
            content: '',
            model: this.model,
            stop_reason: null,
            stop_sequence: null,
            usage: {
              input_tokens: 0,
              output_tokens: 0,
            }
          }
        };
        
        onChunk(initialResponse);
        
        // In a real implementation, the external MCP server would send content
        // chunks that we would forward to the onChunk callback
        
        // Simulate content chunks with delay
        const content = "這是從 MCP 服務器生成的回應。在實際應用中，這會連接到一個真實的 MCP 服務器，能夠執行特殊功能，如網頁抓取、數據處理等。";
        let currentIndex = 0;
        
        const sendNextChunk = () => {
          if (currentIndex >= content.length) {
            // Send final message
            const finalResponse: StreamingResponse = {
              type: 'message_delta',
              message: {
                id: 'msg_' + Date.now(),
                role: 'assistant',
                content: content,
                model: this.model,
                stop_reason: 'end_turn',
                stop_sequence: null,
                usage: {
                  input_tokens: messages.reduce((acc, msg) => acc + msg.content.length / 4, 0), // Rough estimation
                  output_tokens: content.length / 4
                }
              },
              delta: {
                stop_reason: 'end_turn'
              }
            };
            
            onChunk(finalResponse);
            onComplete();
            return;
          }
          
          // Calculate chunk size (1-3 characters)
          const chunkSize = Math.min(3, content.length - currentIndex);
          const chunk = content.substring(currentIndex, currentIndex + chunkSize);
          currentIndex += chunkSize;
          
          // Create streaming response chunk
          const response: StreamingResponse = {
            type: 'content_block_delta',
            delta: {
              text: chunk
            }
          };
          
          onChunk(response);
          
          // Schedule next chunk
          setTimeout(sendNextChunk, 50);
        };
        
        // Start sending chunks
        sendNextChunk();
        
      }, 500);
      
    } catch (error: any) {
      console.error('Error using external MCP server:', error);
      onError(new Error('MCP server error: ' + error.message));
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