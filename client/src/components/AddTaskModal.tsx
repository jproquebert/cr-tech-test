import { useState } from "react";
import { useTaskManagerEndpoints } from "../services/taskManagerEndpoints";
import type { Task } from "../types/taskTypes";
import { useSelector } from "react-redux";

interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onTaskCreated?: (task: Task) => void;
}

export function AddTaskModal({
  open,
  onClose,
  onTaskCreated,
}: AddTaskModalProps) {
  const { createTask } = useTaskManagerEndpoints();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const email = useSelector((state: any) => state.user.email);
  const [form, setForm] = useState({
    Title: "",
    Description: "",
    DueDate: "",
    Status: "pending",
    AssignedTo: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!open) return null;

  const validateFields = () => {
    const errors: Record<string, string> = {};
    if (!form.Title.trim()) errors.Title = "This field is required";
    if (!form.Description.trim()) errors.Description = "This field is required";
    if (!form.DueDate.trim()) errors.DueDate = "This field is required";
    if (!form.Status.trim()) errors.Status = "This field is required";
    if (!form.AssignedTo.trim()) errors.AssignedTo = "This field is required";
    return errors;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true); // Mark as submitted
    const errors = validateFields();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError("Please fill out all fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const newTask = await createTask({
        ...form,
        CreatedBy: email,
        DueDate: form.DueDate,
      });
      if (onTaskCreated) onTaskCreated(newTask);
      onClose();
    } catch (err) {
      setError("Failed to create task. " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="text-sm font-semibold text-gray-300">Title</label>
          <input
            name="Title"
            type="text"
            required
            placeholder="Title"
            className="rounded p-2 bg-gray-800 text-white"
            value={form.Title}
            onChange={handleChange}
          />
          {submitted && fieldErrors.Title && (
            <span className="text-red-400 text-xs">{fieldErrors.Title}</span>
          )}
          <label className="text-sm font-semibold text-gray-300">
            Description
          </label>
          <textarea
            name="Description"
            required
            placeholder="Description"
            className="rounded p-2 bg-gray-800 text-white"
            value={form.Description}
            onChange={handleChange}
          />
          {submitted && fieldErrors.Description && (
            <span className="text-red-400 text-xs">{fieldErrors.Description}</span>
          )}
          <label className="text-sm font-semibold text-gray-300">Due Date</label>
          <input
            name="DueDate"
            type="date"
            required
            className="rounded p-2 bg-gray-800 text-white"
            value={form.DueDate}
            onChange={handleChange}
          />
          {submitted && fieldErrors.DueDate && (
            <span className="text-red-400 text-xs">{fieldErrors.DueDate}</span>
          )}
          <label className="text-sm font-semibold text-gray-300">Status</label>
          <select
            name="Status"
            required
            className="rounded p-2 bg-gray-800 text-white"
            value={form.Status}
            onChange={handleChange}
          >
            <option value="">Select status</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
          {submitted && fieldErrors.Status && (
            <span className="text-red-400 text-xs">{fieldErrors.Status}</span>
          )}
          <label className="text-sm font-semibold text-gray-300">
            Assigned To
          </label>
          <input
            name="AssignedTo"
            type="text"
            required
            placeholder="Assigned To"
            className="rounded p-2 bg-gray-800 text-white"
            value={form.AssignedTo}
            onChange={handleChange}
          />
          {submitted && fieldErrors.AssignedTo && (
            <span className="text-red-400 text-xs">{fieldErrors.AssignedTo}</span>
          )}
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-800 text-white"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={loading}
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              )}
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
