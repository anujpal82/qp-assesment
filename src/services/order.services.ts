import { FindOperator } from "typeorm";
import { E, Errorable, wrapError } from "../../types";
import { Grocery } from "../Entities/grocery.entity";
import { CreateGroceryData } from "../dto/grocery.dto";
import { AuthRepository } from "../repositories/auth.repository";
import { GroceryRepository } from "../repositories/grocery.repository";
import { OrderRepository } from "../repositories/order.repository";
import { UserRepository } from "../repositories/user.repository";
import { Order } from "../Entities/order.entity";

export class OrderServices {
  async createOrder(
    groceries: { id: string; quantity: number }[],
    userId: string
  ): Promise<
    Errorable<
      Partial<Order>,
      E<"UnknownRuntimeError"> | E<"BadRequestError"> | E<"NotFoundError">
    >
  > {
    try {
      if (!userId) {
        return {
          hasError: true,
          error: {
            type: "BadRequestError",
            message: "Please provide valid userId",
          },
          value: null,
        };
      }

      const checkIfUserExist = await AuthRepository.getUserById(userId);
      if (checkIfUserExist.hasError) {
        return {
          hasError: true,
          error: wrapError(checkIfUserExist.error, "Failed to grt user."),
          value: null,
        };
      }
      if (!checkIfUserExist.value) {
        return {
          hasError: true,
          error: {
            type: "NotFoundError",
            message: "User Not Found.",
          },
          value: null,
        };
      }
      if (groceries?.length < 1) {
        return {
          hasError: true,
          error: {
            type: "BadRequestError",
            message: "Please provide minimum one grocery to create order.",
          },
          value: null,
        };
      }

      const createdOrder = await OrderRepository.createOrder(
        groceries,
        checkIfUserExist.value
      );
      if (createdOrder.hasError) {
        return {
          hasError: true,
          error: wrapError(createdOrder.error, "Failed to create order."),
          value: null,
        };
      }

      return createdOrder;
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
