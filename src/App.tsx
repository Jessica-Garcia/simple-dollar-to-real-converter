import { Router } from './Router'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store'
import './styles/global.css'

export function App() {
  return (
    <ReduxProvider store={store}>
      <Router />
    </ReduxProvider>
  )
}
