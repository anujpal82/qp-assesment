import { E, Errorable, wrapError } from "../../types";
import { Grocery } from "../Entities/grocery.entity";
import { CreateGroceryData } from "../dto/grocery.dto";
import { UserRepository } from "../repositories/user.repository";

export class UserServices {
  async getAllGroceries(): Promise<
    Errorable<Grocery[], E<"UnknownRuntimeError">>
  > {
    try {
      const groceries = await UserRepository.getAllAvailableGroceries();
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
}
