"use client"

const SelectField = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error = null,
  type = "select",
}) => {
  if (type === "date") {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 bg-gray-500 text-white p-2 rounded">
          {label}
        </label>
        <input
          type="date"
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1 bg-gray-500 text-white p-2 rounded">{label}</label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default SelectField