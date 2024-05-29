import express from "express";
import cors from "cors";

import todosRouter from "./routes/todosRouter";
import errorMiddleware from "./middleware/errorMiddleware";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/todos", todosRouter);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
