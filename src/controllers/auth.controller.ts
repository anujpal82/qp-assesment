import { Request, Response } from "express";
import { AuthServices } from "../services/auth.services";
import { CreateUserData, SigninData } from "../dto/user.dto";
import { UserRole, wrapError } from "../../types";

export class AuthController {
  private authService = new AuthServices();

  createUser = async (req: Request, res: Response) => {
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

      const createUserData = await this.authService.createUser(userData);
      if (createUserData.hasError) {
        switch (createUserData.error.type) {
          case "AlreadyExistsError":
            return res.status(409).send(createUserData);

          case "BadRequestError":
            return res.status(400).send(createUserData);

          case "UnknownRuntimeError":
            return res.status(500).send(createUserData);

          default:
            return res.status(500).send({
              hasError: true,
              error: wrapError(
                createUserData.error,
                "Something happened wrong at server side."
              ),
              value: null,
            });
        }
      }
      res.status(200).send(createUserData);
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

  signIn = async (req: Request, res: Response) => {
    const { email, password } = req?.body;
    const signInData: SigninData = {
      email,
      password,
    };

    const loginData = await this.authService.signIn(signInData);
    if (loginData.hasError) {
      switch (loginData.error.type) {
        case "BadRequestError":
          return res.status(400).send(loginData);
        case "Unauthorized":
          return res.status(401).send(loginData);

        case "UnknownRuntimeError":
          return res.status(500).send(loginData);

        default:
          return res.status(500).send({
            hasError: true,
            error: wrapError(
              loginData.error,
              "Something happened wrong at server side."
            ),
            value: null,
          });
      }
    }
    res.status(200).send(loginData);
  };
}
