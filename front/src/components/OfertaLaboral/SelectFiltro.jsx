import React from "react";

export default function SelectFiltro({ label, value, onChange, options }) {
  return (
    <div className="w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 font-semibold border-none rounded-lg text-[16px] bg-white text-gray-700"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
