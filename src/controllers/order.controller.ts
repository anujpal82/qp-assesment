import { Request, Response } from "express";
import { wrapError } from "../../types";
import { OrderServices } from "../services/order.services";

export class OrderController {
  private orderService = new OrderServices();

  createOrder = async (req: Request, res: Response) => {
    try {
      const { groceries } = req?.body;
      const { id } = req?.params;

      const createdOrder = await this.orderService.createOrder(groceries, id);
      if (createdOrder.hasError) {
        switch (createdOrder.error.type) {
          case "BadRequestError":
            return res.status(400).send(createdOrder);
          case "NotFoundError":
            return res.status(404).send(createdOrder);

          case "UnknownRuntimeError":
            return res.status(500).send(createdOrder);

          default:
            return res.status(500).send({
              hasError: true,
              error: wrapError(
                createdOrder.error,
                "Something happened wrong at server side."
              ),
              value: null,
            });
        }
      }

      res.status(200).json({
        hasError: false,
        error: null,
        value: {
          orderId: createdOrder.value.id,
        },
      });
    } catch (err: any) {
      return {
        error: {
          type: "UnknownRuntimeError",
          message: `Something wrong happened at Server : ${err.message}`,
        },
        hasError: true,
        value: null,
      };
    }
  };
}
