import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Grocery } from "./grocery.entity";
import { Order } from "./order.entity";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @ManyToOne(() => Grocery)
  grocery: Grocery;

  @Column()
  quantity: number;

  constructor(order: Order, grocery: Grocery, quantity: number) {
    this.id = uuidv4();
    this.order = order;
    this.grocery = grocery;
    this.quantity = quantity;
  }
}
