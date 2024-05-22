import express from "express";

import { validateData } from "../middleware/validationMiddleware";
import { todosSchema } from "../schemas/todosSchemas";
import {
  createTodo,
  deleteCompletedTodos,
  deleteTodo,
  getTodosByFilter,
  updateCompletedTodos,
  updateTodo,
} from "../controllers/todosController";

const router = express.Router();

router.post("/", validateData(todosSchema), createTodo);
router.get("/", getTodosByFilter);
router.put("/:id", validateData(todosSchema), updateTodo);
router.put(
  "/completed/update",
  validateData(todosSchema),
  updateCompletedTodos
);
router.delete("/:id", validateData(todosSchema), deleteTodo);
router.delete("/completed/clear", deleteCompletedTodos);

export default router;
