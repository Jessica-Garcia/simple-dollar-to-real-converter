import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header'
import { useState } from 'react'

export const DefaultLayout = () => {
  const [theme, setTheme] = useState('')

  const handleThemeSwitcher = () => {
    if (theme === '') {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    } else {
      setTheme('')
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center bg-zinc-300 dark:bg-zinc-950`}
    >
      <Header onThemeSwitcher={handleThemeSwitcher} />
      <Outlet />
    </div>
  )
}
