const CardMetric = ({ title, value, percent, icon }) => {
  return (
    <div className="flex flex-col items-start bg-white flex-1 rounded-3xl shadow-md p-5 w-1/4 min-w-[200px]
                    cursor-pointer transform transition-all duration-200 hover:scale-102">
      <div className="mb-2">{icon}</div>
      <h3 className="text-base font-semibold">{title}</h3>
      <div className="flex justify-between items-end w-full">
        <p className="text-4xl font-bold">{value}</p>
        
      </div>
    </div>
  );
};

export default CardMetric;