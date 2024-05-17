import express from "express";
import dotenv from "dotenv";

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
const knex = require("knex")({
  client: configs.client,
  connection: {
    host: configs.host,
    port: configs.port,
    user: configs.username,
    password: configs.password,
    database: configs.database,
  },
});

//
// "INSERT INTO todolist (todo, completed) VALUES (?, ?)";
router.post("/", validateData(todoSchema), async (req, res) => {
  try {
    const { todo, completed } = req.body;
    const [insertId] = await knex("todolist").insert({ todo, completed });

    res.json({ id: insertId, todo: todo, completed: completed });
  } catch (err) {
    console.error("Error adding todo:", err);
    res.status(500).send("새로운 todo 추가 중 오류가 발생했습니다.");
  }
});

//
// "SELECT * FROM todolist"
// "SELECT * FROM todolist WHERE completed = false"
// "SELECT * FROM todolist WHERE completed = true"
router.get("/", async (req, res) => {
  const filter = req.query?.filter || "all";
  let remain;
  let total;

  await knex("todolist")
    .select("*")
    .then((results) => {
      const activeCount = results?.filter((result) => !result.completed).length;
      const totalCount = results?.length;

      remain = activeCount;
      total = totalCount;
    })
    .catch((err) => {
      console.error("todolist 불러오는 중 오류가 발생했습니다.", err);
      res.status(500).send("todolist 불러오는 중 오류가 발생했습니다.");
      return;
    });

  if (filter === "all") {
    await knex("todolist")
      .select("*")
      .then((results) => {
        const modifiedResults = results?.map((result) => ({
          id: result.id,
          todo: result.todo,
          completed: result.completed === 1,
          created_at: result.created_at,
        }));

        res.json({ data: modifiedResults, remain: remain, total: total });
        return;
      })
      .catch((err) => {
        console.error("todolist 불러오는 중 오류가 발생했습니다.", err);
        res.status(500).send("todolist 불러오는 중 오류가 발생했습니다.");
        return;
      });
  }

  if (filter === "active") {
    await knex
      .select("*")
      .from("todolist")
      .where("completed", false)
      .then((results) => {
        const activeTodolist = results.filter((result) => !result.completed);
        const modifiedActiveTodolist = activeTodolist?.map((result) => ({
          id: result.id,
          todo: result.todo,
          completed: result.completed === 1,
          created_at: result.created_at,
        }));

        res.json({
          data: modifiedActiveTodolist,
          remain: remain,
          total: total,
        });
        return;
      })
      .catch((err) => {
        console.error("Error fetching active todolist:", err);
        res.status(500).send("Error fetching active todolist.");
        return;
      });
  }

  if (filter === "completed") {
    await knex
      .select("*")
      .from("todolist")
      .where("completed", true)
      .then((results) => {
        const completedTodolist = results.filter((result) => result.completed);
        const modifiedCompletedTodolist = completedTodolist?.map((result) => ({
          id: result.id,
          todo: result.todo,
          completed: result.completed === 1,
          created_at: result.created_at,
        }));

        res.json({
          data: modifiedCompletedTodolist,
          remain: remain,
          total: total,
        });
      })
      .catch((err) => {
        console.error("Error fetching completed todolist:", err);
        res.status(500).send("Error fetching completed todolist.");
        return;
      });
  }
});

//
// "UPDATE todolist SET field WHERE id = ?"
router.put("/:id", validateData(todoSchema), async (req, res) => {
  try {
    const todoId = req.params.id;
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

    await knex("todolist").where("id", todoId).update(field);

    res.status(200).send("Todo updated successfully.");
  } catch (err) {
    console.error("Error updating todo:", err);
    res.status(500).send("Error updating todo.");
    return;
  }
});

//
// "UPDATE todolist SET completed = ?"
router.put("/completed/update", validateData(todoSchema), async (req, res) => {
  const { completed } = req.body;

  await knex("todolist")
    .update({ completed: completed })
    .then(() => {
      res.status(200).send("Completed Todo updated successfully.");
    })
    .catch((err) => {
      console.error("Error updating completed field:", err);
      res.status(500).send("Error updating completed field.");
    });
});

//
// "DELETE FROM todolist WHERE id = ?"
router.delete("/:id", validateData(todoSchema), async (req, res) => {
  try {
    const todoId = req.params.id;
    await knex("todolist").where("id", todoId).del();
    res.json({ message: "Todo deleted successfully.", id: todoId });
  } catch (err) {
    res.status(500).send("Error deleting todo.");
  }
});

//
// "DELETE FROM todolist WHERE completed = 1"
router.delete(
  "/completed/clear",
  validateData(todoSchema),
  async (req, res) => {
    try {
      await knex("todolist").where("completed", true).del();
      res.json({ message: "Completed todo deleted successfully" });
    } catch (err) {
      res.status(500).send("Error deleting completed todo.");
    }
  }
);

module.exports = router;
