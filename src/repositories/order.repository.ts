import { getRepository } from "typeorm";
import { Grocery } from "../Entities/grocery.entity";
import { Order } from "../Entities/order.entity";
import { OrderItem } from "../Entities/orderItem.entity";
import { User } from "../Entities/user.entity";
import { dataSource } from "../../database";
import { generateOrderId } from "../helper";
import { E, Errorable } from "../../types";

export class OrderRepository {
  static async createOrder(
    groceries: { id: string; quantity: number }[],
    user: User
  ): Promise<
    Errorable<
      Order,
      E<"UnknownRuntimeError"> | E<"NotFoundError"> | E<"BadRequestError">
    >
  > {
    try {
      const orderRepository = dataSource.getRepository(Order);
      const orderItemRepository = dataSource.getRepository(OrderItem);
      const orderId: string = generateOrderId();
      const items: OrderItem[] = [];
      let total: number = 0;
      const order = new Order(orderId, user, items, total);
      const groceryRepository = dataSource.getRepository(Grocery);

      for (const { id, quantity } of groceries) {
        const grocery = await groceryRepository.findOne({
          where: { id },
        });
        if (!grocery) {
          return {
            hasError: true,
            error: {
              type: "NotFoundError",
              message: `Grocery with ID ${id} not found`,
            },
            value: null,
          };
        }

        if (grocery.quantity < quantity) {
          return {
            hasError: true,
            error: {
              type: "BadRequestError",
              message: `Grocery with ID ${id} has not enough quantity which you had asked.`,
            },
            value: null,
          };
        }

        const orderItem = new OrderItem(order, grocery, quantity);
        items.push(orderItem);
        total += quantity * grocery.price;
      }
      order.total = total;
      const savedOrder = await orderRepository.save(order);
      const savedOrderItems = await orderItemRepository.save(items);

      return { hasError: false, error: null, value: savedOrder };
    } catch (err: any) {
      return {
        error: {
          type: "UnknownRuntimeError",
          message: `Something went wrong while creating order: ${err.message}`,
        },
        hasError: true,
        value: null,
      };
    }
  }
}
