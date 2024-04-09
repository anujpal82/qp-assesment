import { MoreThan } from "typeorm";
import { dataSource } from "../../database";
import { E, Errorable } from "../../types";
import { CreateGroceryData } from "../dto/grocery.dto";
import { Grocery } from "../Entities/grocery.entity";
export class UserRepository {
  static async getAllAvailableGroceries(): Promise<
    Errorable<Grocery[], E<"UnknownRuntimeError">>
  > {
    const appDataSource = dataSource.getRepository(Grocery);
    try {
      const groceries = await appDataSource.find({
        where: {
          quantity: MoreThan(0),
        },
      });
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
}
