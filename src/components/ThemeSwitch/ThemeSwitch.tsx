import * as Switch from '@radix-ui/react-switch'

import { SunIcon, Moon } from 'lucide-react'

interface ThemeSwitchProps {
  themeSwitcher: () => void
}

export const ThemeSwitch = ({ themeSwitcher }: ThemeSwitchProps) => {
  return (
    <div className="flex items-start gap-1 ">
      <Switch.Root
        onCheckedChange={themeSwitcher}
        id="mode"
        className='relative flex h-4 w-8 items-center rounded-full border-2 border-green-600 border-solid shadow-sm bg-gray-950 data-[state="checked"]:bg-zinc-300'
      >
        <SunIcon className="h-3 dark:text-zinc-950" />
        <Switch.Thumb className='block absolute z-50 h-3 w-3 translate-x-0 rounded-full bg-zinc-300  transition-transform data-[state="checked"]:bg-gray-950 data-[state="checked"]:translate-x-4' />
        <Moon className="text-zinc-200 h-3" />
      </Switch.Root>
    </div>
  )
}
