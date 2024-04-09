import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { UserRole } from "../../types";
import { Order } from "./order.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastname: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];

  @Column({ type: "enum", enum: UserRole, default: UserRole.User })
  role: UserRole;

  constructor(
    firstName: string,
    lastname: string,
    username: string,
    email: string,
    password: string,
    role: UserRole = UserRole.User
  ) {
    this.id = uuidv4();
    this.firstName = firstName;
    this.lastname = lastname;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
