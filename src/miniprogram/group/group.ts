import { ChangeGroupMemberMuteParams } from "./../../types/index.d";
import {
  CbEvents,
  LoginParams,
  RequestFunc,
  Ws2Promise,
  WsParams,
  WsResponse,
  uuid,
} from "open-im-sdk";
import Emitter from "open-im-sdk/event";
import {
  acceptGroupApplicationParams,
  changeGroupToMuteParams,
  dismissGroupParams,
  getGroupMemberListByJoinTimeFilterParams,
  getGroupMemberListParams,
  getGroupMemberOwnerAndAdminParams,
  getSpecifiedGroupMembersInfoParams,
  getSpecifiedGroupsInfoParams,
  inviteUserToGroupParams,
  joinGroupParams,
  kickGroupMemberParams,
  refuseGroupApplicationParams,
  searchGroupMembersParams,
  searchGroupsParams,
  setGroupApplyMemberFriendParams,
  setGroupInfoParams,
  setGroupLookMemberInfoParams,
  setGroupMemberInfoParams,
  setGroupMemberNicknameParams,
  setGroupMemberRoleLevelParams,
  setGroupVerificationParams,
  transferGroupOwnerParams,
} from "./params";
import axios from "axios";

export default class OpenIMSDK extends Emitter {
  private uid: string | undefined;
  private token: string | undefined;
  private baseUrl: string = "http://localhost:10002";
  constructor() {
    super();
  }

  // accept group application
  acceptGroupApplication = (
    url: string = this.baseUrl,
    data: acceptGroupApplicationParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        reqFuncName: RequestFunc.ACCEPTGROUPAPPLICATION,
        operationID: operationID,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // change GroupMember to Mute
  changeGroupMemberMute = (
    url: string = this.baseUrl,
    data: ChangeGroupMemberMuteParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.CHANGEGROUPMEMBERMUTE,
      };
      this.HttpSend(args, url);
    });
  };

  // changeGroup to Mute
  changeGroupToMute = (
    url: string = this.baseUrl,
    data: changeGroupToMuteParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.CHANGEGROUPTOMUTE,
      };
      this.HttpSend(args, url);
    });
  };

  // create a Group
  createGroup = (
    url: string = this.baseUrl,
    data: changeGroupToMuteParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.CREATEGROUP,
      };
      this.HttpSend(args, url);
    });
  };

  // dismiss a group
  dismissGroup = (
    url: string = this.baseUrl,
    data: dismissGroupParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.DISMISSGROUP,
      };
      this.HttpSend(args, url);
    });
  };

  // get Group ApplicationList As Applicant
  getGroupApplicationListAsApplicant = (
    url: string = this.baseUrl,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.GETGROUPAPPLICATIONLISTASAPPLICANT,
        data: "",
      };
      this.HttpSend(args, url);
    });
  };

  // getGroupApplicationList As Recipient
  getGroupApplicationListAsRecipient = (
    url: string = this.baseUrl,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.GETGROUPAPPLICATIONLISTASRECIPIENT,
        data: "",
      };
      this.HttpSend(args, url);
    });
  };

  // getGroupMemberList
  getGroupMemberList = (
    url: string = this.baseUrl,
    data: getGroupMemberListParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.GETGROUPMEMBERLIST,
      };
      this.HttpSend(args, url);
    });
  };

  // getGroupMemberListByJoinTimeFilter
  getGroupMemberListByJoinTimeFilter = (
    url: string = this.baseUrl,
    data: getGroupMemberListByJoinTimeFilterParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.GETGROUPMEMBERLISTBYJOINTIMEFILTER,
      };
      this.HttpSend(args, url);
    });
  };

  // getGroupMemberOwnerAndAdmin
  getGroupMemberOwnerAndAdmin = (
    url: string = this.baseUrl,
    data: getGroupMemberOwnerAndAdminParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.GETGROUPMEMBEROWNERANDADMIN,
      };
      this.HttpSend(args, url);
    });
  };

  // get JoinedGroupList
  getJoinedGroupList = (url: string = this.baseUrl, operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.GETJOINEDGROUPLIST,
        data: "",
      };
      this.HttpSend(args, url);
    });
  };

  // get SpecifiedGroupMembersInfo
  getSpecifiedGroupMembersInfo = (
    url: string = this.baseUrl,
    data: getSpecifiedGroupMembersInfoParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.GETSPECIFIEDGROUPMEMBERSINFO,
      };
      this.HttpSend(args, url);
    });
  };

  // get SpecifiedGroupsInfo
  getSpecifiedGroupsInfo = (
    url: string = this.baseUrl,
    data: getSpecifiedGroupsInfoParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.GETSPECIFIEDGROUPSINFO,
      };
      this.HttpSend(args, url);
    });
  };

  // inviteUser To Group
  inviteUserToGroup = (
    url: string = this.baseUrl,
    data: inviteUserToGroupParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.INVITEUSERTOGROUP,
      };
      this.HttpSend(args, url);
    });
  };

  // joinGroup
  joinGroup = (
    url: string = this.baseUrl,
    data: joinGroupParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.JOINGROUP,
      };
      this.HttpSend(args, url);
    });
  };

  // kick GroupMember
  kickGroupMember = (
    url: string = this.baseUrl,
    data: kickGroupMemberParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.KICKGROUPMEMBER,
      };
      this.HttpSend(args, url);
    });
  };

  // quitGroup
  quitGroup = (
    url: string = this.baseUrl,
    data: kickGroupMemberParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.QUITGROUP,
      };
      this.HttpSend(args, url);
    });
  };

  // refuse a  GroupApplication
  refuseGroupApplication = (
    url: string = this.baseUrl,
    data: refuseGroupApplicationParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.REFUSEGROUPAPPLICATION,
      };
      this.HttpSend(args, url);
    });
  };

  // searchGroupMembers
  searchGroupMembers = (
    url: string = this.baseUrl,
    data: searchGroupMembersParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.SEARCHGROUPMEMBERS,
      };
      this.HttpSend(args, url);
    });
  };

  // searchGroups
  searchGroups = (
    url: string = this.baseUrl,
    data: searchGroupsParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.SEARCHGROUPS,
      };
      this.HttpSend(args, url);
    });
  };

  //set GroupApplyMemberFriend
  setGroupApplyMemberFriend = (
    url: string = this.baseUrl,
    data: setGroupApplyMemberFriendParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.SETGROUPAPPLYMEMBERFRIEND,
      };
      this.HttpSend(args, url);
    });
  };

  // setGroupInfo
  setGroupInfo = (
    url: string = this.baseUrl,
    data: setGroupInfoParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.SETGROUPINFO,
      };
      this.HttpSend(args, url);
    });
  };

  // setGroupLookMemberInfo
  setGroupLookMemberInfo = (
    url: string = this.baseUrl,
    data: setGroupLookMemberInfoParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.SETGROUPLOOKMEMBERINFO,
      };
      this.HttpSend(args, url);
    });
  };

  // setGroupMemberInfo
  setGroupMemberInfo = (
    url: string = this.baseUrl,
    data: setGroupMemberInfoParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.SETGROUPMEMBERINFO,
      };
      this.HttpSend(args, url);
    });
  };

  // setGroupMemberNickname
  setGroupMemberNickname = (
    url: string = this.baseUrl,
    data: setGroupMemberNicknameParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.SETGROUPMEMBERNICKNAME,
      };
      this.HttpSend(args, url);
    });
  };

  // setGroupMemberRoleLevel
  setGroupMemberRoleLevel = (
    url: string = this.baseUrl,
    data: setGroupMemberRoleLevelParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.SETGROUPMEMBERROLELEVEL,
      };
      this.HttpSend(args, url);
    });
  };

  // setGroupVerification
  setGroupVerification = (
    url: string = this.baseUrl,
    data: setGroupVerificationParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.SETGROUPVERIFICATION,
      };
      this.HttpSend(args, url);
    });
  };

  // transferGroupOwner
  transferGroupOwner = (
    url: string = this.baseUrl,
    data: transferGroupOwnerParams,
    operationID: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.TRANSFERGROUPOWNER,
      };
      this.HttpSend(args, url);
    });
  };

  // connect tools
  private HttpSend = (params: WsParams, url: string) => {
    return new Promise((resolve, reject) => {
      if (window?.navigator && !window.navigator.onLine) {
        let errData = {
          event: params.reqFuncName,
          errCode: 113,
          data: "",
          operationID: params.operationID || "",
        };
        reject(errData);
        return;
      }
      axios
        .post(url, params)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}
