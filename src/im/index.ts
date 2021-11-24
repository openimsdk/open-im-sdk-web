import { CbEvents, RequestFunc } from "../constants";
import { uuid } from "../util";
import Emitter from "../event";

export type InitConfig = {
  uid: string;
  token: string;
  url: string;
  platformID: number;
  operationID?: string;
};

export type WsParams = {
  reqFuncName: RequestFunc;
  operationID: string;
  uid: string | undefined;
  data: any;
};

export type WsResponse = {
  event: RequestFunc;
  errCode: number;
  errMsg: string;
  data: any;
  operationID: string;
};

export type LoginParams = {
  uid: string;
  token: string;
};

export type SelfInfo = {
  name?: string;
  icon?: string;
  gender?: number;
  mobile?: string;
  birth?: string;
  email?: string;
  ex?: string;
};

export type AtMsgParams = {
  text: string;
  atUserList: string[];
};

export type ImageMsgParams = {
  sourcePicture: PicBaseInfo;
  bigPicture: PicBaseInfo;
  snapshotPicture: PicBaseInfo;
};

export type PicBaseInfo = {
  uuid: string;
  type: string;
  size: number;
  width: number;
  height: number;
  url: string;
};

export type SoundMsgParams = {
  uuid: string;
  soundPath: string;
  sourceUrl: string;
  dataSize: number;
  duration: number;
};

export type VideoMsgParams = {
  videoPath: string;
  duration: number;
  videoType: string;
  snapshotPath: string;
  videoUUID: string;
  videoUrl: string;
  videoSize: number;
  snapshotUUID: string;
  snapshotSize: number;
  snapshotUrl: string;
  snapshotWidth: number;
  snapshotHeight: number;
};

export type FileMsgParams = {
  filePath: string;
  fileName: string;
  uuid: string;
  sourceUrl: string;
  fileSize: number;
};

export type MergerMsgParams = {
  messageList: string[];
  title: string;
  summaryList: string[];
};

export type LocationMsgParams = {
  description: string;
  longitude: number;
  latitude: number;
};

export type CustomMsgParams = {
  data: string;
  extension: string;
  description: string;
};

export type QuoteMsgParams = {
  text: string;
  message: string;
};

export type SendMsgParams = {
  recvID: string;
  groupID: string;
  onlineUserOnly: boolean;
  message: string;
};

export type GetHistoryMsgParams = {
  userID: string;
  groupID: string;
  count: number;
  startMsg: any;
};

export type InsertSingleMsgParams = {
  message: string;
  userID: string;
  sender: string;
};

export type TypingUpdateParams = {
  receiver: string;
  msgTip: string;
};

export type MarkC2CParams = {
  receiver: string;
  msgIDList: string[];
};

export type GetOneCveParams = {
  sourceID: string;
  sessionType: number;
};

export type SetDraftParams = {
  conversationID: string;
  draftText: string;
};

export type PinCveParams = {
  conversationID: string;
  isPinned: boolean;
};

export type AddFriendParams = {
  uid: string;
  reqMessage: string;
};

export type SetFriendParams = {
  uid: string;
  comment: string;
};

export type InviteGroupParams = {
  groupId: string;
  reason: string;
  userList: string[];
};

export type GetGroupMemberParams = {
  groupId: string;
  filter: number;
  next: number;
};

export type CreateGroupParams = {
  gInfo: Omit<GroupInfo, "groupId">;
  memberList: member[];
};

export type member = {
  uid: string;
  setRole: number;
};

export type GroupInfo = {
  groupId: string;
  groupName: string;
  introduction: string;
  notification: string;
  faceUrl: string;
};

export type joinGroupParams = {
  groupId: string;
  message: string;
};

export type TransferGroupParams = {
  groupId: string;
  userId: string;
};

export type AccessGroupParams = {
  application: string;
  reason: string;
};

type Ws2Promise = {
  oid: string;
  mname: string;
  mrsve: (value: WsResponse | PromiseLike<WsResponse>) => void;
  mrjet: (reason?: any) => void;
  flag: boolean;
};

export default class OpenIMSDK extends Emitter {
  private ws: WebSocket | undefined;
  private uid: string | undefined;
  private token: string | undefined;
  private platform: string = "web";
  private wsUrl: string = "";
  private lock: boolean = false;
  private logoutFlag: boolean = false;
  private timer: number | undefined;
  private ws2promise: Ws2Promise[] = [];

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
      const { uid, token, url, platformID, operationID } = config;
      this.wsUrl = `${url}?sendID=${uid}&token=${token}&platformID=${platformID}`;
      const loginData = {
        uid,
        token,
      };
      let errData: WsResponse = {
        event: RequestFunc.LOGIN,
        errCode: 0,
        errMsg: "",
        data: "",
        operationID: operationID || "",
      };
      if (this.platform === "web") {
        this.ws = new WebSocket(this.wsUrl);

        this.ws.onopen = () => {
          this.uid = uid;
          this.token = token;
          // console.log("once open:::");

          this.iLogin(loginData, operationID)
            .then((res) => {
              this.logoutFlag = false;
              resolve(res);
            })
            .catch((err) => {
              reject(err);
            });
        };

        this.ws.onclose = () => {
          errData.errCode = 111;
          errData.errMsg = "ws connect failed...";
          if (!this.logoutFlag) this.reconnect();
          reject(errData);
        };

        this.ws.onerror = (err) => {
          errData.errCode = 111;
          errData.errMsg = "ws connect failed...";
          reject(errData);
        };
      } else if (this.platform === "uni" || this.platform === "wx") {
        this.ws =
          this.platform === "uni"
            ? //@ts-ignore
              uni.connectSocket({
                url: this.wsUrl,
                complete: () => {},
              })
            : //@ts-ignore
              wx.connectSocket({
                url: this.wsUrl,
                complete: () => {},
              });
        //@ts-ignore
        this.ws.onOpen(() => {
          this.uid = uid;
          this.iLogin(loginData, operationID)
            .then((res) => {
              this.logoutFlag = false;
              resolve(res);
            })
            .catch((err) => {
              errData.errCode = 111;
              errData.errMsg = "ws connect failed...";
              reject(errData);
            });
        });
        //@ts-ignore
        this.ws.onClose(() => {
          errData.errCode = 111;
          errData.errMsg = "ws connect failed...";
          if (!this.logoutFlag) this.reconnect();
          reject(errData);
        });
        //@ts-ignore
        this.ws.onError(() => {
          errData.errCode = 111;
          errData.errMsg = "ws connect failed...";
          reject(errData);
        });
      } else {
        errData.errCode = 112;
        errData.errMsg = "The current platform is not supported...";
        reject(errData);
      }
    });
  }

  private iLogin(data: LoginParams, operationID?: string) {
    // console.log("cal iLogin::::");

    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.LOGIN,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  }

  logout(operationID?: string) {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.LOGOUT,
        operationID: _uuid,
        uid: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  }

  getLoginStatus = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.GETLOGINSTATUS,
        operationID: _uuid,
        uid: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getLoginUser = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.GETLOGINUSER,
        operationID: _uuid,
        uid: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getUsersInfo = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.GETUSERSINFO,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setSelfInfo = (data: SelfInfo, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.SETSELFINFO,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createTextMessage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.CREATETEXTMESSAGE,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createTextAtMessage = (data: AtMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const tmp: any = data;
      tmp.atUserList = JSON.stringify(tmp.atUserList);
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.CREATETEXTATMESSAGE,
        operationID: _uuid,
        uid: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createImageMessage = (data: ImageMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      let tmp: any = data;
      tmp.bigPicture = JSON.stringify(tmp.bigPicture);
      tmp.snapshotPicture = JSON.stringify(tmp.snapshotPicture);
      tmp.sourcePicture = JSON.stringify(tmp.sourcePicture);
      const args = {
        reqFuncName: RequestFunc.CREATEIMAGEMESSAGEFROMBYURL,
        operationID: _uuid,
        uid: this.uid,
        data: JSON.stringify(tmp),
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createSoundMessage = (data: SoundMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      let tmp = {
        soundBaseInfo: JSON.stringify(data),
      };
      const args = {
        reqFuncName: RequestFunc.CREATESOUNDMESSAGEBYURL,
        operationID: _uuid,
        uid: this.uid,
        data: JSON.stringify(tmp),
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createVideoMessage = (data: VideoMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      let tmp = {
        videoBaseInfo: JSON.stringify(data),
      };
      const args = {
        reqFuncName: RequestFunc.CREATEVIDEOMESSAGEBYURL,
        operationID: _uuid,
        uid: this.uid,
        data: JSON.stringify(tmp),
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createFileMessage = (data: FileMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      let tmp = {
        fileBaseInfo: JSON.stringify(data),
      };
      const args = {
        reqFuncName: RequestFunc.CREATEFILEMESSAGEBYURL,
        operationID: _uuid,
        uid: this.uid,
        data: JSON.stringify(tmp),
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createMergerMessage = (data: MergerMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      let tmp: any = data;
      tmp.messageList = JSON.stringify(data.messageList);
      tmp.summaryList = JSON.stringify(data.summaryList);
      const args = {
        reqFuncName: RequestFunc.CREATEMERGERMESSAGE,
        operationID: _uuid,
        uid: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createForwardMessage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.CREATEFORWARDMESSAGE,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createLocationMessage = (data: LocationMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.CREATELOCATIONMESSAGE,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createCustomMessage = (data: CustomMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.CREATECUSTOMMESSAGE,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createQuoteMessage = (data: QuoteMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.CREATEQUOTEMESSAGE,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  sendMessage = (data: SendMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.SENDMESSAGE,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  sendMessageNotOss = (data: SendMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      let tmp: any = Object.assign({}, data);
      tmp.receiver = data.recvID;
      delete tmp.recvID;
      const args = {
        reqFuncName: RequestFunc.SENDMESSAGENOTOSS,
        operationID: _uuid,
        uid: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getHistoryMessageList = (data: GetHistoryMsgParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.GETHISTORYMESSAGELIST,
        operationID: _uuid,
        uid: this.uid,
        data,
      };

      this.wsSend(args, resolve, reject);
    });
  };

  revokeMessage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.REVOKEMESSAGE,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  deleteMessageFromLocalStorage = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.DELETEMESSAGEFROMLOCALSTORAGE,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  markSingleMessageHasRead = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.MARKSINGLEMESSAGEHASREAD,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  markGroupMessageHasRead = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.MARKGROUPMESSAGEHASREAD,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  insertSingleMessageToLocalStorage = (
    data: InsertSingleMsgParams,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.INSERTSINGLEMESSAGETOLOCALSTORAGE,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  findMessages = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.FINDMESSAGES,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  typingStatusUpdate = (data: TypingUpdateParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.TYPINGSTATUSUPDATE,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  markC2CMessageAsRead = (data: MarkC2CParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      let tmp: any = data;
      tmp.msgIDList = JSON.stringify(tmp.msgIDList);
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.MARKC2CMESSAGEASREAD,
        operationID: _uuid,
        uid: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getAllConversationList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.GETALLCONVERSATIONLIST,
        operationID: _uuid,
        uid: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getOneConversation = (data: GetOneCveParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.GETONECONVERSATION,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getMultipleConversation = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.GETMULTIPLECONVERSATION,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  deleteConversation = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.DELETECONVERSATION,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setConversationDraft = (data: SetDraftParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.SETCONVERSATIONDRAFT,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  pinConversation = (data: PinCveParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.PINCONVERSATION,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getTotalUnreadMsgCount = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.GETTOTALUNREADMSGCOUNT,
        operationID: _uuid,
        uid: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  addFriend = (data: AddFriendParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.ADDFRIEND,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getFriendsInfo = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.GETFRIENDSINFO,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getFriendApplicationList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.GETFRIENDAPPLICATIONLIST,
        operationID: _uuid,
        uid: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getFriendList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.GETFRIENDLIST,
        operationID: _uuid,
        uid: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setFriendInfo = (data: SetFriendParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.SETFRIENDINFO,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  checkFriend = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.CHECKFRIEND,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  acceptFriendApplication = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.ACCEPTFRIENDAPPLICATION,
        operationID: _uuid,
        uid: this.uid,
        data: JSON.stringify(data),
      };
      this.wsSend(args, resolve, reject);
    });
  };

  refuseFriendApplication = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.REFUSEFRIENDAPPLICATION,
        operationID: _uuid,
        uid: this.uid,
        data: JSON.stringify(data),
      };
      this.wsSend(args, resolve, reject);
    });
  };

  deleteFromFriendList = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.DELETEFROMFRIENDLIST,
        operationID: _uuid,
        uid: this.uid,
        data: JSON.stringify(data),
      };
      this.wsSend(args, resolve, reject);
    });
  };

  addToBlackList = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.ADDTOBLACKLIST,
        operationID: _uuid,
        uid: this.uid,
        data: JSON.stringify(data),
      };
      this.wsSend(args, resolve, reject);
    });
  };

  deleteFromBlackList = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.DELETEFROMBLACKLIST,
        operationID: _uuid,
        uid: this.uid,
        data: JSON.stringify(data),
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getBlackList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.GETBLACKLIST,
        operationID: _uuid,
        uid: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  inviteUserToGroup = (data: InviteGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const tmp: any = data;
      tmp.userList = JSON.stringify(tmp.userList);
      const args = {
        reqFuncName: RequestFunc.INVITEUSERTOGROUP,
        operationID: _uuid,
        uid: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  kickGroupMember = (data: InviteGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const tmp: any = data;
      tmp.userList = JSON.stringify(tmp.userList);
      const args = {
        reqFuncName: RequestFunc.KICKGROUPMEMBER,
        operationID: _uuid,
        uid: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getGroupMembersInfo = (
    data: Omit<InviteGroupParams, "reason">,
    operationID?: string
  ) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const tmp: any = data;
      tmp.userList = JSON.stringify(tmp.userList);
      const args = {
        reqFuncName: RequestFunc.GETGROUPMEMBERSINFO,
        operationID: _uuid,
        uid: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getGroupMemberList = (data: GetGroupMemberParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.GETGROUPMEMBERLIST,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getJoinedGroupList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.GETJOINEDGROUPLIST,
        operationID: _uuid,
        uid: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  createGroup = (data: CreateGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const tmp: any = data;
      tmp.gInfo = JSON.stringify(tmp.gInfo);
      tmp.memberList = JSON.stringify(tmp.memberList);
      const args = {
        reqFuncName: RequestFunc.CREATEGROUP,
        operationID: _uuid,
        uid: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  setGroupInfo = (data: GroupInfo, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.SETGROUPINFO,
        operationID: _uuid,
        uid: this.uid,
        data: {
          groupInfo: JSON.stringify(data),
        },
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getGroupsInfo = (data: string[], operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const tmp = {
        groupIdList: JSON.stringify(data),
      };
      const args = {
        reqFuncName: RequestFunc.GETGROUPSINFO,
        operationID: _uuid,
        uid: this.uid,
        data: tmp,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  joinGroup = (data: joinGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.JOINGROUP,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  quitGroup = (data: string, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.QUITGROUP,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  transferGroupOwner = (data: TransferGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.TRANSFERGROUPOWNER,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  getGroupApplicationList = (operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.GETGROUPAPPLICATIONLIST,
        operationID: _uuid,
        uid: this.uid,
        data: "",
      };
      this.wsSend(args, resolve, reject);
    });
  };

  acceptGroupApplication = (data: AccessGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.ACCEPTGROUPAPPLICATION,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  refuseGroupApplication = (data: AccessGroupParams, operationID?: string) => {
    return new Promise<WsResponse>((resolve, reject) => {
      const _uuid = operationID || uuid();
      const args = {
        reqFuncName: RequestFunc.REFUSEGROUPAPPLICATION,
        operationID: _uuid,
        uid: this.uid,
        data,
      };
      this.wsSend(args, resolve, reject);
    });
  };

  //tool methods

  private wsSend = (
    params: WsParams,
    resolve: (value: WsResponse | PromiseLike<WsResponse>) => void,
    reject: (reason?: any) => void
  ) => {
    if (typeof params.data === "object")
      params.data = JSON.stringify(params.data);

    const ws2p = {
      oid: params.operationID,
      mname: params.reqFuncName,
      mrsve: resolve,
      mrjet: reject,
      flag: false,
    };
    this.ws2promise.push(ws2p);

    this.ws2promise = this.ws2promise.filter(wspp=>!wspp.flag)
    
    if (this.platform == "web") {
      this.ws!.send(JSON.stringify(params));
      this.ws!.onmessage = (ev: MessageEvent<string>) => {
        const data = JSON.parse(ev.data);

        if (
          Object.prototype.hasOwnProperty.call(
            CbEvents,
            data.event.toUpperCase()
          )
        )
          this.emit(data.event, data);

        if (params.reqFuncName === RequestFunc.LOGOUT) {
          this.logoutFlag = true;
          this.ws!.close();
          this.ws = undefined;
        }

        const wspidx = this.ws2promise.findIndex(
          (wsp) => wsp.oid === data.operationID
        );
        if (wspidx > -1) {
          if (data.errCode === 0) {
            this.ws2promise[wspidx].mrsve(data);
            this.ws2promise[wspidx].flag=true;
          } else {
            this.ws2promise[wspidx].mrjet(data);
            this.ws2promise[wspidx].flag=true;
          }
        }
      };
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
          //@ts-ignore
          this.ws!.onMessage((ev) => {
            const data = JSON.parse(ev.data);

            if (
              Object.prototype.hasOwnProperty.call(
                CbEvents,
                data.event.toUpperCase()
              )
            )
              this.emit(data.event, data);

            if (params.reqFuncName === RequestFunc.LOGOUT) {
              this.logoutFlag = true;
              this.ws!.close();
              this.ws = undefined;
            }

            const wspidx = this.ws2promise.findIndex(
              (wsp) => wsp.oid === data.operationID
            );
            if (wspidx > -1) {
              if (data.errCode === 0) {
                this.ws2promise[wspidx].mrsve(data);
                this.ws2promise[wspidx].flag=true;
              } else {
                this.ws2promise[wspidx].mrjet(data);
                this.ws2promise[wspidx].flag=true;
              }
            }
          });
        },
      });
    }
  };

  private getPlatform() {
    const wflag = typeof WebSocket;
    //@ts-ignore
    const uflag = typeof uni;
    //@ts-ignore
    const xflag = typeof wx;
    if (wflag === "undefined") {
      if (uflag === "object" && xflag === "object") {
        this.platform = "uni";
      } else if (uflag !== "object" && xflag === "object") {
        this.platform = "wx";
      } else {
        this.platform = "unknow";
      }
    } else {
      this.platform = "web";
    }
  }

  private createWs() {
    if (this.platform === "web") {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onclose = () => {
        // console.log("ws onclose");

        if (!this.logoutFlag) this.reconnect();
      };
      this.ws.onopen = () => {
        // console.log("ws onopen::::");

        // this.resetHeart();
        // this.startHeart();
        const loginData = {
          uid: this.uid!,
          token: this.token!,
        };
        this.iLogin(loginData).then((res) => (this.logoutFlag = false));
      };
    } else if (this.platform === "uni") {
      //@ts-ignore
      this.ws = uni.connectSocket({
        url: this.wsUrl,
        complete: () => {},
      });
      //@ts-ignore
      this.ws.onClose = () => {
        if (!this.logoutFlag) this.reconnect();
      };
      //@ts-ignore
      this.ws.onOpen = () => {
        const loginData = {
          uid: this.uid!,
          token: this.token!,
        };
        this.iLogin(loginData).then((res) => (this.logoutFlag = false));
      };
    } else if (this.platform === "wx") {
      //@ts-ignore
      this.ws = wx.connectSocket({
        url: this.wsUrl,
        complete: () => {},
      });
      //@ts-ignore
      this.ws.onClose = () => {
        if (!this.logoutFlag) this.reconnect();
      };
      //@ts-ignore
      this.ws.onOpen = () => {
        const loginData = {
          uid: this.uid!,
          token: this.token!,
        };
        this.iLogin(loginData).then((res) => (this.logoutFlag = false));
      };
    }
  }

  private reconnect() {
    if (this.lock) return;
    this.lock = true;
    setTimeout(() => {
      this.createWs();
      this.lock = false;
    }, 2000);
  }

  // private resetHeart(){
  //   clearTimeout(this.timer)
  // }

  // private startHeart() {
  //   this.timer = setTimeout(()=>{
  //     this.ws!.close;
  //   },60000)
  // }
}