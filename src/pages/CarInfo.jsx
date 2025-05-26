import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import { featureCategories } from "../utils/features";
import { categories } from "../utils/categories";
import { useState } from "react";
import { updateCar } from "../controllers/cars";
import { getCar, deleteCarImage } from "../controllers/cars";
import { getBranches } from "../controllers/branches";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";


async function loader(params) {
    const carId = params;
    const car = await getCar(carId.params.id);
    return car;
}
export default function CarInfo() {
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const car = useLoaderData();
    const [features, setFeatures] = useState(car.features);
    const navigate = useNavigate();

    // Initialize form values
    setValue('brandId', car.brand.brandId);
    setValue('modelId', car.model.modelId);
    setValue('licensePlate', car.licensePlate);
    setValue('year', car.year);
    setValue('mileage', car.mileage);
    setValue('pricePerDay', car.pricePerDay);
    setValue('branchId', car.branch.id);
    setValue('category', car.category);

    const toggleFeature = (feat) => {
        setFeatures(f =>
            f.includes(feat) ? f.filter(x => x !== feat) : [...f, feat]
        );
    };

    const { data: branches, isLoading: branchesLoading } = useQuery({
        queryKey: ['branches'],
        queryFn: getBranches,
    });

    const deleteImageMutation = useMutation({
        mutationFn: async ({ id, imageUrl }) => {
            await deleteCarImage(id, imageUrl);
            queryClient.invalidateQueries(['car', id]);
        },
        onSuccess: () => {
            toast.success("Image deleted successfully");
            // Consider optimistic updates for instant UI feedback
            queryClient.setQueryData(['car', car.id], old => ({
                ...old,
                imageUrls: old.imageUrls.filter(url => url !== imageUrl)
            }));
        },
        onError: (error) => {
            toast.error(`Error deleting image: ${error.message}`);
        }
    });

    const handleCarUpdate = async (data) => {
        try {
            const updatedData = {
                ...data,
                features: features,
            };
            await updateCar(car.id, updatedData);
            navigate('../cars');
        } catch (error) {
            console.error("Error updating car:", error);
            return;
        }
        // console.log({ ...data, features });
    };

    const handleDeleteImage = (url) => {
        deleteImageMutation.mutate({
            id: car.id,
            imageUrl: url
        });
    };

    return (
        <form
            onSubmit={handleSubmit(handleCarUpdate)}
            className="w-full mx-auto p-6 bg-white rounded-lg shadow-md space-y-4"
        >
            <h2 className="text-2xl font-semibold">Update Car Information</h2>

            {/* Brand */}
            <div>
                <label className="block font-medium">Brand</label>
                <select
                    {...register('brandId')}
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                    disabled
                >
                    <option value={car.brand.brandId}>{car.brand.brandName}</option>
                </select>
            </div>

            {/* Model */}
            <div>
                <label className="block font-medium">Model</label>
                <select
                    {...register('modelId')}
                    className="w-full border rounded px-3 py-2"
                >
                    {car.brand.carModelResponseDTOS.map(m => (
                        <option key={m.modelId} value={m.modelId}>
                            {m.carModelName}
                        </option>
                    ))}
                </select>
            </div>

            {/* License Plate */}
            <div>
                <label className="block font-medium">License Plate</label>
                <input
                    type="text"
                    {...register('licensePlate')}
                    className="w-full border rounded px-3 py-2"
                    defaultValue={car.licensePlate}
                />
            </div>

            {/* Year & Mileage */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium">Year</label>
                    <input
                        type="number"
                        {...register('year')}
                        className="w-full border rounded px-3 py-2"
                        defaultValue={car.year}
                    />
                </div>
                <div>
                    <label className="block font-medium">Mileage</label>
                    <input
                        type="number"
                        {...register('mileage')}
                        className="w-full border rounded px-3 py-2"
                        defaultValue={car.mileage}
                    />
                </div>
            </div>

            {/* Price */}
            <div>
                <label className="block font-medium">Price per Day (€)</label>
                <input
                    type="number"
                    {...register('pricePerDay')}
                    className="w-full border rounded px-3 py-2"
                    defaultValue={car.pricePerDay}
                />
            </div>

            {/* Branch */}
            <div>
                <label className="block font-medium">Branch</label>
                <select
                    {...register('branchId')}
                    className="w-full border rounded px-3 py-2"
                >
                    {branchesLoading ? (
                        <option>Loading branches...</option>
                    ) : (
                        branches.content.map(branch => (
                            <option
                                key={branch.id}
                                value={branch.id}
                            >
                                {branch.name}
                            </option>
                        ))
                    )}
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

            {/* Category */}
            <div>
                <label className="block font-medium">Category</label>
                <select
                    {...register('category')}
                    className="w-full border rounded px-3 py-2"
                >
                    {categories.map(c => (
                        <option key={c} value={c} selected={c === car.category}>
                            {c}
                        </option>
                    ))}
                </select>
            </div>

            {/* Existing Images */}
            <div>
                <label className="block font-medium">Current Images</label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                    {car.imageUrls.map((url, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={url}
                                alt={`Car ${index + 1}`}
                                className="w-full h-32 object-cover rounded"
                            />
                            <button
                                type="button"
                                onClick={() => handleDeleteImage(url)}
                                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full 
                               flex items-center justify-center opacity-75 hover:opacity-100 
                               transition-opacity"
                                aria-label="Delete image"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* New Images */}
            <div>
                <label className="block font-medium">Update Images</label>
                <input
                    type="file"
                    {...register('images')}
                    className="w-full"
                    multiple
                />
            </div>

            <button
                type="submit"
                className="w-full py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
                Update Car
            </button>

            <ToastContainer />
        </form>
    );
}

CarInfo.loader = loader;