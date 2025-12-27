import React from "react";
import TicketList from "./modules/tickets/components/TicketList.jsx";
import KanbanBoard from "./modules/kanban/components/KanbanBoard.jsx";
import AndonBoard from "./modules/andon/components/AndonBoard.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">
          Sistema de Tickets - Kioskoasdfasdaaa
        </h1>
        <span className="text-xs uppercase tracking-wider text-slate-400">
          Monolito modular · Frontendsss
        </span>
      </header>

      <main className="flex-1 px-6 py-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <h2 className="text-sm font-semibold mb-2 text-slate-200">
            Tickets
          </h2>
          <TicketList />
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <h2 className="text-sm font-semibold mb-2 text-slate-200">
            Kanban
          </h2>
          <KanbanBoard />
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <h2 className="text-sm font-semibold mb-2 text-slate-200">
            Andon
          </h2>
          <AndonBoard />
        </section>
      </main>

      <footer className="border-t border-slate-800 px-6 py-3 text-xs text-slate-500">
        Arquitectura monolito modular · Módulos: tickets, kanban, andon (extensible)
      </footer>
    </div>
  );
}
