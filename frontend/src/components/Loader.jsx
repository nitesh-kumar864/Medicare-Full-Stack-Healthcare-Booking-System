import React from "react";
import { Loader2, Sparkles } from "lucide-react";

const Loader = ({
  title = "Loading application...",
  subtitle = "Waking up the server… first load may take up to 30–45 seconds."
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />

      <div className="relative flex flex-col items-center gap-6 z-10 p-8 rounded-2xl">

        {/* Spinner Container */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
          <Loader2 className="h-14 w-14 text-blue-600 animate-spin relative z-10" strokeWidth={2.5} />

          {/*  Central icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-ping" />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-slate-800 tracking-tight">
            {title}
          </h3>
          <p className="text-slate-500 text-sm max-w-[250px] mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Loading Progress Indicator  */}
        <div className="flex gap-1 mt-2">
          <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-1.5 w-1.5 bg-blue-600 rounded-full animate-bounce"></div>
        </div>

      </div>
    </div>
  );
};

// Button Loader
export const ButtonLoader = () => {
  return (
    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
  );
};


export default Loader;