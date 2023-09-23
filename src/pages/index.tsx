import * as z from 'zod'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../lib/axios'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../store'
import {
  converter,
  useCurrentConversion
} from '../store/slices/conversionResult'
import { BadgePercent, BadgeDollarSign } from 'lucide-react'

const newConversionFormSchema = z.object({
  dollarQuantity: z.number().positive(),
  stateTax: z.number().positive(),
  type: z.enum(['money', 'card'])
})

type NewConversionFormInputs = z.infer<typeof newConversionFormSchema>

export const Home = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm<NewConversionFormInputs>({
    resolver: zodResolver(newConversionFormSchema),
    defaultValues: {
      type: 'money'
    }
  })

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { IOFCache, IOFCreditCard } = useCurrentConversion()

  const IOFCachePerCentValue = IOFCache * 100
  const IOFCreditCardPerCentValue = IOFCreditCard * 100

  const { data /* isLoading, error */ } = useQuery(
    'quotationDollarInReais',
    () => {
      return api.get('/last/USD-BRL')
    },
    {
      retry: 3
      // refetchInterval: 60000,
    }
  )

  const handleNewConversion = async (
    conversionData: NewConversionFormInputs
  ) => {
    const { dollarQuantity, stateTax, type } = conversionData
    const dollarQuotation = parseFloat(data?.data.USDBRL.bid)

    dispatch(converter({ dollarQuantity, stateTax, type, dollarQuotation }))
    navigate('/result')
    reset()
  }

  return (
    <main className="flex mt-[3.25rem] bg-zinc-300 dark:bg-zinc-950">
      <form
        onSubmit={handleSubmit(handleNewConversion)}
        className="space-y-1 flex-1 w-full mb-6 border-zinc-500 border-solid border-2 rounded-lg p-6"
        autoComplete="off"
      >
        {/* insert infos */}
        <div className="flex justify-center gap-1 flex-col">
          {/* dollar value */}

          <label htmlFor="dollar" className="dark:text-zinc-300 text-zinc-700">
            Valor em dólar
          </label>

          <div className="flex items-center gap-2 rounded-lg border dark:border-zinc-300 border-zinc-600 px-3 py-2 shadow-sm">
            <BadgeDollarSign className="h-4 w-4 text-zinc-500" />
            <input
              className="border-0 bg-transparent p-0 text-zinc-900 placeholder-zinc-600 outline-none dark:text-zinc-300 dark:placeholder-zinc-400"
              id="dollar"
              type="number"
              {...register('dollarQuantity', {
                valueAsNumber: true,
                required: true
              })}
              placeholder="0"
              min={0.01}
              step={0.01}
              autoFocus
            />
          </div>

          {/* state tax */}

          <label htmlFor="tax" className="dark:text-zinc-300 text-zinc-700">
            Taxa do estado
          </label>
          <div className="flex items-center gap-2 rounded-lg border dark:border-zinc-300 border-zinc-600 px-3 py-2 shadow-sm">
            <BadgePercent className="h-4 w-4 dark:text-zinc-400 text-zinc-500" />
            <input
              className="flex-1 border-0 bg-transparent p-0 text-zinc-900 placeholder-zinc-600 outline-none dark:text-zinc-100 dark:placeholder-zinc-400"
              id="tax"
              type="number"
              min={0}
              step={0.01}
              placeholder="0"
              {...register('stateTax', {
                valueAsNumber: true,
                required: true
              })}
            />
          </div>
        </div>
        {/* dinamic infos */}

        <h1 className="dark:text-zinc-300 text-zinc-700">Tipo de compra</h1>
        <Controller
          control={control}
          name="type"
          render={({ field }) => {
            return (
              <div className="flex flex-col gap-2">
                <RadioGroup.Root
                  className="flex gap-4 "
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <span className="flex items-center gap-2">
                    <RadioGroup.Item
                      value="money"
                      data-testid="money"
                      id="money"
                      className="dark:bg-gray-300 w-4 h-4 bg-zinc-700 rounded-full shadow-md"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:block after:w-2 after:h-2 after:rounded-full after:bg-green-500" />
                    </RadioGroup.Item>
                    <label
                      htmlFor="money"
                      className="dark:text-zinc-300 text-zinc-700"
                    >
                      Dinheiro
                    </label>
                  </span>

                  <span className="flex items-center gap-2">
                    <RadioGroup.Item
                      value="card"
                      id="card"
                      data-testid="card"
                      className="dark:bg-gray-300 w-4 h-4 rounded-full shadow-md bg-zinc-700"
                    >
                      <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:block after:w-2 after:h-2 after:rounded-full after:bg-green-500" />
                    </RadioGroup.Item>
                    <label
                      htmlFor="card"
                      className="dark:text-zinc-300 text-zinc-700"
                    >
                      Cartão
                    </label>
                  </span>
                </RadioGroup.Root>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="iof"
                    className="dark:text-zinc-300 text-zinc-700"
                  >
                    IOF
                  </label>
                  <div className="flex items-center gap-2 rounded-lg border dark:border-zinc-300 border-zinc-700 px-3 py-2 shadow-sm">
                    <BadgePercent className="h-4 w-4 dark:text-zinc-400 text-zinc-500" />
                    <input
                      className="border-0 bg-transparent p-0 text-zinc-600 outline-none dark:text-zinc-400"
                      id="iof"
                      readOnly
                      value={
                        field.value === 'money'
                          ? IOFCachePerCentValue.toLocaleString(undefined, {
                              maximumFractionDigits: 2
                            })
                          : IOFCreditCardPerCentValue.toLocaleString(
                              undefined,
                              { maximumFractionDigits: 2 }
                            )
                      }
                    />
                  </div>
                </div>
              </div>
            )
          }}
        />

        {/* Quotation */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="quotation"
            className="dark:text-zinc-300 text-zinc-700"
          >
            Cotação do dólar em reais
          </label>

          <div className="flex items-center gap-2 rounded-lg border dark:border-zinc-300 border-zinc-700 px-3 py-2 shadow-sm">
            <BadgeDollarSign className="h-4 w-4 dark:text-zinc-400 text-zinc-500" />
            <input
              className="flex-1 border-0 bg-transparent p-0 text-zinc-600 outline-none dark:text-zinc-400 "
              id="quotation"
              readOnly
              value={parseFloat(data?.data.USDBRL.bid).toLocaleString(
                undefined,
                {
                  currency: 'BRL',
                  maximumFractionDigits: 2
                }
              )}
            />
          </div>
        </div>

        {/* Button */}
        <div className="flex cursor-pointer items-center justify-center lg:flex-row">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 w-full mt-4 rounded-lg text-zinc-300 hover:cursor-pointer border-none px-3 py-2 shadow-sm"
          >
            Converter
          </button>
        </div>
      </form>
    </main>
  )
}
