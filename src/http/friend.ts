import config from '@/core/config';
import { FullUserItem, Pagination } from '@/types/entity';
import { RequestApi } from '@/constant/api';
import { uuid } from '@/utils/uuid';
import request from '@/utils/request';

export const getFriendListPage = (params: Pagination, operationID = uuid()) => {
  const { apiAddr, token, userID } = config;
  const headers = {
    operationID,
    token,
    reqFuncName: RequestApi.GetFriendListPage,
  };

  return request<FullUserItem[]>(
    `${apiAddr}/friend/get_friend_list`,
    {
      userID,
      pagination: {
        pageNumber: params.offset,
        showNumber: params.count,
      },
    },
    {
      headers,
    }
  );
};
