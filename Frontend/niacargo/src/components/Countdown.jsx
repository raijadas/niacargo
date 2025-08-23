import { useEffect, useState } from "react";

export default function Countdown({ target }) {
  const [left, setLeft] = useState(() => new Date(target) - Date.now());

  useEffect(() => {
    const id = setInterval(() => setLeft(new Date(target) - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (left <= 0) return <span className="font-semibold text-green-600">Milestone reached!</span>;

  const s = Math.floor(left / 1000);
  const days = Math.floor(s / 86400);
  const hrs = Math.floor((s % 86400) / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  const Tile = ({ label, value }) => (
    <div className="px-4 py-2 bg-white/70 dark:bg-white/10 rounded-xl text-center">
      <div className="text-2xl font-bold">{String(value).padStart(2,'0')}</div>
      <div className="text-xs uppercase tracking-wide">{label}</div>
    </div>
  );

  return (
    <div className="flex gap-3">{/* responsive on mobile */}
      <Tile label="Days" value={days} />
      <Tile label="Hours" value={hrs} />
      <Tile label="Mins" value={mins} />
      <Tile label="Secs" value={secs} />
    </div>
  );
}
