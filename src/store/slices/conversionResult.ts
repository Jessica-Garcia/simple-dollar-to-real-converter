import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useAppSelector } from "..";
import { priceFormatter } from "../../utils/formatter";

interface CreateConversion {
  dollarQuotation: number;
  dollarQuantity: number;
  stateTax: number;
  type: "money" | "card";
}

export interface ConversionState {
  result: number;
}

const initialState: ConversionState = {
  result: 0,
};

const IOFCache = 0.011;
const IOFCreditCard = 0.0538;

export const conversionResultSlice = createSlice({
  name: "conversionResult",
  initialState,
  reducers: {
    converter: (state, action: PayloadAction<CreateConversion>) => {
      const { dollarQuantity, stateTax, type, dollarQuotation } =
        action.payload;
      const stateTaxPerCent = stateTax / 100;
      const stateTaxValue = dollarQuantity * stateTaxPerCent;
      const IOFCacheValue = dollarQuotation * IOFCache;
      const IOFCreditCardValue = dollarQuantity * IOFCreditCard;

      if (type === "money") {
        state.result =
          (dollarQuantity + stateTaxValue) * (dollarQuotation + IOFCacheValue);
      } else {
        state.result =
          (dollarQuantity + stateTaxValue + IOFCreditCardValue) *
          dollarQuotation;
      }
    },
  },
});

export const conversionResult = conversionResultSlice.reducer;
export const { converter } = conversionResultSlice.actions;

export const useCurrentConversionResult = () => {
  return useAppSelector((state) => {
    const { result } = state.conversionResult;
    return priceFormatter.format(result);
  });
};
