import { RequestApi } from '@/constant/api';
import OpenIMSDK from '.';
import type {
  GetOneConversationParams,
  PinConversationParams,
  SetBurnDurationParams,
  SetConversationDraftParams,
  SetConversationPrivateParams,
  SetConversationRecvOptParams,
  SplitConversationParams,
} from '@/types/params';
import type { ConversationItem, WsResponse } from '@/types/entity';

export function setupConversation(openIMSDK: OpenIMSDK) {
  return {
    getAllConversationList: openIMSDK.createRequestFunctionWithoutParams<
      ConversationItem[]
    >(RequestApi.GetAllConversationList),
    getConversationListSplit: openIMSDK.createRequestFunction<
      SplitConversationParams,
      ConversationItem[]
    >(RequestApi.GetConversationListSplit, data =>
      JSON.stringify([data.offset, data.count])
    ),
    getOneConversation: openIMSDK.createRequestFunction<
      GetOneConversationParams,
      ConversationItem
    >(RequestApi.GetOneConversation, data =>
      JSON.stringify([data.sessionType, data.sourceID])
    ),
    getMultipleConversation: openIMSDK.createRequestFunction<
      string,
      ConversationItem[]
    >(RequestApi.GetMultipleConversation),
    getConversationIDBySessionType: openIMSDK.createRequestFunction<
      GetOneConversationParams,
      ConversationItem
    >(RequestApi.GetConversationIDBySessionType, data =>
      JSON.stringify([data.sourceID, data.sessionType])
    ),
    getTotalUnreadMsgCount:
      openIMSDK.createRequestFunctionWithoutParams<number>(
        RequestApi.GetTotalUnreadMsgCount
      ),
    markConversationMessageAsRead: openIMSDK.createRequestFunction<string>(
      RequestApi.MarkConversationMessageAsRead
    ),
    setConversationDraft:
      openIMSDK.createRequestFunction<SetConversationDraftParams>(
        RequestApi.SetConversationDraft,
        data => JSON.stringify([data.conversationID, data.draftText])
      ),
    pinConversation: openIMSDK.createRequestFunction<PinConversationParams>(
      RequestApi.PinConversation,
      data => JSON.stringify([data.conversationID, data.isPinned])
    ),
    setConversationRecvMessageOpt:
      openIMSDK.createRequestFunction<SetConversationRecvOptParams>(
        RequestApi.SetConversationRecvMessageOpt,
        data => JSON.stringify([data.conversationID, data.opt])
      ),
    setConversationPrivateChat:
      openIMSDK.createRequestFunction<SetConversationPrivateParams>(
        RequestApi.SetConversationPrivateChat,
        data => JSON.stringify([data.conversationID, data.isPrivate])
      ),
    setConversationBurnDuration:
      openIMSDK.createRequestFunction<SetBurnDurationParams>(
        RequestApi.SetConversationBurnDuration,
        data => JSON.stringify([data.conversationID, data.burnDuration])
      ),
    resetConversationGroupAtType: openIMSDK.createRequestFunction<string>(
      RequestApi.ResetConversationGroupAtType
    ),
    hideConversation: openIMSDK.createRequestFunction<string>(
      RequestApi.HideConversation
    ),
    hideAllConversation: openIMSDK.createRequestFunctionWithoutParams(
      RequestApi.HideAllConversation
    ),
    clearConversationAndDeleteAllMsg: openIMSDK.createRequestFunction<string>(
      RequestApi.ClearConversationAndDeleteAllMsg
    ),
    deleteConversationAndDeleteAllMsg: openIMSDK.createRequestFunction<string>(
      RequestApi.DeleteConversationAndDeleteAllMsg
    ),
  };
}

export interface ConversationApi {
  getAllConversationList: (
    operationID?: string
  ) => Promise<WsResponse<ConversationItem[]>>;
  getConversationListSplit: (
    params: SplitConversationParams,
    operationID?: string
  ) => Promise<WsResponse<ConversationItem[]>>;
  getOneConversation: (
    params: GetOneConversationParams,
    operationID?: string
  ) => Promise<WsResponse<ConversationItem>>;
  getMultipleConversation: (
    params: string,
    operationID?: string
  ) => Promise<WsResponse<ConversationItem[]>>;
  getConversationIDBySessionType: (
    params: GetOneConversationParams,
    operationID?: string
  ) => Promise<WsResponse<ConversationItem>>;
  getTotalUnreadMsgCount: (operationID?: string) => Promise<WsResponse<number>>;
  markConversationMessageAsRead: (
    params: string,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  setConversationDraft: (
    params: SetConversationDraftParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  pinConversation: (
    params: PinConversationParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  setConversationRecvMessageOpt: (
    params: SetConversationRecvOptParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  setConversationPrivateChat: (
    params: SetConversationPrivateParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  setConversationBurnDuration: (
    params: SetBurnDurationParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  resetConversationGroupAtType: (
    params: string,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  hideConversation: (
    params: string,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  hideAllConversation: (operationID?: string) => Promise<WsResponse<unknown>>;
  clearConversationAndDeleteAllMsg: (
    params: string,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  deleteConversationAndDeleteAllMsg: (
    params: string,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
}
