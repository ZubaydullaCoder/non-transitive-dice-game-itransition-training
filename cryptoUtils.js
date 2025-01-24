import crypto from "crypto";

export class CryptoHandler {
  static generateSecretKey() {
    return crypto.randomBytes(32);
  }

  static calculateHMAC(key, message) {
    const hmac = crypto.createHmac("sha3-256", key);
    hmac.update(message.toString());
    return hmac.digest("hex").toUpperCase();
  }

  static generateSecureRandom(min, max) {
    return crypto.randomInt(min, max + 1); 
  }
}
