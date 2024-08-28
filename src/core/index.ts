import WebSocketManager from '@/ws';
import Emitter from './emitter';
import { WsResponse } from '@/types/entity';
import { uuid } from '@/utils/uuid';
import { LoginParams } from '@/types/params';
import { ErrorCode, RequestApi } from '@/constant/api';
import config, { resetConfig, setConfig } from './config';
import { getFriendListPage } from '@/http';

class OpenIMSDK extends Emitter {
  constructor() {
    super();
  }

  private handleMessage = (data: WsResponse) => {
    console.log('handleMessage');
  };

  private handleReconnectSuccess = () => {
    // console.log('handleReconnectSuccess');
  };

  login = async (params: LoginParams, operationID = uuid()) => {
    const { wsManager } = config;
    if (wsManager) {
      return Promise.reject({
        data: '',
        operationID,
        errMsg: 'login repeat',
        errCode: ErrorCode.LoginRepeatError,
        event: RequestApi.Login,
      });
    }

    const internalWsUrl = `${params.wsAddr}?compression=gzip&isBackground=false&isMsgResp=true&operationID=${operationID}&platformID=5&sendID=${params.userID}&token=${params.token}`;

    setConfig({
      userID: params.userID,
      token: params.token,
      apiAddr: params.apiAddr,
      wsManager: new WebSocketManager(
        internalWsUrl,
        this.handleMessage,
        this.handleReconnectSuccess
      ),
    });

    try {
      await config.wsManager?.connect();
      return {
        data: '',
        operationID,
        errMsg: '',
        errCode: 0,
        event: RequestApi.Login,
      };
    } catch (error) {
      return Promise.reject({
        data: '',
        operationID,
        errMsg: (error as Error).message,
        errCode: ErrorCode.ConnectionEstablishmentFailed,
        event: RequestApi.Login,
      });
    }
  };

  logout = (operationID = uuid()) => {
    config.wsManager?.close();
    resetConfig();
    return {
      data: '',
      operationID,
      errMsg: '',
      errCode: 0,
      event: RequestApi.Logout,
    };
  };

  /**
   * @deprecated This getFriendList method is deprecated, use getFriendListPage instead.
   */
  getFriendList = () => {};
  getFriendListPage = getFriendListPage;
}

export default OpenIMSDK;
