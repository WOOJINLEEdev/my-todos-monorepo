import { useEffect } from "react";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { baseUrl, createFetchInstance } from "@/utils/fetchInstance";

import TodoForm from "@/components/TodoForm";

const api = createFetchInstance(baseUrl, {
  "Content-Type": "application/json",
});

const MainPage = () => {
  const [token, setToken] = useLocalStorage<string | null>("token", null);

  useEffect(() => {
    async function refresh() {
      try {
        const res = await api.post(
          "/auth/refresh",
          undefined,
          undefined,
          "include"
        );

        const { accessToken } = res.data;
        setToken(accessToken);
      } catch (err) {
        console.error("fetch error: ", err);
      }
    }

    refresh();
  }, [setToken]);

  const handleGoogleLogin = async () => {
    try {
      window.location.href = `${baseUrl}/auth/google`;
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", undefined, undefined, "include");

      localStorage.removeItem("token");
      window.location.reload();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="flex flex-col gap-10 min-w-[calc(100%-64px)] min-h-screen">
      <header className="relative">
        <h1>todos</h1>

        {token ? (
          <button
            type="button"
            className="absolute top-1 right-10"
            onClick={() => handleLogout()}
          >
            로그아웃
          </button>
        ) : (
          <button
            type="button"
            className="absolute top-1 right-10"
            onClick={() => handleGoogleLogin()}
          >
            구글 로그인
          </button>
        )}
      </header>

      <main className="flex items-center justify-center">
        <TodoForm />
      </main>

      <footer className="flex flex-col mt-20 text-xs">
        <p>Double-click to edit a todo</p>
        <p>
          Clone{" "}
          <a
            href="https://todomvc.com/examples/react/dist/"
            target="_blank"
            className="hover:underline"
          >
            TodoMVC
          </a>
        </p>
      </footer>
    </div>
  );
};

export default MainPage;
