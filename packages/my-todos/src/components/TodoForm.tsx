/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

import { useForm } from "react-hook-form";

import { useCreateTodo } from "@/hooks/api/useCreateTodo";
import { useDeleteCompletedTodos } from "@/hooks/api/useDeleteCompletedTodos";
import { useDeleteTodo } from "@/hooks/api/useDeleteTodo";
import { useGetTodos } from "@/hooks/api/useGetTodos";
import { useUpdateTodo } from "@/hooks/api/useUpdateTodo";
import { useUpdateTodoChecked } from "@/hooks/api/useUpdateTodoChecked";
import { useUpdateTodosAllChecked } from "@/hooks/api/useUpdateTodosAllChecked";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { capitalizeFirstLetter } from "@/utils/common";

export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
}

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

  const { register, handleSubmit, resetField } = useForm<FormData>({
    defaultValues: {
      todo: "",
    },
  });

  const { mutate: delteTodo } = useDeleteTodo();
  const { mutate: updateTodosAllChecked } = useUpdateTodosAllChecked();
  const { mutate: updateTodo } = useUpdateTodo();
  const { mutate: createTodo } = useCreateTodo();
  const { mutate: deleteCompletedTodos } = useDeleteCompletedTodos();
  const { mutate: updateTodoChecked } = useUpdateTodoChecked();

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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useGetTodos({
    filter: clickedFilter,
  });

  const { ref } = useIntersectionObserver({
    threshold: 0.5,
    onChange: (isIntersecting) => {
      if (isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {(error as Error).message}</p>;
  }

  const remain = data?.pages[0]?.metadata?.remain;
  const total = data?.pages[0]?.metadata?.total;

  const handleFormSubmit = async (data: FormData) => {
    createTodo(data.todo);
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

      updateTodo({ id: id, todo: editText });
      setIsSelected(false);
    }
  };

  const handleFilterBtnClick = async (value: string) => {
    setClickedFilter(value);
  };

  const handleAllCheckChange = async (e: ChangeEvent<HTMLInputElement>) => {
    updateTodosAllChecked(e.currentTarget.checked);
  };

  const handleCompletedTodoClear = async () => {
    if (total === remain) {
      return;
    }

    deleteCompletedTodos();
  };

  const handleTodoDelete = async (id: number) => {
    delteTodo(id);
  };

  const handleCheckboxChange = async (
    e: ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    updateTodoChecked({
      id: id,
      checked: e.currentTarget.checked,
    });
  };

  return (
    <div className="flex flex-col">
      <form
        className="z-10 relative w-[550px] border-t border-solid border-gray-100 shadow-xl"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        {data && data.pages?.[0]?.todos.length > 0 && (
          <div className="absolute top-0 left-2 flex items-center justify-center w-8 h-16">
            <label htmlFor="allCheck" className="sr-only">
              전체 선택
            </label>
            <input
              type="checkbox"
              id="allCheck"
              className="w-8 h-8"
              onChange={(e) => handleAllCheckChange(e)}
              checked={
                data &&
                data.pages
                  .flatMap((page) => page.todos)
                  .every((todo) => todo.completed)
              }
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
          className={`${data && data.pages?.length > 0 ? "mt-1" : ""}`}
          ref={todoListRef}
        >
          {data &&
            data.pages
              .flatMap((page) => page.todos)
              ?.map((todo, index) => {
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
                          onDoubleClick={() =>
                            handleLabelDoubleClick(todo, index)
                          }
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

        {(total > 0 || (data && data?.pages[0]?.todos.length > 0)) && (
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
      <div ref={ref} />
    </div>
  );
};

export default TodoApiForm;
