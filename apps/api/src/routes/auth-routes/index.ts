import { Router } from "express";

import { AuthController } from "@/controllers/auth-controller";

export const authRouter: Router = Router();

authRouter.get("/login", AuthController.login);
authRouter.get("/callback", AuthController.callback);
authRouter.get("/logout", AuthController.logout);
