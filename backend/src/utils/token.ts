import jwt, { type SignOptions } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.js";

type TokenPayload = Record<string, string | number | boolean>;

function sign(payload: TokenPayload, secret: string, expiresIn: string) {
  return jwt.sign(payload, secret, { expiresIn } as SignOptions);
}

export function signCustomerAccessToken(payload: TokenPayload) {
  return sign(payload, jwtConfig.customerSecret, jwtConfig.accessExpiresIn);
}

export function signCustomerRefreshToken(payload: TokenPayload) {
  return sign(payload, jwtConfig.customerRefreshSecret, jwtConfig.refreshExpiresIn);
}

export function signCmsAccessToken(payload: TokenPayload) {
  return sign(payload, jwtConfig.cmsSecret, jwtConfig.accessExpiresIn);
}

export function signCmsRefreshToken(payload: TokenPayload) {
  return sign(payload, jwtConfig.cmsRefreshSecret, jwtConfig.refreshExpiresIn);
}

export function verifyCustomerToken(token: string) {
  return jwt.verify(token, jwtConfig.customerSecret) as TokenPayload;
}

export function verifyCmsToken(token: string) {
  return jwt.verify(token, jwtConfig.cmsSecret) as TokenPayload;
}
