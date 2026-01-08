import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">Main Menu</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/login?redirect=inventory"
          className="bg-slate-800 p-8 rounded-2xl text-center text-xl hover:bg-slate-700 transition"
        >
          Inventory
        </Link>

        <Link
          to="/login?redirect=tickets"
          className="bg-slate-800 p-8 rounded-2xl text-center text-xl hover:bg-slate-700 transition"
        >
          Tickets
        </Link>

        <Link
          to="/login?redirect=andon"
          className="bg-slate-800 p-8 rounded-2xl text-center text-xl hover:bg-slate-700 transition"
        >
          Andon
        </Link>
      </div>
    </div>
  );
}
