import { TypingUpdateParams } from "./../../types/index.d";
import {
  MessageEntity,
  MessageItem,
  MessageType,
  OfflinePush,
  PicBaseInfo,
} from "open-im-sdk";

export type createAdvancedQuoteMessageParams = {
  text: string;
  message: MessageItem;
  messageEntityList: MessageEntity[];
};

export type createAdvancedTextMessageParams = {
  text: string;
  messageEntityList: MessageEntity[];
};

export type createCardMessageParams = {
  userID: string;
  nickname: string;
  faceURL: string;
  ex: string;
};

export type createCustomMessageParams = {
  data: string;
  extension: string;
  description: string;
};

export type createFaceMessageWithIndexParams = {
  index: number;
  dataStr: string;
};

export type createFileMessageParams = {
  filePath: string;
  fileName: string;
  uuid: string;
  sourceUrl: string;
  fileSize: number;
  fileType?: string;
};

export type createImageMessageParams = {
  sourcePicture: PicBaseInfo;
  bigPicture: PicBaseInfo;
  snapshotPicture: PicBaseInfo;
};

export type createLocationMessageParams = {
  description: string;
  longitude: number;
  latitude: number;
};

export type createMergeMessageParams = {
  messageList: MessageItem[];
  title: string;
  summaryList: string[];
};

export type createQuoteMessageParams = {
  text: string;
  message: MessageItem;
};

export type createSoundMessageParams = {
  uuid: string;
  soundPath: string;
  sourceUrl: string;
  dataSize: number;
  duration: number;
  soundType?: string;
};

export type createTextAtMessageParams = {
  text: string;
  atUserIDList: string[];
  atUsersInfo: AtUsersInfoItem[];
  message?: MessageItem;
};

export type createVideoMessageParams = {
  videoPath: string;
  duration: number;
  videoType: string;
  snapshotPath: string;
  videoUUID: string;
  videoUrl: string;
  videoSize: number;
  snapshotUUID: string;
  snapshotSize: number;
  snapshotUrl: string;
  snapshotWidth: number;
  snapshotHeight: number;
  snapShotType: string;
};

export type deleteMessageParams = {
  conversationID: string;
  clientMsgID: string;
};

export type deleteMessageFromLocalStorageParams = {
  conversationID: string;
  clientMsgID: string;
};

export type findMessageListParams = {
  conversationID: string;
  clientMsgIDList: string[];
};

export type getAdvancedHistoryMessageListParams = {
  lastMinSeq: number;
  count: number;
  startClientMsgID: string;
  conversationID: string;
};

export type getAdvancedHistoryMessageListReverseParams = {
  lastMinSeq: number;
  count: number;
  startClientMsgID: string;
  conversationID: string;
};

export type insertGroupMessageToLocalStorageParams = {
  message: MessageItem;
  groupID: string;
  sendID: string;
};

export type insertSingleMessageToLocalStorageParams = {
  message: MessageItem;
  recvID: string;
  sendID: string;
};

export type MARKMESSAGEASREADBYMSGIDParams = {
  conversationID: string;
  clientMsgIDList: string[];
};

export type revokeMessageParams = {
  conversationID: string;
  clientMsgID: string;
};
export type searchLocalMessagesParams = {
  conversationID?: string;
  keywordList: string[];
  keywordListMatchType?: number;
  senderUserIDList?: string[];
  messageTypeList: MessageType[];
  searchTimePosition: number;
  searchTimePeriod: number;
  pageIndex: number;
  count: number;
};
export type sendMessageParams = {
  recvID: string;
  groupID: string;
  offlinePushInfo?: OfflinePush;
  message: MessageItem;
};

export type sendMessageNotOssParams = {
  recvID: string;
  groupID: string;
  offlinePushInfo?: OfflinePush;
  message: MessageItem;
};

export type typingStatusUpdateParams = {
  recvID: string;
  msgTip: string;
};
