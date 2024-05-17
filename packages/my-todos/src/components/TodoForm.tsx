/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

import { useForm } from "react-hook-form";

import { capitalizeFirstLetter } from "@/utils/common";
import {
  createTodoItem,
  deleteCompletedTodos,
  deleteTodoItem,
  getTodos,
  updateTodoItem,
  updateTodoItemChecked,
  updateTodosAllChecked,
} from "@/utils/todo";

import useTodoListStore, { Todo } from "@/state/useTodoListStore";

interface FormData {
  todo: string;
}

const FILTERS = ["all", "active", "completed"];

const TodoApiForm = () => {
  const editRef = useRef<HTMLInputElement>(null);
  const todoListRef = useRef<HTMLUListElement>(null);

  const [isSelected, setIsSelected] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [index, setIndex] = useState<number | null>(null);
  const [clickedFilter, setClickedFilter] = useState("all");
  const [refetch, setRefetch] = useState(false);

  const { todoList, remain, total, setTodoList, setRemain, setTotal } =
    useTodoListStore();

  const { register, handleSubmit, reset, resetField } = useForm<FormData>({
    defaultValues: {
      todo: "",
    },
  });

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent): void {
      if (todoListRef.current?.contains(e.target as Node)) {
        if (editRef && e.target !== editRef.current) {
          setIsSelected(false);
          setIndex(null);
        }
      }

      if (
        todoListRef.current &&
        !todoListRef.current.contains(e.target as Node)
      ) {
        setIsSelected(false);
        setIndex(null);
      }
    }

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [todoListRef]);

  useEffect(() => {
    if ((index && editRef) || index === 0) {
      editRef.current?.focus();
    }
  }, [selectedId, index]);

  useEffect(() => {
    async function getTodoList() {
      try {
        const res = await getTodos(clickedFilter);
        setTodoList(res.data);
        setRemain(res.remain);
        setTotal(res.total);
        reset({});
      } catch (err) {
        console.error("error : ", err);
      }
    }

    getTodoList();
  }, [refetch, clickedFilter]);

  const handleFormSubmit = async (data: FormData) => {
    setRefetch(true);
    try {
      await createTodoItem(data.todo);
    } catch (err) {
      console.error("err : ", err);
    } finally {
      setRefetch(false);
    }

    resetField("todo");
  };

  const handleLabelClick = () => {
    setIsSelected(false);
    setIndex(null);
  };

  const handleLabelDoubleClick = (item: Todo, index: number) => {
    setIsSelected((prev) => !prev);
    setSelectedId(item.id);
    setEditText(item.todo);
    setIndex(index);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditText(e.currentTarget.value);
  };

  const handleInputBlur = () => {
    setIsSelected(false);
  };

  const handleInputKeyDown = async (e: KeyboardEvent, id: number) => {
    if (e.key === "Enter") {
      if (editText.trim().length < 2) {
        return;
      }

      setRefetch(true);
      try {
        await updateTodoItem({ id: id, todo: editText });
      } catch (err) {
        console.error("err : ", err);
      } finally {
        setIsSelected(false);
        setRefetch(false);
      }
    }
  };

  const handleFilterBtnClick = async (value: string) => {
    setClickedFilter(value);
  };

  const handleAllCheckChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setRefetch(true);
    try {
      await updateTodosAllChecked(e.currentTarget.checked);
    } catch (err) {
      console.error("err : ", err);
    } finally {
      setRefetch(false);
    }
  };

  const handleCompletedTodoClear = async () => {
    setRefetch(true);
    try {
      await deleteCompletedTodos();
    } catch (err) {
      console.error("err : ", err);
    } finally {
      setRefetch(false);
    }
  };

  const handleTodoDelete = async (id: number) => {
    setRefetch(true);
    try {
      await deleteTodoItem(id);
    } catch (err) {
      console.error("err : ", err);
    } finally {
      setRefetch(false);
    }
  };

  const handleCheckboxChange = async (
    e: ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    setRefetch(true);
    try {
      await updateTodoItemChecked({
        id: id,
        checked: e.currentTarget.checked,
      });
    } catch (err) {
      console.error("err : ", err);
    } finally {
      setRefetch(false);
    }
  };

  return (
    <div className="flex flex-col">
      <form
        className="z-10 relative w-[550px] border-t border-solid border-gray-100 shadow-xl"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        {todoList?.length > 0 && (
          <div className="absolute top-0 left-2 flex items-center justify-center w-8 h-16">
            <label htmlFor="allCheck" className="sr-only">
              전체 선택
            </label>
            <input
              type="checkbox"
              id="allCheck"
              className="w-8 h-8"
              onChange={(e) => handleAllCheckChange(e)}
              checked={todoList.every((todo) => todo.completed)}
            />
          </div>
        )}

        <label htmlFor="todo" className="sr-only">
          todo 입력
        </label>
        <input
          type="text"
          id="todo"
          placeholder="Type..."
          className="todo_input w-full p-4 pl-[60px] text-2xl ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          {...register("todo", {
            required: true,
            minLength: 2,
            validate: (value) => (value.trim().length >= 2 ? true : false),
          })}
        />

        <ul
          className={`${todoList?.length > 0 ? "mt-1" : ""}`}
          ref={todoListRef}
        >
          {todoList?.map((todo, index) => {
            return (
              <li
                key={`todo_${todo.id}`}
                className="relative border border-t-0 border-solid border-gray-200"
                id={index.toString()}
              >
                {isSelected && selectedId === todo.id ? (
                  <>
                    <label htmlFor="todoEditInput" className="sr-only">
                      todo 수정
                    </label>
                    <input
                      type="text"
                      id="todoEditInput"
                      className="w-full p-4 pl-[60px] text-2xl"
                      defaultValue={todo.todo}
                      ref={index === index ? editRef : undefined}
                      onKeyDown={(e) => handleInputKeyDown(e, todo.id)}
                      onChange={(e) => handleInputChange(e)}
                      onBlur={handleInputBlur}
                    />
                  </>
                ) : (
                  <div className="flex">
                    <div className="absolute top-0 left-2 flex items-center justify-center w-8 h-full">
                      <label htmlFor="todoItemCheck" className="sr-only">
                        todo 선택 체크박스
                      </label>
                      <input
                        type="checkbox"
                        id="todoItemCheck"
                        className="w-8 h-8"
                        onChange={(e) => handleCheckboxChange(e, todo.id)}
                        checked={todo.completed}
                      />
                    </div>

                    <label
                      role="button"
                      className={`block w-full p-4 pl-[60px] bg-white text-2xl text-left select-none ${todo.completed ? "line-through" : ""}`}
                      onClick={() => handleLabelClick()}
                      onDoubleClick={() => handleLabelDoubleClick(todo, index)}
                    >
                      {todo?.todo}
                    </label>

                    <button
                      type="button"
                      className="absolute top-0 right-0 h-full bg-white"
                      aria-label="todo 삭제"
                      onClick={() => handleTodoDelete(todo.id)}
                    >
                      x
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {(total > 0 || todoList?.length > 0) && (
          <div className="flex justify-between min-h-5 px-4 py-2.5 border border-t-0 border-solid border-gray-200">
            <span>{remain} item left!</span>

            <ul className="flex gap-1">
              {FILTERS.map((filter, i) => {
                return (
                  <li key={`${filter}_${i}`}>
                    <button
                      type="button"
                      className={`p-0 px-1 bg-white ${clickedFilter === filter ? "border border-solid border-blue-500" : ""} focus:outline-none`}
                      onClick={() => handleFilterBtnClick(filter)}
                    >
                      {capitalizeFirstLetter(filter)}
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              className="p-0 bg-white border-0 hover:underline focus:outline-none"
              onClick={() => handleCompletedTodoClear()}
            >
              Clear completed
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default TodoApiForm;
