const baseUrl = import.meta.env.VITE_BASE_URL;

export async function getTodos({
  filter,
  offset = null,
  limit = 10,
}: {
  filter: string;
  offset: number | null;
  limit?: number;
}) {
  const queryParams = new URLSearchParams({
    filter: filter,
    limit: String(limit),
    offset: String(offset),
  });
  const result = await fetch(`${baseUrl}/todos?${queryParams.toString()}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    });

  return result;
}

export async function createTodoItem(todo: string) {
  await fetch(`${baseUrl}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todo: todo, completed: false }),
  });
}

export async function updateTodoItem({
  id,
  todo,
}: {
  id: number;
  todo: string;
}) {
  await fetch(`${baseUrl}/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ todo: todo }),
  });
}

export async function updateTodosAllChecked(check: boolean) {
  await fetch(`${baseUrl}/todos/completed`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: check }),
  });
}

export async function deleteCompletedTodos() {
  await fetch(`${baseUrl}/todos/completed`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function deleteTodoItem(id: number) {
  await fetch(`${baseUrl}/todos/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function updateTodoItemChecked({
  id,
  checked,
}: {
  id: number;
  checked: boolean;
}) {
  await fetch(`${baseUrl}/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: checked }),
  });
}
