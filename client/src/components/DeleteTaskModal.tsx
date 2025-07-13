interface DeleteTaskModalProps {
  open: boolean;
  taskTitle: string;
  onDelete: () => void;
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
}

export function DeleteTaskModal({
  open,
  taskTitle,
  onDelete,
  onClose,
  loading,
  error,
}: DeleteTaskModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gray-900 rounded-xl shadow-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4 text-red-400">Delete Task</h2>
        <p className="mb-6 text-gray-300">
          Are you sure you want to delete <span className="font-bold text-white">{taskTitle}</span>?
        </p>
        {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
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
            type="button"
            onClick={onDelete}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}