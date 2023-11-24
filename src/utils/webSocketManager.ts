import type { WsRequest, WsResponse } from '@/types/entity';
import { utf8Decode, utf8Encode } from './textCoder';

type AppPlatform = 'unknow' | 'web' | 'uni' | 'wx';

enum WsOpenState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

class WebSocketManager {
  private ws?: WebSocket;
  private url: string;
  private reconnectInterval: number; // ms
  private maxReconnectAttempts: number;
  private reconnectAttempts: number;
  private shouldReconnect: boolean;
  private isProcessingMessage: boolean = false;
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
    if (typeof WebSocket !== 'undefined') {
      return 'web';
    }
    // @ts-ignore
    if (typeof uni !== 'undefined') {
      return 'uni';
    }
    // @ts-ignore
    if (typeof wx !== 'undefined') {
      return 'wx';
    }
    return 'unknow';
  };

  public connect = (): Promise<void> => {
    if (this.platformNamespace === 'unknow') {
      return Promise.reject(new Error('WebSocket is not supported'));
    }
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState === WsOpenState.CLOSED) {
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
          const connectOptions = {
            url: this.url,
            complete: () => {},
          };
          if (this.platformNamespace === 'uni') {
            // @ts-ignore
            this.ws = uni.connectSocket(connectOptions);
          }
          if (this.platformNamespace === 'wx') {
            // @ts-ignore
            this.ws = wx.connectSocket(connectOptions);
          }
          // @ts-ignore
          this.ws.onOpen(onWsOpen);
          // @ts-ignore
          this.ws.onError(onWsError);
        }

        this.setupEventListeners();
      } else if (this.ws.readyState === this.ws.OPEN) {
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
    const onWsClose = (event?: CloseEvent) => {
      if (
        this.shouldReconnect &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        if (this.isProcessingMessage) {
          setTimeout(() => onWsClose(), 100);
          return;
        }
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
    this.isProcessingMessage = true;
    if (this.platformNamespace === 'web' && data instanceof Blob) {
      data = await data.arrayBuffer();
    }
    const message = utf8Decode(data);
    const json: WsResponse = JSON.parse(message);
    this.onMessage(json);
    this.isProcessingMessage = false;
  };

  private encodeMessage = (messageObject: WsRequest): ArrayBuffer => {
    const messageString = JSON.stringify(messageObject);
    return utf8Encode(messageString);
  };

  public sendMessage = (message: WsRequest) => {
    if (this.ws?.readyState === WsOpenState.OPEN) {
      if (this.platformNamespace === 'web') {
        this.ws.send(this.encodeMessage(message));
      } else {
        this.ws.send({
          //@ts-ignore
          data: this.encodeMessage(message),
          success: () => {
            //@ts-ignore
            if (
              this.platformNamespace === 'uni' &&
              //@ts-ignore
              this.ws!._callbacks !== undefined &&
              //@ts-ignore
              this.ws!._callbacks.message !== undefined
            ) {
              //@ts-ignore
              this.ws!._callbacks.message = [];
            }
          },
        });
      }
    } else {
      console.error('WebSocket is not open. Message not sent.');
    }
  };

  public close = () => {
    this.shouldReconnect = false;
    if (this.ws?.readyState === WsOpenState.OPEN) {
      this.ws.close();
    }
  };
}

export default WebSocketManager;
