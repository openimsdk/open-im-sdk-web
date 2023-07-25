import {
  CbEvents,
  RequestFunc,
  Ws2Promise,
  WsParams,
  WsResponse,
  uuid,
} from "open-im-sdk";
import Emitter from "open-im-sdk/event";
import { SelfUserInfoParams, upLoadFileParams } from "./params";

export class OpenIMSDK extends Emitter {
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
  // set user information
  setSelfInfo = (userInfo: SelfUserInfoParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: userInfo,
        operationID: operationID || "",
        reqFuncName: RequestFunc.SETSELFINFO,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // get User Information
  getUsersInfo = (userIDList: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: userIDList,
        operationID: operationID || "",
        reqFuncName: RequestFunc.GETUSERINFO,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // getSelfUserInformation
  getSelfUserInfo = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: "",
        operationID: operationID || "",
        reqFuncName: RequestFunc.GETSELFUSERINFO,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // upLoad User File
  upLoadUserFile = (data: upLoadFileParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.UPLOADFILE,
        userID: "userID",
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
      if (this.platform == "miniprogram") {
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
        errMsg: "no http conect...",
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
}
