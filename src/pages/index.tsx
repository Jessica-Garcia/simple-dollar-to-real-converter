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
    <main className="flex relative top-[220px] mr-auto ml-auto w-11/12 max-w-xl lg:max-w-2xl justify-center dark:text-zinc-300">
      <form
        onSubmit={handleSubmit(handleNewConversion)}
        className="flex items-center space-y-6 mb-5 flex-col border-solid w-full py-8 border-green-400 border-2 rounded-xl"
        autoComplete="off"
      >
        {/* insert infos */}
        <div className="w-4/5 flex justify-center flex-col gap-4">
          {/* dollar value */}

          <label htmlFor="dollar" className="">
            Valor em dólar
          </label>

          <div className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
            <BadgeDollarSign className="h-4 w-4 text-zinc-400" />
            <input
              className="border-0 bg-transparent p-0 text-zinc-900 placeholder-zinc-600 outline-none dark:text-zinc-100 dark:placeholder-zinc-400"
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

          {/* state tax */}

          <label htmlFor="tax">Taxa do estado</label>
          <div className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
            <BadgePercent className="h-4 w-4 text-zinc-400" />
            <input
              className="flex-1 border-0 bg-transparent p-0 text-zinc-900 placeholder-zinc-600 outline-none dark:text-zinc-100 dark:placeholder-zinc-400"
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
        </div>
        {/* dinamic infos */}
        <div className="flex w-4/5 justify-center flex-col gap-4">
          <h1>Tipo de compra</h1>
          <Controller
            control={control}
            name="type"
            render={({ field }) => {
              return (
                <>
                  <RadioGroup.Root
                    className="flex flex-col gap-4 flex-wrap"
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <span className="flex items-center gap-2">
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

                    <span className="flex items-center gap-2">
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

                  <label htmlFor="iof">IOF</label>
                  <div className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
                    <BadgePercent className="h-4 w-4 text-zinc-400" />
                    <input
                      className="border-0 bg-transparent p-0 text-zinc-600  outline-none dark:text-zinc-400"
                      id="iof"
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
                </>
              );
            }}
          />

          {/* Quotation */}

          <label htmlFor="quotation">Cotação do dólar em reais</label>
          <div className="flex items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
            <BadgeDollarSign className="h-4 w-4 text-zinc-400" />
            <input
              className="flex-1 border-0 bg-transparent p-0 text-zinc-600 outline-none dark:text-zinc-400 "
              id="quotation"
              readOnly
              value={parseFloat(data?.data.USDBRL.bid).toLocaleString(
                undefined,
                { currency: "BRL", maximumFractionDigits: 2 },
              )}
            />
          </div>
        </div>
        {/* Button */}
        <div className="flex w-4/5 items-center justify-center lg:flex-row gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 w-full rounded-lg border-none px-3 py-2 shadow-sm"
          >
            Converter
          </button>
        </div>
      </form>
    </main>
  );
};
