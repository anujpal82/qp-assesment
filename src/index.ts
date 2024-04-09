import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { connect } from "../database";
import { DataSource } from "typeorm";
import AdminRoutes from "./routes/admin.routes";
import authRoutes from "./routes/auth.routes";
import groceryRoutes from "./routes/grocery.routes";
import userRoutes from "./routes/user.routes";
import orderRoutes from "./routes/order.routes";

/*
 * Load up and parse configuration details from
 * the `.env` file to the `process.env`
 * object of Node.js
 */
dotenv.config();

const app: Express = express();
app.use(express.json());
const port = process.env.PORT;

connect()
  .then((res) => console.log("Database connected successfully."))
  .catch((err: any) =>
    console.log(`Error occurred during connecting database : ${err.message}`)
  );

app.get("/", (req, res) => res.send("hello world"));
// defining router structures
app.use("/admin", AdminRoutes);
app.use("/grocery", groceryRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/order", orderRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
