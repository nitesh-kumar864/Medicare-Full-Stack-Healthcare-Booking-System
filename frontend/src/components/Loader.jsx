import React from "react";
import { Loader2 } from "lucide-react";

const Loader = ({
  title = "Loading",
  subtitle = "Please wait while we load the data.",
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50">
      <div className="absolute w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative flex flex-col items-center gap-5 px-8 py-6 rounded-2xl">
        <Loader2
          className="h-14 w-14 text-blue-600 animate-spin"
          strokeWidth={2.5}
        />

        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold text-slate-800">
            {title}
          </h3>
          <p className="text-sm text-slate-500 max-w-[260px]">
            {subtitle}
          </p>
        </div>

        <div className="flex gap-1 mt-1">
          <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};


export const ButtonLoader = () => {
  return (
    <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
  );
};

export default Loader;
