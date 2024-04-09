import { Request, Response } from "express";
import { AuthServices } from "../services/auth.services";
import { CreateUserData, SigninData } from "../dto/user.dto";
import { wrapError } from "../../types";
import { CreateGroceryData } from "../dto/grocery.dto";
import { GroceryServices } from "../services/grocery.service";

export class GroceryController {
  private groceryService = new GroceryServices();

  createGrocery = async (req: Request, res: Response) => {
    try {
      const { name, price, quantity } = req?.body;
      const groceryData: CreateGroceryData = {
        name,
        price,
        quantity,
      };
      const createGroceryData = await this.groceryService.createGrocery(
        groceryData
      );
      if (createGroceryData.hasError) {
        switch (createGroceryData.error.type) {
          case "AlreadyExistsError":
            return res.status(409).send(createGroceryData);

          case "BadRequestError":
            return res.status(400).send(createGroceryData);

          case "UnknownRuntimeError":
            return res.status(500).send(createGroceryData);

          default:
            return res.status(500).send({
              hasError: true,
              error: wrapError(
                createGroceryData.error,
                "Something happened wrong at server side."
              ),
              value: null,
            });
        }
      }
      res.status(200).send(createGroceryData);
    } catch (err: any) {
      return {
        error: {
          type: "UnknownRuntimeError",
          message: `Something wrong happened at Servi : ${err.message}`,
        },
        hasError: true,
        value: null,
      };
    }
  };

  getAllGroceries = async (req: Request, res: Response) => {
    try {
      const getAllGroceriesData = await this.groceryService.getAllGroceries();
      if (getAllGroceriesData.hasError) {
        switch (getAllGroceriesData.error.type) {
          case "UnknownRuntimeError":
            return res.status(500).send(getAllGroceriesData);

          default:
            return res.status(500).send({
              hasError: true,
              error: wrapError(
                getAllGroceriesData.error,
                "Something happened wrong at server side."
              ),
              value: null,
            });
        }
      }
      res.status(200).send(getAllGroceriesData);
    } catch (err: any) {
      return {
        error: {
          type: "UnknownRuntimeError",
          message: `Something wrong happened at Servi : ${err.message}`,
        },
        hasError: true,
        value: null,
      };
    }
  };
  deleteGroceryById = async (req: Request, res: Response) => {
    try {
      const deletionResult = await this.groceryService.deleteGroceryById(
        req.params.id
      );
      if (deletionResult.hasError) {
        switch (deletionResult.error.type) {
          case "BadRequestError":
            res.status(400).send(deletionResult);
          case "UnknownRuntimeError":
            return res.status(500).send(deletionResult);

          default:
            return res.status(500).send({
              hasError: true,
              error: wrapError(
                deletionResult.error,
                "Something happened wrong at server side."
              ),
              value: null,
            });
        }
      }

      res.status(200).send(deletionResult);
    } catch (err: any) {
      return res.status(500).send({
        error: {
          type: "UnknownRuntimeError",
          message: `Something wrong happened at Service : ${err.message}`,
        },
        hasError: true,
        value: null,
      });
    }
  };
  updateGroceryById = async (req: Request, res: Response) => {
    try {
      const groceryId = req.params.id;
      const updatedFields = req.body;
      const updateResult = await this.groceryService.updateGroceryById(
        groceryId,
        updatedFields
      );

      if (updateResult.hasError) {
        switch (updateResult.error.type) {
          case "BadRequestError":
            return res.status(400).send(updateResult);
          case "UnknownRuntimeError":
            return res.status(500).send(updateResult);
          case "NotFoundError":
            return res.status(404).send(updateResult);
          default:
            return res.status(500).send({
              hasError: true,
              error: wrapError(
                updateResult.error,
                "Something happened wrong at server side."
              ),
              value: null,
            });
        }
      }

      // Return updated grocery data if successful
      res.status(200).send(updateResult);
    } catch (err: any) {
      return res.status(500).send({
        error: {
          type: "UnknownRuntimeError",
          message: `Something wrong happened at Service : ${err.message}`,
        },
        hasError: true,
        value: null,
      });
    }
  };
}
