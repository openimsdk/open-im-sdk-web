import type {
  AtUsersInfoItem,
  GroupItem,
  MessageItem,
  OfflinePush,
  PicBaseInfo,
  SelfUserInfo,
} from './entity';
import type {
  GroupJoinSource,
  GroupMemberFilter,
  GroupMemberRole,
  MessageReceiveOptType,
  MessageType,
} from './enum';

export type LoginParams = {
  userID: string;
  token: string;
  wsAddr: string;
  apiAddr: string;
  platformID: number;
};

export type SetSelfInfoParams = Partial<SelfUserInfo>;

export type GetUserInfoWithCacheParams = {
  userIDList: string[];
  groupID?: string;
};

export type SplitConversationParams = {
  offset: number;
  count: number;
};

export type GetOneConversationParams = {
  sourceID: string;
  sessionType: number;
};

export type SetConversationDraftParams = {
  conversationID: string;
  draftText: string;
};

export type PinConversationParams = {
  conversationID: string;
  isPinned: boolean;
};

export type SetConversationRecvOptParams = {
  conversationID: string;
  opt: MessageReceiveOptType;
};

export type SetConversationPrivateParams = {
  conversationID: string;
  isPrivate: boolean;
};

export type SetBurnDurationParams = {
  conversationID: string;
  burnDuration: number;
};

export type AccessFriendParams = {
  toUserID: string;
  handleMsg: string;
};

export type AddBlackParams = {
  toUserID: string;
  ex?: string;
};

export type SearchFriendParams = {
  keywordList: string[];
  isSearchUserID: boolean;
  isSearchNickname: boolean;
  isSearchRemark: boolean;
};

export type RemarkFriendParams = {
  toUserID: string;
  remark: string;
};

export type CreateGroupParams = {
  memberUserIDs: string[];
  groupInfo: Partial<GroupItem>;
  adminUserIDs?: string[];
  ownerUserID?: string;
};

export type JoinGroupParams = {
  groupID: string;
  reqMsg: string;
  joinSource: GroupJoinSource;
  ex?: string;
};

export type OpreateGroupParams = {
  groupID: string;
  reason: string;
  userIDList: string[];
};

export type SearchGroupParams = {
  keywordList: string[];
  isSearchGroupID: boolean;
  isSearchGroupName: boolean;
};

export type SetGroupinfoParams = Partial<GroupItem> & { groupID: string };

export type AccessGroupParams = {
  groupID: string;
  fromUserID: string;
  handleMsg: string;
};

export declare type GetGroupMemberParams = {
  groupID: string;
  filter: GroupMemberFilter;
  offset: number;
  count: number;
};

export type getGroupMembersInfoParams = {
  groupID: string;
  userIDList: string[];
};

export type SearchGroupMemberParams = {
  groupID: string;
  keywordList: string[];
  isSearchUserID: boolean;
  isSearchMemberNickname: boolean;
  offset: number;
  count: number;
};

export type UpdateMemberInfoParams = {
  groupID: string;
  userID: string;
  nickname?: string;
  faceURL?: string;
  roleLevel?: GroupMemberRole;
  ex?: string;
};

export type GetGroupMemberByTimeParams = {
  groupID: string;
  filterUserIDList: string[];
  offset: number;
  count: number;
  joinTimeBegin: number;
  joinTimeEnd: number;
};

export type ChangeGroupMemberMuteParams = {
  groupID: string;
  userID: string;
  mutedSeconds: number;
};

export type ChangeGroupMuteParams = {
  groupID: string;
  isMute: boolean;
};

export type TransferGroupParams = {
  groupID: string;
  newOwnerUserID: string;
};

export type AtMsgParams = {
  text: string;
  atUserIDList: string[];
  atUsersInfo?: AtUsersInfoItem[];
  message?: MessageItem;
};

export type ImageMsgParams = {
  sourcePicture: PicBaseInfo;
  bigPicture: PicBaseInfo;
  snapshotPicture: PicBaseInfo;
  sourcePath: string;
};

export type SoundMsgParams = {
  uuid: string;
  soundPath: string;
  sourceUrl: string;
  dataSize: number;
  duration: number;
  soundType?: string;
};

export type VideoMsgParams = {
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
  snapShotType?: string;
};

export type FileMsgParams = {
  filePath: string;
  fileName: string;
  uuid: string;
  sourceUrl: string;
  fileSize: number;
  fileType?: string;
};

export type MergerMsgParams = {
  messageList: MessageItem[];
  title: string;
  summaryList: string[];
};

export type LocationMsgParams = {
  description: string;
  longitude: number;
  latitude: number;
};

export type QuoteMsgParams = {
  text: string;
  message: string;
};

export type CustomMsgParams = {
  data: string;
  extension: string;
  description: string;
};

export type FaceMessageParams = {
  index: number;
  data: string;
};

export type SendMsgParams = {
  recvID: string;
  groupID: string;
  offlinePushInfo?: OfflinePush;
  message: MessageItem;
  isOnlineOnly?: boolean;
};

export type TypingUpdateParams = {
  recvID: string;
  msgTip: string;
};

export type OpreateMessageParams = {
  conversationID: string;
  clientMsgID: string;
};

export type SearchLocalParams = {
  conversationID: string;
  keywordList: string[];
  keywordListMatchType?: number;
  senderUserIDList?: string[];
  messageTypeList?: MessageType[];
  searchTimePosition?: number;
  searchTimePeriod?: number;
  pageIndex?: number;
  count?: number;
};

export type GetAdvancedHistoryMsgParams = {
  userID?: string;
  groupID?: string;
  lastMinSeq: number;
  count: number;
  startClientMsgID: string;
  conversationID: string;
};

export type FindMessageParams = {
  conversationID: string;
  clientMsgIDList: string[];
};

export type InsertGroupMsgParams = {
  message: MessageItem;
  groupID: string;
  sendID: string;
};

export type InsertSingleMsgParams = {
  message: MessageItem;
  recvID: string;
  sendID: string;
};

export type SetMessageLocalExParams = {
  conversationID: string;
  clientMsgID: string;
  localEx: string;
};

export declare type UploadFileParams = {
  name?: string;
  contentType?: string;
  uuid?: string;
  file: File;
};
