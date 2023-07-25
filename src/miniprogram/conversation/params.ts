import { ConversationItem } from "./../../types/index.d";
export type getConversationListSplitParams = {
  offset: number;
  count: number;
};

export type getOneConversationParams = {
  sourceID: string;
  sessionType: number;
};

export type pinConversationParams = {
  ConversationID: string;
  isPinned: boolean;
};

export type setConversationBurnDurationParams = {
  ConversationID: string;
  burnDuration: number;
};
export type setConversationDraftParams = {
  ConversationID: string;
  draftText: string;
};
export type setConversationPrivateChatParams = {
  ConversationID: string;
  isPrivate: boolean;
};

export type setConversationRecvMessageOptParams = {
  ConversationID: string;
  opt: MessageReceiveOptType;
};

export enum MessageReceiveOptType {
  Nomal = 0,
  NotReceive = 1,
  NotNotify = 2,
}
