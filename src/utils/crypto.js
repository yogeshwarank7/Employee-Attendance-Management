import CryptoJS from "crypto-js";

export function sha256(text) {
  return CryptoJS.SHA256(String(text)).toString(CryptoJS.enc.Hex);
}
