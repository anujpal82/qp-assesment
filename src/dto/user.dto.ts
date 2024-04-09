export interface CreateUserData {
  firstName: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  role: string;
}
export type SigninData = Pick<CreateUserData, "email" | "password">;
