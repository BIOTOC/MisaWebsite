export default function ConfirmModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-80 text-center">
        <p className="mb-4 text-gray-800 font-medium">
          Bạn có chắc chắn hoàn thành thẩm định hợp đồng này không?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-green-600 text-white rounded"
          >
            Có
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-500 text-white rounded"
          >
            Không
          </button>
        </div>
      </div>
    </div>
  );
}
