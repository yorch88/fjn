import React from "react";

const signals = [
  { id: 1, area: "Línea 1", level: "rojo", message: "Paro por falla de hardware" },
  { id: 2, area: "Línea 2", level: "amarillo", message: "Atención: tiempo de respuesta alto" },
  { id: 3, area: "Línea 3", level: "verde", message: "Operación normal" }
];

export default function AndonBoard() {
  const badgeClass = (level) => {
    switch (level) {
      case "rojo":
        return "bg-red-500/10 text-red-400 border-red-500/40";
      case "amarillo":
        return "bg-amber-500/10 text-amber-300 border-amber-500/40";
      default:
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
    }
  };

  return (
    <div className="space-y-2 text-xs">
      {signals.map((s) => (
        <div
          key={s.id}
          className="flex items-start justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-2"
        >
          <div>
            <p className="font-medium text-slate-100">{s.area}</p>
            <p className="text-[11px] text-slate-400">{s.message}</p>
          </div>
          <span
            className={
              "text-[11px] px-2 py-1 rounded-full border capitalize " +
              badgeClass(s.level)
            }
          >
            {s.level}
          </span>
        </div>
      ))}
      <p className="text-[11px] text-slate-500 mt-2">
        El módulo Andon se integrará con eventos en tiempo real en el backend.
      </p>
    </div>
  );
}
