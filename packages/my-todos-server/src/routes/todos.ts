import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import { validateData } from "../middleware/validationMiddleware";
import { todoSchema } from "../schemas/todoSchemas";

dotenv.config({ path: ".env.local" });

export const configs = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "database",
  client: process.env.DIALECT || "mysql",
};

const router = express.Router();
const prisma = new PrismaClient();

router.post("/", validateData(todoSchema), async (req, res) => {
  try {
    const { todo, completed } = req.body;

    const newTodo = await prisma.todolist.create({
      data: {
        todo: todo,
        completed: completed,
      },
    });

    res.status(201).json(newTodo);
  } catch (err) {
    console.error("새로운 Todo 추가 중 오류 발생", err);
    res.status(500).send("새로운 Todo 추가 중 오류 발생");
  }
});

router.get("/", async (req, res) => {
  const filter = req.query?.filter || "all";
  let remain;
  let total;

  try {
    const todolist = await prisma.todolist.findMany();
    const activeCount = todolist?.filter((result) => !result.completed).length;
    const totalCount = todolist?.length;

    remain = activeCount;
    total = totalCount;
  } catch (err) {
    console.error("Todolist 불러오는 중 오류 발생", err);
    res.status(500).send("Todolist 불러오는 중 오류 발생");
  }

  if (filter === "all") {
    try {
      const todolist = await prisma.todolist.findMany();
      const modifiedTodolist = todolist?.map((todo) => ({
        id: todo.id,
        todo: todo.todo,
        completed: todo.completed === true,
        created_at: todo.created_at,
      }));

      res.json({ data: modifiedTodolist, remain: remain, total: total });
    } catch (err) {
      console.error("Todolist 불러오는 중 오류 발생", err);
      res.status(500).send("Todolist 불러오는 중 오류 발생");
    }
  }

  if (filter === "active") {
    try {
      const activeTodolist = await prisma.todolist.findMany({
        where: {
          completed: false,
        },
      });
      const modifiedActiveTodolist = activeTodolist?.map((todo) => ({
        id: todo.id,
        todo: todo.todo,
        completed: todo.completed === true,
        created_at: todo.created_at,
      }));

      res.json({
        data: modifiedActiveTodolist,
        remain: remain,
        total: total,
      });
    } catch (err) {
      console.error("Active todo를 불러오는 중 오류 발생", err);
      res.status(500).send("Active todo를 불러오는 중 오류 발생");
    }
  }

  if (filter === "completed") {
    try {
      const completedTodolist = await prisma.todolist.findMany({
        where: {
          completed: true,
        },
      });
      const modifiedCompletedTodolist = completedTodolist?.map((todo) => ({
        id: todo.id,
        todo: todo.todo,
        completed: todo.completed === true,
        created_at: todo.created_at,
      }));

      res.json({
        data: modifiedCompletedTodolist,
        remain: remain,
        total: total,
      });
    } catch (err) {
      console.error("Completed todo를 불러오는 중 오류 발생", err);
      res.status(500).send("Completed todo를 불러오는 중 오류 발생");
    }
  }
});

router.put("/:id", validateData(todoSchema), async (req, res) => {
  const todoId = req.params.id;

  try {
    const { todo, completed }: { todo?: string; completed?: string } = req.body;
    let field;

    if (todo !== undefined) {
      field = { todo: todo };
    }

    if (completed !== undefined) {
      field = { completed: completed };
    }

    if (todo === undefined && completed === undefined) {
      res.status(400).send("No fields to update");
      return;
    }

    await prisma.todolist.update({
      where: {
        id: Number(todoId),
      },
      data: field,
    });

    res.status(200).send(`${todoId} Todo 업데이트 성공`);
  } catch (err) {
    console.error(`${todoId} Todo 업데이트 실패`, err);
    res.status(500).send(`${todoId} Todo 업데이트 실패`);
    return;
  }
});

router.put("/completed/update", validateData(todoSchema), async (req, res) => {
  const { completed } = req.body;

  try {
    await prisma.todolist.updateMany({
      data: {
        completed: completed,
      },
    });
    res.status(200).send("Completed Todos 업데이트 성공");
  } catch (err) {
    console.error("Completed Todos 업데이트 실패", err);
    res.status(500).send("Completed Todo 업데이트 실패");
  }
});

router.delete("/:id", validateData(todoSchema), async (req, res) => {
  try {
    const todoId = req.params.id;
    await prisma.todolist.delete({
      where: {
        id: Number(todoId),
      },
    });

    res.json(`${todoId} Todo 삭제 성공`);
  } catch (err) {
    res.status(500).send("Todo 삭제 실패");
  }
});

router.delete(
  "/completed/clear",
  validateData(todoSchema),
  async (req, res) => {
    try {
      await prisma.todolist.deleteMany({
        where: {
          completed: true,
        },
      });

      res.json({ message: "Completed Todos 삭제 성공" });
    } catch (err) {
      res.status(500).send("Completed Todos 삭제 실패");
    }
  }
);

module.exports = router;
