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
        className='relative flex h-5 w-12 items-center rounded-full shadow-sm bg-zinc-600 data-[state="checked"]:bg-zinc-300'
      >
        <SunIcon className="h-4 dark:text-zinc-500" />
        <Switch.Thumb className='block absolute z-50 h-5 w-5 translate-x-0 rounded-full bg-zinc-400  transition-transform data-[state="checked"]:bg-zinc-700 data-[state="checked"]:translate-x-7' />
        <Moon className="text-zinc-300 h-4 " />
      </Switch.Root>
    </div>
  );
};
