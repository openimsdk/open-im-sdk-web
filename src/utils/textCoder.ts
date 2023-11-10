export function utf8Encode(str: string): ArrayBuffer {
  if (typeof TextEncoder !== 'undefined') {
    return new TextEncoder().encode(str);
  }

  const bytes: number[] = [];
  let c: number;

  for (let i = 0; i < str.length; i++) {
    c = str.charCodeAt(i);
    if (c >= 0x010000 && c <= 0x10ffff) {
      bytes.push(((c >> 18) & 0x07) | 0xf0);
      bytes.push(((c >> 12) & 0x3f) | 0x80);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000800 && c <= 0x00ffff) {
      bytes.push(((c >> 12) & 0x0f) | 0xe0);
      bytes.push(((c >> 6) & 0x3f) | 0x80);
      bytes.push((c & 0x3f) | 0x80);
    } else if (c >= 0x000080 && c <= 0x0007ff) {
      bytes.push(((c >> 6) & 0x1f) | 0xc0);
      bytes.push((c & 0x3f) | 0x80);
    } else {
      bytes.push(c & 0xff);
    }
  }

  return new Uint8Array(bytes).buffer;
}

export function utf8Decode(buffer: ArrayBuffer): string {
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder().decode(buffer);
  }

  const dataView = new DataView(buffer);
  const bytes = new Uint8Array(buffer.byteLength);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = dataView.getUint8(i);
  }

  let str = '';
  for (let i = 0; i < bytes.length; i++) {
    const one = bytes[i].toString(2);
    const v = one.match(/^1+?(?=0)/);
    if (v && one.length === 8) {
      const bytesLength = v[0].length;
      let store = bytes[i].toString(2).slice(7 - bytesLength);
      for (let st = 1; st < bytesLength; st++) {
        store += bytes[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(bytes[i]);
    }
  }

  return str;
}
