import crypto from "node:crypto";

export function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

export function otpExpiry(minutes = 10) {
  return new Date(Date.now() + minutes * 60 * 1000);
}
