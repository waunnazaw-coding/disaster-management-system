import React from "react";

interface ConfirmModalProps {
    open: boolean;
    title?: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({
    open,
    title = "Confirm Delete",
    message = "Are you sure you want to delete?",
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
                backgroundColor: "rgba(255,255,255,0.35)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
            }}
        >
            <div className="bg-white rounded p-6 max-w-sm w-full shadow-lg">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                        type="button"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        type="button"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

