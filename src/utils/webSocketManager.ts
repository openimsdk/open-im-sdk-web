import type { WsRequest, WsResponse } from '@/types/entity';

type AppPlatform = 'unknow' | 'web' | 'uni' | 'wx';

class WebSocketManager {
  private ws?: WebSocket;
  private url: string;
  private reconnectInterval: number; // ms
  private maxReconnectAttempts: number;
  private reconnectAttempts: number;
  private shouldReconnect: boolean;
  private platformNamespace: AppPlatform;

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
    this.platformNamespace = this.checkPlatform();
  }

  private checkPlatform = () => {
    if (typeof WebSocket) {
      return 'web';
    }
    // @ts-ignore
    if (typeof uni) {
      return 'uni';
    }
    // @ts-ignore
    if (typeof wx) {
      return 'wx';
    }
    return 'unknow';
  };

  public connect = (): Promise<void> => {
    if (this.platformNamespace === 'unknow') {
      return Promise.reject(new Error('WebSocket is not supported'));
    }
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
        const onWsOpen = () => {
          if (this.reconnectAttempts) {
            this.onReconnectSuccess();
          }
          this.reconnectAttempts = 0;
          resolve();
        };
        const onWsError = (event: Event) => reject(event);

        if (this.platformNamespace === 'web') {
          this.ws = new WebSocket(this.url);
          this.ws.onopen = onWsOpen;
          this.ws.onerror = onWsError;
        } else {
          // @ts-ignore
          this.ws = this.platformNamespace.connectSocket({
            url: this.url,
            complete: () => {},
          });
          // @ts-ignore
          this.ws.onOpen(onWsOpen);
          // @ts-ignore
          this.ws.onError(onWsError);
        }

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

    const onWsMessage = (event: MessageEvent<ArrayBuffer>) =>
      this.onBinaryMessage(event.data);
    const onWsClose = (event: CloseEvent) => {
      if (
        this.shouldReconnect &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        setTimeout(() => this.connect(), this.reconnectInterval);
        this.reconnectAttempts++;
      }
    };

    if (this.platformNamespace === 'web') {
      this.ws.onmessage = onWsMessage;
      this.ws.onclose = onWsClose;
    } else {
      // @ts-ignore
      this.ws.onMessage(onWsMessage);
      // @ts-ignore
      this.ws.onClose(onWsClose);
    }
  };

  private onBinaryMessage = async (data: ArrayBuffer) => {
    if (data instanceof Blob) {
      data = await data.arrayBuffer();
    }
    const decoder = new TextDecoder();
    const message = decoder.decode(data);
    const json: WsResponse = JSON.parse(message);
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
