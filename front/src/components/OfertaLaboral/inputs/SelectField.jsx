import { Controller } from "react-hook-form";

function SelectField({ name, label, control, errors, options = [], ...props }) {
  return (
    <div className="w-full">
      <label className="block mb-1 text-left text-[17px] font-semibold text-[#333]">
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <select
              {...field}
              {...props}
              className={`w-full transition-all duration-200
          hover:border-gray-600 rounded-md text-[#111] bg-white border px-4 py-2 text-[15px] font-sans focus:outline-none focus:ring-1 focus:ring-[#25BF7B] ${
            errors?.[name]
              ? "border-red-500"
              : "border-gray-300 focus:border-[#25BF7B]"
          }`}
            >
              <option value="">Selecciona una opción</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors?.[name] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[name].message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}

export default SelectField;
