import type {
  GetUserInfoWithCacheParams,
  SetSelfInfoParams,
} from '@/types/params';
import OpenIMSDK from '.';
import { RequestApi } from '@/constant/api';
import type { MessageReceiveOptType } from '@/types/enum';
import type {
  FullUserItemWithCache,
  SelfUserInfo,
  UserOnlineState,
  WsResponse,
} from '@/types/entity';

export function setupUser(openIMSDK: OpenIMSDK) {
  return {
    getSelfUserInfo: openIMSDK.createRequestFunctionWithoutParams<SelfUserInfo>(
      RequestApi.GetSelfUserInfo
    ),
    setSelfInfo: openIMSDK.createRequestFunction<SetSelfInfoParams>(
      RequestApi.SetSelfInfo
    ),
    getUsersInfoWithCache: openIMSDK.createRequestFunction<
      GetUserInfoWithCacheParams,
      FullUserItemWithCache[]
    >(RequestApi.GetUsersInfoWithCache, data =>
      JSON.stringify([JSON.stringify(data.userIDList), data.groupID ?? ''])
    ),
    subscribeUsersStatus: openIMSDK.createRequestFunction<
      string[],
      UserOnlineState
    >(RequestApi.SubscribeUsersStatus),
    unsubscribeUsersStatus: openIMSDK.createRequestFunction<string[]>(
      RequestApi.UnsubscribeUsersStatus
    ),
    getSubscribeUsersStatus: openIMSDK.createRequestFunctionWithoutParams<
      UserOnlineState[]
    >(RequestApi.GetSubscribeUsersStatus),
    setAppBackgroundStatus: openIMSDK.createRequestFunction<boolean>(
      RequestApi.SetAppBackgroundStatus
    ),
    networkStatusChanged: openIMSDK.createRequestFunctionWithoutParams(
      RequestApi.NetworkStatusChanged
    ),
    setGlobalRecvMessageOpt:
      openIMSDK.createRequestFunction<MessageReceiveOptType>(
        RequestApi.SetGlobalRecvMessageOpt
      ),
  };
}

export interface UserApi {
  getSelfUserInfo: (operationID?: string) => Promise<WsResponse<SelfUserInfo>>;
  setSelfInfo: (
    params: Partial<SelfUserInfo>,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  getUsersInfoWithCache: (
    params: GetUserInfoWithCacheParams,
    operationID?: string
  ) => Promise<WsResponse<FullUserItemWithCache[]>>;
  subscribeUsersStatus: (
    params: string[],
    operationID?: string
  ) => Promise<WsResponse<UserOnlineState>>;
  unsubscribeUsersStatus: (
    params: string[],
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  getSubscribeUsersStatus: (
    operationID?: string
  ) => Promise<WsResponse<UserOnlineState[]>>;
  setAppBackgroundStatus: (
    params: boolean,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  networkStatusChanged: (operationID?: string) => Promise<WsResponse<unknown>>;
  setGlobalRecvMessageOpt: (
    params: MessageReceiveOptType,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
}
