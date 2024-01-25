import { RequestApi } from '@/constant/api';
import OpenIMSDK from '.';
import type {
  AtMsgParams,
  CustomMsgParams,
  FaceMessageParams,
  FileMsgParams,
  FindMessageParams,
  GetAdvancedHistoryMsgParams,
  ImageMsgParams,
  InsertGroupMsgParams,
  InsertSingleMsgParams,
  LocationMsgParams,
  MergerMsgParams,
  OpreateMessageParams,
  QuoteMsgParams,
  SearchLocalParams,
  SendMsgParams,
  SetMessageLocalExParams,
  SoundMsgParams,
  TypingUpdateParams,
  VideoMsgParams,
} from '@/types/params';
import type {
  AdvancedGetMessageResult,
  CardElem,
  MessageItem,
  SearchMessageResult,
  WsResponse,
} from '@/types/entity';

export function setupMessage(openIMSDK: OpenIMSDK) {
  return {
    createTextMessage: openIMSDK.createRequestFunction<string, MessageItem>(
      RequestApi.CreateTextMessage
    ),
    createTextAtMessage: openIMSDK.createRequestFunction<
      AtMsgParams,
      MessageItem
    >(RequestApi.CreateTextAtMessage, data =>
      JSON.stringify([
        data.text,
        JSON.stringify(data.atUserIDList),
        JSON.stringify(data.atUsersInfo),
        JSON.stringify(data.message) ?? '',
      ])
    ),
    createImageMessageByURL: openIMSDK.createRequestFunction<
      ImageMsgParams,
      MessageItem
    >(RequestApi.CreateImageMessageByURL, data =>
      JSON.stringify([
        data.sourcePath,
        JSON.stringify(data.sourcePicture),
        JSON.stringify(data.bigPicture),
        JSON.stringify(data.snapshotPicture),
      ])
    ),
    createSoundMessageByURL: openIMSDK.createRequestFunction<
      SoundMsgParams,
      MessageItem
    >(RequestApi.CreateSoundMessageByURL),
    createVideoMessageByURL: openIMSDK.createRequestFunction<
      VideoMsgParams,
      MessageItem
    >(RequestApi.CreateVideoMessageByURL),
    createFileMessageByURL: openIMSDK.createRequestFunction<
      FileMsgParams,
      MessageItem
    >(RequestApi.CreateFileMessageByURL),
    createMergerMessage: openIMSDK.createRequestFunction<
      MergerMsgParams,
      MessageItem
    >(RequestApi.CreateMergerMessage, data =>
      JSON.stringify([
        JSON.stringify(data.messageList),
        data.title,
        JSON.stringify(data.summaryList),
      ])
    ),
    createForwardMessage: openIMSDK.createRequestFunction<
      MessageItem,
      MessageItem
    >(RequestApi.CreateForwardMessage),
    createLocationMessage: openIMSDK.createRequestFunction<
      LocationMsgParams,
      MessageItem
    >(RequestApi.CreateLocationMessage, data =>
      JSON.stringify([data.description, data.longitude, data.latitude])
    ),
    createQuoteMessage: openIMSDK.createRequestFunction<
      QuoteMsgParams,
      MessageItem
    >(RequestApi.CreateQuoteMessage, data =>
      JSON.stringify([data.text, data.message])
    ),
    createCardMessage: openIMSDK.createRequestFunction<CardElem, MessageItem>(
      RequestApi.CreateCardMessage
    ),
    createCustomMessage: openIMSDK.createRequestFunction<
      CustomMsgParams,
      MessageItem
    >(RequestApi.CreateCustomMessage, data =>
      JSON.stringify([data.data, data.extension, data.description])
    ),
    createFaceMessage: openIMSDK.createRequestFunction<
      FaceMessageParams,
      MessageItem
    >(RequestApi.CreateFaceMessage, data =>
      JSON.stringify([data.index, data.data])
    ),
    sendMessage: openIMSDK.createRequestFunction<SendMsgParams, MessageItem>(
      RequestApi.SendMessageNotOss,
      data => {
        const offlinePushInfo = data.offlinePushInfo ?? {
          title: 'You has a new message.',
          desc: 'message',
          ex: '',
          iOSPushSound: '+1',
          iOSBadgeCount: true,
        };
        return JSON.stringify([
          JSON.stringify(data.message),
          data.recvID,
          data.groupID,
          JSON.stringify(offlinePushInfo),
        ]);
      }
    ),
    sendMessageNotOss: openIMSDK.createRequestFunction<
      SendMsgParams,
      MessageItem
    >(RequestApi.SendMessageNotOss, data => {
      const offlinePushInfo = data.offlinePushInfo ?? {
        title: 'You has a new message.',
        desc: 'message',
        ex: '',
        iOSPushSound: '+1',
        iOSBadgeCount: true,
      };
      return JSON.stringify([
        JSON.stringify(data.message),
        data.recvID,
        data.groupID,
        JSON.stringify(offlinePushInfo),
      ]);
    }),
    typingStatusUpdate: openIMSDK.createRequestFunction<TypingUpdateParams>(
      RequestApi.TypingStatusUpdate,
      data => JSON.stringify([data.recvID, data.msgTip])
    ),
    revokeMessage: openIMSDK.createRequestFunction<OpreateMessageParams>(
      RequestApi.RevokeMessage,
      data => JSON.stringify([data.conversationID, data.clientMsgID])
    ),
    deleteMessage: openIMSDK.createRequestFunction<OpreateMessageParams>(
      RequestApi.DeleteMessage,
      data => JSON.stringify([data.conversationID, data.clientMsgID])
    ),
    deleteMessageFromLocalStorage:
      openIMSDK.createRequestFunction<OpreateMessageParams>(
        RequestApi.DeleteMessageFromLocalStorage,
        data => JSON.stringify([data.conversationID, data.clientMsgID])
      ),
    deleteAllMsgFromLocal: openIMSDK.createRequestFunctionWithoutParams(
      RequestApi.DeleteAllMsgFromLocal
    ),
    deleteAllMsgFromLocalAndSvr: openIMSDK.createRequestFunctionWithoutParams(
      RequestApi.DeleteAllMsgFromLocalAndSvr
    ),
    searchLocalMessages: openIMSDK.createRequestFunction<
      SearchLocalParams,
      SearchMessageResult
    >(RequestApi.SearchLocalMessages),
    getAdvancedHistoryMessageList: openIMSDK.createRequestFunction<
      GetAdvancedHistoryMsgParams,
      AdvancedGetMessageResult
    >(RequestApi.GetAdvancedHistoryMessageList),
    getAdvancedHistoryMessageListReverse: openIMSDK.createRequestFunction<
      GetAdvancedHistoryMsgParams,
      AdvancedGetMessageResult
    >(RequestApi.GetAdvancedHistoryMessageListReverse),
    findMessageList: openIMSDK.createRequestFunction<
      FindMessageParams[],
      MessageItem[]
    >(RequestApi.FindMessageList),
    insertGroupMessageToLocalStorage:
      openIMSDK.createRequestFunction<InsertGroupMsgParams>(
        RequestApi.InsertGroupMessageToLocalStorage,
        data =>
          JSON.stringify([
            JSON.stringify(data.message),
            data.groupID,
            data.sendID,
          ])
      ),
    insertSingleMessageToLocalStorage:
      openIMSDK.createRequestFunction<InsertSingleMsgParams>(
        RequestApi.InsertSingleMessageToLocalStorage,
        data =>
          JSON.stringify([
            JSON.stringify(data.message),
            data.recvID,
            data.sendID,
          ])
      ),
    setMessageLocalEx: openIMSDK.createRequestFunction<SetMessageLocalExParams>(
      RequestApi.SetMessageLocalEx,
      data =>
        JSON.stringify([data.conversationID, data.clientMsgID, data.localEx])
    ),
  };
}

export interface MessageApi {
  createTextMessage: (
    params: string,
    operationID?: string
  ) => Promise<WsResponse<MessageItem>>;
  createTextAtMessage: (
    params: AtMsgParams,
    operationID?: string
  ) => Promise<WsResponse<MessageItem>>;
  createImageMessageByURL: (
    params: ImageMsgParams,
    operationID?: string
  ) => Promise<WsResponse<MessageItem>>;
  createSoundMessageByURL: (
    params: SoundMsgParams,
    operationID?: string
  ) => Promise<WsResponse<MessageItem>>;
  createVideoMessageByURL: (
    params: VideoMsgParams,
    operationID?: string
  ) => Promise<WsResponse<MessageItem>>;
  createFileMessageByURL: (
    params: FileMsgParams,
    operationID?: string
  ) => Promise<WsResponse<MessageItem>>;
  createMergerMessage: (
    params: MergerMsgParams,
    operationID?: string
  ) => Promise<WsResponse<MessageItem>>;
  createForwardMessage: (
    params: MessageItem,
    operationID?: string
  ) => Promise<WsResponse<MessageItem>>;
  createLocationMessage: (
    params: LocationMsgParams,
    operationID?: string
  ) => Promise<WsResponse<MessageItem>>;
  createQuoteMessage: (
    params: QuoteMsgParams,
    operationID?: string
  ) => Promise<WsResponse<MessageItem>>;
  createCardMessage: (
    params: CardElem,
    operationID?: string
  ) => Promise<WsResponse<MessageItem>>;
  createCustomMessage: (
    params: CustomMsgParams,
    operationID?: string
  ) => Promise<WsResponse<MessageItem>>;
  createFaceMessage: (
    params: FaceMessageParams,
    operationID?: string
  ) => Promise<WsResponse<MessageItem>>;
  sendMessage: (
    params: SendMsgParams,
    operationID?: string
  ) => Promise<WsResponse<MessageItem>>;
  sendMessageNotOss: (
    params: SendMsgParams,
    operationID?: string
  ) => Promise<WsResponse<MessageItem>>;
  typingStatusUpdate: (
    params: TypingUpdateParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  revokeMessage: (
    params: OpreateMessageParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  deleteMessage: (
    params: OpreateMessageParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  deleteMessageFromLocalStorage: (
    params: OpreateMessageParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  deleteAllMsgFromLocal: (operationID?: string) => Promise<WsResponse<unknown>>;
  deleteAllMsgFromLocalAndSvr: (
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  searchLocalMessages: (
    params: SearchLocalParams,
    operationID?: string
  ) => Promise<WsResponse<SearchMessageResult>>;
  getAdvancedHistoryMessageList: (
    params: GetAdvancedHistoryMsgParams,
    operationID?: string
  ) => Promise<WsResponse<AdvancedGetMessageResult>>;
  getAdvancedHistoryMessageListReverse: (
    params: GetAdvancedHistoryMsgParams,
    operationID?: string
  ) => Promise<WsResponse<AdvancedGetMessageResult>>;
  findMessageList: (
    params: FindMessageParams[],
    operationID?: string
  ) => Promise<WsResponse<MessageItem[]>>;
  insertGroupMessageToLocalStorage: (
    params: InsertGroupMsgParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  insertSingleMessageToLocalStorage: (
    params: InsertSingleMsgParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  setMessageLocalEx: (
    params: SetMessageLocalExParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
}
