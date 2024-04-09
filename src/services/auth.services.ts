import { E, Errorable, wrapError } from "../../types";
import { User } from "../Entities/user.entity";
import { CreateUserData, SigninData } from "../dto/user.dto";
import { AuthRepository } from "../repositories/auth.repository";

export class AuthServices {
  async createUser(
    userData: CreateUserData
  ): Promise<
    Errorable<
      Partial<User>,
      E<"UnknownRuntimeError"> | E<"BadRequestError"> | E<"AlreadyExistsError">
    >
  > {
    try {
      const { firstName, lastname, username, email, password } = userData;

      // Check if any required field is missing
      if (!firstName || !lastname || !username || !email || !password) {
        return {
          hasError: true,
          error: {
            type: "BadRequestError",
            message: "Please provide valid user information",
          },
          value: null,
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          hasError: true,
          error: {
            type: "BadRequestError",
            message: "Email format is not valid",
          },
          value: null,
        };
      }

      // Check if email already exists
      const ifEmailExists = await AuthRepository.getUserByEmail(email);
      if (ifEmailExists?.hasError === false && ifEmailExists.value) {
        return {
          hasError: true,
          error: {
            type: "AlreadyExistsError",
            message: "User already exists",
          },
          value: null,
        };
      }

      // Create user if all validations pass
      const createdUserData = await AuthRepository.createUser(userData);
      if (createdUserData.hasError) {
        return {
          hasError: true,
          error: wrapError(createdUserData.error, "Failed to create user."),
          value: null,
        };
      }

      return {
        error: null,
        hasError: false,
        value: createdUserData.value,
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

  async signIn(
    userData: SigninData
  ): Promise<
    Errorable<
      { user: User; token: String } | null,
      E<"UnknownRuntimeError"> | E<"BadRequestError"> | E<"Unauthorized">
    >
  > {
    try {
      const { email, password } = userData;

      // Check if any required field is missing
      if (!email || !password) {
        return {
          hasError: true,
          error: {
            type: "BadRequestError",
            message: "Please provide valid user information",
          },
          value: null,
        };
      }

      const signInResponse = await AuthRepository.signIn(userData);
      if (signInResponse.hasError) {
        return {
          hasError: true,
          error: wrapError(signInResponse.error, "Failed Signin."),
          value: null,
        };
      }

      if (!signInResponse.hasError && !signInResponse.value) {
        return {
          hasError: true,
          error: {
            type: "Unauthorized",
            message: "Please provide valid email and password.",
          },
          value: null,
        };
      }

      return signInResponse;
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
