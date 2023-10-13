import { useCurrentConversion } from '../store/slices/conversionResult'
import { useNavigate } from 'react-router-dom'
import { priceFormatter } from '../utils/formatter'

export const Result = () => {
  const { result, dollarQuotation, type, stateTax } = useCurrentConversion()
  const navigate = useNavigate()
  return (
    <main className="flex-col mt-[3.25rem]">
      <button onClick={() => navigate('/')}>Voltar</button>
      <p>O Resultado do cálculo é</p>
      <div>{priceFormatter.format(result)}</div>
      <div className="flex flex-col">
        <small>
          Compra no {type === 'money' ? 'dinheiro' : 'cartão'} e taxa de{' '}
          {stateTax}%
        </small>
        <small>
          Cotação do dólar: $1 = {priceFormatter.format(dollarQuotation)}{' '}
        </small>
      </div>
    </main>
  )
}
