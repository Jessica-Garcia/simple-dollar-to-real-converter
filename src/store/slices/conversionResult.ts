import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { useAppSelector } from '..'

interface CreateConversion {
  dollarQuotation: number
  dollarQuantity: number
  stateTax: number
  type: 'money' | 'card'
}

export interface ConversionState {
  result: number
  IOFCache: number
  IOFCreditCard: number
  dollarQuotation: number
  stateTax: number
  type: 'money' | 'card'
}

const initialState: ConversionState = {
  result: 0,
  IOFCache: 0.011,
  IOFCreditCard: 0.0538,
  dollarQuotation: 0,
  stateTax: 0,
  type: 'money'
}

export const conversionResultSlice = createSlice({
  name: 'conversionResult',
  initialState,
  reducers: {
    converter: (state, action: PayloadAction<CreateConversion>) => {
      const { dollarQuantity, stateTax, type, dollarQuotation } = action.payload
      const stateTaxPerCent = stateTax / 100
      const stateTaxValue = dollarQuantity * stateTaxPerCent
      const IOFCacheValue = dollarQuotation * state.IOFCache
      const IOFCreditCardValue = dollarQuantity * state.IOFCreditCard

      if (type === 'money') {
        state.result =
          (dollarQuantity + stateTaxValue) * (dollarQuotation + IOFCacheValue)
      } else {
        state.type = 'card'
        state.result =
          (dollarQuantity + stateTaxValue + IOFCreditCardValue) *
          dollarQuotation
      }

      state.stateTax = stateTax
      state.dollarQuotation = dollarQuotation
    }
  }
})

export const conversionResult = conversionResultSlice.reducer
export const { converter } = conversionResultSlice.actions

export const useCurrentConversion = () => {
  return useAppSelector((state) => {
    return state.conversionResult
  })
}
