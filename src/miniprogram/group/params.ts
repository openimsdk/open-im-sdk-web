import { TypingUpdateParams } from "./../../types/index.d";
import {
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
