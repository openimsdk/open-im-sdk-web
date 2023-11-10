import {
  CommonOptions,
  ConfirmData,
  UploadData,
  UploadParams,
} from '@/types/upload';

// api
const handleResponse = async (res: Response) => {
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const data = await res.json();
  if (data.errCode !== 0) {
    throw new Error(data.errMsg);
  }
  return data.data;
};

export const getUploadPartsize = (
  baseUrl: string,
  size: number,
  commonOptions: CommonOptions
): Promise<{ size: number }> =>
  fetch(`${baseUrl}/object/part_size`, {
    method: 'POST',
    headers: {
      ...commonOptions,
    },
    body: JSON.stringify({
      size,
    }),
  }).then(handleResponse);

export const getUploadUrl = (
  baseUrl: string,
  params: UploadParams,
  commonOptions: CommonOptions
): Promise<UploadData> =>
  fetch(`${baseUrl}/object/initiate_multipart_upload`, {
    method: 'POST',
    headers: {
      ...commonOptions,
    },
    body: JSON.stringify(params),
  }).then(handleResponse);

export const confirmUpload = (
  baseUrl: string,
  params: ConfirmData,
  commonOptions: CommonOptions
): Promise<{ url: string }> =>
  fetch(`${baseUrl}/object/complete_multipart_upload`, {
    method: 'POST',
    headers: {
      ...commonOptions,
    },
    body: JSON.stringify(params),
  }).then(handleResponse);

// common
const mimeTypesMap: Record<string, string> = {
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  json: 'application/json',
  csv: 'text/csv',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  bmp: 'image/bmp',
  svg: 'image/svg+xml',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  wav: 'audio/wav',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  xml: 'application/xml',
  zip: 'application/zip',
  tar: 'application/x-tar',
  '7z': 'application/x-7z-compressed',
  rar: 'application/vnd.rar',
  ogg: 'audio/ogg',
  midi: 'audio/midi',
  webm: 'audio/webm',
  avi: 'video/x-msvideo',
  mpeg: 'video/mpeg',
  ts: 'video/mp2t',
  mov: 'video/quicktime',
  wmv: 'video/x-ms-wmv',
  flv: 'video/x-flv',
  mkv: 'video/x-matroska',
  webp: 'image/webp',
  heic: 'image/heic',
  psd: 'image/vnd.adobe.photoshop',
  ai: 'application/postscript',
  eps: 'application/postscript',
  ttf: 'font/ttf',
  otf: 'font/otf',
  woff: 'font/woff',
  woff2: 'font/woff2',
  jsonld: 'application/ld+json',
  ics: 'text/calendar',
  sh: 'application/x-sh',
  php: 'application/x-httpd-php',
  jar: 'application/java-archive',
};

export const getMimeType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
  return mimeTypesMap[extension] || 'application/octet-stream';
};
