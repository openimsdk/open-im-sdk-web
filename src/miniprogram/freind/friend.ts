import {
  pageNationParams,
  searchFriendParams,
  setFriendRemarkParams,
} from "./params";
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
import { addFriendParams } from "./params";
import { createWorker, stopWorker } from "open-im-sdk/util";

export default class openIMJSSDK extends Emitter {
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

  // Judge a friend
  judgeFriend = (userID: string, otherUserID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.GETSELFUSERINFO,
        operationID: "1",
        userID: userID,
        data: userID,
      };
      this.wsSend(args, resolve, reject);
    });
  };
  // add a friend
  addFriend = (data: addFriendParams, operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        reqFuncName: RequestFunc.addFriend,
        userID: this.uid,
      };
      this.wsSend(args, resolve, reject);
    });
  };
  // add a Friend to Black
  addFriendToBlack = (operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: "",
        operationID: operationID,
        reqFuncName: RequestFunc.ADDFRIENDTOBALCK,
        userID: this.uid,
      };
      this.wsSend(args, resolve, reject);
    });
  };
  // checkFriend whether in or not is other's friend list
  checkFriendExists = (userIDList: string[], operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        data: userIDList,
        operationID: operationID,
        reqFuncName: RequestFunc.CHECKFRIENDEXISTS,
        userID: this.uid,
      };
      this.wsSend(args, resolve, reject);
    });
  };
  //delete a friend
  deleteFriend = (userID: string, operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        userID: userID,
        operationID: operationID,
        reqFuncName: RequestFunc.DELETEFRIEND,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };
  //get friend black list
  getFriendBlackList = (userID: string, pageNation: pageNationParams) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        userID: userID,
        reqFuncName: RequestFunc.GETSPECIFIEDFRIENDINFO,
        data: pageNation,
        operationID: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };
  //get friend list
  getFriendList = (userID: string, pageNation: pageNationParams) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        userID: userID,
        reqFuncName: RequestFunc.GETSPECIFIEDFRIENDINFO,
        data: pageNation,
        operationID: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  //get Receive Friend Apply List
  getRecvFriendApplicationList = (
    userID: string,
    pageNation: pageNationParams
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        userID: userID,
        reqFuncName: RequestFunc.GETSPECIFIEDFRIENDINFO,
        data: pageNation,
        operationID: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };
  //get Send Friend Apply List
  getSendFriendApplicationList = (
    userID: string,
    pageNation: pageNationParams
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        userID: userID,
        reqFuncName: RequestFunc.GETSPECIFIEDFRIENDINFO,
        data: pageNation,
        operationID: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };
  // get specifically friends information
  getSpecifiedFriendsInfo = (userID: string, pageNation: pageNationParams) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        userID: userID,
        reqFuncName: RequestFunc.GETSPECIFIEDFRIENDINFO,
        data: pageNation,
        operationID: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };
  // accept a friend's apply
  acceptFriendApplication = (toUserID: string, handleMsg: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        userID: "",
        operationID: "1",
        reqFuncName: RequestFunc.ACCEPTFRIENDAPPLICATION,
        data: { handledMsg: handleMsg, toUserID: toUserID },
      };
      this.wsSend(args, resolve, reject);
    });
  };
  // refuse friend apply
  refuseFriendApplication = (toUserID: string, handleMsg: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        operationID: "",
        reqFuncName: RequestFunc.REFUSEFRIENDAPPLICATION,
        data: { handledMsg: handleMsg, toUserID: toUserID },
        userID: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };
  // remove friend from black list
  removeBlack = (userID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: "",
        operationID: "",
        reqFuncName: RequestFunc.REMOVEBLACK,
        userID: userID,
      };
      this.wsSend(args, resolve, reject);
    });
  };
  // search friends by specified key word
  searchFriends = (data: searchFriendParams, operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        reqFuncName: RequestFunc.SEARCHFRIENDS,
        userID: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };
  // set friend remark
  setFriendRemark = (data: setFriendRemarkParams, operationID: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID,
        userID: "",
        reqFuncName: RequestFunc.SETFRIENDREMARK,
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
        errMsg: "no ws connect...",
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
export type WsParamsPageNation = {
  reqFuncName: RequestFunc;
  operationID: string;
  userID: string | undefined;
  data: any;
  pageNation: string;
};
