import { dataSource } from "../../database";
import { E, Errorable, UserRole } from "../../types";
import { User } from "../Entities/user.entity";
import bcrypt from "bcrypt";
import { CreateUserData, SigninData } from "../dto/user.dto";
import jwt from "jsonwebtoken";
import { FindOperator } from "typeorm";
export class AuthRepository {
  static async createUser(
    userData: CreateUserData
  ): Promise<Errorable<Partial<User>, E<"UnknownRuntimeError">>> {
    const appDataSOurce = dataSource.getRepository(User);
    try {
      const { firstName, lastname, username, email, password, role } = userData;

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User(
        firstName,
        lastname,
        username,
        email,
        hashedPassword,
        role as UserRole
      );
      const createdUser = await appDataSOurce.save(newUser);
      return {
        hasError: false,
        error: null,
        value: createdUser,
      };
    } catch (err: any) {
      return {
        error: {
          type: "UnknownRuntimeError",
          message: `Something wrong happened at createUser : ${err.message}`,
        },
        hasError: true,
        value: null,
      };
    }
  }

  static async getUserByEmail(
    email: string
  ): Promise<Errorable<User | null, E<"UnknownRuntimeError">>> {
    const appDataSOurce = dataSource.getRepository(User);
    try {
      const user = await appDataSOurce.findOne({ where: { email } });
      if (user) {
        return {
          hasError: false,
          error: null,
          value: user,
        };
      } else {
        return {
          hasError: false,
          error: null,
          value: null,
        };
      }
    } catch (err: any) {
      return {
        error: {
          type: "UnknownRuntimeError",
          message: `Something wrong happened at getUserByEmail : ${err.message}`,
        },
        hasError: true,
        value: null,
      };
    }
  }

  static async getUserById(
    id: string
  ): Promise<Errorable<User | null, E<"UnknownRuntimeError">>> {
    const appDataSOurce = dataSource.getRepository(User);
    try {
      const user = await appDataSOurce.findOne({
        where: {
          id,
        },
      });
      if (user) {
        return {
          hasError: false,
          error: null,
          value: user,
        };
      } else {
        return {
          hasError: false,
          error: null,
          value: null,
        };
      }
    } catch (err: any) {
      return {
        error: {
          type: "UnknownRuntimeError",
          message: `Something wrong happened at getUserById : ${err.message}`,
        },
        hasError: true,
        value: null,
      };
    }
  }

  static async signIn(
    signInData: SigninData
  ): Promise<
    Errorable<{ user: User; token: String } | null, E<"UnknownRuntimeError">>
  > {
    const appDataSOurce = dataSource.getRepository(User);
    try {
      const user = await appDataSOurce.findOne({
        where: { email: signInData.email },
      });
      if (!user) {
        return {
          hasError: false,
          error: null,
          value: null,
        };
      }
      const passwordMatch = await bcrypt.compare(
        signInData.password,
        user.password
      );
      if (!passwordMatch) {
        return {
          hasError: false,
          error: null,
          value: null,
        };
      }
      const token = jwt.sign(
        { user },
        process.env.JWT_SECRET || "qp-assesment",
        {
          expiresIn: "1h",
        }
      );
      return {
        hasError: false,
        error: null,
        value: {
          token,
          user,
        },
      };
    } catch (err: any) {
      return {
        error: {
          type: "UnknownRuntimeError",
          message: `Something wrong happened at getUserByEmail : ${err.message}`,
        },
        hasError: true,
        value: null,
      };
    }
  }
}
