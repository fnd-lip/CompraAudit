export function reduzirHash(hash: string): string {
  if (!hash) return "";
  if (hash.length <= 18) {
    return hash;
  }
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}