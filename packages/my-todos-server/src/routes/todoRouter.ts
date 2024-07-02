import express from "express";

import { validateData } from "../middleware/validationMiddleware";
import { authenticateToken } from "../middleware/authenticationMiddleware";
import { createTodoSchema } from "../schemas/createTodoSchema";
import { todoIdSchema } from "../schemas/todoIdSchema";
import { updateTodosToCompletedSchema } from "../schemas/updateTodosToCompletedSchema";
import { getTodosSchema } from "../schemas/getTodosSchema";
import { todoController } from "../controllers/todoController";
import { wrapAsync } from "../lib/wrapAsync";

const router = express.Router();

router.use(authenticateToken());

router.post(
  "/",
  validateData({ body: createTodoSchema }),
  wrapAsync(todoController.createTodo)
);
router.get(
  "/",
  validateData({ query: getTodosSchema }),
  wrapAsync(todoController.getTodos)
);
router.patch(
  "/completed",
  validateData({ body: updateTodosToCompletedSchema }),
  wrapAsync(todoController.updateTodosToCompleted)
);
router.put(
  "/:id",
  validateData({ params: todoIdSchema }),
  wrapAsync(todoController.updateTodo)
);
router.delete("/completed", wrapAsync(todoController.deleteCompletedTodos));
router.delete(
  "/:id",
  validateData({ params: todoIdSchema }),
  wrapAsync(todoController.deleteTodo)
);

export default router;
