import type { WsRequest, WsResponse } from '@/types/entity';

class WebSocketManager {
  private ws?: WebSocket;
  private url: string;
  private reconnectInterval: number; // ms
  private maxReconnectAttempts: number;
  private reconnectAttempts: number;
  private shouldReconnect: boolean;

  constructor(
    url: string,
    private onMessage: (data: WsResponse) => void,
    private onReconnectSuccess: () => void,
    reconnectInterval = 5000,
    maxReconnectAttempts = 10
  ) {
    this.url = url;
    this.reconnectInterval = reconnectInterval;
    this.maxReconnectAttempts = maxReconnectAttempts;
    this.reconnectAttempts = 0;
    this.shouldReconnect = true;
  }

  public connect = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          if (this.reconnectAttempts) {
            this.onReconnectSuccess();
          }
          this.reconnectAttempts = 0;
          resolve();
        };
        this.ws.onerror = event => {
          reject(event);
        };

        this.setupEventListeners();
      } else if (this.ws.readyState === WebSocket.OPEN) {
        resolve();
      } else {
        reject(new Error('WebSocket is in an unknown state'));
      }
    });
  };

  private setupEventListeners = () => {
    if (!this.ws) return;

    this.ws.onmessage = event => {
      if (this.isHeartbeat(event.data)) {
        this.onHeartbeat();
      } else {
        this.onBinaryMessage(event.data);
      }
    };

    this.ws.onclose = event => {
      if (
        this.shouldReconnect &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        setTimeout(() => this.connect(), this.reconnectInterval);
        this.reconnectAttempts++;
      }
    };
  };

  private isHeartbeat = (data: unknown): boolean => {
    return data === 'ping';
  };

  private onHeartbeat = () => {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send('pong');
    }
  };

  private onBinaryMessage = async (data: ArrayBuffer) => {
    if (data instanceof Blob) {
      data = await data.arrayBuffer();
    }
    const decoder = new TextDecoder();
    const message = decoder.decode(data);
    const json: WsResponse = JSON.parse(message);
    console.log('Received JSON message from server:', json);
    this.onMessage(json);
  };

  private encodeMessage = (messageObject: WsRequest): ArrayBuffer => {
    const messageString = JSON.stringify(messageObject);
    const encoder = new TextEncoder();
    const encoded = encoder.encode(messageString);
    return encoded.buffer;
  };

  public sendMessage = (message: WsRequest) => {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(this.encodeMessage(message));
    } else {
      console.error('WebSocket is not open. Message not sent.');
    }
  };

  public close = () => {
    this.shouldReconnect = false;
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.close();
    }
  };
}

export default WebSocketManager;
