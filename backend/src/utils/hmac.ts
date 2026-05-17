import crypto from "node:crypto";

export function hmacSha512(payload: string, secret: string) {
  return crypto.createHmac("sha512", secret).update(payload).digest("hex");
}

export function safeCompare(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
