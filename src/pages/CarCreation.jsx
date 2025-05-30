import { useState } from "react";
import { useForm } from "react-hook-form";
import { createBrand, getAllBrands, createModel, getAllModelsByBrandId, createCar } from "../controllers/cars";
import { getBranches } from "../controllers/branches";
import { featureCategories } from "../utils/features";
import { categories } from "../utils/categories";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "../components/Modal";
import { ToastContainer, toast } from "react-toastify";

export default function CarCreation() {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    // form state
    const [features, setFeatures] = useState([]);
    const [selectedBrandId, setSelectedBrandId] = useState("");
    const [modelName, setModelName] = useState("");

    const [brandName, setBrandName] = useState("");
    const [brandLogo, setBrandLogo] = useState(null);

    const [isBrandModalOpen, setBrandModalOpen] = useState(false);
    const [isModelModalOpen, setModelModalOpen] = useState(false);

    const brandId = watch("brandId");

    const {
        data: brands,
        isLoading: isBrandsLoading,
        isError: isBrandsError,
        error: brandsError,
    } = useQuery({
        queryKey: ["brands"],
        queryFn: getAllBrands,
    });

    const {
        data: models,
        isLoading: isModelsLoading,
        isError: isModelsError,
        error: modelsError,
    } = useQuery({
        queryKey: ["models", brandId],
        queryFn: () => getAllModelsByBrandId(brandId),
        enabled: Boolean(brandId),
    });

    const {
        data: branches,
        isLoading: isBranchesLoading,
        isError: isBranchesError,
        error: branchesError,
    } = useQuery({
        queryKey: ["branches"],
        queryFn: getBranches,
    });

    const createBrandMutation = useMutation({
        mutationFn: createBrand,
        onSuccess: () => {
            queryClient.invalidateQueries(["brands"]);
            setBrandModalOpen(false);
            setBrandName("");
            setBrandLogo(null);
            toast.success("Brand created successfully!");
        },
        onError: (error) => {
            console.error("Error creating brand:", error);
            toast.error(error.message || "Failed to create brand. Please try again.");
        },
    });

    const createModelMutation = useMutation({
        mutationFn: createModel,
        onSuccess: () => {
            queryClient.invalidateQueries(["models"]);
            setModelModalOpen(false);
            setSelectedBrandId("");
            setModelName("");
            toast.success("Model created successfully!");
        },
        onError: (error) => {
            console.error("Error creating model:", error);
            toast.error(error.message || "Failed to create model. Please try again.");
        },
    })

    const toggleFeature = (feat) => {
        setFeatures(f =>
            f.includes(feat) ? f.filter(x => x !== feat) : [...f, feat]
        );
    };

    const handleCarSubmit = async (data) => {
        try {
            await createCar({
                ...data,
                features
            });
            reset();
            setFeatures([]);
        } catch (error) {
            console.error("Error creating car:", error);
            // Optionally, display an error message to the user
        }
    };

    const handleBrandCreation = (e) => {
        if (brandName) {
            createBrandMutation.mutate({ name: brandName, logo: brandLogo });
        }
    };

    const handleModelCreation = () => {
        createModelMutation.mutate({ name: modelName, brandId: selectedBrandId });
    }

    return (
        <>
            {/* Car Creation Form */}
            <form
                onSubmit={handleSubmit(handleCarSubmit)}
                className="w-full mx-auto p-6 bg-white rounded-lg shadow-md space-y-4"
            >
                <h2 className="text-2xl font-semibold">Create New Car</h2>

                {/* Brand + Create Brand */}
                <div>
                    <label className="block font-medium">Brand</label>
                    <div className="flex space-x-2">
                        <select
                            {...register('brandId', { required: 'Brand is required' })}
                            className="flex-1 border rounded px-3 py-2"
                        >
                            <option value="">Select brand…</option>
                            {brands && brands.map(b => (
                                <option key={b.brandId} value={b.brandId}>{b.brandName}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => setBrandModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            + Brand
                        </button>
                    </div>
                </div>

                {/* Model + Create Model */}
                <div>
                    <label className="block font-medium">Model</label>
                    <div className="flex space-x-2">
                        <select
                            {...register('modelId', { required: 'Model is required' })}
                            className="flex-1 border rounded px-3 py-2"
                        >
                            <option value="">Select model…</option>
                            {models && models.carModelResponseDTOS
                                .map(m => (
                                    <option key={m.modelId} value={m.modelId}>{m.carModelName}</option>
                                ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => setModelModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            + Model
                        </button>
                    </div>
                </div>

                {/* Other Car Fields */}
                <div>
                    <label className="block font-medium">License Plate</label>
                    <input
                        type="text"
                        {...register('licensePlate', {
                            required: 'License plate is required',
                            minLength: { value: 5, message: 'License plate must be at least 5 characters' },
                            maxLength: { value: 7, message: 'License plate cannot exceed 7 characters' },
                        })}
                        className="w-full border rounded px-3 py-2"
                        placeholder="ABC1234"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block font-medium">Year</label>
                        <input
                            type="number"
                            {...register('year', { required: 'Year is required', valueAsNumber: true })}
                            className="w-full border rounded px-3 py-2"
                            placeholder="2022"
                        />
                    </div>
                    <div>
                        <label className="block font-medium">Mileage</label>
                        <input
                            type="number"
                            {...register('mileage', { required: 'Mileage is required', valueAsNumber: true, min: 0 })}
                            className="w-full border rounded px-3 py-2"
                            placeholder="15000"
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-medium">Price per Day (€)</label>
                    <input
                        type="number"
                        {...register('pricePerDay', {
                            required: 'Price per day is required',
                            valueAsNumber: true,
                            min: 1,
                            max: 500,
                            step: '1',
                        })}
                        className="w-full border rounded px-3 py-2"
                        placeholder="100"
                    />
                </div>

                <div>
                    <label className="block font-medium">Branch</label>
                    <select
                        {...register('branchId', { required: 'Branch is required' })}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select branch…</option>
                        {branches?.content.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>

                {/* Features */}
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
                                                checked={features.includes(feature.name)}
                                                onChange={() => toggleFeature(feature.name)}
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

                <div>
                    <label className="block font-medium">Category</label>
                    <select
                        {...register('category', { required: 'Category is required' })}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select category…</option>
                        {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-medium">Images</label>
                    <input
                        type="file"
                        {...register('images', { required: 'At least one image is required' })}
                        className="w-full"
                        multiple
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                    Save Car
                </button>
            </form>

            {/* Brand Modal */}
            {isBrandModalOpen && (
                <Modal onClose={() => setBrandModalOpen(false)}>
                    <h3 className="text-xl font-semibold mb-4">Create New Brand</h3>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            handleBrandCreation(brandName, brandLogo);
                            // save brand logic...
                            setBrandModalOpen(false);
                        }}
                        className="space-y-3"
                    >
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            placeholder="Brand Name"
                            required
                            onChange={e => setBrandName(e.target.value)}
                        />
                        <input
                            type="file"
                            className="w-full"
                            accept="image/*"
                            onChange={e => setBrandLogo(e.target.files[0])}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setBrandModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Model Modal */}
            {isModelModalOpen && (
                <Modal onClose={() => setModelModalOpen(false)}>
                    <h3 className="text-xl font-semibold mb-4">Create New Model</h3>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            handleModelCreation(modelName, selectedBrandId);
                            setModelModalOpen(false);
                        }}
                        className="space-y-3"
                    >
                        <select
                            name="brandId"
                            id="brandId"
                            className="w-full border rounded px-3 py-2"
                            placeholder="Brand Name"
                            value={selectedBrandId}
                            onChange={(e) => setSelectedBrandId(e.target.value)}
                            required
                        >
                            <option value="">Select brand…</option>
                            {brands.map((brand) => (
                                <option key={brand.brandId} value={brand.brandId}>
                                    {brand.brandName}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            className="w-full border rounded px-3 py-2"
                            placeholder="Model Name"
                            required
                            onChange={e => setModelName(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setModelModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            <ToastContainer />
        </>
    );
}