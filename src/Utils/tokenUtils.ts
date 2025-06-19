import * as CryptoJS from "crypto-js";

const SECRET_KEY = "testTokenKey"; 

export const encryptToken = (token: string): string => {
  return CryptoJS.AES.encrypt(token, SECRET_KEY).toString();
};

export const decryptToken = (encryptedToken: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const saveToken = (token: string) => {
  const encrypted = encryptToken(token);
  localStorage.setItem("token", encrypted);
};

export const getToken = (): string | null => {
  const encrypted = localStorage.getItem("token");
  if (!encrypted) return null;

  try {
    return decryptToken(encrypted);
  } catch {
    return null;
  }
};

export const clearToken = () => {
  localStorage.removeItem("token");
};
