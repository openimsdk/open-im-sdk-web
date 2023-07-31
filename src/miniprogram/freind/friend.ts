import { OpenIMSDK } from "./../message/message";
import {
  pageNationParams,
  searchFriendParams,
  setFriendRemarkParams,
} from "./params";
import { RequestFunc, WsParams, WsResponse, uuid } from "open-im-sdk";
import Emitter from "open-im-sdk/event";
import { addFriendParams } from "./params";
import axios from "axios";

export default class openIMJSSDK extends Emitter {
  private uid: string | undefined;
  private token: string | undefined;
  private baseUrl: string = "http://localhost:10002";
  constructor() {
    super();
  }

  // Judge a friend
  judgeFriend = (
    url: string = this.baseUrl,
    userID: string,
    otherUserID: string,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.GETSELFUSERINFO,
        operationID: operationID || uuid(this.uid as string),
        userID: userID || this.uid,
        data: { otherUserID },
      };
      this.HttpSend(args, url);
    });
  };
  // add a friend
  addFriend = (
    url: string = this.baseUrl,
    data: addFriendParams,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.addFriend,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };
  // add a Friend to Black
  addFriendToBlack = (url: string = this.baseUrl, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: "",
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.ADDFRIENDTOBALCK,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };
  // checkFriend whether in or not is other's friend list
  checkFriendExists = (
    url: string = this.baseUrl,
    userIDList: string[],
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        data: userIDList,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.CHECKFRIENDEXISTS,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };
  //delete a friend
  deleteFriend = (
    url: string = this.baseUrl,
    userID: string,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        userID: userID || this.uid,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.DELETEFRIEND,
        data: "",
      };
      this.HttpSend(args, url);
    });
  };
  //get friend black list
  getFriendBlackList = (
    url: string = this.baseUrl,
    userID: string,
    pageNation: pageNationParams,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        userID: userID || this.uid,
        reqFuncName: RequestFunc.GETSPECIFIEDFRIENDINFO,
        data: pageNation,
        operationID: operationID || uuid(this.uid as string),
      };
      this.HttpSend(args, url);
    });
  };
  //get friend list
  getFriendList = (
    url: string = this.baseUrl,
    userID: string,
    pageNation: pageNationParams,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        userID: userID || this.uid,
        reqFuncName: RequestFunc.GETSPECIFIEDFRIENDINFO,
        data: pageNation,
        operationID: operationID || uuid(this.uid as string),
      };
      this.HttpSend(args, url);
    });
  };

  //get Receive Friend Apply List
  getRecvFriendApplicationList = (
    url: string = this.baseUrl,
    userID: string,
    pageNation: pageNationParams,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        userID: userID || this.uid,
        reqFuncName: RequestFunc.GETSPECIFIEDFRIENDINFO,
        data: pageNation,
        operationID: operationID || uuid(this.uid as string),
      };
      this.HttpSend(args, url);
    });
  };
  //get Send Friend Apply List
  getSendFriendApplicationList = (
    url: string = this.baseUrl,
    userID: string,
    pageNation: pageNationParams,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        userID: userID || this.uid,
        reqFuncName: RequestFunc.GETSPECIFIEDFRIENDINFO,
        data: pageNation,
        operationID: operationID || uuid(this.uid as string),
      };
      this.HttpSend(args, url);
    });
  };
  // get specifically friends information
  getSpecifiedFriendsInfo = (
    url: string = this.baseUrl,
    userID: string,
    pageNation: pageNationParams,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        userID: userID || this.uid,
        reqFuncName: RequestFunc.GETSPECIFIEDFRIENDINFO,
        data: pageNation,
        operationID: operationID || uuid(this.uid as string),
      };
      this.HttpSend(args, url);
    });
  };
  // accept a friend's apply
  acceptFriendApplication = (
    url: string = this.baseUrl,
    toUserID: string,
    handleMsg: string,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        userID: this.uid,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.ACCEPTFRIENDAPPLICATION,
        data: { handledMsg: handleMsg, toUserID: toUserID },
      };
      this.HttpSend(args, url);
    });
  };
  // refuse friend apply
  refuseFriendApplication = (
    url: string = this.baseUrl,
    toUserID: string,
    handleMsg: string,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.REFUSEFRIENDAPPLICATION,
        data: { handledMsg: handleMsg, toUserID: toUserID },
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };
  // remove friend from black list
  removeBlack = (
    url: string = this.baseUrl,
    userID: string,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: "",
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.REMOVEBLACK,
        userID: userID || this.uid,
      };
      this.HttpSend(args, url);
    });
  };
  // search friends by specified key word
  searchFriends = (
    url: string = this.baseUrl,
    data: searchFriendParams,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.SEARCHFRIENDS,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };
  // set friend remark
  setFriendRemark = (
    url: string = this.baseUrl,
    data: setFriendRemarkParams,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        userID: this.uid,
        reqFuncName: RequestFunc.SETFRIENDREMARK,
      };
      this.HttpSend(args, url);
    });
  };
  // http tool
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
export type WsParamsPageNation = {
  reqFuncName: RequestFunc;
  operationID: string;
  userID: string | undefined;
  data: any;
  pageNation: string;
};
