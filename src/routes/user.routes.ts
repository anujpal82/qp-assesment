import express, { Router, Request, Response } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const userRoutes: Router = express.Router();
const userController = new UserController();

userRoutes.get(
  "/get-available-groceries",
  authenticateToken,
  userController.getAvailableGrceries
);

// userRouter.post("/sign-in", UserController.signIn);

export default userRoutes;
