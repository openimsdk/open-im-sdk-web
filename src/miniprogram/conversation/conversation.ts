import {
  getConversationListSplitParams,
  pinConversationParams,
  setConversationBurnDurationParams,
  setConversationDraftParams,
  setConversationPrivateChatParams,
  setConversationRecvMessageOptParams,
} from "./params";
import {
  RequestFunc,
  SessionType,
  Ws2Promise,
  WsResponse,
  uuid,
} from "open-im-sdk";
import Emitter from "open-im-sdk/event";

export default class OpenIMSDK extends Emitter {
  wsSend(
    args: {
      reqFuncName: RequestFunc;
      operationID: any;
      userID: string | undefined;
      data: any;
    },
    resolve: (value: WsResponse | PromiseLike<WsResponse>) => void,
    reject: (reason?: any) => void
  ) {
    throw new Error("Method not implemented.");
  }
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
  //   constructor() {
  //     super();
  //     this.getPlatform();
  //   }

  // 本地删除一个会话
  clearConversationAndDeleteAllMsg = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.CLEARCONVERSATIONANDDELETEALLMSG,
        operationID: operationID || "1",
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // deleteAllConversationFromLocal
  deleteAllConversationFromLocal = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.DELETEALLCONVERSATIONFROMLOCAL,
        operationID: operationID || "1",
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // deleteConversationAndDeleteAllMsg
  deleteConversationAndDeleteAllMsg = (
    conversationID: string,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.DELETECONVERSATIONANDDELETEALLMSG,
        operationID: operationID || "1",
        userID: this.uid,
        data: conversationID,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // getAllConversationList
  getAllConversationList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.GETALLCONVERSATIONLIST,
        operationID: operationID || "1",
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // getConversationIDBySessionType
  getConversationIDBySessionType = (
    sourceID: string,
    sessionType: SessionType,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.GETCONVERSATIONIDBYSESSIONTYPE,
        operationID: operationID || "1",
        userID: this.uid,
        data: { sourceID: sourceID, sessionType: sessionType },
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // getConversationListSplit
  getConversationListSplit = (
    data: getConversationListSplitParams,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.GETCONVERSATIONLISTSPLIT,
        operationID: operationID || "1",
        userID: this.uid,
        data: { data: data },
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // getConversationRecvMessageOpt
  getConversationRecvMessageOpt = (
    conversationIDList: string[],
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.GETCONVERSATIONRECVMESSAGEOPT,
        operationID: operationID || "1",
        userID: this.uid,
        data: { data: conversationIDList },
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // getMultipleConversation
  getMultipleConversation = (
    conversationIDList: string[],
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.GETMULTIPLECONVERSATION,
        operationID: operationID || "1",
        userID: this.uid,
        data: { data: conversationIDList },
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // getOneConversation
  getOneConversation = (
    data: getConversationListSplitParams,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.GETONECONVERSATION,
        operationID: operationID || "1",
        userID: this.uid,
        data: { data: data },
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // getTotalUnreadMsgCount
  getTotalUnreadMsgCount = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.GETTOTALUNREADMSGCOUNT,
        operationID: operationID || "1",
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // hideConversation
  hideConversation = (ConversationID: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.HIDECONVERSATION,
        operationID: operationID || "1",
        userID: this.uid,
        data: ConversationID,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // markConversationMessageAsRead
  markConversationMessageAsRead = (
    ConversationID: string,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.MARKCONVERSATIONMESSAGEASREAD,
        operationID: operationID || "1",
        userID: this.uid,
        data: ConversationID,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // pinConversation
  pinConversation = (data: pinConversationParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.PINCONVERSATION,
        operationID: operationID || "1",
        userID: this.uid,
        data: data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // resetConversationGroupAtType
  resetConversationGroupAtType = (
    ConversationID: string,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.RESETCONVERSATIONGROUPATTYPE,
        operationID: operationID || "1",
        userID: this.uid,
        data: ConversationID,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // setConversationBurnDuration
  setConversationBurnDuration = (
    data: setConversationBurnDurationParams,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.SETCONVERSATIONBURNDURATION,
        operationID: operationID || "1",
        userID: this.uid,
        data: data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // setConversationDraft
  setConversationDraft = (
    data: setConversationDraftParams,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.SETCONVERSATIONDRAFT,
        operationID: operationID || "1",
        userID: this.uid,
        data: data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // setConversationPrivateChat
  setConversationPrivateChat = (
    data: setConversationPrivateChatParams,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.SETCONVERSATIONPRIVATECHAT,
        operationID: operationID || "1",
        userID: this.uid,
        data: data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // setConversationRecvMessageOpt
  setConversationRecvMessageOpt = (
    data: setConversationRecvMessageOptParams,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const args = {
        reqFuncName: RequestFunc.SETCONVERSATIONRECVMESSAGEOPT,
        operationID: operationID || "1",
        userID: this.uid,
        data: data,
      };
      this.wsSend(args, resolve, reject);
    });
  };
}
