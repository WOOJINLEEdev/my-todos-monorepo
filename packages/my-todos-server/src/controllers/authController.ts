import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { errorResponse, successResponse } from "../lib/responseHelper";
import { makeAccessToken, makeRefreshToken, verifyToken } from "../lib/jwt";
import { authService } from "../services/authService";
import { User } from "../models/authModel";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_LOGIN_CALLBACK_URL } =
  process.env;

export const authController = {
  refreshAccessToken: async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const verifiedAccessToken = verifyToken(refreshToken);

    if (!verifiedAccessToken) {
      return errorResponse(res, {
        message: "Invalid token",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const accessToken = makeAccessToken(verifiedAccessToken.id);
    return successResponse(res, { data: { accessToken: accessToken } });
  },

  getGoogleOAuthUrl: async (req: Request, res: Response) => {
    let url = "https://accounts.google.com/o/oauth2/v2/auth";
    url += `?client_id=${process.env.GOOGLE_CLIENT_ID}`;
    url += `&redirect_uri=${process.env.GOOGLE_LOGIN_CALLBACK_URL}`;
    url += "&response_type=code";
    url += "&scope=openid profile email";

    res.redirect(url);
  },

  authenticateGoogleUser: async (req: Request, res: Response) => {
    const { code } = req.query;

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: code as string,
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        redirect_uri: GOOGLE_LOGIN_CALLBACK_URL!,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData) {
      return errorResponse(res, {
        message: "Authentication failed",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const { access_token }: { access_token: string } = tokenData;

    const userResponse = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    );

    if (!userResponse.ok) {
      if (userResponse.status === 400) {
        return errorResponse(res, {
          message: "Invalid access token",
          statusCode: StatusCodes.BAD_REQUEST,
        });
      } else if (userResponse.status >= 500 && userResponse.status <= 599) {
        return errorResponse(res, {
          message: "Google server error",
          statusCode: userResponse.status,
        });
      } else {
        return errorResponse(res, {
          message: `Unexpected error: ${userResponse.statusText}`,
          statusCode: userResponse.status,
        });
      }
    }

    const userData = await userResponse.json();
    const { sub, email, name }: User = userData;

    let user = await authService.getUser({ email: email });
    if (!user) {
      user = await authService.createUser({ sub, email, name });
    }

    const refreshToken = makeRefreshToken(user.id);
    const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      domain: "localhost",
      expires: expires,
    });

    res.redirect("http://localhost:5173/");
  },

  logout: async (req: Request, res: Response) => {
    res.cookie("refreshToken", "", { maxAge: 0 });
    successResponse(res, { message: "Logged out successfully" });
  },
};
