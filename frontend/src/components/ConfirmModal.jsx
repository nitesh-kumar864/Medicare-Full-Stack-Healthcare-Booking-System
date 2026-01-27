import React from "react";

const ConfirmModal = ({ open, onConfirm, onCancel }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-xl">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    Payment Confirmation
                </h2>

                <p className="text-sm text-gray-600 leading-relaxed">
                    This is a test booking for demonstration purposes.
                    <br />
                    No actual payment will be charged.
                </p>


                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 rounded-lg bg-primary text-white hover:opacity-90"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
