import type {
  MessageItem,
  PromiseMap,
  WsRequest,
  WsResponse,
} from '@/types/entity';
import type {
  FileMsgParams,
  ImageMsgParams,
  LoginParams,
  SoundMsgParams,
  UploadFileParams,
  VideoMsgParams,
} from '@/types/params';
import WebSocketManager from '@/utils/webSocketManager';
import { ErrorCode, RequestApi } from '@/constant/api';
import { UserApi, setupUser } from './user';
import { FriendApi, setupFriend } from './friend';
import { GroupApi, setupGroup } from './group';
import { MessageApi, setupMessage } from './message';
import { ConversationApi, setupConversation } from './conversation';
import Emitter from '@/utils/emitter';
import { CbEvents } from '@/constant/callback';
import SparkMD5 from 'spark-md5';
import {
  confirmUpload,
  getMimeType,
  getUploadPartsize,
  getUploadUrl,
} from '@/utils/upload';
import { LoginStatus } from '@/types/enum';
import { uuid } from '@/utils/uuid';

const forceCloseEvents = [
  RequestApi.Logout,
  CbEvents.OnKickedOffline,
  CbEvents.OnUserTokenInvalid,
  CbEvents.OnUserTokenExpired,
];

function isEventInCallbackEvents(event: string): event is CbEvents {
  return Object.values(CbEvents).includes(event as CbEvents);
}

class OpenIMSDK
  extends Emitter
  implements UserApi, FriendApi, GroupApi, MessageApi, ConversationApi
{
  private userID?: string;
  private token?: string;
  private apiAddr?: string;
  private wsManager?: WebSocketManager;
  private requestMap = new Map<string, PromiseMap>();

  constructor() {
    super();
    Object.assign(this, setupUser(this));
    Object.assign(this, setupFriend(this));
    Object.assign(this, setupGroup(this));
    Object.assign(this, setupMessage(this));
    Object.assign(this, setupConversation(this));
  }

  private sendRequest = <T>(requestObj: WsRequest): Promise<WsResponse<T>> => {
    return new Promise((resolve, reject) => {
      if (!this.wsManager) {
        reject({
          data: '',
          operationID: requestObj.operationID,
          errMsg: 'please login first',
          errCode: ErrorCode.ResourceLoadNotCompleteError,
          event: requestObj.reqFuncName,
        });
        return;
      }

      this.requestMap.set(requestObj.operationID, {
        resolve: resolve as unknown as (value: WsResponse<unknown>) => void,
        reject,
      });
      this.wsManager?.sendMessage(requestObj);
    });
  };

  private defaultDataFormatter = <T>(params: T) => {
    if (typeof params === 'object') {
      params = JSON.stringify(params) as unknown as T;
    }
    return JSON.stringify([params]);
  };

  createRequestFunction = <T, R = unknown>(
    reqFuncName: RequestApi,
    dataFormatter = this.defaultDataFormatter<T>
  ) => {
    return (params: T, operationID = uuid()) => {
      const data = dataFormatter(params as T);
      return this.sendRequest<R>({
        data,
        operationID,
        userID: this.userID!,
        reqFuncName: reqFuncName,
      });
    };
  };

  createRequestFunctionWithoutParams = <T = unknown>(
    reqFuncName: RequestApi
  ) => {
    return (operationID = uuid()) =>
      this.sendRequest<T>({
        data: '[]',
        operationID,
        userID: this.userID!,
        reqFuncName: reqFuncName,
      });
  };

  private handleMessage = (data: WsResponse) => {
    if (data.event === RequestApi.InitSDK) {
      if (data.errCode !== 0) console.error(data);
      return;
    }

    try {
      data.data = JSON.parse(data.data as string);
    } catch (error) {}

    if (forceCloseEvents.includes(data.event)) {
      this.wsManager?.close();
      this.wsManager = undefined;
    }

    if (isEventInCallbackEvents(data.event)) {
      this.emit(data.event, data);
      if (forceCloseEvents.includes(data.event)) {
        this.requestMap.clear();
      }
      return;
    }
    const promiseHandlers = this.requestMap.get(data.operationID);
    if (promiseHandlers) {
      const promiseHandler =
        data.errCode === 0 ? promiseHandlers.resolve : promiseHandlers.reject;
      promiseHandler(data);
      this.requestMap.delete(data.operationID);
    }
    if (forceCloseEvents.includes(data.event)) {
      this.requestMap.clear();
    }
  };

  private handleReconnectSuccess = () => {
    if (!this.userID) return;

    this.sendRequest({
      data: JSON.stringify([this.userID, this.token]),
      operationID: uuid(),
      userID: this.userID,
      reqFuncName: RequestApi.Login,
    });
  };

  login = async (
    params: LoginParams,
    operationID = uuid()
  ): Promise<WsResponse> => {
    if (this.wsManager) {
      return Promise.resolve({
        data: '',
        operationID,
        errMsg: 'login repeat',
        errCode: ErrorCode.LoginRepeatError,
        event: RequestApi.Login,
      });
    }
    const internalWsUrl = `${params.wsAddr}?sendID=${params.userID}&token=${params.token}&platformID=${params.platformID}&operationID=${operationID}`;
    this.userID = params.userID;
    this.token = params.token;
    this.apiAddr = params.apiAddr;
    this.wsManager = new WebSocketManager(
      internalWsUrl,
      this.handleMessage,
      this.handleReconnectSuccess
    );
    try {
      await this.wsManager.connect();
    } catch (error) {
      return Promise.reject({
        data: '',
        operationID,
        errMsg: (error as Error).message,
        errCode: ErrorCode.ConnectionEstablishmentFailed,
        event: RequestApi.Login,
      });
    }
    return this.sendRequest({
      data: JSON.stringify([params.userID, params.token]),
      operationID,
      userID: this.userID,
      reqFuncName: RequestApi.Login,
    });
  };

  logout = this.createRequestFunctionWithoutParams(RequestApi.Logout);

  getLoginStatus = this.createRequestFunctionWithoutParams<LoginStatus>(
    RequestApi.GetLoginStatus
  );

  getLoginUserID = this.createRequestFunctionWithoutParams<string>(
    RequestApi.GetLoginUserID
  );

  // third
  private internalUploadFile = async (
    file: File,
    operationID: string
  ): Promise<{ url?: string; error?: Error }> => {
    try {
      const fileName = `${this.userID}/${file.name}`;
      const contentType = getMimeType(file.name);
      const commonOptions = { operationID, token: this.token! };
      const { size: partSize } = await getUploadPartsize(
        this.apiAddr!,
        file.size,
        commonOptions
      );
      const chunks = Math.ceil(file.size / partSize);
      const chunkGapList: { start: number; end: number }[] = [];
      const chunkHashList: string[] = [];
      const fileSpark = new SparkMD5.ArrayBuffer();
      let currentChunk = 0;

      while (currentChunk < chunks) {
        const start = currentChunk * partSize;
        const end = Math.min(start + partSize, file.size);
        const chunk = file.slice(start, end);
        chunkGapList.push({ start, end });

        // Use a self-invoking function to capture the currentChunk index
        const chunkHash = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(chunk);
          reader.onload = e => {
            if (e.target) {
              fileSpark.append(e.target.result as ArrayBuffer);
              resolve(fileSpark.end());
            }
          };
          reader.onerror = err => reject(err);
        });
        chunkHashList.push(chunkHash);
        currentChunk++;
      }

      const totalFileHash = chunkHashList.join(',');
      fileSpark.destroy();
      const textSpark = new SparkMD5();
      textSpark.append(totalFileHash);
      const { url: finishUrl, upload } = await getUploadUrl(
        this.apiAddr!,
        {
          hash: textSpark.end(),
          size: file.size,
          partSize,
          maxParts: -1,
          cause: '',
          name: fileName,
          contentType,
        },
        commonOptions
      );
      textSpark.destroy();
      if (finishUrl) {
        return {
          url: finishUrl,
        };
      }

      let uploadParts = upload.sign.parts;
      const signQuery = upload.sign.query;
      const signHeader = upload.sign.header;

      // Use Promise.all to wait for all PUT operations to complete
      await Promise.all(
        uploadParts.map(async (part, idx) => {
          const url = part.url || upload.sign.url;
          const rawUrl = new URL(url);
          if (signQuery) {
            const params = new URLSearchParams(rawUrl.search);
            signQuery.forEach(item => {
              params.set(item.key, item.values[0]);
            });
            rawUrl.search = params.toString();
          }
          if (part.query) {
            const params = new URLSearchParams(rawUrl.search);
            part.query.forEach(item => {
              params.set(item.key, item.values[0]);
            });
            rawUrl.search = params.toString();
          }
          const putUrl = rawUrl.toString();
          const headers = new Headers();
          if (signHeader) {
            signHeader.forEach(item => {
              headers.set(item.key, item.values[0]);
            });
          }
          if (part.header) {
            part.header.forEach(item => {
              headers.set(item.key, item.values[0]);
            });
          }
          headers.set(
            'Content-Length',
            (chunkGapList[idx].end - chunkGapList[idx].start).toString()
          );

          // Ensure correct content type is set for the chunk
          headers.set('Content-Type', contentType);

          const response = await fetch(putUrl, {
            method: 'PUT',
            headers,
            body: file.slice(chunkGapList[idx].start, chunkGapList[idx].end),
          });

          if (!response.ok) {
            throw new Error(`Failed to upload chunk ${idx + 1}`);
          }
        })
      );

      const { url } = await confirmUpload(
        this.apiAddr!,
        {
          uploadID: upload.uploadID,
          parts: chunkHashList,
          cause: '',
          name: fileName,
          contentType,
        },
        commonOptions
      );
      return { url };
    } catch (error) {
      console.error('Upload failed:', error);
      return { error: error as Error };
    }
  };

  uploadFile = async (
    { file }: UploadFileParams,
    operationID = uuid()
  ): Promise<WsResponse<{ url: string }>> => {
    const { url = '', error } = await this.internalUploadFile(
      file,
      operationID
    );
    return {
      data: {
        url,
      },
      operationID,
      errMsg: error?.message ?? '',
      errCode: error ? ErrorCode.UnknownError : 0,
      event: RequestApi.UploadFile,
    };
  };

  // extends message
  createImageMessageByFile = async (
    params: ImageMsgParams & { file: File },
    operationID = uuid()
  ) => {
    const { url, error } = await this.internalUploadFile(
      params.file,
      operationID
    );
    if (error) {
      return Promise.reject({
        data: '',
        operationID,
        errMsg: error.message,
        errCode: ErrorCode.UnknownError,
        event: RequestApi.CreateImageMessageByFile,
      });
    }
    params.sourcePicture.url = url!;
    params.bigPicture.url = url!;
    params.snapshotPicture.url = `${url}?type=image&width=${params.snapshotPicture.width}&height=${params.snapshotPicture.height}`;
    const tmpParams = { ...params };
    // @ts-ignore
    delete tmpParams.file;
    return this.createImageMessageByURL(tmpParams, operationID) as Promise<
      WsResponse<MessageItem>
    >;
  };

  createVideoMessageByFile = async (
    params: VideoMsgParams & { videoFile: File; snapshotFile: File },
    operationID = uuid()
  ) => {
    try {
      const [{ url: snapshotUrl }, { url: videoUrl }] = await Promise.all([
        this.internalUploadFile(params.snapshotFile, operationID),
        this.internalUploadFile(params.videoFile, operationID),
      ]);
      params.videoUrl = videoUrl!;
      params.snapshotUrl = `${snapshotUrl}?type=image&width=${params.snapshotWidth}&height=${params.snapshotHeight}`;
      const tmpParams = { ...params };
      // @ts-ignore
      delete tmpParams.videoFile;
      // @ts-ignore
      delete tmpParams.snapshotFile;
      return this.createVideoMessageByURL(tmpParams, operationID) as Promise<
        WsResponse<MessageItem>
      >;
    } catch (error) {
      return Promise.reject({
        data: '',
        operationID,
        errMsg: (error as Error).message,
        errCode: ErrorCode.UnknownError,
        event: RequestApi.CreateVideoMessageByFile,
      });
    }
  };

  createSoundMessageByFile = async (
    params: SoundMsgParams & { file: File },
    operationID = uuid()
  ) => {
    const { url, error } = await this.internalUploadFile(
      params.file,
      operationID
    );
    if (error) {
      return Promise.reject({
        data: '',
        operationID,
        errMsg: error.message,
        errCode: ErrorCode.UnknownError,
        event: RequestApi.CreateSoundMessageByFile,
      });
    }
    params.sourceUrl = url!;
    const tmpParams = { ...params };
    // @ts-ignore
    delete tmpParams.file;
    return this.createSoundMessageByURL(tmpParams, operationID) as Promise<
      WsResponse<MessageItem>
    >;
  };

  createFileMessageByFile = async (
    params: FileMsgParams & { file: File },
    operationID = uuid()
  ) => {
    const { url, error } = await this.internalUploadFile(
      params.file,
      operationID
    );
    if (error) {
      return Promise.reject({
        data: '',
        operationID,
        errMsg: error.message,
        errCode: ErrorCode.UnknownError,
        event: RequestApi.CreateFileMessageByFile,
      });
    }
    params.sourceUrl = url!;
    const tmpParams = { ...params };
    // @ts-ignore
    delete tmpParams.file;
    return this.createFileMessageByURL(tmpParams, operationID) as Promise<
      WsResponse<MessageItem>
    >;
  };

  // UserApi
  getSelfUserInfo!: UserApi['getSelfUserInfo'];
  setSelfInfo!: UserApi['setSelfInfo'];
  getUsersInfoWithCache!: UserApi['getUsersInfoWithCache'];
  subscribeUsersStatus!: UserApi['subscribeUsersStatus'];
  unsubscribeUsersStatus!: UserApi['unsubscribeUsersStatus'];
  getSubscribeUsersStatus!: UserApi['getSubscribeUsersStatus'];
  setAppBackgroundStatus!: UserApi['setAppBackgroundStatus'];
  networkStatusChanged!: UserApi['networkStatusChanged'];
  setGlobalRecvMessageOpt!: UserApi['setGlobalRecvMessageOpt'];

  // FriendApi
  acceptFriendApplication!: FriendApi['acceptFriendApplication'];
  addBlack!: FriendApi['addBlack'];
  addFriend!: FriendApi['addFriend'];
  checkFriend!: FriendApi['checkFriend'];
  deleteFriend!: FriendApi['deleteFriend'];
  getBlackList!: FriendApi['getBlackList'];
  getFriendApplicationListAsApplicant!: FriendApi['getFriendApplicationListAsApplicant'];
  getFriendApplicationListAsRecipient!: FriendApi['getFriendApplicationListAsRecipient'];
  getFriendList!: FriendApi['getFriendList'];
  getFriendListPage!: FriendApi['getFriendListPage'];
  getSpecifiedFriendsInfo!: FriendApi['getSpecifiedFriendsInfo'];
  refuseFriendApplication!: FriendApi['refuseFriendApplication'];
  removeBlack!: FriendApi['removeBlack'];
  searchFriends!: FriendApi['searchFriends'];
  setFriendRemark!: FriendApi['setFriendRemark'];

  // GroupApi
  createGroup!: GroupApi['createGroup'];
  joinGroup!: GroupApi['joinGroup'];
  inviteUserToGroup!: GroupApi['inviteUserToGroup'];
  getJoinedGroupList!: GroupApi['getJoinedGroupList'];
  getJoinedGroupListPage!: GroupApi['getJoinedGroupListPage'];
  searchGroups!: GroupApi['searchGroups'];
  getSpecifiedGroupsInfo!: GroupApi['getSpecifiedGroupsInfo'];
  setGroupInfo!: GroupApi['setGroupInfo'];
  getGroupApplicationListAsRecipient!: GroupApi['getGroupApplicationListAsRecipient'];
  getGroupApplicationListAsApplicant!: GroupApi['getGroupApplicationListAsApplicant'];
  acceptGroupApplication!: GroupApi['acceptGroupApplication'];
  refuseGroupApplication!: GroupApi['refuseGroupApplication'];
  getGroupMemberList!: GroupApi['getGroupMemberList'];
  getSpecifiedGroupMembersInfo!: GroupApi['getSpecifiedGroupMembersInfo'];
  searchGroupMembers!: GroupApi['searchGroupMembers'];
  setGroupMemberInfo!: GroupApi['setGroupMemberInfo'];
  getGroupMemberOwnerAndAdmin!: GroupApi['getGroupMemberOwnerAndAdmin'];
  getGroupMemberListByJoinTimeFilter!: GroupApi['getGroupMemberListByJoinTimeFilter'];
  kickGroupMember!: GroupApi['kickGroupMember'];
  changeGroupMemberMute!: GroupApi['changeGroupMemberMute'];
  changeGroupMute!: GroupApi['changeGroupMute'];
  transferGroupOwner!: GroupApi['transferGroupOwner'];
  dismissGroup!: GroupApi['dismissGroup'];
  quitGroup!: GroupApi['quitGroup'];

  // MessageApi
  createTextMessage!: MessageApi['createTextMessage'];
  createTextAtMessage!: MessageApi['createTextAtMessage'];
  createImageMessageByURL!: MessageApi['createImageMessageByURL'];
  createSoundMessageByURL!: MessageApi['createSoundMessageByURL'];
  createVideoMessageByURL!: MessageApi['createVideoMessageByURL'];
  createFileMessageByURL!: MessageApi['createFileMessageByURL'];
  createMergerMessage!: MessageApi['createMergerMessage'];
  createForwardMessage!: MessageApi['createForwardMessage'];
  createLocationMessage!: MessageApi['createLocationMessage'];
  createQuoteMessage!: MessageApi['createQuoteMessage'];
  createCardMessage!: MessageApi['createCardMessage'];
  createCustomMessage!: MessageApi['createCustomMessage'];
  createFaceMessage!: MessageApi['createFaceMessage'];
  sendMessage!: MessageApi['sendMessage'];
  sendMessageNotOss!: MessageApi['sendMessageNotOss'];
  typingStatusUpdate!: MessageApi['typingStatusUpdate'];
  revokeMessage!: MessageApi['revokeMessage'];
  deleteMessage!: MessageApi['deleteMessage'];
  deleteMessageFromLocalStorage!: MessageApi['deleteMessageFromLocalStorage'];
  deleteAllMsgFromLocal!: MessageApi['deleteAllMsgFromLocal'];
  deleteAllMsgFromLocalAndSvr!: MessageApi['deleteAllMsgFromLocalAndSvr'];
  searchLocalMessages!: MessageApi['searchLocalMessages'];
  getAdvancedHistoryMessageList!: MessageApi['getAdvancedHistoryMessageList'];
  getAdvancedHistoryMessageListReverse!: MessageApi['getAdvancedHistoryMessageListReverse'];
  findMessageList!: MessageApi['findMessageList'];
  insertGroupMessageToLocalStorage!: MessageApi['insertGroupMessageToLocalStorage'];
  insertSingleMessageToLocalStorage!: MessageApi['insertSingleMessageToLocalStorage'];
  setMessageLocalEx!: MessageApi['setMessageLocalEx'];

  // ConversationApi
  getAllConversationList!: ConversationApi['getAllConversationList'];
  getConversationListSplit!: ConversationApi['getConversationListSplit'];
  getOneConversation!: ConversationApi['getOneConversation'];
  getMultipleConversation!: ConversationApi['getMultipleConversation'];
  getConversationIDBySessionType!: ConversationApi['getConversationIDBySessionType'];
  getTotalUnreadMsgCount!: ConversationApi['getTotalUnreadMsgCount'];
  markConversationMessageAsRead!: ConversationApi['markConversationMessageAsRead'];
  setConversationDraft!: ConversationApi['setConversationDraft'];
  pinConversation!: ConversationApi['pinConversation'];
  setConversationRecvMessageOpt!: ConversationApi['setConversationRecvMessageOpt'];
  setConversationPrivateChat!: ConversationApi['setConversationPrivateChat'];
  setConversationBurnDuration!: ConversationApi['setConversationBurnDuration'];
  resetConversationGroupAtType!: ConversationApi['resetConversationGroupAtType'];
  hideConversation!: ConversationApi['hideConversation'];
  hideAllConversation!: ConversationApi['hideAllConversation'];
  clearConversationAndDeleteAllMsg!: ConversationApi['clearConversationAndDeleteAllMsg'];
  deleteConversationAndDeleteAllMsg!: ConversationApi['deleteConversationAndDeleteAllMsg'];
}

export default OpenIMSDK;

export type MixinApiService = OpenIMSDK &
  UserApi &
  FriendApi &
  GroupApi &
  MessageApi &
  ConversationApi;
