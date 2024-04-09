import { dataSource } from "../../database";
import { E, Errorable } from "../../types";
import { CreateGroceryData } from "../dto/grocery.dto";
import { Grocery } from "../Entities/grocery.entity";
export class GroceryRepository {
  static async createGrocery(
    groceryData: CreateGroceryData
  ): Promise<Errorable<Partial<Grocery>, E<"UnknownRuntimeError">>> {
    const appDataSOurce = dataSource.getRepository(Grocery);
    try {
      const { name, price, quantity } = groceryData;

      const newGrocery = new Grocery(quantity, price, name);
      const createdGrocery = await appDataSOurce.save(newGrocery);
      return {
        hasError: false,
        error: null,
        value: createdGrocery,
      };
    } catch (err: any) {
      return {
        error: {
          type: "UnknownRuntimeError",
          message: `Something wrong happened at createGrocery : ${err.message}`,
        },
        hasError: true,
        value: null,
      };
    }
  }
  static async getGroceryByName(
    name: String
  ): Promise<Errorable<Grocery | null, E<"UnknownRuntimeError">>> {
    const appDataSource = dataSource.getRepository(Grocery);
    try {
      const grocery = await appDataSource.findOne({ where: { name } });
      return {
        hasError: false,
        error: null,
        value: grocery || null,
      };
    } catch (err: any) {
      return {
        error: {
          type: "UnknownRuntimeError",
          message: `Something wrong happened at getGroceryByName: ${err.message}`,
        },
        hasError: true,
        value: null,
      };
    }
  }
  static async getAllGroceries(): Promise<
    Errorable<Grocery[], E<"UnknownRuntimeError">>
  > {
    const appDataSource = dataSource.getRepository(Grocery);
    try {
      const groceries = await appDataSource.find();
      return {
        hasError: false,
        error: null,
        value: groceries,
      };
    } catch (err: any) {
      return {
        error: {
          type: "UnknownRuntimeError",
          message: `Something went wrong while fetching all groceries: ${err.message}`,
        },
        hasError: true,
        value: null,
      };
    }
  }

  static async deleteGroceryById(
    id: string
  ): Promise<Errorable<null, E<"UnknownRuntimeError"> | E<"NotFoundError">>> {
    const appDataSource = dataSource.getRepository(Grocery);
    try {
      const groceryToRemove = await appDataSource.findOne({
        where: {
          id,
        },
      });
      if (!groceryToRemove) {
        return {
          hasError: true,
          error: {
            type: "NotFoundError",
            message: `Grocery with id ${id} not found`,
          },
          value: null,
        };
      }
      await appDataSource.remove(groceryToRemove);
      return {
        hasError: false,
        error: null,
        value: null,
      };
    } catch (err: any) {
      return {
        error: {
          type: "UnknownRuntimeError",
          message: `Something went wrong while deleting grocery: ${err.message}`,
        },
        hasError: true,
        value: null,
      };
    }
  }
  static async getGroceryById(
    id: string
  ): Promise<Errorable<Grocery | null, E<"UnknownRuntimeError">>> {
    const appDataSource = dataSource.getRepository(Grocery);
    try {
      const grocery = await appDataSource.findOne({
        where: {
          id,
        },
      });
      return {
        hasError: false,
        error: null,
        value: grocery,
      };
    } catch (err: any) {
      return {
        error: {
          type: "UnknownRuntimeError",
          message: `Something went wrong while fetching grocery by ID: ${err.message}`,
        },
        hasError: true,
        value: null,
      };
    }
  }
  static async updateGroceryById(
    id: string,
    updatedData: Partial<Grocery>
  ): Promise<Errorable<Grocery, E<"UnknownRuntimeError">>> {
    const appDataSource = dataSource.getRepository(Grocery);
    try {
      const existingGrocery = await appDataSource.findOne({
        where: {
          id,
        },
      });

      // Update existing grocery with the provided data
      const updatedGrocery = await appDataSource.save({
        ...existingGrocery,
        ...updatedData,
      });

      return {
        hasError: false,
        error: null,
        value: updatedGrocery,
      };
    } catch (err: any) {
      return {
        hasError: true,
        error: {
          type: "UnknownRuntimeError",
          message: `Failed to update grocery with ID ${id}: ${err.message}`,
        },
        value: null,
      };
    }
  }
}
