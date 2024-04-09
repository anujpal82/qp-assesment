import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { User } from "./user.entity";
import { OrderItem } from "./orderItem.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items: OrderItem[];

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total: number;

  constructor(id: string, user: User, items: OrderItem[], total: number) {
    this.id = id;
    this.user = user;
    this.items = items;
    this.total = total;
  }
}
