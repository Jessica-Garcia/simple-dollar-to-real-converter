import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Home } from "./pages";
import { Result } from "./pages/Result";
import { DefaultLayout } from "./layouts/DefaultLayout";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/result" element={<Result />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
