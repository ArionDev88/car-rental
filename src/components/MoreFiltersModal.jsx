import { featureCategories } from "../utils/features";
export default function MoreFiltersModal({ isOpen, onClose, register, watch }) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">More Filters (Features)</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-semibold">
                        &times;
                    </button>
                </div>
                <div className="space-y-4">
                    <label className="block font-medium">Features</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {featureCategories.map(category => (
                            <div key={category.name} className="border rounded-lg overflow-hidden">
                                <div className="bg-gray-100 px-4 py-2 font-medium">
                                    {category.name}
                                </div>
                                <div className="p-4 grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                                    {category.features.map(feature => (
                                        <label
                                            key={feature.name}
                                            className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                                        >
                                            <input
                                                type="checkbox"
                                                value={feature.name} // Use feature.name as value
                                                {...register('features')} // Register with 'features'
                                                className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-300"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">
                                                    {feature.name.replace(/_/g, ' ')}
                                                </span>
                                                {feature.description && (
                                                    <span className="text-xs text-gray-500">
                                                        {feature.description}
                                                    </span>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-blue-600 text-white p-2 px-4 rounded hover:bg-blue-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}