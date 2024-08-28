import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import mpAdapter from 'axios-miniprogram-adapter';

import imConfig from '@/core/config';
import { ErrorCode } from '@/constant/api';
import { HttpResponse, WsResponse } from '@/types/entity';

// @ts-ignore
// axios.defaults.adapter = mpAdapter;

const instance = axios.create();

instance.interceptors.request.use(config => {
  const { wsManager } = imConfig;
  if (!wsManager) {
    return Promise.reject({
      data: '',
      operationID: config.headers.operationID || '',
      errMsg: 'please login first',
      errCode: ErrorCode.ResourceLoadNotCompleteError,
      event: config.headers.reqFuncName,
    });
  }
  return config;
});

function request<T>(
  url: string,
  params: any,
  config: AxiosRequestConfig
): Promise<WsResponse<T>> {
  return instance
    .post(url, params, config)
    .then((response: AxiosResponse<HttpResponse<T>>) => {
      const { data } = response;

      if (data.errCode !== 0) {
        return Promise.reject({
          data: '' as T,
          operationID: config.headers?.operationID || '',
          errMsg: JSON.stringify(data),
          errCode: ErrorCode.UnknownError,
          event: config.headers?.reqFuncName || '',
        });
      }
      const result: WsResponse<T> = {
        data: data.data,
        operationID: config.headers?.operationID || '',
        errMsg: '',
        errCode: 0,
        event: config.headers?.reqFuncName || '',
      };

      return result;
    })
    .catch(error => {
      const { config, errCode } = error;
      if (errCode) {
        return Promise.reject(error);
      }

      return Promise.reject({
        data: '',
        operationID: config?.headers?.operationID || '',
        errMsg: JSON.stringify(error),
        errCode: ErrorCode.UnknownError,
        event: config?.headers?.reqFuncName || '',
      });
    });
}

export default request;
