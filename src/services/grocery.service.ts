import { E, Errorable, wrapError } from "../../types";
import { Grocery } from "../Entities/grocery.entity";
import { CreateGroceryData } from "../dto/grocery.dto";
import { GroceryRepository } from "../repositories/grocery.repository";

export class GroceryServices {
  async createGrocery(
    groceryData: CreateGroceryData
  ): Promise<
    Errorable<
      Partial<Grocery>,
      | E<"UnknownRuntimeError">
      | E<"BadRequestError">
      | E<"AlreadyExistsError">
      | E<"PermissionDenied">
    >
  > {
    try {
      const { name, price, quantity } = groceryData;

      // Check if any required field is missing
      if (!name || !price || !quantity) {
        return {
          hasError: true,
          error: {
            type: "BadRequestError",
            message: "Please provide valid grocery information",
          },
          value: null,
        };
      }

      const checkIfExist = await GroceryRepository.getGroceryByName(name);
      if (checkIfExist.hasError) {
        return {
          hasError: true,
          error: wrapError(
            checkIfExist.error,
            "Failed to check exist grocery."
          ),
          value: null,
        };
      }
      if (checkIfExist.value) {
      }

      const createdGroceryData = await GroceryRepository.createGrocery(
        groceryData
      );
      if (createdGroceryData.hasError) {
        return {
          hasError: true,
          error: wrapError(
            createdGroceryData.error,
            "Failed to create grocery."
          ),
          value: null,
        };
      }
      if (checkIfExist?.hasError === false && checkIfExist.value) {
        return {
          hasError: true,
          error: {
            type: "AlreadyExistsError",
            message: "Grocery already exists",
          },
          value: null,
        };
      }
      return {
        error: null,
        hasError: false,
        value: createdGroceryData.value,
      };
    } catch (err: any) {
      return {
        error: {
          type: "UnknownRuntimeError",
          message: `Something wrong happened at Service : ${err.message}`,
        },
        hasError: true,
        value: null,
      };
    }
  }
  async getAllGroceries(): Promise<
    Errorable<Grocery[], E<"UnknownRuntimeError">>
  > {
    try {
      const groceries = await GroceryRepository.getAllGroceries();
      if (groceries.hasError) {
        return {
          hasError: true,
          error: wrapError(groceries.error, "Failed to get all grocery."),
          value: null,
        };
      }
      return groceries;
    } catch (err: any) {
      return {
        error: {
          type: "UnknownRuntimeError",
          message: `Something wrong happened at Service : ${err.message}`,
        },
        hasError: true,
        value: null,
      };
    }
  }
  async deleteGroceryById(
    id: string
  ): Promise<
    Errorable<
      String,
      E<"UnknownRuntimeError"> | E<"NotFoundError"> | E<"BadRequestError">
    >
  > {
    try {
      if (!id) {
        return {
          hasError: true,
          error: {
            type: "BadRequestError",
            message: "Please provide a valid grocery ID",
          },
          value: null,
        };
      }

      const deletionResult = await GroceryRepository.deleteGroceryById(id);
      if (deletionResult.hasError) {
        return {
          hasError: true,
          error: wrapError(
            deletionResult.error,
            "Failed to delete grocery by ID."
          ),
          value: null,
        };
      }

      return {
        hasError: false,
        error: null,
        value: "Grocery deleted sucessfully.",
      };
    } catch (err: any) {
      return {
        error: {
          type: "UnknownRuntimeError",
          message: `Something wrong happened at Service : ${err.message}`,
        },
        hasError: true,
        value: null,
      };
    }
  }

  async updateGroceryById(
    id: string,
    updatedData: Partial<Grocery>
  ): Promise<
    Errorable<
      Grocery,
      E<"UnknownRuntimeError"> | E<"NotFoundError"> | E<"BadRequestError">
    >
  > {
    try {
      if (!id) {
        return {
          hasError: true,
          error: {
            type: "BadRequestError",
            message: "Please provide a valid grocery ID",
          },
          value: null,
        };
      }

      if (Object.keys(updatedData).length < 1) {
        return {
          hasError: true,
          error: {
            type: "BadRequestError",
            message: "Please provide minimum one filed to update",
          },
          value: null,
        };
      }
      const ifExist = await GroceryRepository.getGroceryById(id);
      if (ifExist.hasError) {
        return {
          hasError: true,
          error: wrapError(ifExist.error, "Failed to check grocery by ID."),
          value: null,
        };
      }

      if (!ifExist.hasError && !ifExist.value) {
        return {
          hasError: true,
          error: {
            type: "NotFoundError",
            message: `Grocery with : ${id} not found`,
          },
          value: null,
        };
      }
      const updateResult = await GroceryRepository.updateGroceryById(
        id,
        updatedData
      );
      if (updateResult.hasError) {
        return {
          hasError: true,
          error: wrapError(
            updateResult.error,
            "Failed to delete grocery by ID."
          ),
          value: null,
        };
      }

      return updateResult;
    } catch (err: any) {
      return {
        error: {
          type: "UnknownRuntimeError",
          message: `Something wrong happened at Service : ${err.message}`,
        },
        hasError: true,
        value: null,
      };
    }
  }
}
