import { ThemeSwitch } from '../ThemeSwitch/ThemeSwitch'
import { useEffect, useState } from 'react'

interface HeaderThemeSwitchProps {
  onThemeSwitcher: () => void
}

export const Header = ({ onThemeSwitcher }: HeaderThemeSwitchProps) => {
  const realTime = () => {
    return new Date().toLocaleTimeString(undefined, {
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      timeZone: 'UTC',
      timeZoneName: 'short'
    })
  }

  const currentDate = () => {
    return new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      timeZone: 'UTC'
    })
  }

  const [formatedTime, setFormatedTime] = useState(realTime)
  const [formatedDate, setFormatedDate] = useState(currentDate)

  useEffect(() => {
    const time = setInterval(() => {
      setFormatedTime(realTime)
    }, 1000)

    return () => clearInterval(time)
  }, [])

  useEffect(() => {
    setFormatedDate(currentDate)
  }, [formatedTime])

  return (
    <header className="flex justify-between w-full items-center p-6 pb-3 bg-zinc-300 dark:bg-zinc-950">
      <div className="flex flex-col">
        <span>
          <strong className="text-5xl text-green-600 dark:text-green-500">
            $
          </strong>
          <strong className="text-green-600 text-xl dark:text-green-500">
            imple
          </strong>
        </span>
        <span className="block self-end text-green-600 text-xs dark:text-green-500">
          Converter
        </span>
      </div>
      <div className="flex flex-col items-end space-y-6">
        <ThemeSwitch themeSwitcher={onThemeSwitcher} />
        <div className="flex items-center flex-wrap space-x-1">
          <small
            data-testid="date"
            className="text-xs dark:text-zinc-300 text-zinc-900"
          >
            {formatedDate}
          </small>
          <span className="h-3 w-[2px] bg-zinc-600 dark:bg-zinc-400" />
          <small
            data-testid="time"
            className="text-xs dark:text-zinc-300  text-zinc-900"
          >
            {formatedTime}
          </small>
        </div>
      </div>
    </header>
  )
}
