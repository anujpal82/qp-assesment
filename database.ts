import { DataSource } from "typeorm";
import "reflect-metadata";

const dataSource = new DataSource({
  type: "postgres",
  // host: "localhost", // when you are working with localhost just use localhost
  host: "dev-db",
  port: 5432,
  username: "postgres",
  password: "123",
  database: "qp-assessment",
  synchronize: true,
  // logging: true, // Enable logging
  entities: [__dirname + "/src/Entities/**/*.entity.ts"],
});

async function connect(): Promise<DataSource> {
  return await dataSource.initialize();
}

export { dataSource, connect };
