import express from "express";

import { authController } from "../controllers/authController";
import { wrapAsync } from "../lib/wrapAsync";
import { validateData } from "../middleware/validationMiddleware";
import { authenticateGoogleUserSchema } from "../schemas/authenticateGoogleUserSchema";

const router = express.Router();

router.post("/refresh", wrapAsync(authController.refreshAccessToken));
router.get("/google", wrapAsync(authController.getGoogleOAuthUrl));
router.get(
  "/google/callback",
  validateData({ query: authenticateGoogleUserSchema }),
  wrapAsync(authController.authenticateGoogleUser)
);
router.post("/logout", wrapAsync(authController.logout));

export default router;
