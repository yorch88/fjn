import React from "react";

const mockTickets = [
  { id: 1, title: "Falla impresora kiosko 01", status: "abierto" },
  { id: 2, title: "Pantalla congelada kiosko 03", status: "en progreso" },
  { id: 3, title: "Error de red kiosko 07", status: "cerrado" }
];

export default function TicketList() {
  return (
    <div className="space-y-2 text-sm">
      {mockTickets.map((ticket) => (
        <article
          key={ticket.id}
          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2"
        >
          <div>
            <p className="font-medium text-slate-100">{ticket.title}</p>
            <p className="text-[11px] text-slate-400">ID: {ticket.id}</p>
          </div>
          <span
            className={
              "text-[11px] px-2 py-1 rounded-full capitalize " +
              (ticket.status === "abierto"
                ? "bg-red-500/10 text-red-400 border border-red-500/30"
                : ticket.status === "en progreso"
                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30")
            }
          >
            {ticket.status}
          </span>
        </article>
      ))}

      <p className="text-[11px] text-slate-500 mt-2">
        Este módulo crecerá con vistas, formularios y lógica específica de tickets.
      </p>
    </div>
  );
}
