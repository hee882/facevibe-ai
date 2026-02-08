"use client";

import { motion } from "framer-motion";

interface RadarChartProps {
  data: { label: string; value: number }[];
  size?: number;
}

export default function RadarChart({ data, size = 220 }: RadarChartProps) {
  const center = size / 2;
  const radius = size / 2 - 36;
  const n = data.length;

  const getPoint = (index: number, percent: number) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const r = (percent / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const pointsToPath = (points: { x: number; y: number }[]) =>
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") +
    " Z";

  const gridLevels = [25, 50, 75, 100];
  const dataPoints = data.map((d, i) => getPoint(i, d.value));
  const dataPath = pointsToPath(dataPoints);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto"
    >
      {/* 배경 그리드 */}
      {gridLevels.map((level) => (
        <path
          key={level}
          d={pointsToPath(
            Array.from({ length: n }, (_, i) => getPoint(i, level))
          )}
          fill={level === 25 ? "rgba(124,58,237,0.03)" : "none"}
          stroke="#e5e7eb"
          strokeWidth={level === 100 ? 1.5 : 0.8}
          strokeDasharray={level < 100 ? "3 3" : undefined}
        />
      ))}

      {/* 축선 */}
      {data.map((_, i) => {
        const end = getPoint(i, 100);
        return (
          <line
            key={`axis-${i}`}
            x1={center}
            y1={center}
            x2={end.x}
            y2={end.y}
            stroke="#e5e7eb"
            strokeWidth={0.8}
          />
        );
      })}

      {/* 데이터 영역 */}
      <motion.path
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        d={dataPath}
        fill="rgba(124, 58, 237, 0.12)"
        stroke="#7c3aed"
        strokeWidth={2}
        style={{ transformOrigin: `${center}px ${center}px` }}
      />

      {/* 데이터 포인트 */}
      {dataPoints.map((p, i) => (
        <motion.circle
          key={`dot-${i}`}
          initial={{ opacity: 0, r: 0 }}
          animate={{ opacity: 1, r: 3.5 }}
          transition={{ delay: 0.8 + i * 0.05, duration: 0.3 }}
          cx={p.x}
          cy={p.y}
          fill="#7c3aed"
        />
      ))}

      {/* 라벨 */}
      {data.map((d, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const labelR = radius + 22;
        const x = center + labelR * Math.cos(angle);
        const y = center + labelR * Math.sin(angle);
        return (
          <text
            key={`label-${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={10}
            fill="#71717a"
            fontWeight={500}
          >
            {d.label}
          </text>
        );
      })}

      {/* 값 표시 (각 꼭짓점 옆) */}
      {data.map((d, i) => {
        const p = dataPoints[i];
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const offsetX = Math.cos(angle) * 14;
        const offsetY = Math.sin(angle) * 14;
        return (
          <text
            key={`val-${i}`}
            x={p.x + offsetX}
            y={p.y + offsetY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9}
            fill="#7c3aed"
            fontWeight={700}
          >
            {d.value}
          </text>
        );
      })}
    </svg>
  );
}
