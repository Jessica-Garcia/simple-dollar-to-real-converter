import * as z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { api } from "../lib/axios";
import { useQuery } from "react-query";

const newConversionFormSchema = z.object({
  dollarQuantity: z.number(),
  stateTax: z.number(),
  type: z.enum(["money", "card"]),
});

type NewConversionFormInputs = z.infer<typeof newConversionFormSchema>;

export const Home = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting },
    // reset,
  } = useForm<NewConversionFormInputs>({
    resolver: zodResolver(newConversionFormSchema),
    defaultValues: {
      type: "money",
    },
  });

  const { data, isLoading, error } = useQuery(
    "quotationDollarInReais",
    () => {
      return api.get("https://economia.awesomeapi.com.br/last/USD-BRL");
    },
    {
      retry: 3,
      refetchOnWindowFocus: true,
      refetchInterval: 5000,
    },
  );

  const IOFCache = 0.011;
  const IOFCreditCard = 0.0538;
  const dollarQuotation = parseFloat(data?.data.USDBRL.bid);

  const handleNewConversion = async (
    conversionData: NewConversionFormInputs,
  ) => {
    const { dollarQuantity, stateTax, type } = conversionData;

    const stateTaxPerCent = stateTax / 100;
    const stateTaxValue = dollarQuantity * stateTaxPerCent;
    const IOFCacheValue = dollarQuotation * IOFCache;
    const IOFCreditCardValue = dollarQuantity * IOFCreditCard;

    if (type === "money") {
      const conversionResult =
        (dollarQuantity + stateTaxValue) * (dollarQuotation + IOFCacheValue);
      console.log(conversionResult);
      return conversionResult;
    } else {
      const conversionResult =
        (dollarQuantity + stateTaxValue + IOFCreditCardValue) * dollarQuotation;
      console.log(conversionResult);
      return conversionResult;
    }
  };

  return (
    <main className="flex">
      <form
        onSubmit={handleSubmit(handleNewConversion)}
        className="flex flex-col border-solid border-green-400 border-2"
      >
        <div className="flex">
          <span className="flex flex-col">
            <label htmlFor="dollar">Dollar</label>
            <input
              type="number"
              id="dollar"
              placeholder="$"
              {...register("dollarQuantity", {
                valueAsNumber: true,
              })}
              required
            />
          </span>
          <span className="flex flex-col">
            <label htmlFor="tax">Taxa do estado</label>
            <input
              type="number"
              id="tax"
              placeholder="%"
              {...register("stateTax", { valueAsNumber: true })}
              required
            />
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
    </main>
  );
};
