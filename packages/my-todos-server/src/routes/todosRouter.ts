import express from "express";

import { validateData } from "../middleware/validationMiddleware";
import { createTodoSchema } from "../schemas/createTodoSchema";
import { todoIdSchema } from "../schemas/todoIdSchema";
import { updateTodosToCompletedSchema } from "../schemas/updateTodosToCompletedSchema";
import { getTodosSchema } from "../schemas/getTodosSchema";
import { todosController } from "../controllers/todosController";
import { wrapAsync } from "../lib/wrapAsync";

const router = express.Router();

router.post(
  "/",
  validateData({ body: createTodoSchema }),
  wrapAsync(todosController.createTodo)
);
router.get(
  "/",
  validateData({ query: getTodosSchema }),
  wrapAsync(todosController.getTodos)
);
router.patch(
  "/completed",
  validateData({ body: updateTodosToCompletedSchema }),
  wrapAsync(todosController.updateTodosToCompleted)
);
router.put(
  "/:id",
  validateData({ params: todoIdSchema }),
  wrapAsync(todosController.updateTodo)
);
router.delete("/completed", wrapAsync(todosController.deleteCompletedTodos));
router.delete(
  "/:id",
  validateData({ params: todoIdSchema }),
  wrapAsync(todosController.deleteTodo)
);

export default router;
