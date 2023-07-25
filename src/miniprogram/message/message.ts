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
import { MessageItem, RequestFunc, WsParams } from "open-im-sdk";
import { MessageReceiveOptType } from "../conversation/params";

export class OpenIMSDK extends Emitter {
  // createAdvancedQuoteMessage
  createAdvancedQuoteMessage = (
    data: createAdvancedQuoteMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.CREATEADVANCEDQUOTEMESSAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // createAdvancedTextMessage
  createAdvancedTextMessage = (
    data: createAdvancedTextMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.CREATEADVANCEDTEXTMESSAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // createCardMessage
  createCardMessage = (data: createCardMessageParams, operationID?: string) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.CREATEADVANCEDTEXTMESSAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // createCustomMessage
  createCustomMessage = (
    data: createCustomMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.CREATECUSTOMMESSAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // createFaceMessageWithIndex
  createFaceMessageWithIndex = (
    data: createFaceMessageWithIndexParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.CREATEFACEMESSAGEWITHINDEX,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // createFileMessage
  createFileMessage = (data: createFileMessageParams, operationID?: string) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.CREATEFACEMESSAGEWITHINDEX,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // createForwardMessage
  createForwardMessage = (data: MessageItem, operationID?: string) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.CREATEFORWARDMESSAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // createImageMessage
  createImageMessage = (
    data: createImageMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.CREATEFORWARDMESSAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // createLocationMessage
  createLocationMessage = (
    data: createLocationMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.CREATELOCATIONMESSAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // createMergeMessage
  createMergeMessage = (
    data: createMergeMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.CREATEMERGEMESSAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // createQuoteMessage
  createQuoteMessage = (
    data: createQuoteMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.CREATEQUOTEMESSAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // createSoundMessage
  createSoundMessage = (
    data: createSoundMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.CREATESOUNDMESSAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // createTextAtMessage
  createTextAtMessage = (
    data: createTextAtMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.CREATETEXTATMESSAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // createTextMessage
  createTextMessage = (text: string, operationID?: string) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: text,
        operationID: operationID || "",
        reqFuncName: RequestFunc.CREATETEXTMESSAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // createVideoMessage
  createVideoMessage = (
    data: createVideoMessageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.CREATEVIDEOMESSAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // deleteAllMsgFromLocal
  deleteAllMsgFromLocal = (operationID?: string) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: "",
        operationID: operationID || "",
        reqFuncName: RequestFunc.DELETEALLMSGFROMLOCAL,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // deleteAllMsgFromLocalAndSvr
  deleteAllMsgFromLocalAndSvr = (operationID?: string) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: "",
        operationID: operationID || "",
        reqFuncName: RequestFunc.DELETEALLMSGFROMLOCALANDSVR,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // deleteMessage
  deleteMessage = (data: deleteMessageParams, operationID?: string) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.DELETEMESSAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // deleteMessageFromLocalStorage
  deleteMessageFromLocalStorage = (
    data: deleteMessageFromLocalStorageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.DELETEMESSAGEFROMLOCALSTORAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // findMessageList
  findMessageList = (data: findMessageListParams, operationID?: string) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.FINDMESSAGELIST,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // getAdvancedHistoryMessageList
  getAdvancedHistoryMessageList = (
    data: getAdvancedHistoryMessageListParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.GETADVANCEDHISTORYMESSAGELIST,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };
  // getAdvancedHistoryMessageListReverse
  getAdvancedHistoryMessageListReverse = (
    data: getAdvancedHistoryMessageListReverseParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.GETADVANCEDHISTORYMESSAGELISTREVERSE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // insertGroupMessageToLocalStorage
  insertGroupMessageToLocalStorage = (
    data: insertGroupMessageToLocalStorageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.INSERTGROUPMESSAGETOLOCALSTORAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // insertSingleMessageToLocalStorage
  insertSingleMessageToLocalStorage = (
    data: insertSingleMessageToLocalStorageParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.INSERTSINGLEMESSAGETOLOCALSTORAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // markMessageAsReadByMsgID
  markMessageAsReadByMsgID = (
    data: MARKMESSAGEASREADBYMSGIDParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.MARKMESSAGEASREADBYMSGID,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // revokeMessage
  revokeMessage = (data: revokeMessageParams, operationID?: string) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.MARKMESSAGEASREADBYMSGID,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // searchLocalMessages
  searchLocalMessages = (
    data: searchLocalMessagesParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.SEARCHLOCALMESSAGES,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // sendMessage
  sendMessage = (data: sendMessageParams, operationID?: string) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.SENDMESSAGE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // sendMessageNotOss
  sendMessageNotOss = (data: sendMessageNotOssParams, operationID?: string) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.SENDMESSAGENOTOSS,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // setGlobalRecvMessageOpt
  setGlobalRecvMessageOpt = (
    data: MessageReceiveOptType,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.SETGLOBALRECVMESSAGEOPT,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // typingStatusUpdate
  typingStatusUpdate = (
    data: typingStatusUpdateParams,
    operationID?: string
  ) => {
    return new Promise<WsParams>((resolve, reject) => {
      const args = {
        data: data,
        operationID: operationID || "",
        reqFuncName: RequestFunc.TYPINGSTATUSUPDATE,
        userID: "userID",
      };
      this.wsSend(args, resolve, reject);
    });
  };
}
