export interface CommonOptions {
  operationID: string;
  token: string;
}

export interface UploadParams {
  hash: string;
  size: number;
  partSize: number;
  maxParts: number;
  cause: string;
  name: string;
  contentType: string;
}

export interface ConfirmData {
  uploadID: string;
  parts: string[];
  cause: string;
  name: string;
  contentType: string;
}

export interface UploadData {
  url: string;
  upload: Upload;
}

export interface Upload {
  uploadID: string;
  partSize: number;
  sign: Sign;
}

export interface Sign {
  url: string;
  query?: KeyForValueList[];
  header?: KeyForValueList[];
  parts: Part[];
}

export interface Part {
  partNumber: number;
  url: string;
  query?: KeyForValueList[];
  header?: KeyForValueList[];
}

export interface KeyForValueList {
  key: string;
  values: string[];
}
