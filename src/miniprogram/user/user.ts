import { CbEvents, RequestFunc, WsParams, WsResponse, uuid } from "open-im-sdk";
import Emitter from "open-im-sdk/event";
import { SelfUserInfoParams, upLoadFileParams } from "./params";
import axios from "axios";

export class OpenIMSDK extends Emitter {
  private uid: string | undefined;
  private token: string | undefined;
  private baseUrl: string = "http://localhost:10002";

  // set user information
  setSelfInfo = (
    url: string = this.baseUrl,
    userInfo: SelfUserInfoParams,
    operationID?: string
  ) => {
    return new Promise<WsResponse>(() => {
      const args = {
        data: userInfo,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.SETSELFINFO,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // get User Information
  getUsersInfo = (
    url: string = this.baseUrl,
    userIDList: string[],
    operationID?: string
  ) => {
    return new Promise<WsResponse>(() => {
      const args = {
        data: userIDList,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.GETUSERINFO,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // getSelfUserInformation
  getSelfUserInfo = (url: string = this.baseUrl, operationID?: string) => {
    return new Promise<WsResponse>(() => {
      const args = {
        data: "",
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.GETSELFUSERINFO,
        userID: "userID",
      };
      this.HttpSend(args, url);
    });
  };

  // upLoad User File
  upLoadUserFile = (
    url: string = this.baseUrl,
    data: upLoadFileParams,
    operationID?: string
  ) => {
    return new Promise<WsResponse>(() => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.UPLOADFILE,
        userID: this.uid,
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
