import express, { Router, Request, Response } from "express";
import { OrderController } from "../controllers/order.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const orderRoutes: Router = express.Router();
const userController = new OrderController();

orderRoutes.post(
  "/create-order/:id",
  authenticateToken,
  userController.createOrder
);

// userRouter.post("/sign-in", UserController.signIn);

export default orderRoutes;
