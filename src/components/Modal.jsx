export function Modal({ children, onClose }) {
    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-1000 backdrop-blur-sm">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
}