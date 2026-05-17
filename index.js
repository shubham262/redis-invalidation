import express from "express";
import productRoute from "./src/routes/index.js";
import { handleMongoDbConnection } from "./src/config/database.js";
await handleMongoDbConnection();
const app = express();

app.use(express.json());

app.use("/api/products", productRoute);
app.listen(3000, () => console.log("server started at port 3000"));
