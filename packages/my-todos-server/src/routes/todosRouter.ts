import express from "express";

import { validateData } from "../middleware/validationMiddleware";
import { todoSchema } from "../schemas/todoSchemas";
import { todoIdSchema } from "../schemas/todoIdSchema";
import { todoCompletedSchema } from "../schemas/todoCompletedSchema";
import { todosController } from "../controllers/todosController";
import { wrapAsync } from "../lib/wrapAsync";

const router = express.Router();

router.post(
  "/",
  validateData({ body: todoSchema }),
  wrapAsync(todosController.createTodo)
);
router.get("/", wrapAsync(todosController.getTodos));
router.patch(
  "/completed",
  validateData({ body: todoCompletedSchema }),
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
