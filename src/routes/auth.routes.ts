import express, { Router, Request, Response } from "express";
import { AuthController } from "../controllers/auth.controller";

const authRouter: Router = express.Router();
const authController = new AuthController();

authRouter.post("/sign-up", authController.createUser);

authRouter.post("/sign-in", authController.signIn);

export default authRouter;
