// shared_utils.ts
export function packFrame(type: number, data: Uint8Array): Uint8Array {
  const header = new Uint8Array(5);
  header[0] = type;
  header[1] = (data.length >>> 24) & 0xff;
  header[2] = (data.length >>> 16) & 0xff;
  header[3] = (data.length >>> 8) & 0xff;
  header[4] = data.length & 0xff;
  const packed = new Uint8Array(5 + data.length);
  packed.set(header);
  packed.set(data, 5);
  return packed;
}
