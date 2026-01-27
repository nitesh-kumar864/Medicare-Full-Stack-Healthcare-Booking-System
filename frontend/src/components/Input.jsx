const Input = ({ icon: Icon, error, ...props }) => {
  return (
    <div className="mb-5 w-full">

      {/* Wrapper with dynamic red border */}
      <div
        className={`relative flex items-center rounded-xl overflow-hidden 
        border bg-white shadow-sm transition-all
        ${error ? "border-red-500" : "border-gray-300"}`}
      >
        {/* Icon */}
        <div className="absolute left-3 pointer-events-none">
          <Icon className="size-5 text-emerald-600" />
        </div>

        {/* Input Field */}
        <input
          {...props}
          className="w-full pl-11 pr-3 py-3 outline-none text-gray-800 placeholder-gray-500
          bg-white"
        />
      </div>

      {/* Error Text */}
      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
