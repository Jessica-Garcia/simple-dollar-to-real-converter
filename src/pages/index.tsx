import * as z from "zod";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../lib/axios";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store";
import {
  converter,
  useCurrentConversion,
} from "../store/slices/conversionResult";
import { BadgePercent, BadgeDollarSign } from "lucide-react";

const newConversionFormSchema = z.object({
  dollarQuantity: z.number().positive(),
  stateTax: z.number().positive(),
  type: z.enum(["money", "card"]),
});

type NewConversionFormInputs = z.infer<typeof newConversionFormSchema>;

export const Home = () => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NewConversionFormInputs>({
    resolver: zodResolver(newConversionFormSchema),
    defaultValues: {
      type: "money",
    },
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { IOFCache, IOFCreditCard } = useCurrentConversion();

  const IOFCachePerCentValue = IOFCache * 100;
  const IOFCreditCardPerCentValue = IOFCreditCard * 100;

  const { data /* isLoading, error */ } = useQuery(
    "quotationDollarInReais",
    () => {
      return api.get("/last/USD-BRL");
    },
    {
      retry: 3,
      // refetchInterval: 60000,
    },
  );

  const handleNewConversion = async (
    conversionData: NewConversionFormInputs,
  ) => {
    const { dollarQuantity, stateTax, type } = conversionData;
    const dollarQuotation = parseFloat(data?.data.USDBRL.bid);

    dispatch(converter({ dollarQuantity, stateTax, type, dollarQuotation }));
    navigate("/result");
    reset();
  };

  return (
    <main className="flex justify-center max-w-screen dark:text-zinc-300">
      <form
        onSubmit={handleSubmit(handleNewConversion)}
        className="flex items-center space-y-3 flex-col border-solid w-full px-4 py-8 border-green-400 border-2 rounded-xl"
        autoComplete="off"
      >
        <span className="flex flex-col w-4/5">
          <label htmlFor="dollar" className="">
            Valor em dólar
          </label>
          <div className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
            <BadgeDollarSign className="h-4 w-4 text-zinc-400" />
            <input
              className="border-0 bg-transparent p-0 text-zinc-900 placeholder-zinc-600 placeholder:text-sm outline-none dark:text-zinc-100 dark:placeholder-zinc-400"
              id="dollar"
              type="number"
              {...register("dollarQuantity", {
                valueAsNumber: true,
                required: true,
              })}
              placeholder="0"
              min={0.01}
              step={0.01}
              autoFocus
            />
          </div>
        </span>
        <span className="flex flex-col w-4/5">
          <label htmlFor="tax">Taxa do estado</label>
          <div className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
            <BadgePercent className="h-4 w-4 text-zinc-400" />
            <input
              className="flex-1 placeholder:text-sm border-0 bg-transparent p-0 text-zinc-900 placeholder-zinc-600 outline-none dark:text-zinc-100 dark:placeholder-zinc-400"
              id="tax"
              type="number"
              min={0}
              step={0.01}
              placeholder="0"
              {...register("stateTax", {
                valueAsNumber: true,
                required: true,
              })}
            />
          </div>
        </span>
        <span className="w-4/5">
          <h1>Tipo de compra</h1>
          <Controller
            control={control}
            name="type"
            render={({ field }) => {
              return (
                <>
                  <RadioGroup.Root
                    className="flex gap-3"
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <span className="flex items-center gap-1">
                      <RadioGroup.Item
                        value="money"
                        data-testid="money"
                        id="money"
                        className="bg-gray-300 w-4 h-4 rounded-full shadow-md"
                      >
                        <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:block after:w-2 after:h-2 after:rounded-full after:bg-green-500" />
                      </RadioGroup.Item>
                      <label htmlFor="money" className="">
                        Dinheiro
                      </label>
                    </span>

                    <span className="flex items-center gap-1">
                      <RadioGroup.Item
                        value="card"
                        id="card"
                        data-testid="card"
                        className="bg-gray-300 w-4 h-4 rounded-full shadow-md"
                      >
                        <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:block after:w-2 after:h-2 after:rounded-full after:bg-green-500" />
                      </RadioGroup.Item>
                      <label htmlFor="card" className="">
                        Cartão
                      </label>
                    </span>
                  </RadioGroup.Root>

                  <span className="flex flex-col">
                    <label htmlFor="iofcache">IOF</label>
                    <div className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
                      <BadgePercent className="h-4 w-4 text-zinc-400" />
                      <input
                        className="flex-1 border-0 bg-transparent p-0 outline-none text-zinc-400 text-sm"
                        id="iofcache"
                        readOnly
                        value={
                          field.value === "money"
                            ? IOFCachePerCentValue.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })
                            : IOFCreditCardPerCentValue.toLocaleString(
                                undefined,
                                { maximumFractionDigits: 2 },
                              )
                        }
                      />
                    </div>
                  </span>
                </>
              );
            }}
          />
        </span>
        <span className="flex flex-col w-4/5">
          <label htmlFor="quotation">Cotação do dólar em reais</label>
          <div className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
            <BadgeDollarSign className="h-4 w-4 text-zinc-400" />
            <input
              className="flex-1 border-0 bg-transparent p-0 outline-none text-zinc-400 text-sm"
              id="quotation"
              readOnly
              value={parseFloat(data?.data.USDBRL.bid).toLocaleString(
                undefined,
                { currency: "BRL", maximumFractionDigits: 2 },
              )}
            />
          </div>
        </span>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-500 w-36"
        >
          Converter
        </button>
      </form>
    </main>
  );
};
