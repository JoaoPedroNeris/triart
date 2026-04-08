"use client";

import { useState } from "react";
import { coordsToPoints, getPolygonCenter, getStatusColor, getStatusHoverColor } from "@/lib/utils";
import { StandStatus } from "@/types/map";

interface StandPolygonProps {
  id: number;
  coords: number[];
  label: string;
  status: StandStatus;
  isSelected: boolean;
  onClick: (id: number) => void;
}

export function StandPolygon({ id, coords, label, status, isSelected, onClick }: StandPolygonProps) {
  const [hovered, setHovered] = useState(false);
  const center = getPolygonCenter(coords);
  const points = coordsToPoints(coords);

  const fillColor = hovered || isSelected
    ? getStatusHoverColor(status)
    : getStatusColor(status);

  const strokeColor = isSelected
    ? "#2BA89D"
    : hovered
    ? "#ffffff"
    : "rgba(255,255,255,0.3)";

  const strokeWidth = isSelected ? 4 : hovered ? 3 : 1;

  return (
    <g
      className="cursor-pointer"
      style={{ pointerEvents: "auto" }}
      onClick={() => onClick(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <polygon
        points={points}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        style={{ transition: "fill 0.2s ease, stroke 0.2s ease, stroke-width 0.2s ease" }}
      />
      {/* Stand number label */}
      <text
        x={center.x}
        y={center.y}
        textAnchor="middle"
        dominantBaseline="central"
        fill={hovered || isSelected ? "#ffffff" : "rgba(255,255,255,0.8)"}
        fontSize="28"
        fontWeight="600"
        fontFamily="Inter, system-ui, sans-serif"
        style={{
          pointerEvents: "none",
          textShadow: "0 1px 3px rgba(0,0,0,0.5)",
          transition: "fill 0.2s ease",
        }}
      >
        {id}
      </text>
      {/* Tooltip on hover */}
      {hovered && label && (
        <>
          <rect
            x={center.x - 80}
            y={center.y - 55}
            width={160}
            height={30}
            rx={8}
            fill="rgba(0,0,0,0.8)"
            style={{ pointerEvents: "none" }}
          />
          <text
            x={center.x}
            y={center.y - 40}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#ffffff"
            fontSize="16"
            fontWeight="500"
            fontFamily="Inter, system-ui, sans-serif"
            style={{ pointerEvents: "none" }}
          >
            {label.length > 18 ? label.substring(0, 18) + "..." : label}
          </text>
        </>
      )}
    </g>
  );
}
