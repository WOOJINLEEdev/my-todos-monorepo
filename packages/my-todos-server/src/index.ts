import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import todoRouter from "./routes/todoRouter";
import authRouter from "./routes/authRouter";
import errorMiddleware from "./middleware/errorMiddleware";

const app = express();
const port = 3000;

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(errorMiddleware);
app.use("/todos", todoRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
