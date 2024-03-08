import { RequestApi } from '@/constant/api';
import type {
  AllowType,
  ApplicationHandleResult,
  GroupAtType,
  GroupJoinSource,
  GroupMemberRole,
  GroupStatus,
  GroupType,
  GroupVerificationType,
  MessageReceiveOptType,
  MessageStatus,
  MessageType,
  OnlineState,
  Platform,
  Relationship,
  SessionType,
} from './enum';
import { CbEvents } from '..';

export interface WsRequest {
  reqFuncName: RequestApi;
  userID: string;
  data: string;
  operationID: string;
}

export interface WsResponse<T = unknown> {
  event: RequestApi | CbEvents;
  errCode: number;
  errMsg: string;
  data: T;
  operationID: string;
}

export interface PromiseMap {
  resolve: (response: WsResponse) => void;
  reject: (response: WsResponse) => void;
}

export type MessageEntity = {
  type: string;
  offset: number;
  length: number;
  url?: string;
  info?: string;
};
export type PicBaseInfo = {
  uuid: string;
  type: string;
  size: number;
  width: number;
  height: number;
  url: string;
};
export type AtUsersInfoItem = {
  atUserID: string;
  groupNickname: string;
};
export type GroupApplicationItem = {
  createTime: number;
  creatorUserID: string;
  ex: string;
  groupFaceURL: string;
  groupID: string;
  groupName: string;
  groupType: GroupType;
  handleResult: ApplicationHandleResult;
  handleUserID: string;
  handledMsg: string;
  handledTime: number;
  introduction: string;
  memberCount: number;
  nickname: string;
  notification: string;
  ownerUserID: string;
  reqMsg: string;
  reqTime: number;
  joinSource: GroupJoinSource;
  status: GroupStatus;
  userFaceURL: string;
  userID: string;
};
export type FriendApplicationItem = {
  createTime: number;
  ex: string;
  fromFaceURL: string;
  fromNickname: string;
  fromUserID: string;
  handleMsg: string;
  handleResult: ApplicationHandleResult;
  handleTime: number;
  handlerUserID: string;
  reqMsg: string;
  toFaceURL: string;
  toNickname: string;
  toUserID: string;
};
export type FullUserItem = {
  blackInfo: BlackUserItem | null;
  friendInfo: FriendUserItem | null;
  publicInfo: PublicUserItem | null;
};
export type FullUserItemWithCache = {
  blackInfo: BlackUserItem | null;
  friendInfo: FriendUserItem | null;
  publicInfo: PublicUserItem | null;
  groupMemberInfo: GroupMemberItem | null;
};
export type PublicUserItem = {
  nickname: string;
  userID: string;
  faceURL: string;
  ex: string;
};
export type SelfUserInfo = {
  createTime: number;
  ex: string;
  faceURL: string;
  nickname: string;
  userID: string;
  globalRecvMsgOpt: MessageReceiveOptType;
};
export type PartialUserInfo = {
  userID: string;
} & Partial<Omit<SelfUserInfo, 'userID'>>;
export type FriendUserItem = {
  addSource: number;
  createTime: number;
  ex: string;
  faceURL: string;
  userID: string;
  nickname: string;
  operatorUserID: string;
  ownerUserID: string;
  remark: string;
  attachedInfo: string;
};
export type SearchedFriendsInfo = FriendUserItem & {
  relationship: Relationship;
};
export type FriendshipInfo = {
  result: number;
  userID: string;
};
export type BlackUserItem = {
  addSource: number;
  userID: string;
  createTime: number;
  ex: string;
  faceURL: string;
  nickname: string;
  operatorUserID: string;
  ownerUserID: string;
};
export type GroupItem = {
  groupID: string;
  groupName: string;
  notification: string;
  notificationUserID: string;
  notificationUpdateTime: number;
  introduction: string;
  faceURL: string;
  ownerUserID: string;
  createTime: number;
  memberCount: number;
  status: GroupStatus;
  creatorUserID: string;
  groupType: GroupType;
  needVerification: GroupVerificationType;
  ex: string;
  applyMemberFriend: AllowType;
  lookMemberInfo: AllowType;
};
export type GroupMemberItem = {
  groupID: string;
  userID: string;
  nickname: string;
  faceURL: string;
  roleLevel: GroupMemberRole;
  muteEndTime: number;
  joinTime: number;
  joinSource: GroupJoinSource;
  inviterUserID: string;
  operatorUserID: string;
  ex: string;
};
export type ConversationItem = {
  conversationID: string;
  conversationType: SessionType;
  userID: string;
  groupID: string;
  showName: string;
  faceURL: string;
  recvMsgOpt: MessageReceiveOptType;
  unreadCount: number;
  groupAtType: GroupAtType;
  latestMsg: string;
  latestMsgSendTime: number;
  draftText: string;
  draftTextTime: number;
  burnDuration: number;
  msgDestructTime: number;
  isPinned: boolean;
  isNotInGroup: boolean;
  isPrivateChat: boolean;
  isMsgDestruct: boolean;
  attachedInfo: string;
  ex: string;
};
export type MessageItem = {
  clientMsgID: string;
  serverMsgID: string;
  createTime: number;
  sendTime: number;
  sessionType: SessionType;
  sendID: string;
  recvID: string;
  msgFrom: number;
  contentType: MessageType;
  senderPlatformID: Platform;
  senderNickname: string;
  senderFaceUrl: string;
  groupID: string;
  content: string;
  seq: number;
  isRead: boolean;
  status: MessageStatus;
  isReact: boolean;
  isExternalExtensions: boolean;
  offlinePush: OfflinePush;
  attachedInfo: string;
  ex: string;
  localEx: string;
  textElem: TextElem;
  cardElem: CardElem;
  pictureElem: PictureElem;
  soundElem: SoundElem;
  videoElem: VideoElem;
  fileElem: FileElem;
  mergeElem: MergeElem;
  atTextElem: AtTextElem;
  faceElem: FaceElem;
  locationElem: LocationElem;
  customElem: CustomElem;
  quoteElem: QuoteElem;
  notificationElem: NotificationElem;
  advancedTextElem: AdvancedTextElem;
  typingElem: TypingElem;
  attachedInfoElem: AttachedInfoElem;
};
export type TextElem = {
  content: string;
};
export type CardElem = {
  userID: string;
  nickname: string;
  faceURL: string;
  ex: string;
};
export type AtTextElem = {
  text: string;
  atUserList: string[];
  atUsersInfo?: AtUsersInfoItem[];
  quoteMessage?: MessageItem;
  isAtSelf?: boolean;
};
export type NotificationElem = {
  detail: string;
};
export type AdvancedTextElem = {
  text: string;
  messageEntityList: MessageEntity[];
};
export type TypingElem = {
  msgTips: string;
};
export type CustomElem = {
  data: string;
  description: string;
  extension: string;
};
export type FileElem = {
  filePath: string;
  uuid: string;
  sourceUrl: string;
  fileName: string;
  fileSize: number;
};
export type FaceElem = {
  index: number;
  data: string;
};
export type LocationElem = {
  description: string;
  longitude: number;
  latitude: number;
};
export type MergeElem = {
  title: string;
  abstractList: string[];
  multiMessage: MessageItem[];
  messageEntityList: MessageEntity[];
};
export type OfflinePush = {
  title: string;
  desc: string;
  ex: string;
  iOSPushSound: string;
  iOSBadgeCount: boolean;
};
export type PictureElem = {
  sourcePath: string;
  sourcePicture: Picture;
  bigPicture: Picture;
  snapshotPicture: Picture;
};
export type AttachedInfoElem = {
  groupHasReadInfo: GroupHasReadInfo;
  isPrivateChat: boolean;
  isEncryption: boolean;
  inEncryptStatus: boolean;
  burnDuration: number;
  hasReadTime: number;
  notSenderNotificationPush: boolean;
  messageEntityList: MessageEntity[];
  uploadProgress: UploadProgress;
};
export type UploadProgress = {
  total: number;
  save: number;
  current: number;
};
export type GroupHasReadInfo = {
  hasReadCount: number;
  unreadCount: number;
  hasReadUserIDList: string[];
  groupMemberCount: number;
};
export type Picture = {
  uuid: string;
  type: string;
  size: number;
  width: number;
  height: number;
  url: string;
};
export type QuoteElem = {
  text: string;
  quoteMessage: MessageItem;
};
export type SoundElem = {
  uuid: string;
  soundPath: string;
  sourceUrl: string;
  dataSize: number;
  duration: number;
};
export type VideoElem = {
  videoPath: string;
  videoUUID: string;
  videoUrl: string;
  videoType: string;
  videoSize: number;
  duration: number;
  snapshotPath: string;
  snapshotUUID: string;
  snapshotSize: number;
  snapshotUrl: string;
  snapshotWidth: number;
  snapshotHeight: number;
};
export type AdvancedRevokeContent = {
  clientMsgID: string;
  revokeTime: number;
  revokerID: string;
  revokerNickname: string;
  revokerRole: number;
  seq: number;
  sessionType: SessionType;
  sourceMessageSendID: string;
  sourceMessageSendTime: number;
  sourceMessageSenderNickname: string;
};

export type RevokedInfo = {
  revokerID: string;
  revokerRole: number;
  clientMsgID: string;
  revokerNickname: string;
  revokeTime: number;
  sourceMessageSendTime: number;
  sourceMessageSendID: string;
  sourceMessageSenderNickname: string;
  sessionType: number;
  seq: number;
  ex: string;
};

export type ReceiptInfo = {
  userID: string;
  groupID: string;
  msgIDList: string[];
  readTime: number;
  msgFrom: number;
  contentType: MessageType;
  sessionType: SessionType;
};

export type SearchMessageResult = {
  totalCount: number;
  searchResultItems?: SearchMessageResultItem[];
  findResultItems?: SearchMessageResultItem[];
};

export type SearchMessageResultItem = {
  conversationID: string;
  messageCount: number;
  conversationType: SessionType;
  showName: string;
  faceURL: string;
  messageList: MessageItem[];
};

export type AdvancedGetMessageResult = {
  isEnd: boolean;
  lastMinSeq: number;
  errCode: number;
  errMsg: string;
  messageList: MessageItem[];
};

export type RtcInvite = {
  inviterUserID: string;
  inviteeUserIDList: string[];
  customData?: string;
  groupID: string;
  roomID: string;
  timeout: number;
  mediaType: string;
  sessionType: number;
  platformID: number;
  initiateTime?: number;
  busyLineUserIDList?: string[];
};

export type UserOnlineState = {
  platformIDs?: Platform[];
  status: OnlineState;
  userID: string;
};

export type GroupMessageReceiptInfo = {
  conversationID: string;
  groupMessageReadInfo: GroupMessageReadInfo[];
};
export type GroupMessageReadInfo = {
  clientMsgID: string;
  hasReadCount: number;
  unreadCount: number;
  readMembers: GroupMemberItem[];
};
