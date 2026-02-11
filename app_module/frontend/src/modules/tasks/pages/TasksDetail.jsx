import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getTaskById,
  moveTask,
  addTaskComment,
  closeTask,
} from "../api";
import { getDepartments } from "../../departments/api";
import LogoutButton from "../../shared/LogoutButton";

export default function TasksDetail() {
    const [moveComment, setMoveComment] = useState("");
    const [closeComment, setCloseComment] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [comment, setComment] = useState("");
  const [moveDepartment, setMoveDepartment] = useState("");

  const [loading, setLoading] = useState(true);
  function getDepartmentName(depId) {
    const dep = departments.find((d) => d.id === depId);
    return dep ? dep.name : "-";
    }
  // ======================
  // Load Task + Departments
  // ======================

  async function load() {
    try {
      const data = await getTaskById(id);
      const deps = await getDepartments();

      setTask(data);
      setDepartments(deps);
    } catch (err) {
      console.error(err);
      alert("Failed to load task");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [id]);

  // ======================
  // Comment
  // ======================

  async function handleAddComment() {
    if (!comment.trim()) return;

    try {
      await addTaskComment(id, { message: comment });
      setComment("");
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  // ======================
  // Move Task
  // ======================

  async function handleMoveTask() {
    if (!moveDepartment) return;

    try {
      await moveTask(id, {
        to_department_id: moveDepartment,
        comment: moveComment
        });

        setMoveComment("");
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  // ======================
  // Close Task
  // ======================

async function handleCloseTask() {
  const comment = prompt("Close reason:");

  if (!comment) return;

  try {
    await closeTask(id, { comment });
    load();
  } catch (err) {
    alert(err.message);
  }
}

  // ======================
  // UI States
  // ======================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        Task not found
      </div>
    );
  }

  // ======================
  // Render
  // ======================

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* HEADER */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <LogoutButton />

        <h1 className="text-xl font-semibold tracking-tight">
          Task Detail
        </h1>

        <button
          onClick={() => navigate("/task/all")}
          className="text-sm text-slate-400 hover:text-slate-200"
        >
          Back to tasks
        </button>
      </header>

      {/* CONTENT */}
      <main className="flex-1 px-6 py-4 space-y-6">

        {/* SUMMARY */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-2">
            {task.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Status</span>
              <div>{task.status}</div>
            </div>

            <div>
              <span className="text-slate-400">ETA</span>
              <div>
                {task.eta_at
                  ? new Date(task.eta_at).toLocaleString()
                  : "-"}
              </div>
            </div>

            <div>
              <span className="text-slate-400">Delayed</span>
              <div
                className={
                  task.is_delayed
                    ? "text-red-400"
                    : "text-green-400"
                }
              >
                {task.is_delayed ? "YES" : "NO"}
              </div>
            </div>

            <div>
              <span className="text-slate-400">Current Dept</span>
              <div>
                {getDepartmentName(task.current_department_id)}
            </div>
            </div>
          </div>
 {task.description && (
          <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="text-xs uppercase text-slate-400 mb-2 tracking-wide">
              Description
            </div>
            <div className="text-sm text-slate-300 whitespace-pre-line">
              {task.description}
            </div>
          </div>
          )}
          {task.status !== "closed" && (
            <div className="mt-4">
              <button
                onClick={handleCloseTask}
                className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-md text-sm"
              >
                Close Task
              </button>
            </div>
          )}
        </div>

        {/* MOVE TASK */}
        {task.status !== "closed" && (
         <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Move Task</h3>

            <div className="space-y-2">

                <select
                    value={moveDepartment}
                    onChange={(e) => setMoveDepartment(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm w-full"
                >
                    <option value="">-- Select Department --</option>

                    {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                        {d.name}
                    </option>
                    ))}
                </select>

                <input
                    value={moveComment}
                    onChange={(e) => setMoveComment(e.target.value)}
                    placeholder="Move comment (optional)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
                />

                <button
                    onClick={handleMoveTask}
                    className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md text-sm"
                >
                    Move
                </button>

                </div>
        </div>
        )}


        {/* COMMENTS */}
        {task.status !== "closed" && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-semibold mb-3">Add Comment</h3>

            <div className="flex gap-3">
            <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm"
            />

            <button
                onClick={handleAddComment}
                className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-md text-sm"
            >
                Send
            </button>
            </div>
        </div>
        )}

        {/* TIMELINE */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">
            Tracking Timeline
          </h3>

          <div className="space-y-3">
            {task.events.map((e, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 border-b border-slate-800 pb-2"
              >
                <div className="text-indigo-400 text-xs">
                  {new Date(e.created_at).toLocaleString()}
                </div>

                <div className="text-sm">
                  <strong>{e.type}</strong>

                  {(e.comment || e.message) && (
                    <span className="ml-2 text-slate-400">
                        — {e.comment || e.message}
                    </span>
                    )}
                </div>
              </div>
            ))}

            {!task.events.length && (
              <div className="text-slate-500">
                No tracking events
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
