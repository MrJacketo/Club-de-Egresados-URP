import React from "react";

function InputField({ name, label, register, errors, type = "text", ...props }) {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="block mb-1 font-semibold text-left text-[#333] text-[17px] font-sans"
      >
        {label}
      </label>

      <input
        id={name}
        type={type}
        {...register(name)}
        className={`w-full rounded-lg text-black bg-white px-4 py-2 text-[15px] font-sans border focus:outline-none transition-all duration-200
          ${errors?.[name] ? "border-red-500" : "border-gray-300"}
          focus:border-[#25BF7B] focus:border-2
          hover:border-gray-600`}
        {...props}
      />

      {errors?.[name] && (
        <p className="text-sm text-red-500 mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}

export default InputField;

