import { Route, Routes } from "react-router-dom";

import MainPage from "@/pages/MainPage";
import "@/App.css";

function App() {
  return (
    <div className="flex flex-col gap-10 min-w-[calc(100%-64px)] min-h-screen">
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </div>
  );
}

export default App;
