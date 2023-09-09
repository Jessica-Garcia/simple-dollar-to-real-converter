import { useCurrentConversionResult } from "../store/slices/conversionResult";
import { useNavigate } from "react-router-dom";
export const Result = () => {
  const currentConversionResult = useCurrentConversionResult();
  const navigate = useNavigate();
  return (
    <main className="">
      <h1>{currentConversionResult}</h1>
      <button onClick={() => navigate("/")}>voltar</button>
    </main>
  );
};
