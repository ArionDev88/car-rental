import React, { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getAllCars, getAllAvailableBrands, getAllModelsByBrandIds } from '../controllers/cars';
import { getBranches } from '../controllers/branches';
import { categories } from '../utils/categories';
import { bookCar } from '../controllers/reservations';
import MoreFiltersModal from '../components/MoreFiltersModal';

export default function VehicleMarketplace() {
    const queryClient = useQueryClient();
    const [carsResponse, setCarsResponse] = useState({ content: [] });
    const [showMoreFiltersModal, setShowMoreFiltersModal] = useState(false); // New state for modal


    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm({
        defaultValues: {
            priceMin: '',
            priceMax: '',
            yearMin: '',
            yearMax: '',
            categories: [],
            brandIds: [],
            modelIds: [],
            branchIds: [],
            availFrom: '',
            availTo: '',
            features: [],
        },
    });

    const {
        data: brands,
        isLoading: isBrandsLoading,
        isError: isBrandsError,
        error: brandsError,
    } = useQuery({
        queryKey: ["brands"],
        queryFn: getAllAvailableBrands,
    });

    const {
        data: models,
        isLoading: isModelsLoading,
        isError: isModelsError,
        error: modelsError,
    } = useQuery({
        queryKey: ["models"],
        queryFn: () => getAllModelsByBrandIds(watch('brandIds')),
        enabled: watch('brandIds').length > 0,
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

    const [openCategories, setOpenCategories] = useState(false);
    const [openBrands, setOpenBrands] = useState(false);
    const [openModels, setOpenModels] = useState(false);
    const [openBranches, setOpenBranches] = useState(false);

    const availFromValue = watch('availFrom');
    const availToValue = watch('availTo'); // Watch availTo as well

    const fetchCarsMutation = useMutation({
        mutationFn: (filters) => getAllCars(filters),
        onSuccess: (data) => {
            setCarsResponse(data);
        },
        onError: (err) => {
            console.error('Error fetching cars:', err);
        },
    });

    const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
    if (!hasFetchedOnce) {
        fetchCarsMutation.mutate({});
        setHasFetchedOnce(true);
    }

    const onSubmit = (data) => {
        const filters = {};
        if (data.categories.length) {
            filters.categories = data.categories;
        }
        if (data.priceMin) {
            filters.minRate = data.priceMin;
        }
        if (data.priceMax) {
            filters.maxRate = data.priceMax;
        }
        if (data.brandIds.length) {
            filters.brandIds = data.brandIds.map((id) => parseInt(id));
        }
        if (data.modelIds.length) {
            filters.modelIds = data.modelIds.map((id) => parseInt(id));
        }
        if (data.branchIds.length) {
            filters.branchIds = data.branchIds.map((id) => parseInt(id));
        }
        if (data.yearMin) {
            filters.minYear = parseInt(data.yearMin);
        }
        if (data.yearMax) {
            filters.maxYear = parseInt(data.yearMax);
        }
        if (data.availFrom) {
            filters.availFrom = data.availFrom;
        }
        if (data.availTo) {
            filters.availTo = data.availTo;
        }
        if (data.features.length) {
            filters.features = data.features;
        }
        fetchCarsMutation.mutate(filters);
    };

    const isLoading = fetchCarsMutation.isLoading;
    const isError = fetchCarsMutation.isError;
    const error = fetchCarsMutation.error;

    if (isLoading) {
        return <div className="p-4">Loading cars…</div>;
    }

    if (isError) {
        return (
            <div className="p-4 text-red-600">
                Error loading cars: {error?.message || 'Unknown error'}
            </div>
        );
    }

    const cars = carsResponse?.content || [];

    // Determine if buttons should be disabled
    const isBookingDisabled = !availFromValue || !availToValue;

    const handlePickUpBooking = async (carId) => {
        try {
            await bookCar({
                carId,
                startDate: availFromValue,
                endDate: availToValue,
                paymentOption: 'PAY_AT_PICKUP',
            });
            // Handle success (e.g., show a success message)
        } catch (error) {
            console.error('Error booking car:', error);
            // Handle error (e.g., show an error message)
        }
    }


    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 min-h-screen">
            {/* Filters Sidebar  */}
            <div className="w-full md:w-80 bg-white p-4 rounded-lg shadow-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* 1) Categories Multiselect */}
                    <div className="mb-4 relative">
                        <h2 className="font-bold mb-2">Categories</h2>
                        <button
                            type="button"
                            onClick={() => setOpenCategories((o) => !o)}
                            className="w-full p-2 border rounded text-left flex justify-between items-center"
                        >
                            {watch('categories').length
                                ? watch('categories').join(', ')
                                : 'Select categories…'}
                            <span className="ml-2">&#9662;</span>
                        </button>
                        {openCategories && (
                            <ul className="absolute z-10 bg-white border rounded w-full max-h-48 overflow-y-auto mt-1">
                                {categories.map((cat) => (
                                    <li key={cat} className="px-2 py-1 hover:bg-gray-100">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                value={cat}
                                                {...register('categories')}
                                                className="form-checkbox h-4 w-4 text-blue-600"
                                            />
                                            <span className="text-sm">{cat}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* 2) Brands Multiselect */}
                    <div className="mb-4 relative">
                        <h2 className="font-bold mb-2">Brands</h2>
                        <button
                            type="button"
                            onClick={() => setOpenBrands((o) => !o)}
                            className="w-full p-2 border rounded text-left flex justify-between items-center"
                        >
                            {watch('brandIds').length
                                ? `${watch('brandIds').length} selected`
                                : 'Select brands…'}
                            <span className="ml-2">&#9662;</span>
                        </button>
                        {openBrands && (
                            <ul className="absolute z-10 bg-white border rounded w-full max-h-48 overflow-y-auto mt-1">
                                {brands.map((brand) => (
                                    <li key={brand.brandId} className="px-2 py-1 hover:bg-gray-100">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                value={brand.brandId}
                                                {...register('brandIds')}
                                                className="form-checkbox h-4 w-4 text-blue-600"
                                            />
                                            <span className="text-sm">{brand.brandName}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* 3) Models Multiselect */}
                    <div className="mb-4 relative">
                        <h2 className="font-bold mb-2">Models</h2>
                        <button
                            type="button"
                            onClick={() => setOpenModels((o) => !o)}
                            className="w-full p-2 border rounded text-left flex justify-between items-center"
                        >
                            {watch('modelIds').length
                                ? `${watch('modelIds').length} selected`
                                : 'Select models…'}
                            <span className="ml-2">&#9662;</span>
                        </button>
                        {openModels && (
                            <ul className="absolute z-10 bg-white border rounded w-full max-h-48 overflow-y-auto mt-1">
                                {models.map((model) => (
                                    <li key={model.modelId} className="px-2 py-1 hover:bg-gray-100">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                value={model.modelId}
                                                {...register('modelIds')}
                                                className="form-checkbox h-4 w-4 text-blue-600"
                                            />
                                            <span className="text-sm">{model.carModelName}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* 4) Branches Multiselect */}
                    <div className="mb-4 relative">
                        <h2 className="font-bold mb-2">Branches</h2>
                        <button
                            type="button"
                            onClick={() => setOpenBranches((o) => !o)}
                            className="w-full p-2 border rounded text-left flex justify-between items-center"
                        >
                            {watch('branchIds').length
                                ? `${watch('branchIds').length} selected`
                                : 'Select branches…'}
                            <span className="ml-2">&#9662;</span>
                        </button>
                        {openBranches && (
                            <ul className="absolute z-10 bg-white border rounded w-full max-h-48 overflow-y-auto mt-1">
                                {branches.content.map((branch) => (
                                    <li key={branch.id} className="px-2 py-1 hover:bg-gray-100">
                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                value={branch.id}
                                                {...register('branchIds')}
                                                className="form-checkbox h-4 w-4 text-blue-600"
                                            />
                                            <span className="text-sm">{branch.name}</span>
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* 5) Price Filter */}
                    <div className="mb-4">
                        <h2 className="font-bold mb-2">Price (€)</h2>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="From"
                                className="w-full p-2 border rounded"
                                {...register('priceMin')}
                            />
                            <input
                                type="number"
                                placeholder="To"
                                className="w-full p-2 border rounded"
                                {...register('priceMax')}
                            />
                        </div>
                    </div>

                    {/* 6) Year Filter */}
                    <div className="mb-4">
                        <h2 className="font-bold mb-2">Year</h2>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="From"
                                className="w-full p-2 border rounded"
                                {...register('yearMin')}
                            />
                            <input
                                type="number"
                                placeholder="To"
                                className="w-full p-2 border rounded"
                                {...register('yearMax')}
                            />
                        </div>
                    </div>

                    {/* 7) Availability Dates */}
                    <div className="mb-6 grid grid-cols-1 gap-4">
                        <div>
                            <h2 className="font-bold mb-2">Available From</h2>
                            <input
                                type="date"
                                className="w-full p-2 border rounded"
                                {...register('availFrom')}
                            />
                        </div>
                        <div>
                            <h2 className="font-bold mb-2">Available To</h2>
                            <input
                                type="date"
                                className="w-full p-2 border rounded"
                                {...register('availTo')}
                                min={availFromValue || undefined}
                            />
                        </div>
                    </div>

                    {/* More Filters Button */}
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={() => setShowMoreFiltersModal(true)}
                            className="w-full bg-gray-100 text-gray-800 p-2 rounded hover:bg-gray-200 flex items-center justify-center space-x-2"
                        >
                            <span>More Filters</span>
                            {/* Example Icon - replace with a proper icon library like Heroicons */}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                        </button>
                    </div>

                    {/* 8) Submit / Reset Buttons */}
                    <div className="space-y-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                        >
                            Apply Filters
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                // Reset form fields
                                Object.entries(getValues()).forEach(([key, _]) => {
                                    setValue(key, Array.isArray(getValues()[key]) ? [] : '');
                                });
                                // Refetch without filters
                                fetchCarsMutation.mutate({});
                            }}
                            className="w-full bg-gray-200 p-2 rounded hover:bg-gray-300"
                        >
                            Reset Filters
                        </button>
                    </div>
                </form>
            </div>

            {/* Car Listings ───────────────────────────────────────────────────────────── */}
            <div className="flex-1 space-y-6">
                {cars.length === 0 ? (
                    <div className="text-center text-gray-600">No cars available.</div>
                ) : (
                    cars.map((car) => (
                        <div
                            key={car.id}
                            className="bg-white p-3 rounded-lg shadow-md flex flex-col md:flex-row gap-6"
                        >
                            {/* ─── Left: 2×2 Image Grid ─── */}
                            <div className="w-full md:w-1/3 grid grid-rows-2 grid-cols-2 gap-2">
                                {car.imageUrls[0] && (
                                    <img
                                        src={car.imageUrls[0]}
                                        alt={`${car.brand.brandName} ${car.model.carModelName} #1`}
                                        className="col-span-2 row-span-1 h-48 w-full object-cover rounded"
                                    />
                                )}
                                {car.imageUrls[1] && (
                                    <img
                                        src={car.imageUrls[1]}
                                        alt={`${car.brand.brandName} ${car.model.carModelName} #2`}
                                        className="h-full w-full object-cover rounded"
                                    />
                                )}
                                {car.imageUrls[2] && (
                                    <img
                                        src={car.imageUrls[2]}
                                        alt={`${car.brand.brandName} ${car.model.carModelName} #3`}
                                        className="h-full w-full object-cover rounded"
                                    />
                                )}
                            </div>

                            {/* ─── Right: Car Details ─── */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold">
                                            {car.brand.brandName} {car.model.carModelName}
                                        </h2>
                                        {car.status === 'AVAILABLE' ? (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                                                Available
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 bg-red-100 text-red-800 text-sm rounded">
                                                {car.status}
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-2 text-gray-600">
                                        <strong>License:</strong> {car.licensePlate} &nbsp; | &nbsp;
                                        <strong>Year:</strong> {car.year} &nbsp; | &nbsp;
                                        <strong>Mileage:</strong> {car.mileage.toLocaleString()} km
                                    </p>

                                    <p className="mt-2 text-2xl font-semibold text-blue-600">
                                        €{car.pricePerDay.toLocaleString()} / day
                                    </p>

                                    <p className="mt-1 text-sm text-gray-500">
                                        <strong>Category:</strong> {car.category}
                                    </p>

                                    <div className="mt-4">
                                        <h3 className="font-medium text-gray-700 mb-1">Features:</h3>
                                        <ul className="flex flex-wrap gap-2">
                                            {car.features.map((feat) => (
                                                <li
                                                    key={feat}
                                                    className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs"
                                                >
                                                    {feat.replace(/_/g, ' ')}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="pt-4 border-t mt-4"> {/* Added mt-4 for spacing */}
                                    <p className="text-sm text-gray-700">
                                        <strong>Branch:</strong> {car.branch.name},{' '}
                                        {car.branch.city}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        <strong>Address:</strong> {car.branch.address}
                                    </p>
                                </div>

                                {/* Booking Buttons */}
                                <div className="flex justify-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        className={`px-4 py-2 rounded ${
                                            isBookingDisabled
                                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                        disabled={isBookingDisabled}
                                        onClick={() => {
                                            if (!isBookingDisabled) {
                                                // Handle "Pay at Pick Up" logic here
                                                console.log(`Pay at Pick Up for car ${car.id} from ${availFromValue} to ${availToValue}`);
                                                handlePickUpBooking(car.id);
                                            }
                                        }}
                                    >
                                        Pay at Pick Up
                                    </button>
                                    <button
                                        type="button"
                                        className={`px-4 py-2 rounded ${
                                            isBookingDisabled
                                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                                : 'bg-green-600 text-white hover:bg-green-700'
                                        }`}
                                        disabled={isBookingDisabled}
                                        onClick={() => {
                                            if (!isBookingDisabled) {
                                                // Handle "Pay Now" logic here
                                                console.log(`Pay Now for car ${car.id} from ${availFromValue} to ${availToValue}`);
                                            }
                                        }}
                                    >
                                        Pay Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>


            {/* More Filters Modal */}
            <MoreFiltersModal
                isOpen={showMoreFiltersModal}
                onClose={() => setShowMoreFiltersModal(false)}
                register={register}
                watch={watch}
            />
        </div>


    );
}