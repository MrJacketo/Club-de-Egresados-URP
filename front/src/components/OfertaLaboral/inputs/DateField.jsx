function DateField({ name, label, register, errors, ...props }) {
  return (
    <div className="w-full">
      <label className="block mb-1 text-left text-[17px] font-semibold text-[#333]">
        {label}
      </label>

      <input
        type="date"
        {...register(name)}
        {...props}
        className={`w-full text-[#111] transition-all duration-200
          hover:border-gray-600 rounded-md bg-white border px-4 py-2 text-[15px] font-sans focus:outline-none focus:ring-1 focus:ring-[#25BF7B] ${
          errors?.[name]
            ? "border-red-500"
            : "border-gray-300 focus:border-[#25BF7B]"
        }`}
      />

      {errors?.[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}

export default DateField;
