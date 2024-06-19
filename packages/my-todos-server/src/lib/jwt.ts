import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  id: number;
}

const ACCESS_TOKEN_KEY = process.env.ACCESS_TOKEN_KEY || "";

export const verifyToken = (token: string): DecodedToken | null => {
  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_KEY) as DecodedToken;
    return decoded;
  } catch (error: any) {
    switch (error.name) {
      case "TokenExpiredError":
        console.error("Token has expired");
        break;
      case "JsonWebTokenError":
        console.error("Invalid token");
        break;
      case "NotBeforeError":
        console.error("Token not active");
        break;
      default:
        console.error(error);
    }
    return null;
  }
};

export const makeAccessToken = (id: number): string => {
  try {
    return jwt.sign({ userId: id }, ACCESS_TOKEN_KEY, { expiresIn: "2h" });
  } catch (error) {
    console.error("Error creating access token:", error);
    return "";
  }
};

export const makeRefreshToken = (id: number): string => {
  try {
    return jwt.sign({ id }, ACCESS_TOKEN_KEY, { expiresIn: "14d" });
  } catch (error) {
    console.error("Error creating refresh token:", error);
    return "";
  }
};
