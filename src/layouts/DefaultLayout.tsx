import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { useState } from "react";

export const DefaultLayout = () => {
  const [theme, setTheme] = useState("");

  const setThemeMode = () => {
    theme === "" ? setTheme("dark") : setTheme("");
  };

  const applyDarkMode = () => {
    if (theme === "") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleThemeSwitcher = () => {
    setThemeMode();
    applyDarkMode();
  };

  return (
    <div
      className={`dark:bg-zinc-800 bg-slate-200 py-5 px-2 space-y-6 flex flex-col min-h-screen`}
    >
      <Header onThemeSwitcher={handleThemeSwitcher} />
      <Outlet />
    </div>
  );
};
