import { useEffect, useState } from "react";
import { ThemeSwitch } from "../ThemeSwitch/ThemeSwitch";

interface HeaderThemeSwitchProps {
  onThemeSwitcher: () => void;
}

export const Header = ({ onThemeSwitcher }: HeaderThemeSwitchProps) => {
  const realTime = () => {
    return new Date().toLocaleTimeString(undefined, {
      hour: "2-digit",
      hour12: false,
      minute: "2-digit",
      timeZone: "UTC",
      timeZoneName: "short",
    });
  };

  const currentDate = () => {
    return new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "2-digit",
      timeZone: "UTC",
    });
  };

  const [formatedTime, setFormatedTime] = useState(realTime);
  const [formatedDate, setFormatedDate] = useState(currentDate);

  useEffect(() => {
    const time = setInterval(() => {
      setFormatedTime(realTime);
    }, 1000);

    return () => clearInterval(time);
  }, []);

  useEffect(() => {
    setFormatedDate(currentDate);
  }, [formatedTime]);

  return (
    <header className="flex w-full fixed py-8 px-5 items-center top-0 right-0 left-0 dark:bg-zinc-800 bg-slate-200 z-50 justify-center">
      <div className="flex flex-col w-11/12 max-w-xl lg:max-w-2xl gap-6 justify-between">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span>
              <strong className="text-5xl text-green-500">$</strong>
              <strong className="text-green-500 text-xl">imple</strong>
            </span>
            <span className="block self-end text-green-400 text-xs">
              Currency
            </span>
          </div>
          <ThemeSwitch themeSwitcher={onThemeSwitcher} />
        </div>
        <div className="flex dark:text-zinc-300 gap-2 items-center self-end">
          <small data-testid="date" className="text-xs">
            {formatedDate}
          </small>
          <span className="h-3 w-[2px] dark:bg-zinc-600" />
          <small data-testid="time" className="text-xs">
            {formatedTime}
          </small>
        </div>
      </div>
    </header>
  );
};
