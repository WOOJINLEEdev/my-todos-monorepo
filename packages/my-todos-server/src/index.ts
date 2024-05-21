import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({ path: ".env.local" });

const todosRoutes = require("./routes/todos");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/todos", todosRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
