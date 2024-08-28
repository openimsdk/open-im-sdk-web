import WebSocketManager from '@/ws';

export type Config = {
  userID: string;
  token: string;
  apiAddr: string;
  wsManager: WebSocketManager | undefined;
};

const config: Config = {
  userID: '',
  token: '',
  apiAddr: '',
  wsManager: undefined,
};

export const setConfig = (params: Config) => {
  config.userID = params.userID;
  config.token = params.token;
  config.apiAddr = params.apiAddr;
  config.wsManager = params.wsManager;
};

export const resetConfig = () => {
  config.userID = '';
  config.token = '';
  config.apiAddr = '';
  config.wsManager = undefined;
};

export default config;
