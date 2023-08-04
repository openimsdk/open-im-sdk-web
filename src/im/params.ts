export type getConversationListSplitParams = {
  offset: number;
  count: number;
};

export type getOneConversationParams = {
  sourceID: string;
  sessionType: number;
};

export type pinConversationParams = {
  ConversationID: string;
  isPinned: boolean;
};

export type setConversationBurnDurationParams = {
  ConversationID: string;
  burnDuration: number;
};
export type setConversationDraftParams = {
  ConversationID: string;
  draftText: string;
};
export type setConversationPrivateChatParams = {
  ConversationID: string;
  isPrivate: boolean;
};

export type setConversationRecvMessageOptParams = {
  ConversationID: string;
  opt: MessageReceiveOptType;
};

export enum MessageReceiveOptType {
  Nomal = 0,
  NotReceive = 1,
  NotNotify = 2,
}

export type addFriendParams = {
  fromUserID: string;
  ToUserID: string;
  ReqMSg: string;
  ex: string;
};

export type pageNationParams = {
  pageNumber: string;
  showNumber: string;
};

export type searchFriendParams = {
  keywordList: string[];
  isSearchUserID: boolean;
  isSearchNickname: boolean;
  isSearchRemark: boolean;
};

export type setFriendRemarkParams = {
  toUserID: string;
  remark: string;
};

export type judgeFriendParams = {
  userID: string;
  otherUserID: string;
};

export type getFriendBlackListParams = {
  userID: string;
  pageNation: pageNationParams;
};
export type getFriendListParams = {
  userID: string;
  pageNation: pageNationParams;
};
export type getRecvFriendApplicationListParams = {
  userID: string;
  pageNation: pageNationParams;
};
export type getSendFriendApplicationListParams = {
  userID: string;
  pageNation: pageNationParams;
};
export type getSpecifiedFriendsInfoParams = {
  userID: string;
  pageNation: pageNationParams;
};

export type acceptFriendApplicationParams = {
  toUserID: string;
  handleMsg: string;
};

export type refuseFriendApplicationParams = {
  toUserID: string;
  handleMsg: string;
};
import {
  AtUsersInfoItem,
  GroupInitInfo,
  GroupJoinSource,
  GroupVerificationType,
} from "open-im-sdk";

export type acceptGroupApplicationParams = {
  groupID: string;
  fromUserID: string;
  handleMsg: string;
};

export type changeGroupMemberMuteParams = {
  groupID: string;
  userID: string;
  mutedSeconds: number;
};

export type changeGroupToMuteParams = {
  groupID: string;
  isMute: boolean;
};

export type createGroupParams = {
  groupInfo: GroupInitInfo;
  memberUserIDs: string[];
  adminUserIDs?: string[];
  ownerUserID?: string;
};
export type dismissGroupParams = { groupID: string };

export type getGroupMemberListParams = {
  groupID: string;
  filter: number;
  offset: number;
  count: number;
};

export type getGroupMemberListByJoinTimeFilterParams = {
  groupID: string;
  offset: number;
  count: number;
  joinTimeBegin: number;
  joinTimeEnd: number;
  filterUserIDList: string[];
};

export type getGroupMemberOwnerAndAdminParams = { groupID: string };

export type getSpecifiedGroupMembersInfoParams = {
  groupID: string;
  userIDList: string[];
};

export type getSpecifiedGroupsInfoParams = {
  groupIDList: string[];
};

export type inviteUserToGroupParams = {
  groupID: string;
  reason: string;
  userIDList: string[];
};

export type joinGroupParams = {
  groupID: string;
  reqMsg: string;
  joinSource: GroupJoinSource;
};

export type kickGroupMemberParams = {
  groupID: string;
  reason: string;
  userIDList: string[];
};

export type quitGroup = { groupID: string };

export type refuseGroupApplicationParams = {
  groupID: string;
  fromUserID: string;
  handleMsg: string;
};

export type searchGroupMembersParams = {
  groupID: string;
  keywordList: string[];
  isSearchUserID: boolean;
  isSearchMemberNickname: boolean;
  offset: number;
  count: number;
};

export type searchGroupsParams = {
  keywordList: string[];
  isSearchGroupID: boolean;
  isSearchGroupName: boolean;
};

export type setGroupApplyMemberFriendParams = {
  groupID: string;
  rule: number;
};

export type setGroupInfoParams = {
  groupID: string;
  groupName?: string;
  introduction?: string;
  notification?: string;
  faceURL?: string;
  ex?: string;
};

export type setGroupLookMemberInfoParams = {
  groupID: string;
  rule: number;
};

export type setGroupMemberInfoParams = {
  groupID: string;
  userID: string;
  ex: string;
};

export type setGroupMemberNicknameParams = {
  groupID: string;
  userID: string;
  groupMemberNickname: string;
};
export enum GroupMemberRole {
  GroupOwner = 100,
  GroupAdmin = 60,
  GroupOrdinaryUsers = 20,
}

export type setGroupMemberRoleLevelParams = {
  groupID: string;
  userID: string;
  roleLevel: GroupMemberRole;
};

export type setGroupVerificationParams = {
  groupID: string;
  verification: GroupVerificationType;
};

export type transferGroupOwnerParams = {
  groupID: string;
  newOwnerUserID: string;
};

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

export type SelfUserInfoParams = {
  userID: string;
  nikName: string;
  faceURL: string;
  createTime: number;
  appManagerLevel: number;
  ex: string;
  AttachedInfo: string;
  globalRecvMsgOpt: MessageReceiveOptType;
};

export type upLoadFileParams = {
  name: string;
  contentType: string;
  uuid: string;
  file: File;
};
