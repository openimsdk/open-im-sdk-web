import type {
  AccessGroupParams,
  ChangeGroupMemberMuteParams,
  ChangeGroupMuteParams,
  CreateGroupParams,
  GetGroupMemberByTimeParams,
  GetGroupMemberParams,
  JoinGroupParams,
  OpreateGroupParams,
  SearchGroupMemberParams,
  SearchGroupParams,
  SetGroupinfoParams,
  TransferGroupParams,
  UpdateMemberInfoParams,
  getGroupMembersInfoParams,
} from '@/types/params';
import OpenIMSDK from '.';
import { RequestApi } from '@/constant/api';
import type {
  GroupApplicationItem,
  GroupItem,
  GroupMemberItem,
  WsResponse,
} from '@/types/entity';

export function setupGroup(openIMSDK: OpenIMSDK) {
  return {
    createGroup: openIMSDK.createRequestFunction<CreateGroupParams, GroupItem>(
      RequestApi.CreateGroup
    ),
    joinGroup: openIMSDK.createRequestFunction<JoinGroupParams>(
      RequestApi.JoinGroup,
      data =>
        JSON.stringify([
          data.groupID,
          data.reqMsg,
          data.joinSource,
          data.ex ?? '',
        ])
    ),
    inviteUserToGroup: openIMSDK.createRequestFunction<OpreateGroupParams>(
      RequestApi.InviteUserToGroup,
      data =>
        JSON.stringify([
          data.groupID,
          data.reason,
          JSON.stringify(data.userIDList),
        ])
    ),
    getJoinedGroupList: openIMSDK.createRequestFunctionWithoutParams<
      GroupItem[]
    >(RequestApi.GetJoinedGroupList),
    searchGroups: openIMSDK.createRequestFunction<
      SearchGroupParams,
      GroupItem[]
    >(RequestApi.SearchGroups),
    getSpecifiedGroupsInfo: openIMSDK.createRequestFunction<
      string[],
      GroupItem[]
    >(RequestApi.GetSpecifiedGroupsInfo),
    setGroupInfo: openIMSDK.createRequestFunction<SetGroupinfoParams>(
      RequestApi.SetGroupInfo
    ),
    getGroupApplicationListAsRecipient:
      openIMSDK.createRequestFunctionWithoutParams<GroupApplicationItem[]>(
        RequestApi.GetGroupApplicationListAsRecipient
      ),
    getGroupApplicationListAsApplicant:
      openIMSDK.createRequestFunctionWithoutParams<GroupApplicationItem[]>(
        RequestApi.GetGroupApplicationListAsApplicant
      ),
    acceptGroupApplication: openIMSDK.createRequestFunction<AccessGroupParams>(
      RequestApi.AcceptGroupApplication,
      data => JSON.stringify([data.groupID, data.fromUserID, data.handleMsg])
    ),
    refuseGroupApplication: openIMSDK.createRequestFunction<AccessGroupParams>(
      RequestApi.RefuseGroupApplication,
      data => JSON.stringify([data.groupID, data.fromUserID, data.handleMsg])
    ),
    getGroupMemberList: openIMSDK.createRequestFunction<
      GetGroupMemberParams,
      GroupMemberItem[]
    >(RequestApi.GetGroupMemberList, data =>
      JSON.stringify([data.groupID, data.filter, data.offset, data.count])
    ),
    getSpecifiedGroupMembersInfo: openIMSDK.createRequestFunction<
      getGroupMembersInfoParams,
      GroupMemberItem[]
    >(RequestApi.GetSpecifiedGroupMembersInfo, data =>
      JSON.stringify([data.groupID, JSON.stringify(data.userIDList)])
    ),
    searchGroupMembers: openIMSDK.createRequestFunction<
      SearchGroupMemberParams,
      GroupMemberItem[]
    >(RequestApi.SearchGroupMembers),
    setGroupMemberInfo: openIMSDK.createRequestFunction<UpdateMemberInfoParams>(
      RequestApi.SetGroupMemberInfo
    ),
    getGroupMemberOwnerAndAdmin: openIMSDK.createRequestFunction<
      string,
      GroupMemberItem[]
    >(RequestApi.GetGroupMemberOwnerAndAdmin),
    getGroupMemberListByJoinTimeFilter: openIMSDK.createRequestFunction<
      GetGroupMemberByTimeParams,
      GroupMemberItem[]
    >(RequestApi.GetGroupMemberListByJoinTimeFilter, data =>
      JSON.stringify([
        data.groupID,
        data.offset,
        data.count,
        data.joinTimeBegin,
        data.joinTimeEnd,
        JSON.stringify(data.filterUserIDList),
      ])
    ),
    kickGroupMember: openIMSDK.createRequestFunction<OpreateGroupParams>(
      RequestApi.KickGroupMember,
      data =>
        JSON.stringify([
          data.groupID,
          data.reason,
          JSON.stringify(data.userIDList),
        ])
    ),
    changeGroupMemberMute:
      openIMSDK.createRequestFunction<ChangeGroupMemberMuteParams>(
        RequestApi.ChangeGroupMemberMute,
        data => JSON.stringify([data.groupID, data.userID, data.mutedSeconds])
      ),
    changeGroupMute: openIMSDK.createRequestFunction<ChangeGroupMuteParams>(
      RequestApi.ChangeGroupMute,
      data => JSON.stringify([data.groupID, data.isMute])
    ),
    transferGroupOwner: openIMSDK.createRequestFunction<TransferGroupParams>(
      RequestApi.TransferGroupOwner,
      data => JSON.stringify([data.groupID, data.newOwnerUserID])
    ),
    dismissGroup: openIMSDK.createRequestFunction<string>(
      RequestApi.DismissGroup
    ),
    quitGroup: openIMSDK.createRequestFunction<string>(RequestApi.QuitGroup),
  };
}

export interface GroupApi {
  createGroup: (
    params: CreateGroupParams,
    operationID?: string
  ) => Promise<WsResponse<GroupItem>>;
  joinGroup: (
    params: JoinGroupParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  inviteUserToGroup: (
    params: OpreateGroupParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  getJoinedGroupList: (
    operationID?: string
  ) => Promise<WsResponse<GroupItem[]>>;
  searchGroups: (
    params: SearchGroupParams,
    operationID?: string
  ) => Promise<WsResponse<GroupItem[]>>;
  getSpecifiedGroupsInfo: (
    params: string[],
    operationID?: string
  ) => Promise<WsResponse<GroupItem[]>>;
  setGroupInfo: (
    params: SetGroupinfoParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  getGroupApplicationListAsRecipient: (
    operationID?: string
  ) => Promise<WsResponse<GroupApplicationItem[]>>;
  getGroupApplicationListAsApplicant: (
    operationID?: string
  ) => Promise<WsResponse<GroupApplicationItem[]>>;
  acceptGroupApplication: (
    params: AccessGroupParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  refuseGroupApplication: (
    params: AccessGroupParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  getGroupMemberList: (
    operationID?: string
  ) => Promise<WsResponse<GroupMemberItem[]>>;
  getSpecifiedGroupMembersInfo: (
    params: getGroupMembersInfoParams,
    operationID?: string
  ) => Promise<WsResponse<GroupMemberItem[]>>;
  searchGroupMembers: (
    params: SearchGroupMemberParams,
    operationID?: string
  ) => Promise<WsResponse<GroupMemberItem[]>>;
  setGroupMemberInfo: (
    params: UpdateMemberInfoParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  getGroupMemberOwnerAndAdmin: (
    params: string,
    operationID?: string
  ) => Promise<WsResponse<GroupMemberItem[]>>;
  getGroupMemberListByJoinTimeFilter: (
    params: GetGroupMemberByTimeParams,
    operationID?: string
  ) => Promise<WsResponse<GroupMemberItem[]>>;
  kickGroupMember: (
    params: OpreateGroupParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  changeGroupMemberMute: (
    params: ChangeGroupMemberMuteParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  changeGroupMute: (
    params: ChangeGroupMuteParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  transferGroupOwner: (
    params: TransferGroupParams,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  dismissGroup: (
    params: string,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
  quitGroup: (
    params: string,
    operationID?: string
  ) => Promise<WsResponse<unknown>>;
}
