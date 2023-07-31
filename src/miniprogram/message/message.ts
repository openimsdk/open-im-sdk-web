import Emitter from "open-im-sdk/event";
import {
  MARKMESSAGEASREADBYMSGIDParams,
  createAdvancedQuoteMessageParams,
  createAdvancedTextMessageParams,
  createCardMessageParams,
  createCustomMessageParams,
  createFaceMessageWithIndexParams,
  createFileMessageParams,
  createImageMessageParams,
  createLocationMessageParams,
  createMergeMessageParams,
  createQuoteMessageParams,
  createSoundMessageParams,
  createTextAtMessageParams,
  createVideoMessageParams,
  deleteMessageFromLocalStorageParams,
  deleteMessageParams,
  findMessageListParams,
  getAdvancedHistoryMessageListParams,
  getAdvancedHistoryMessageListReverseParams,
  insertGroupMessageToLocalStorageParams,
  insertSingleMessageToLocalStorageParams,
  revokeMessageParams,
  searchLocalMessagesParams,
  sendMessageNotOssParams,
  sendMessageParams,
  typingStatusUpdateParams,
} from "./params";
import {
  MessageItem,
  RequestFunc,
  Ws2Promise,
  WsParams,
  uuid,
} from "open-im-sdk";
import { MessageReceiveOptType } from "../conversation/params";
import axios from "axios";

export class OpenIMSDK extends Emitter {
  private uid: string | undefined;
  private token: string | undefined;
  private baseUrl: string = "http://localhost:10002";
  // createAdvancedQuoteMessage
  createAdvancedQuoteMessage = (
    url: string = this.baseUrl,
    data: createAdvancedQuoteMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.CREATEADVANCEDQUOTEMESSAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // createAdvancedTextMessage
  createAdvancedTextMessage = (
    url: string = this.baseUrl,
    data: createAdvancedTextMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.CREATEADVANCEDTEXTMESSAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // createCardMessage
  createCardMessage = (
    url: string = this.baseUrl,
    data: createCardMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.CREATEADVANCEDTEXTMESSAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // createCustomMessage
  createCustomMessage = (
    url: string = this.baseUrl,
    data: createCustomMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.CREATECUSTOMMESSAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // createFaceMessageWithIndex
  createFaceMessageWithIndex = (
    url: string = this.baseUrl,
    data: createFaceMessageWithIndexParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.CREATEFACEMESSAGEWITHINDEX,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // createFileMessage
  createFileMessage = (
    url: string = this.baseUrl,
    data: createFileMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.CREATEFACEMESSAGEWITHINDEX,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // createForwardMessage
  createForwardMessage = (
    url: string = this.baseUrl,
    data: MessageItem,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.CREATEFORWARDMESSAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // createImageMessage
  createImageMessage = (
    url: string = this.baseUrl,
    data: createImageMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.CREATEFORWARDMESSAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // createLocationMessage
  createLocationMessage = (
    url: string = this.baseUrl,
    data: createLocationMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.CREATELOCATIONMESSAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // createMergeMessage
  createMergeMessage = (
    url: string = this.baseUrl,
    data: createMergeMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.CREATEMERGEMESSAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // createQuoteMessage
  createQuoteMessage = (
    url: string = this.baseUrl,
    data: createQuoteMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.CREATEQUOTEMESSAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // createSoundMessage
  createSoundMessage = (
    url: string = this.baseUrl,
    data: createSoundMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.CREATESOUNDMESSAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // createTextAtMessage
  createTextAtMessage = (
    url: string = this.baseUrl,
    data: createTextAtMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.CREATETEXTATMESSAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // createTextMessage
  createTextMessage = (
    url: string = this.baseUrl,
    text: string,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: text,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.CREATETEXTMESSAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // createVideoMessage
  createVideoMessage = (
    url: string = this.baseUrl,
    data: createVideoMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.CREATEVIDEOMESSAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // deleteAllMsgFromLocal
  deleteAllMsgFromLocal = (
    url: string = this.baseUrl,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: "",
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.DELETEALLMSGFROMLOCAL,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // deleteAllMsgFromLocalAndSvr
  deleteAllMsgFromLocalAndSvr = (
    url: string = this.baseUrl,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: "",
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.DELETEALLMSGFROMLOCALANDSVR,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // deleteMessage
  deleteMessage = (
    url: string = this.baseUrl,
    data: deleteMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.DELETEMESSAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // deleteMessageFromLocalStorage
  deleteMessageFromLocalStorage = (
    url: string = this.baseUrl,
    data: deleteMessageFromLocalStorageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.DELETEMESSAGEFROMLOCALSTORAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // findMessageList
  findMessageList = (
    url: string = this.baseUrl,
    data: findMessageListParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.FINDMESSAGELIST,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // getAdvancedHistoryMessageList
  getAdvancedHistoryMessageList = (
    url: string = this.baseUrl,
    data: getAdvancedHistoryMessageListParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.GETADVANCEDHISTORYMESSAGELIST,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };
  // getAdvancedHistoryMessageListReverse
  getAdvancedHistoryMessageListReverse = (
    url: string = this.baseUrl,
    data: getAdvancedHistoryMessageListReverseParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.GETADVANCEDHISTORYMESSAGELISTREVERSE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // insertGroupMessageToLocalStorage
  insertGroupMessageToLocalStorage = (
    url: string = this.baseUrl,
    data: insertGroupMessageToLocalStorageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.INSERTGROUPMESSAGETOLOCALSTORAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // insertSingleMessageToLocalStorage
  insertSingleMessageToLocalStorage = (
    url: string = this.baseUrl,
    data: insertSingleMessageToLocalStorageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.INSERTSINGLEMESSAGETOLOCALSTORAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // markMessageAsReadByMsgID
  markMessageAsReadByMsgID = (
    url: string = this.baseUrl,
    data: MARKMESSAGEASREADBYMSGIDParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.MARKMESSAGEASREADBYMSGID,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // revokeMessage
  revokeMessage = (
    url: string = this.baseUrl,
    data: revokeMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.MARKMESSAGEASREADBYMSGID,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // searchLocalMessages
  searchLocalMessages = (
    url: string = this.baseUrl,
    data: searchLocalMessagesParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.SEARCHLOCALMESSAGES,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // sendMessage
  sendMessage = (
    url: string = this.baseUrl,
    data: sendMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.SENDMESSAGE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // sendMessageNotOss
  sendMessageNotOss = (
    url: string = this.baseUrl,
    data: sendMessageNotOssParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.SENDMESSAGENOTOSS,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // setGlobalRecvMessageOpt
  setGlobalRecvMessageOpt = (
    url: string = this.baseUrl,
    data: MessageReceiveOptType,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.SETGLOBALRECVMESSAGEOPT,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };

  // typingStatusUpdate
  typingStatusUpdate = (
    url: string = this.baseUrl,
    data: typingStatusUpdateParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || uuid(this.uid as string),
        reqFuncName: RequestFunc.TYPINGSTATUSUPDATE,
        userID: this.uid,
      };
      this.HttpSend(args, url);
    });
  };
  //tool methods
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
