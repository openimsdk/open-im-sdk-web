import { CbEvents, RequestFunc } from "../constants";
import { createWorker, stopWorker, uuid } from "../util";
import Emitter from "../event";
import {
  Ws2Promise,
  InitConfig,
  WsResponse,
  LoginParams,
  AtMsgParams,
  ImageMsgParams,
  SoundMsgParams,
  VideoMsgParams,
  FileMsgParams,
  MergerMsgParams,
  LocationMsgParams,
  CustomMsgParams,
  QuoteMsgParams,
  SendMsgParams,
  GetHistoryMsgParams,
  InsertSingleMsgParams,
  TypingUpdateParams,
  MarkC2CParams,
  GetOneCveParams,
  SetDraftParams,
  PinCveParams,
  AddFriendParams,
  InviteGroupParams,
  GetGroupMemberParams,
  CreateGroupParams,
  JoinGroupParams,
  TransferGroupParams,
  AccessGroupParams,
  WsParams,
  SplitParams,
  AccessFriendParams,
  GroupInfoParams,
  RemarkFriendParams,
  PartialUserItem,
  isRecvParams,
  SearchLocalParams,
  InsertGroupMsgParams,
  FaceMessageParams,
  RtcInvite,
  RtcActionParams,
  GroupMsgReadParams,
  ChangeGroupMuteParams,
  ChangeGroupMemberMuteParams,
  setPrvParams,
  MarkNotiParams,
  FileMsgFullParams,
  SouondMsgFullParams,
  VideoMsgFullParams,
  MemberNameParams,
  AdvancedMsgParams,
  GetSubDepParams,
  SearchInOrzParams,
  SetGroupRoleParams,
  SetGroupVerificationParams,
  SearchFriendParams,
  OptType,
  SearchGroupParams,
  GetGroupMemberByTimeParams,
  SearchGroupMemberParams,
  AdvancedQuoteMsgParams,
  SetMemberAuthParams,
  GetAdvancedHistoryMsgParams,
  FindMessageParams,
} from "../types";

export default class OpenIMSDK extends Emitter {
  private ws: WebSocket | undefined;
  private uid: string | undefined;
  private token: string | undefined;
  private platform: string = "web";
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

  /**
   *
   * @description init and login OpenIMSDK
   * @param uid userID
   * @param token token
   * @param url service url
   * @param platformID platformID
   * @param operationID? unique operation ID
   * @returns
   */
  login(config: InitConfig) {
    return new Promise<WsResponse>((resolve, reject) => {
      const { userID, token, url, platformID, isBatch = false, operationID } = config;
      this.wsUrl = `${url}?sendID=${userID}&token=${token}&platformID=${platformID}`;
      this.platformID = platformID;
      const loginData = {
        userID,
        token,
      };
      let errData: WsResponse = {
        event: RequestFunc.LOGIN,
        errCode: 0,
        errMsg: "",
        data: "",
        operationID: operationID || "",
      };

      const onOpen = () => {
        this.uid = userID;
        this.token = token;
        this.isBatch = isBatch;
        this.iLogin(loginData, operationID)
          .then((res) => {
            this.logoutFlag = false;
            this.heartbeat();
            resolve(res);
          })
          .catch((err) => {
            errData.errCode = err.errCode;
            errData.errMsg = err.errMsg;
            reject(errData);
          });
      };

      const onClose = () => {
        errData.errCode = 111;
        errData.errMsg = "ws connect close...";
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
        reject(errData);
      };

      const onError = (err: Error | Event) => {
        console.log(err);
        errData.errCode = 112;
        errData.errMsg = "ws connect error...";
        // if (!this.logoutFlag) this.reconnect();
        reject(errData);
      };

      this.createWs(onOpen, onClose, onError);

      if (!this.ws) {
        errData.errCode = 112;
        errData.errMsg = "The current platform is not supported...";
        reject(errData);
      }
    });
  }

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

  getLoginUser = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETLOGINUSER,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getSelfUserInfo = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETSELFUSERINFO,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getUsersInfo = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETUSERSINFO,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setSelfInfo = (data: PartialUserItem, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SETSELFINFO,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createTextMessage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATETEXTMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createTextAtMessage = (data: AtMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const tmp: any = { ...data };
      tmp.atUserIDList = JSON.stringify(tmp.atUserIDList);
      tmp.atUsersInfo = JSON.stringify(tmp.atUsersInfo);
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATETEXTATMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createAdvancedTextMessage = (data: AdvancedMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const tmp: any = { ...data };
      tmp.messageEntityList = JSON.stringify(tmp.messageEntityList);
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATEADVANCEDTEXTMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createImageMessage = (data: ImageMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      let tmp: any = { ...data };
      tmp.bigPicture = JSON.stringify(tmp.bigPicture);
      tmp.snapshotPicture = JSON.stringify(tmp.snapshotPicture);
      tmp.sourcePicture = JSON.stringify(tmp.sourcePicture);
      const args = {
        reqFuncName: RequestFunc.CREATEIMAGEMESSAGEFROMBYURL,
        operationID: _uuid,
        userID: this.uid,
        data: JSON.stringify(tmp),
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createSoundMessage = (data: SoundMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      let tmp = {
        soundBaseInfo: JSON.stringify(data),
      };
      const args = {
        reqFuncName: RequestFunc.CREATESOUNDMESSAGEBYURL,
        operationID: _uuid,
        userID: this.uid,
        data: JSON.stringify(tmp),
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createVideoMessage = (data: VideoMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      let tmp = {
        videoBaseInfo: JSON.stringify(data),
      };
      const args = {
        reqFuncName: RequestFunc.CREATEVIDEOMESSAGEBYURL,
        operationID: _uuid,
        userID: this.uid,
        data: JSON.stringify(tmp),
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createFileMessage = (data: FileMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      let tmp = {
        fileBaseInfo: JSON.stringify(data),
      };
      const args = {
        reqFuncName: RequestFunc.CREATEFILEMESSAGEBYURL,
        operationID: _uuid,
        userID: this.uid,
        data: JSON.stringify(tmp),
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createFileMessageFromFullPath = (data: FileMsgFullParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATEFILEMESSAGEFROMFULLPATH,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createImageMessageFromFullPath = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATEIMAGEMESSAGEFROMFULLPATH,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createSoundMessageFromFullPath = (data: SouondMsgFullParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATESOUNDMESSAGEFROMFULLPATH,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createVideoMessageFromFullPath = (data: VideoMsgFullParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATEVIDEOMESSAGEFROMFULLPATH,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createMergerMessage = (data: MergerMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      let tmp: any = { ...data };
      tmp.messageList = JSON.stringify(data.messageList);
      tmp.summaryList = JSON.stringify(data.summaryList);
      const args = {
        reqFuncName: RequestFunc.CREATEMERGERMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createForwardMessage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATEFORWARDMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createFaceMessage = (data: FaceMessageParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATEFACEMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createLocationMessage = (data: LocationMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATELOCATIONMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createCustomMessage = (data: CustomMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATECUSTOMMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createQuoteMessage = (data: QuoteMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATEQUOTEMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createAdvancedQuoteMessage = (data: AdvancedQuoteMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = { ...data };
      tmp.messageEntityList = JSON.stringify(tmp.messageEntityList);
      const args = {
        reqFuncName: RequestFunc.CREATEADVANCEDQUOTEMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createCardMessage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CREATECARDMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  sendMessage = (data: SendMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = { ...data };
      tmp.offlinePushInfo = tmp.offlinePushInfo ? JSON.stringify(data.offlinePushInfo) : "";
      const args = {
        reqFuncName: RequestFunc.SENDMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  sendMessageNotOss = (data: SendMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = { ...data };
      tmp.offlinePushInfo = tmp.offlinePushInfo ? JSON.stringify(data.offlinePushInfo) : "";
      const args = {
        reqFuncName: RequestFunc.SENDMESSAGENOTOSS,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getHistoryMessageList = (data: GetHistoryMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETHISTORYMESSAGELIST,
        operationID: _uuid,
        userID: this.uid,
        data,
      };

      this.wsSend(args, resolve, reject);
    });
  };

  getAdvancedHistoryMessageList = (data: GetAdvancedHistoryMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETADVANCEDHISTORYMESSAGELIST,
        operationID: _uuid,
        userID: this.uid,
        data,
      };

      this.wsSend(args, resolve, reject);
    });
  };

  getHistoryMessageListReverse = (data: GetHistoryMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETHISTORYMESSAGELISTREVERSE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };

      this.wsSend(args, resolve, reject);
    });
  };

  revokeMessage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.REVOKEMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setOneConversationPrivateChat = (data: setPrvParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SETONECONVERSATIONPRIVATECHAT,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  deleteMessageFromLocalStorage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.DELETEMESSAGEFROMLOCALSTORAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  deleteMessageFromLocalAndSvr = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.DELETEMESSAGEFROMLOCALANDSVR,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  deleteConversationFromLocalAndSvr = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.DELETECONVERSATIONFROMLOCALANDSVR,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  deleteAllConversationFromLocal = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.DELETEALLCONVERSATIONFROMLOCAL,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  deleteAllMsgFromLocal = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.DELETEALLMSGFROMLOCAL,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  deleteAllMsgFromLocalAndSvr = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.DELETEALLMSGFROMLOCALANDSVR,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  markGroupMessageHasRead = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.MARKGROUPMESSAGEHASREAD,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  markGroupMessageAsRead = (data: GroupMsgReadParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = { ...data };
      tmp.msgIDList = JSON.stringify(tmp.msgIDList);
      const args = {
        reqFuncName: RequestFunc.MARKGROUPMESSAGEASREAD,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  insertSingleMessageToLocalStorage = (data: InsertSingleMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.INSERTSINGLEMESSAGETOLOCALSTORAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  insertGroupMessageToLocalStorage = (data: InsertGroupMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.INSERTGROUPMESSAGETOLOCALSTORAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  typingStatusUpdate = (data: TypingUpdateParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.TYPINGSTATUSUPDATE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  markC2CMessageAsRead = (data: MarkC2CParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      let tmp: any = { ...data };
      tmp.msgIDList = JSON.stringify(tmp.msgIDList);
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.MARKC2CMESSAGEASREAD,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  markNotifyMessageHasRead = (conversationID: string, operationID?: string) => {
    this.markMessageAsReadByConID({ conversationID, msgIDList: [] });
  };

  markMessageAsReadByConID = (data: MarkNotiParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      let tmp: any = { ...data };
      tmp.msgIDList = JSON.stringify(tmp.msgIDList);
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.MARKMESSAGEASREADBYCONID,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  clearC2CHistoryMessage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CLEARC2CHISTORYMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  clearC2CHistoryMessageFromLocalAndSvr = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CLEARC2CHISTORYMESSAGEFROMLOCALANDSVR,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  clearGroupHistoryMessage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CLEARGROUPHISTORYMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  clearGroupHistoryMessageFromLocalAndSvr = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CLEARGROUPHISTORYMESSAGEFROMLOCALANDSVR,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getAllConversationList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETALLCONVERSATIONLIST,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getConversationListSplit = (data: SplitParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETCONVERSATIONLISTSPLIT,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getOneConversation = (data: GetOneCveParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETONECONVERSATION,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getConversationIDBySessionType = (data: GetOneCveParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETCONVERSATIONIDBYSESSIONTYPE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getMultipleConversation = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETMULTIPLECONVERSATION,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  deleteConversation = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.DELETECONVERSATION,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setConversationDraft = (data: SetDraftParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SETCONVERSATIONDRAFT,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  pinConversation = (data: PinCveParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.PINCONVERSATION,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getTotalUnreadMsgCount = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETTOTALUNREADMSGCOUNT,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getConversationRecvMessageOpt = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETCONVERSATIONRECVMESSAGEOPT,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setConversationRecvMessageOpt = (data: isRecvParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = { ...data };
      tmp.conversationIDList = JSON.stringify(data.conversationIDList);
      const args = {
        reqFuncName: RequestFunc.SETCONVERSATIONRECVMESSAGEOPT,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };

      this.wsSend(args, resolve, reject);
    });
  };

  searchLocalMessages = (data: SearchLocalParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SEARCHLOCALMESSAGES,
        operationID: _uuid,
        userID: this.uid,
        data,
      };

      this.wsSend(args, resolve, reject);
    });
  };

  addFriend = (data: AddFriendParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.ADDFRIEND,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  searchFriends = (data: SearchFriendParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SEARCHFRIENDS,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getDesignatedFriendsInfo = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETDESIGNATEDFRIENDSINFO,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getRecvFriendApplicationList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETRECVFRIENDAPPLICATIONLIST,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getSendFriendApplicationList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETSENDFRIENDAPPLICATIONLIST,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getFriendList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETFRIENDLIST,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setFriendRemark = (data: RemarkFriendParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SETFRIENDREMARK,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  checkFriend = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CHECKFRIEND,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  acceptFriendApplication = (data: AccessFriendParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.ACCEPTFRIENDAPPLICATION,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  refuseFriendApplication = (data: AccessFriendParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.REFUSEFRIENDAPPLICATION,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  deleteFriend = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.DELETEFRIEND,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  addBlack = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.ADDBLACK,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  removeBlack = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.REMOVEBLACK,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getBlackList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETBLACKLIST,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  inviteUserToGroup = (data: InviteGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = { ...data };
      tmp.userIDList = JSON.stringify(tmp.userIDList);
      const args = {
        reqFuncName: RequestFunc.INVITEUSERTOGROUP,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  kickGroupMember = (data: InviteGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = { ...data };
      tmp.userIDList = JSON.stringify(tmp.userIDList);
      const args = {
        reqFuncName: RequestFunc.KICKGROUPMEMBER,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getGroupMembersInfo = (data: Omit<InviteGroupParams, "reason">, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = { ...data };
      tmp.userIDList = JSON.stringify(tmp.userIDList);
      const args = {
        reqFuncName: RequestFunc.GETGROUPMEMBERSINFO,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getGroupMemberList = (data: GetGroupMemberParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETGROUPMEMBERLIST,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getGroupMemberListByJoinTimeFilter = (data: GetGroupMemberByTimeParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = { ...data };
      tmp.filterUserIDList = JSON.stringify(tmp.filterUserIDList);
      const args = {
        reqFuncName: RequestFunc.GETGROUPMEMBERLISTBYJOINTIMEFILTER,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  searchGroupMembers = (data: SearchGroupMemberParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SEARCHGROUPMEMBERS,
        operationID: _uuid,
        userID: this.uid,
        data: {
          searchParam: JSON.stringify(data),
        },
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setGroupApplyMemberFriend = (data: SetMemberAuthParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SETGROUPAPPLYMEMBERFRIEND,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setGroupLookMemberInfo = (data: SetMemberAuthParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SETGROUPLOOKMEMBERINFO,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getJoinedGroupList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETJOINEDGROUPLIST,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createGroup = (data: CreateGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = { ...data };
      tmp.groupBaseInfo = JSON.stringify(tmp.groupBaseInfo);
      tmp.memberList = JSON.stringify(tmp.memberList);
      const args = {
        reqFuncName: RequestFunc.CREATEGROUP,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setGroupInfo = (data: GroupInfoParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = { ...data };
      tmp.groupInfo = JSON.stringify(tmp.groupInfo);
      const args = {
        reqFuncName: RequestFunc.SETGROUPINFO,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setGroupMemberNickname = (data: MemberNameParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SETGROUPMEMBERNICKNAME,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getGroupsInfo = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETGROUPSINFO,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  joinGroup = (data: JoinGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.JOINGROUP,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  searchGroups = (data: SearchGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SEARCHGROUPS,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  quitGroup = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.QUITGROUP,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  dismissGroup = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.DISMISSGROUP,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  changeGroupMute = (data: ChangeGroupMuteParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CHANGEGROUPMUTE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  changeGroupMemberMute = (data: ChangeGroupMemberMuteParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.CHANGEGROUPMEMBERMUTE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  transferGroupOwner = (data: TransferGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.TRANSFERGROUPOWNER,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getSendGroupApplicationList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETSENDGROUPAPPLICATIONLIST,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getRecvGroupApplicationList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETRECVGROUPAPPLICATIONLIST,
        operationID: _uuid,
        userID: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  acceptGroupApplication = (data: AccessGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.ACCEPTGROUPAPPLICATION,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  refuseGroupApplication = (data: AccessGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.REFUSEGROUPAPPLICATION,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  signalingInvite = (data: RtcInvite, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = {};
      tmp.invitation = data;
      const args = {
        reqFuncName: RequestFunc.SIGNAL_INGINVITE,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  signalingInviteInGroup = (data: RtcInvite, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = {};
      tmp.invitation = data;
      const args = {
        reqFuncName: RequestFunc.SIGNALINGINVITEINGROUP,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  signalingAccept = (data: RtcActionParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SIGNALINGACCEPT,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  signalingReject = (data: RtcActionParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SIGNALINGREJECT,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  signalingCancel = (data: RtcActionParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SIGNALINGCANCEL,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  signalingHungUp = (data: RtcActionParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SIGNALINGHUNGUP,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  // organization
  getSubDepartment = (data: GetSubDepParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETSUBDEPARTMENT,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getDepartmentMember = (data: GetSubDepParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETDEPARTMENTMEMBER,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getUserInDepartment = (userID: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETUSERINDEPARTMENT,
        operationID: _uuid,
        userID: this.uid,
        data: userID,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getDepartmentMemberAndSubDepartment = (departmentID: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETDEPARTMENTMEMBERANDSUBDEPARTMENT,
        operationID: _uuid,
        userID: this.uid,
        data: departmentID,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getDepartmentInfo = (departmentID: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.GETDEPARTMENTINFO,
        operationID: _uuid,
        userID: this.uid,
        data: departmentID,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  searchOrganization = (data: SearchInOrzParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const tmp: any = data;
      tmp.input = JSON.stringify(tmp.input);
      const args = {
        reqFuncName: RequestFunc.SEARCHORGANIZATION,
        operationID: _uuid,
        userID: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  resetConversationGroupAtType = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.RESETCONVERSATIONGROUPATTYPE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setGroupMemberRoleLevel = (data: SetGroupRoleParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SETGROUPMEMBERROLELEVEL,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setGroupVerification = (data: SetGroupVerificationParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SETGROUPVERIFICATION,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setGlobalRecvMessageOpt = (data: { opt: OptType }, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.SETGLOBALRECVMESSAGEOPT,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };
  
  newRevokeMessage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.NEWREVOKEMESSAGE,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  findMessageList = (data: FindMessageParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid(this.uid as string);
      const args = {
        reqFuncName: RequestFunc.FINDMESSAGELIST,
        operationID: _uuid,
        userID: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  //tool methods

  private wsSend = (params: WsParams, resolve: (value: WsResponse | PromiseLike<WsResponse>) => void, reject: (reason?: any) => void) => {
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
        if (data.event === RequestFunc.SENDMESSAGE || data.event === RequestFunc.SENDMESSAGENOTOSS) {
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

  private getPlatform() {
    const wflag = typeof WebSocket;
    //@ts-ignore
    const uflag = typeof uni;
    //@ts-ignore
    const xflag = typeof wx;

    if (wflag !== "undefined") {
      this.platform = "web";
      return;
    }

    if (uflag === "object" && xflag !== "object") {
      this.platform = "uni";
    } else if (uflag !== "object" && xflag === "object") {
      this.platform = "wx";
    } else {
      this.platform = "unknow";
    }
  }

  private createWs(_onOpen?: Function, _onClose?: Function, _onError?: Function) {
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

      if (this.platform === "web") {
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

  private clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

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

      if (this.ws?.readyState !== this.ws?.CONNECTING && this.ws?.readyState !== this.ws?.OPEN) {
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
    } catch (error) {
      
    }
  }
}
