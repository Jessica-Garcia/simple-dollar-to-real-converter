import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { useState } from "react";

export const DefaultLayout = () => {
  const [theme, setTheme] = useState("");

  const applyDarkMode = () => {
    if (theme === "") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("");
      document.documentElement.classList.remove("dark");
    }
  };

  const handleThemeSwitcher = () => {
    applyDarkMode();
  };

  return (
    <div
      className={`dark:bg-zinc-800 overflow-x-hidden w-screen bg-slate-200 py-5 px-5 space-y-6 flex flex-col min-h-screen`}
    >
      <Header onThemeSwitcher={handleThemeSwitcher} />
      <Outlet />
    </div>
  );
};
