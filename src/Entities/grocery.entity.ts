import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";
import { v4 as uuidv4 } from "uuid";

// Define the enum for roles

@Entity()
export class Grocery {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  name: String;

  constructor(quantity: number, price: number, name: String) {
    this.id = uuidv4();
    this.quantity = quantity;
    this.price = price;
    this.name = name;
  }
}
