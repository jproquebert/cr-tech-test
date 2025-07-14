import { useState } from "react";
import type { Task } from "../types/taskTypes";
import { useTaskManagerEndpoints } from "../services/taskManagerEndpoints";

interface EditTaskModalProps {
  open: boolean;
  id: string;
  task: Task | null;
  onClose: () => void;
  onTaskUpdated?: (task: Task) => void;
}

export function EditTaskModal({ open, id, task, onClose, onTaskUpdated }: EditTaskModalProps) {
  const { editTask } = useTaskManagerEndpoints();
  const [form, setForm] = useState<Task | null>(task);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!open || !form) return null;

  const validateFields = () => {
    const errors: Record<string, string> = {};
    if (!form.Title.trim()) errors.Title = "This field is required";
    if (!form.Description?.trim()) errors.Description = "This field is required";
    if (!form.DueDate?.trim()) errors.DueDate = "This field is required";
    if (!form.Status.trim()) errors.Status = "This field is required";
    if (!form.AssignedTo.trim()) errors.AssignedTo = "This field is required";
    return errors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value } as Task);
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
  };

  const isFormValid = Object.keys(validateFields()).length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateFields();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError("Please fill out all fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const updatedTask = await editTask(id, {
        Title: form.Title,
        Description: form.Description,
        DueDate: form.DueDate,
        Status: form.Status,
        AssignedTo: form.AssignedTo,
      });
      if (onTaskUpdated) onTaskUpdated(updatedTask);
      onClose();
    } catch (err) {
      setError("Failed to update task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-2">
      <div className="bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4 text-blue-400">Edit Task</h2>
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
          {fieldErrors.Title && (
            <span className="text-red-400 text-xs">{fieldErrors.Title}</span>
          )}
          <label className="text-sm font-semibold text-gray-300">Description</label>
          <textarea
            name="Description"
            required
            placeholder="Description"
            className="rounded p-2 bg-gray-800 text-white"
            value={form.Description ?? ""}
            onChange={handleChange}
          />
          {fieldErrors.Description && (
            <span className="text-red-400 text-xs">{fieldErrors.Description}</span>
          )}
          <label className="text-sm font-semibold text-gray-300">Due Date</label>
          <input
            name="DueDate"
            type="date"
            required
            className="rounded p-2 bg-gray-800 text-white"
            value={form.DueDate ? form.DueDate.split("T")[0] : ""}
            onChange={handleChange}
          />
          {fieldErrors.DueDate && (
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
          {fieldErrors.Status && (
            <span className="text-red-400 text-xs">{fieldErrors.Status}</span>
          )}
          <label className="text-sm font-semibold text-gray-300">Assigned To</label>
          <input
            name="AssignedTo"
            type="text"
            required
            placeholder="Assigned To"
            className="rounded p-2 bg-gray-800 text-white"
            value={form.AssignedTo}
            onChange={handleChange}
          />
          {fieldErrors.AssignedTo && (
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
              disabled={loading || !isFormValid}
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              )}
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}