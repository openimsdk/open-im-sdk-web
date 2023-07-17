export type addFriendParams = {
    fromUserID: string;
    ToUserID: string;
    ReqMSg: string;
    ex:string
}

export type pageNationParams  ={
    pageNumber:string,
    showNumber:string
}

export type searchFriendParams = {
  keywordList: string[];
  isSearchUserID: boolean;
  isSearchNickname: boolean;
  isSearchRemark: boolean
}

export type setFriendRemarkParams = {
    toUserID: string;
    remark: string
}