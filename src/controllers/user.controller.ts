import { Request, Response } from "express";
import { AuthServices } from "../services/auth.services";
import { CreateUserData, SigninData } from "../dto/user.dto";
import { UserRole, wrapError } from "../../types";
import { UserServices } from "../services/user.services";

export class UserController {
  private userService = new UserServices();

  getAvailableGrceries = async (req: Request, res: Response) => {
    try {
      const { email, firstName, lastname, password, username, role } =
        req?.body;
      const userData: CreateUserData = {
        email,
        firstName,
        lastname,
        password,
        username,
        role: role || UserRole.User,
      };

      const availableGroceries = await this.userService.getAllGroceries();
      if (availableGroceries.hasError) {
        switch (availableGroceries.error.type) {
          case "UnknownRuntimeError":
            return res.status(500).send(availableGroceries);

          default:
            return res.status(500).send({
              hasError: true,
              error: wrapError(
                availableGroceries.error,
                "Something happened wrong at server side."
              ),
              value: null,
            });
        }
      }
      res.status(200).send(availableGroceries);
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
}
