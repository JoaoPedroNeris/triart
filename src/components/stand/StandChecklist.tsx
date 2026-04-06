"use client";

import { StandChecklist as ChecklistType } from "@/types/stand";
import { ChecklistCategory } from "./ChecklistCategory";
import { calculateCategoryProgress } from "@/lib/utils";
import { Zap, Hammer, Sofa, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface StandChecklistProps {
  checklist: ChecklistType;
  readOnly: boolean;
  onToggle: (category: keyof ChecklistType, itemId: string) => void;
}

const categories: {
  key: keyof ChecklistType;
  label: string;
  icon: React.ElementType;
}[] = [
  { key: "eletrica", label: "Eletrica", icon: Zap },
  { key: "marcenaria", label: "Marcenaria", icon: Hammer },
  { key: "tapecaria", label: "Tapecaria", icon: Sofa },
  { key: "comunicacaoVisual", label: "Comunicacao Visual", icon: Palette },
];

export function StandChecklist({ checklist, readOnly, onToggle }: StandChecklistProps) {
  const [expanded, setExpanded] = useState<string | null>("eletrica");

  return (
    <div className="space-y-3">
      {categories.map(({ key, label, icon: Icon }) => {
        const items = checklist[key];
        const progress = calculateCategoryProgress(items);
        const isOpen = expanded === key;

        return (
          <div key={key} className="rounded-xl border border-black/5 overflow-hidden">
            <button
              onClick={() => setExpanded(isOpen ? null : key)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-triart-gray-light/50 transition-apple"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-triart-green/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-4 h-4 text-triart-green" />
                </div>
                <span className="text-sm font-medium text-triart-black">{label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full",
                    progress === 100
                      ? "bg-green-100 text-green-700"
                      : progress > 0
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-500"
                  )}
                >
                  {progress}%
                </span>
                <svg
                  className={cn("w-4 h-4 text-triart-gray transition-transform duration-200", isOpen && "rotate-180")}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 border-t border-black/5 pt-3">
                <ChecklistCategory
                  items={items}
                  readOnly={readOnly}
                  onToggle={(itemId) => onToggle(key, itemId)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
