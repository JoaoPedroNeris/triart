"use client";

import { cn } from "@/lib/utils";
import { Map, BarChart3 } from "lucide-react";

interface ViewToggleProps {
  view: "mapa" | "dashboard";
  onChange: (view: "mapa" | "dashboard") => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="relative flex items-center bg-triart-gray-light rounded-xl p-1 h-10">
      {/* Sliding pill */}
      <div
        className={cn(
          "absolute top-1 bottom-1 rounded-lg bg-white shadow-sm transition-all duration-300 ease-out",
          view === "mapa" ? "left-1 w-[calc(50%-4px)]" : "left-[calc(50%+2px)] w-[calc(50%-4px)]"
        )}
      />

      <button
        onClick={() => onChange("mapa")}
        className={cn(
          "relative z-10 flex items-center gap-1.5 px-4 h-full text-sm font-medium transition-colors duration-200 rounded-lg",
          view === "mapa" ? "text-triart-black" : "text-triart-gray hover:text-triart-black"
        )}
      >
        <Map className="w-4 h-4" />
        Mapa
      </button>

      <button
        onClick={() => onChange("dashboard")}
        className={cn(
          "relative z-10 flex items-center gap-1.5 px-4 h-full text-sm font-medium transition-colors duration-200 rounded-lg",
          view === "dashboard" ? "text-triart-black" : "text-triart-gray hover:text-triart-black"
        )}
      >
        <BarChart3 className="w-4 h-4" />
        Dashboard
      </button>
    </div>
  );
}
