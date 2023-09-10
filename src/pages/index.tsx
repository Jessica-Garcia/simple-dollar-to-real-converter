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
  useCurrentConversionResult,
} from "../store/slices/conversionResult";
import { DollarSignIcon, Percent } from "lucide-react";

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

  const currentConversionResult = useCurrentConversionResult();

  const { data /* isLoading, error */ } = useQuery(
    "quotationDollarInReais",
    () => {
      return api.get("/last/USD-BRL");
    },
    {
      retry: 3,
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
    <main className="flex">
      <form
        onSubmit={handleSubmit(handleNewConversion)}
        className="flex flex-col border-solid border-green-400 border-2"
        autoComplete="off"
      >
        <div className="flex">
          <span className="flex flex-col">
            <label htmlFor="dollar">Dollar</label>
            <div className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
              <DollarSignIcon className="h-4 w-4 text-zinc-400" />
              <input
                className="flex-1  border-0 bg-transparent p-0 text-zinc-900 placeholder-zinc-600 placeholder:text-sm outline-none dark:text-zinc-100 dark:placeholder-zinc-400"
                id="dollar"
                type="number"
                {...register("dollarQuantity", {
                  valueAsNumber: true,
                  required: true,
                })}
                placeholder="00.00"
                min={0.01}
                step={0.01}
                autoFocus
              />
            </div>
          </span>
          <span className="flex flex-col">
            <label htmlFor="tax">Taxa do estado</label>
            <div className="flex w-full items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 shadow-sm">
              <Percent className="h-4 w-4 text-zinc-400" />
              <input
                className="flex-1 placeholder:text-sm border-0 bg-transparent p-0 text-zinc-900 placeholder-zinc-600 outline-none dark:text-zinc-100 dark:placeholder-zinc-400"
                id="tax"
                type="number"
                min={0.01}
                step={0.01}
                placeholder="00.00"
                {...register("stateTax", {
                  valueAsNumber: true,
                  required: true,
                })}
              />
            </div>
          </span>
        </div>

        <h1>Tipo de compra</h1>
        <Controller
          control={control}
          name="type"
          render={({ field }) => {
            return (
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
            );
          }}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-500 w-36"
        >
          Converter
        </button>
      </form>
      <div>{currentConversionResult}</div>
    </main>
  );
};
