import { useCurrentConversion } from "../store/slices/conversionResult";
import { useNavigate } from "react-router-dom";
import { priceFormatter } from "../utils/formatter";

export const Result = () => {
  const { result } = useCurrentConversion();
  const navigate = useNavigate();
  return (
    <main className="">
      <h1>{priceFormatter.format(result)}</h1>
      <button onClick={() => navigate("/")}>voltar</button>
    </main>
  );
};
