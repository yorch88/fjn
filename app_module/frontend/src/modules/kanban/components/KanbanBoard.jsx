import React from "react";

const columns = [
  {
    id: "todo",
    title: "Por hacer",
    items: ["Configurar flujos de tickets", "Diseñar vista de kiosko"]
  },
  {
    id: "doing",
    title: "En progreso",
    items: ["Implementar módulo Kanban"]
  },
  {
    id: "done",
    title: "Listo",
    items: ["Base del proyecto", "Docker + Tailwind offline"]
  }
];

export default function KanbanBoard() {
  return (
    <div className="grid grid-cols-3 gap-2 text-xs">
      {columns.map((col) => (
        <div
          key={col.id}
          className="rounded-2xl bg-slate-950/60 border border-slate-800 p-2"
        >
          <h3 className="font-semibold text-slate-200 mb-2">{col.title}</h3>
          <div className="space-y-2">
            {col.items.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-slate-900/80 border border-slate-700 px-2 py-1"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
