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
import { createWorker, stopWorker } from "open-im-sdk/util";

export default class OpenIMSDK extends Emitter {
  private ws: WebSocket | undefined;
  private uid: string | undefined;
  private token: string | undefined;
  private platform: string = "miniProgram";
  private wsUrl: string = "";
  private lock: boolean = false;
  private logoutFlag: boolean = false;
  private ws2promise: Record<string, Ws2Promise> = {};
  private onceFlag: boolean = true;
  private timer: NodeJS.Timer | undefined = undefined;
  private lastTime: number = 0;
  private heartbeatCount: number = 0;
  private heartbeatStartTime: number = 0;
  private platformID: number = 0;
  private isBatch: boolean = false;
  private worker: Worker | null = null;

  constructor() {
    super();
    this.getPlatform();
  }

  // accept group application
  acceptGroupApplication = (
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
      this.wsSend(args, resolve, reject);
    });
  };

  // change GroupMember to Mute
  changeGroupMemberMute = (
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
      this.wsSend(args, resolve, reject);
    });
  };

  // changeGroup to Mute
  changeGroupToMute = (data: changeGroupToMuteParams, operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.CHANGEGROUPTOMUTE,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // create a Group
  createGroup = (data: changeGroupToMuteParams, operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.CREATEGROUP,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // dismiss a group
  dismissGroup = (data: dismissGroupParams, operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.DISMISSGROUP,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // get Group ApplicationList As Applicant
  getGroupApplicationListAsApplicant = (operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.GETGROUPAPPLICATIONLISTASAPPLICANT,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // getGroupApplicationList As Recipient
  getGroupApplicationListAsRecipient = (operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.GETGROUPAPPLICATIONLISTASRECIPIENT,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // getGroupMemberList
  getGroupMemberList = (
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
      this.wsSend(args, resolve, reject);
    });
  };

  // getGroupMemberListByJoinTimeFilter
  getGroupMemberListByJoinTimeFilter = (
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
      this.wsSend(args, resolve, reject);
    });
  };

  // getGroupMemberOwnerAndAdmin
  getGroupMemberOwnerAndAdmin = (
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
      this.wsSend(args, resolve, reject);
    });
  };

  // get JoinedGroupList
  getJoinedGroupList = (operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.GETJOINEDGROUPLIST,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // get SpecifiedGroupMembersInfo
  getSpecifiedGroupMembersInfo = (
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
      this.wsSend(args, resolve, reject);
    });
  };

  // get SpecifiedGroupsInfo
  getSpecifiedGroupsInfo = (
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
      this.wsSend(args, resolve, reject);
    });
  };

  // inviteUser To Group
  inviteUserToGroup = (data: inviteUserToGroupParams, operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.INVITEUSERTOGROUP,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // joinGroup
  joinGroup = (data: joinGroupParams, operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.JOINGROUP,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // kick GroupMember
  kickGroupMember = (data: kickGroupMemberParams, operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.KICKGROUPMEMBER,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // quitGroup
  quitGroup = (data: kickGroupMemberParams, operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.QUITGROUP,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // refuse a  GroupApplication
  refuseGroupApplication = (
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
      this.wsSend(args, resolve, reject);
    });
  };

  // searchGroupMembers
  searchGroupMembers = (
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
      this.wsSend(args, resolve, reject);
    });
  };

  // searchGroups
  searchGroups = (data: searchGroupsParams, operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.SEARCHGROUPS,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  //set GroupApplyMemberFriend
  setGroupApplyMemberFriend = (
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
      this.wsSend(args, resolve, reject);
    });
  };

  // setGroupInfo
  setGroupInfo = (data: setGroupInfoParams, operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: this.uid,
        reqFuncName: RequestFunc.SETGROUPINFO,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // setGroupLookMemberInfo
  setGroupLookMemberInfo = (
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
      this.wsSend(args, resolve, reject);
    });
  };

  // setGroupMemberInfo
  setGroupMemberInfo = (
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
      this.wsSend(args, resolve, reject);
    });
  };

  // setGroupMemberNickname
  setGroupMemberNickname = (
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
      this.wsSend(args, resolve, reject);
    });
  };

  // setGroupMemberRoleLevel
  setGroupMemberRoleLevel = (
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
      this.wsSend(args, resolve, reject);
    });
  };

  // setGroupVerification
  setGroupVerification = (
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
      this.wsSend(args, resolve, reject);
    });
  };

  // transferGroupOwner
  transferGroupOwner = (
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
      this.wsSend(args, resolve, reject);
    });
  };

  // connect tools
  private wsSend = (
    params: WsParams,
    resolve: (value: WsResponse | PromiseLike<WsResponse>) => void,
    reject: (reason?: any) => void
  ) => {
    if (window?.navigator && !window.navigator.onLine) {
      let errData: WsResponse = {
        event: params.reqFuncName,
        errCode: 113,
        errMsg: "net work error",
        data: "",
        operationID: params.operationID || "",
      };
      reject(errData);
      return;
    }
    if (this.ws?.readyState !== this.ws?.OPEN) {
      let errData: WsResponse = {
        event: params.reqFuncName,
        errCode: 112,
        errMsg: "ws conecting...",
        data: "",
        operationID: params.operationID || "",
      };
      reject(errData);
      return;
    }
    // if (this.ws === undefined) {
    //   let errData: WsResponse = {
    //     event: params.reqFuncName,
    //     errCode: 112,
    //     errMsg: "ws conect failed...",
    //     data: "",
    //     operationID: params.operationID || "",
    //   };
    //   reject(errData);
    //   return;
    // }
    if (typeof params.data === "object") {
      params.data = JSON.stringify(params.data);
    }

    const ws2p = {
      oid: params.operationID || uuid(this.uid as string),
      mname: params.reqFuncName,
      mrsve: resolve,
      mrjet: reject,
      flag: false,
    };

    this.ws2promise[ws2p.oid] = ws2p;

    const handleMessage = (ev: MessageEvent<string>) => {
      this.lastTime = new Date().getTime();
      const data = JSON.parse(ev.data);
      if ((CbEvents as Record<string, string>)[data.event.toUpperCase()]) {
        this.emit(data.event, data);
        return;
      }

      if (params.reqFuncName === RequestFunc.LOGOUT) {
        this.logoutFlag = true;
        this.ws!.close();
        this.ws = undefined;
      }

      const callbackJob = this.ws2promise[data.operationID];
      if (!callbackJob) {
        if (
          data.event === RequestFunc.SENDMESSAGE ||
          data.event === RequestFunc.SENDMESSAGENOTOSS
        ) {
          this.emit(CbEvents.ONRECVNEWMESSAGEFROMOTHERWEB, data);
        }
        return;
      }
      if (data.errCode === 0) {
        callbackJob.mrsve(data);
      } else {
        callbackJob.mrjet(data);
      }
      delete this.ws2promise[data.operationID];
    };

    try {
      if (this.platform == "web") {
        this.ws!.send(JSON.stringify(params));
        this.ws!.onmessage = handleMessage;
      } else {
        this.ws!.send({
          //@ts-ignore
          data: JSON.stringify(params),
          success: (res: any) => {
            //@ts-ignore
            if (
              this.platform === "uni" &&
              //@ts-ignore
              this.ws!._callbacks !== undefined &&
              //@ts-ignore
              this.ws!._callbacks.message !== undefined
            ) {
              //@ts-ignore
              this.ws!._callbacks.message = [];
            }
          },
        });
        if (this.onceFlag) {
          //@ts-ignore
          this.ws!.onMessage(handleMessage);
          this.onceFlag = false;
        }
      }
    } catch (error) {
      let errData: WsResponse = {
        event: params.reqFuncName,
        errCode: 112,
        errMsg: "no ws conect...",
        data: "",
        operationID: params.operationID || "",
      };
      reject(errData);
      return;
    }
    if (params.reqFuncName === RequestFunc.LOGOUT) {
      this.onceFlag = true;
    }
  };

  // get login credentials
  private iLogin(data: LoginParams, operationID?: string) {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.LOGIN,
        operationID: _uuid,
        userID: this.uid,
        data,
        batchMsg: this.isBatch ? 1 : 0,
      };
      this.wsSend(args, resolve, reject);
    });
  }

  // user logo out
  logout(operationID?: string) {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.LOGOUT,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  }
  // get login status
  getLoginStatus = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETLOGINSTATUS,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  private getPlatform() {
    const wflag = typeof WebSocket;
    //@ts-ignore
    const uflag = typeof uni;
    //@ts-ignore
    const xflag = typeof wx;
    //@ts-ignore
    const mflag = typeof miniprogram;

    if (wflag !== "undefined") {
      this.platform = "web";
      return;
    }

    if (uflag === "object" && xflag !== "object" && mflag !== "object") {
      this.platform = "uni";
    } else if (uflag !== "object" && xflag === "object" && mflag !== "object") {
      this.platform = "wx";
    } else if (uflag !== "object" && xflag === "object" && mflag !== "object") {
      this.platform = "miniProgram";
    } else {
      this.platform = "unknow";
    }
  }

  private createWs(
    _onOpen?: Function,
    _onClose?: Function,
    _onError?: Function
  ) {
    console.log("start createWs...");
    return new Promise<void>((resolve, reject) => {
      this.ws?.close();
      this.ws = undefined;

      let onOpen: any = () => {
        const loginData = {
          userID: this.uid!,
          token: this.token!,
        };
        this.iLogin(loginData).then((res) => {
          this.logoutFlag = false;
          console.log("iLogin suc...");
          this.heartbeat();
          resolve();
        });
      };

      if (_onOpen) {
        onOpen = _onOpen;
      }

      let onClose: any = () => {
        console.log("ws close agin:::");
        if (!this.logoutFlag) {
          Object.values(this.ws2promise).forEach((promise) =>
            promise.mrjet({
              event: promise.mname,
              errCode: 111,
              errMsg: "ws connect close...",
              data: "",
              operationID: promise.oid,
            })
          );
          // this.reconnect();
        }
      };

      if (_onClose) {
        onClose = _onClose;
      }

      let onError: any = () => {};
      if (_onError) {
        onError = _onError;
      }

      if (this.platform === "miniProgram") {
        this.ws = new WebSocket(this.wsUrl);
        this.ws.onclose = onClose;
        this.ws.onopen = onOpen;
        this.ws.onerror = onError;
        return;
      }

      // @ts-ignore
      const platformNamespace = this.platform === "uni" ? uni : wx;
      this.ws = platformNamespace.connectSocket({
        url: this.wsUrl,
        complete: () => {},
      });
      //@ts-ignore
      this.ws.onClose(onClose);
      //@ts-ignore
      this.ws.onOpen(onOpen);
      //@ts-ignore
      this.ws.onError(onError);
    });
  }

  private reconnect() {
    if (!this.onceFlag) this.onceFlag = true;
    if (this.lock) return;
    this.lock = true;
    this.clearTimer();
    this.timer = setTimeout(() => {
      this.createWs();
      this.lock = false;
    }, 500);
  }
  // cleartimer
  private clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  // test heartbeat
  private heartbeat() {
    console.log("start heartbeat...");
    this.clearTimer();
    const callback = () => {
      if (this.logoutFlag) {
        if (this.worker) {
          stopWorker(this.worker);
        }
        return;
      }

      if (
        this.ws?.readyState !== this.ws?.CONNECTING &&
        this.ws?.readyState !== this.ws?.OPEN
      ) {
        this.reconnect();
        return;
      }

      const now = new Date().getTime();
      if (now - this.lastTime < 9000) {
        return;
      }

      this.getLoginStatus().catch((err) => this.reconnect());
    };
    if (this.worker) {
      stopWorker(this.worker);
    }
    try {
      this.worker = createWorker(callback, 10000);
    } catch (error) {}
  }
}
