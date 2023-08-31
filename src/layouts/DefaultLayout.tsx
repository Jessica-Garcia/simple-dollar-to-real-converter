import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";

export const DefaultLayout = () => {
  return (
    <div className="w-screen space-y-10 overflow-hidden flex flex-col h-screen">
      <Header />
      <Outlet />
    </div>
  );
};
