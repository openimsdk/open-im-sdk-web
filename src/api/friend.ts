import type {
  AccessFriendParams,
  AddBlackParams,
  RemarkFriendParams,
  SearchFriendParams,
} from '@/types/params';
import OpenIMSDK from '.';
import { RequestApi } from '@/constant/api';
import type {
  BlackUserItem,
  FriendApplicationItem,
  FriendshipInfo,
  WsResponse,
  SearchedFriendsInfo,
  FullUserItem,
} from '@/types/entity';

export function setupFriend(openIMSDK: OpenIMSDK) {
  return {
    acceptFriendApplication:
      openIMSDK.createRequestFunction<AccessFriendParams>(
        RequestApi.AcceptFriendApplication
      ),
    addBlack: openIMSDK.createRequestFunction<AddBlackParams>(
      RequestApi.AddBlack,
      data => JSON.stringify([data.toUserID, data.ex ?? ''])
    ),
    addFriend: openIMSDK.createRequestFunction<string>(RequestApi.AddFriend),
    checkFriend: openIMSDK.createRequestFunction<string[], FriendshipInfo[]>(
      RequestApi.CheckFriend
    ),
    deleteFriend: openIMSDK.createRequestFunction<string>(
      RequestApi.DeleteFriend
    ),
    getBlackList: openIMSDK.createRequestFunctionWithoutParams<BlackUserItem[]>(
      RequestApi.GetBlackList
    ),
    getFriendApplicationListAsApplicant:
      openIMSDK.createRequestFunctionWithoutParams<FriendApplicationItem[]>(
        RequestApi.GetFriendApplicationListAsApplicant
      ),
    getFriendApplicationListAsRecipient:
      openIMSDK.createRequestFunctionWithoutParams<FriendApplicationItem[]>(
        RequestApi.GetFriendApplicationListAsRecipient
      ),
    getFriendList: openIMSDK.createRequestFunctionWithoutParams<FullUserItem[]>(
      RequestApi.GetFriendList
    ),
    getSpecifiedFriendsInfo: openIMSDK.createRequestFunction<
      string[],
      FullUserItem[]
    >(RequestApi.GetSpecifiedFriendsInfo),
    refuseFriendApplication:
      openIMSDK.createRequestFunction<AccessFriendParams>(
        RequestApi.RefuseFriendApplication
      ),
    removeBlack: openIMSDK.createRequestFunction<string>(
      RequestApi.RemoveBlack
    ),
    searchFriends: openIMSDK.createRequestFunction<
      SearchFriendParams,
      SearchedFriendsInfo[]
    >(RequestApi.SearchFriends),
    setFriendRemark: openIMSDK.createRequestFunction<RemarkFriendParams>(
      RequestApi.SetFriendRemark
    ),
  };
}

export interface FriendApi {
  acceptFriendApplication: (
    params: AccessFriendParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  addBlack: (
    params: AddBlackParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  addFriend: (
    params: string,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  checkFriend: (
    params: string[],
    operationID?: string
  ) => Promise<WsResponse<FriendshipInfo[]>>;
  deleteFriend: (
    params: string,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  getBlackList: (operationID?: string) => Promise<WsResponse<BlackUserItem[]>>;
  getFriendApplicationListAsApplicant: (
    operationID?: string
  ) => Promise<WsResponse<FriendApplicationItem[]>>;
  getFriendApplicationListAsRecipient: (
    operationID?: string
  ) => Promise<WsResponse<FriendApplicationItem[]>>;
  getFriendList: (operationID?: string) => Promise<WsResponse<FullUserItem[]>>;
  getSpecifiedFriendsInfo: (
    params: string[],
    operationID?: string
  ) => Promise<WsResponse<FullUserItem[]>>;
  refuseFriendApplication: (
    params: AccessFriendParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  removeBlack: (
    params: string,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  searchFriends: (
    params: SearchFriendParams,
    operationID?: string
  ) => Promise<WsResponse<SearchedFriendsInfo[]>>;
  setFriendRemark: (
    params: RemarkFriendParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
}
