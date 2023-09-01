import { useEffect, useState } from "react";

export const Header = () => {
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
    setInterval(() => {
      setFormatedTime(realTime);
    }, 1000);
  }, []);

  useEffect(() => {
    setFormatedDate(currentDate);
  }, [formatedTime]);

  return (
    <header className="flex">
      <div className="">
        <strong className="">$</strong>
        <strong className="">imple</strong>
        <span className="block">Currency</span>
      </div>
      <div>
        <div className="flex gap-2 items-center">
          <span data-testid="date" className="">
            {formatedDate}
          </span>
          <span className="h-3 w-[2px] bg-zinc-600" />
          <span data-testid="time" className="">
            {formatedTime}
          </span>
        </div>
        <small>Dados de câmbio disponibilizados pela Morningstar</small>
      </div>
    </header>
  );
};
