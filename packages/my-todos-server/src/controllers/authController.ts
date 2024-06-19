import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { successResponse } from "../lib/responseHelper";
import HttpError from "../lib/HttpError";
import { makeAccessToken, makeRefreshToken, verifyToken } from "../lib/jwt";
import { authService } from "../services/authService";
import { User } from "../models/authModel";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_LOGIN_REDIRECT_URI } =
  process.env;

export const authController = {
  sendRefreshToken: async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    const verifiedAccessToken = verifyToken(refreshToken);

    if (verifiedAccessToken!.id) {
      const accessToken = makeAccessToken(verifiedAccessToken!.id);
      const refreshToken = makeRefreshToken(verifiedAccessToken!.id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
      });

      return successResponse(res, { accessToken });
    }

    return res.json({ test: "Test" });
  },

  getGoogleOAuthUrl: async (req: Request, res: Response) => {
    let url = "https://accounts.google.com/o/oauth2/v2/auth";
    url += `?client_id=${process.env.GOOGLE_CLIENT_ID}`;
    url += `&redirect_uri=${process.env.GOOGLE_LOGIN_REDIRECT_URI}`;
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
        redirect_uri: GOOGLE_LOGIN_REDIRECT_URI!,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData) {
      throw new HttpError("Authentication failed", StatusCodes.NOT_FOUND);
    }

    const { access_token }: any = tokenData;

    const userResponse = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
    );
    const userData = await userResponse.json();
    const { sub, email, name }: User = userData;

    let user = await authService.getUser({ email: email });
    if (!user) {
      user = await authService.createUser({ sub, email, name });
    }

    const accessToken = makeAccessToken(user.id);
    const refreshToken = makeRefreshToken(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      domain: "localhost",
    });

    res.redirect("http://localhost:5173/");
  },

  logout: async (req: Request, res: Response) => {
    res.cookie("refreshToken", "", { maxAge: 0 });
    successResponse(res, undefined, "Logged out successfully");
  },
};
