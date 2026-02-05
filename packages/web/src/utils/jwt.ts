import { SignJWT, jwtVerify, type JWTPayload } from "jose";

type ContinueTokenPayload = {
  sessionId: string;
  userId: string;
};

const CONTINUE_TOKEN_EXPIRY = "5m";

const getSecret = () => {
  const secret = process.env.CONTINUE_TOKEN_SECRET;
  if (!secret) {
    throw new Error("CONTINUE_TOKEN_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
};

export const createContinueToken = async (payload: ContinueTokenPayload): Promise<string> => {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(CONTINUE_TOKEN_EXPIRY)
    .sign(getSecret());

  return token;
};

export type VerifiedContinueToken = ContinueTokenPayload & JWTPayload;

export const verifyContinueToken = async (token: string): Promise<VerifiedContinueToken | null> => {
  try {
    const { payload } = await jwtVerify(token, getSecret());

    if (!payload.sessionId || !payload.userId) {
      return null;
    }

    return payload as VerifiedContinueToken;
  } catch {
    return null;
  }
};
