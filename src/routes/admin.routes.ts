import express, { Router, Request, Response } from "express";

const adminRouter: Router = express.Router();

adminRouter.get("/", (req: Request, res: Response) => {
  res.send("User Home Page");
});

adminRouter.get("/profile", (req: Request, res: Response) => {
  res.send("User Profile Page");
});

export default adminRouter;
