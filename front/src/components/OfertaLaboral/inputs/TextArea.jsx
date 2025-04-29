function TextArea({ name, label, register, errors, rows = 4, ...props }) {
  return (
    <div className="w-full">
      <label className="block mb-1 text-left text-[17px] font-semibold text-[#333]">
        {label}
      </label>

      <textarea
        {...register(name)}
        rows={rows}
        {...props}
        className={`w-full  focus:border-[#25BF7B] focus:border-1 transition-all duration-200
          hover:border-gray-600 text-[#111] rounded-md bg-white border px-4 py-2 text-[16px] font-sans focus:outline-none focus:ring-1 focus:ring-[#25BF7B]  ${
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

export default TextArea;
