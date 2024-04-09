import express, { Request, Response, Router } from "express";
import { GroceryController } from "../controllers/grocery.controller";
import { authenticateToken, isAdmin } from "../middleware/auth.middleware";

const groceryRoutes: Router = express.Router();
const groceryController = new GroceryController();

groceryRoutes.post(
  "/create-grocery",
  authenticateToken,
  isAdmin,
  groceryController.createGrocery
);

groceryRoutes.get(
  "/",
  authenticateToken,
  isAdmin,
  groceryController.getAllGroceries
);

groceryRoutes.delete(
  "/:id",
  authenticateToken,
  isAdmin,
  groceryController.deleteGroceryById
);

groceryRoutes.put(
  "/:id",
  authenticateToken,
  isAdmin,
  groceryController.updateGroceryById
);

export default groceryRoutes;
