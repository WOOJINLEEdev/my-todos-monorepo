import express from "express";
import cors from "cors";

const todosRoutes = require("./routes/todos");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/todos", todosRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});