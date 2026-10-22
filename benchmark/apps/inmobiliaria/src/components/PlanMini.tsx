"use client";

import { motion } from "motion/react";
import type { PlanRoom } from "@/lib/properties";

const center = (r: PlanRoom) => [r.x + r.w / 2, r.y + r.h / 2] as const;

/** Planta con "estás acá": resalta el ambiente actual y dibuja el trayecto desde el anterior. */
export default function PlanMini({
  plan,
  current,
  previous,
  onSelect,
  dark = false,
  showM2 = false,
  className = "",
}: {
  plan: PlanRoom[];
  current?: string;
  previous?: string;
  onSelect?: (id: string) => void;
  dark?: boolean;
  showM2?: boolean;
  className?: string;
}) {
  const cur = plan.find((r) => r.id === current);
  const prev = plan.find((r) => r.id === previous);
  const line = dark ? "#f4f1ea" : "#14130f";

  return (
    <svg viewBox="-1 -1 102 62" className={className}>
      {plan.map((r) => {
        const active = r.id === current;
        return (
          <g key={r.id} onClick={() => onSelect?.(r.id)} className={onSelect ? "cursor-pointer" : ""}>
            <motion.rect
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              rx={0.6}
              animate={{
                fill: active ? "rgba(168,131,75,0.55)" : dark ? "rgba(244,241,234,0.06)" : "rgba(20,19,15,0.03)",
              }}
              transition={{ duration: 0.5 }}
              stroke={line}
              strokeOpacity={0.55}
              strokeWidth={0.5}
            />
            <text
              x={r.x + r.w / 2}
              y={r.y + r.h / 2 + (showM2 ? -1 : 1)}
              textAnchor="middle"
              fontSize={r.w < 22 ? 2.6 : 3.2}
              fill={line}
              opacity={active ? 1 : 0.65}
              className="pointer-events-none select-none"
            >
              {r.name}
            </text>
            {showM2 && (
              <text
                x={r.x + r.w / 2}
                y={r.y + r.h / 2 + 3.6}
                textAnchor="middle"
                fontSize={2.4}
                fill={line}
                opacity={0.5}
                className="pointer-events-none select-none"
              >
                {r.m2} m²
              </text>
            )}
          </g>
        );
      })}

      {cur && prev && cur.id !== prev.id && (
        <motion.path
          key={`${prev.id}-${cur.id}`}
          d={`M${center(prev).join(" ")} L${center(cur).join(" ")}`}
          stroke="#a8834b"
          strokeWidth={0.6}
          strokeDasharray="1.4 1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      )}

      {cur && (
        <motion.g animate={{ x: center(cur)[0], y: center(cur)[1] - 5 }} transition={{ type: "spring", stiffness: 120, damping: 16 }}>
          <circle r={2.2} fill="#a8834b" className="pulse-ring" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          <circle r={1.3} fill="#a8834b" stroke="#fff" strokeWidth={0.4} />
        </motion.g>
      )}
    </svg>
  );
}
