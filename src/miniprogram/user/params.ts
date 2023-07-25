import { MessageReceiveOptType } from "../conversation/params";
export type SelfUserInfoParams = {
  userID: string;
  nikName: string;
  faceURL: string;
  createTime: number;
  appManagerLevel: number;
  ex: string;
  AttachedInfo: string;
  globalRecvMsgOpt: MessageReceiveOptType;
};

export type upLoadFileParams = {
  name: string;
  contentType: string;
  uuid: string;
  file: File;
};
