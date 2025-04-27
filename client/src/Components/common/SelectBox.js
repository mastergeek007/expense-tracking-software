import { useEffect, useState } from "react";

export default function SelectBox({ type = "year", value, onChange }) {
  const currentYear = new Date().getFullYear();
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (type === "year") {
      const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
      setOptions(years);
    } else if (type === "month") {
      const months = Array.from({ length: 12 }, (_, i) => i + 1);
      setOptions(months);
    }
  }, [type, currentYear]);

  return (
    <div className="relative">
      <select
        value={value} // bind the selected value here
        onChange={(e) => onChange(Number(e.target.value))}
        className="border border-primary w-32 p-1 rounded"
      >
        {options.map((val) => (
          <option key={val} value={val}>
            {type === "month"
              ? new Date(0, val - 1).toLocaleString('default', { month: 'long' })
              : val}
          </option>
        ))}
      </select>
    </div>
  );
}
