import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  id: number;
}

const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY || "";

export const verifyToken = (token: string): DecodedToken | null => {
  const decoded = jwt.verify(token, ACCESS_TOKEN_KEY) as DecodedToken;
  return decoded;
};

export const makeAccessToken = (id: number): string => {
  return jwt.sign({ userId: id }, ACCESS_TOKEN_KEY, { expiresIn: "2h" });
};

export const makeRefreshToken = (id: number): string => {
  return jwt.sign({ id }, ACCESS_TOKEN_KEY, { expiresIn: "14d" });
};
