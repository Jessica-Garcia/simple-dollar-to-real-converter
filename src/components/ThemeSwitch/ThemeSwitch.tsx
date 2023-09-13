import * as Switch from "@radix-ui/react-switch";

import { SunIcon, Moon } from "lucide-react";

interface ThemeSwitchProps {
  themeSwitcher: () => void;
}

export const ThemeSwitch = ({ themeSwitcher }: ThemeSwitchProps) => {
  return (
    <div className="flex items-start gap-1 ">
      <Switch.Root
        onCheckedChange={themeSwitcher}
        id="mode"
        className='relative flex h-7 w-14 items-center rounded-full border-4 border-green-600 border-solid shadow-sm bg-blue-950 data-[state="checked"]:bg-zinc-300'
      >
        <SunIcon className="h-4 dark:text-yellow-700" />
        <Switch.Thumb className='block absolute z-50 h-5 w-5 translate-x-0 rounded-full bg-zinc-300  transition-transform data-[state="checked"]:bg-zinc-700 data-[state="checked"]:translate-x-7' />
        <Moon className="text-zinc-200 h-4 " />
      </Switch.Root>
    </div>
  );
};
