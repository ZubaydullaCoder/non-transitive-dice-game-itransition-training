import crypto from "crypto";

export class CryptoHandler {
  static generateSecretKey() {
    // Generates a 256-bit (32-byte) secret key
    return crypto.randomBytes(32);
  }

  static calculateHMAC(key, message) {
    const hmac = crypto.createHmac("sha3-256", key);
    hmac.update(message.toString());
    return hmac.digest("hex").toUpperCase();
  }

  static generateSecureRandom(min, max) {
    // Ensures uniform distribution
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    const maxValue = Math.pow(256, bytesNeeded);
    const maxValidValue = maxValue - (maxValue % range);

    let randomValue;
    do {
      const randomBytes = crypto.randomBytes(bytesNeeded);
      randomValue = 0;
      for (let i = 0; i < bytesNeeded; i++) {
        randomValue = (randomValue << 8) + randomBytes[i];
      }
    } while (randomValue >= maxValidValue);

    return min + (randomValue % range);
  }
}
