import { useEffect, useState } from "react";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Harga Masa" },
    {
      name: "description",
      content: "See how many hours you need to work to buy something",
    },
  ];
}

export default function Home() {
  const [itemPrice, setItemPrice] = useState("");
  const [monthlySalary, setMonthlySalary] = useState("5000");
  const [workWeek, setWorkWeek] = useState(45);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const salary = params.get("salary");
    const week = params.get("week");
    if (salary) setMonthlySalary(salary);
    if (week) setWorkWeek(Number(week));
  }, []);

  const monthlyHours = (workWeek * 52) / 12;

  const price = parseFloat(itemPrice.replace(/,/g, "")) || 0;
  const salaryNum = parseFloat(monthlySalary) || 0;
  const hourlyRate = salaryNum > 0 ? salaryNum / monthlyHours : 0;
  const hoursNeeded = price > 0 && hourlyRate > 0 ? price / hourlyRate : 0;

  let wholeHours = Math.floor(hoursNeeded);
  let minutes = Math.round((hoursNeeded - wholeHours) * 60);
  if (minutes === 60) {
    wholeHours += 1;
    minutes = 0;
  }

  const workDays = hoursNeeded / 8;
  const workDaysPerMonth = (workWeek / 8) * (52 / 12);
  const workDaysPerYear = workDaysPerMonth * 12;

  const formatNumber = (d: number) => {
    if (d % 1 < 0.05) return Math.round(d).toString();
    return d.toFixed(1);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemPrice(e.target.value.replace(/[^0-9.]/g, ""));
  };

  const handleSaveLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("salary", monthlySalary);
    url.searchParams.set("week", String(workWeek));
    window.history.replaceState(null, "", url.toString());
    await navigator.clipboard.writeText(url.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-sm mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-10">
          Harga Masa
        </h1>

        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-widest">
            Item price
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl text-gray-300 font-light">
              $
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={itemPrice}
              onChange={handlePriceChange}
              placeholder="0"
              className="w-full pl-11 pr-4 py-4 text-3xl font-light text-gray-900 bg-gray-50 rounded-xl border border-gray-200 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-400 transition-all"
            />
          </div>
        </div>

        <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-center">
            <div className="text-5xl font-light text-gray-900 tabular-nums">
              {wholeHours > 0 && `${wholeHours}h`}
              {wholeHours > 0 && minutes > 0 && " "}
              {minutes > 0 && `${minutes}m`}
              {hoursNeeded === 0 && "0m"}
              {hoursNeeded > 0 && wholeHours === 0 && minutes === 0 && "<1m"}
            </div>
            {hoursNeeded > 0 && (
              <div className="mt-2 text-sm text-gray-500">
                {workDays < 1
                  ? "Less than a work day"
                  : workDays < workDaysPerMonth
                    ? `\u2248 ${formatNumber(workDays)} work day${Math.round(workDays) !== 1 ? "s" : ""}`
                    : workDays < workDaysPerYear
                      ? `\u2248 ${formatNumber(workDays / workDaysPerMonth)} month${Math.round(workDays / workDaysPerMonth) !== 1 ? "s" : ""}`
                      : `\u2248 ${formatNumber(workDays / workDaysPerYear)} year${Math.round(workDays / workDaysPerYear) !== 1 ? "s" : ""}`}
              </div>
            )}
          </div>
        </div>

        {salaryNum > 0 && (
          <div className="mt-3 text-center">
            <span className="text-xs text-gray-300">
              Hourly rate: ${hourlyRate.toFixed(2)}
            </span>
          </div>
        )}

        <details className="mt-12 group">
          <summary className="text-xs text-gray-300 cursor-pointer hover:text-gray-500 transition-colors select-none list-none flex items-center gap-1">
            <svg
              className="w-3 h-3 text-gray-300 group-open:rotate-90 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            Settings
          </summary>
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Monthly salary
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-300">
                  $
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={monthlySalary}
                  onChange={(e) =>
                    setMonthlySalary(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-full pl-7 pr-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-400 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Work week
              </label>
              <select
                value={workWeek}
                onChange={(e) => setWorkWeek(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-400 transition-all appearance-none"
              >
                <option value={40}>40 hours per week</option>
                <option value={45}>45 hours per week</option>
              </select>
            </div>
            <button
              onClick={handleSaveLink}
              className="w-full px-3 py-2 text-sm text-gray-400 bg-gray-50 rounded-lg border border-gray-200 hover:text-gray-600 hover:border-gray-300 transition-colors"
            >
              {copied ? "Copied!" : "Save link"}
            </button>
          </div>
        </details>
      </div>
    </div>
  );
}
