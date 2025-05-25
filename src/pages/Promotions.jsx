import { Modal } from "../components/Modal";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  makePromotion,
  getPromotions,
  editPromotion,
  deletePromotion,
  getPromotionById,
} from "../controllers/promotions";
import { getCars } from "../controllers/revenues";

export default function Promotions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromoId, setEditingPromoId] = useState(null);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, watch } = useForm();
  const watchStartDate = watch("startDate");

  // Fetch all promotions
  const { data: promotions, isLoading: isPromotionsLoading } = useQuery({
    queryKey: ["promotions"],
    queryFn: getPromotions,
  });

  // Fetch all cars (for the multi-select)
  const { data: cars, isLoading: isCarsLoading } = useQuery({
    queryKey: ["cars"],
    queryFn: getCars,
  });

  // Mutation: create new promotion
  const makePromotionMutation = useMutation({
    mutationFn: makePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries(["promotions"]);
      setIsModalOpen(false);
      reset();
    },
  });

  // Mutation: edit existing promotion
  const editPromotionMutation = useMutation({
    mutationFn: (payload) => editPromotion(editingPromoId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(["promotions"]);
      setIsModalOpen(false);
      reset();
      setEditingPromoId(null);
    },
  });

  // “Delete” helper
  const handleDelete = async (promoId) => {
    try {
      await deletePromotion(promoId);
      queryClient.invalidateQueries(["promotions"]);
    } catch (err) {
      console.error("Failed to delete promotion:", err);
    }
  };

  // Open “Edit” modal and pre-fill form
  const openEditModal = async (promoId) => {
    try {
      const data = await getPromotionById(promoId);
      reset({
        name: data.name,
        description: data.description,
        discountPercent: data.discountPercent,
        startDate: data.startDate,
        endDate: data.endDate,
        carIds: data.cars.map((c) => String(c.id)),
      });
      setEditingPromoId(promoId);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch promotion for editing:", err);
    }
  };

  // Form submission (create or edit)
  const onSubmit = (formData) => {
    const payload = {
      name: formData.name,
      description: formData.description,
      discountPercent: Number(formData.discountPercent),
      startDate: formData.startDate,
      endDate: formData.endDate,
      carIds: Array.isArray(formData.carIds)
        ? formData.carIds.map((id) => Number(id))
        : [Number(formData.carIds)],
    };

    if (editingPromoId) {
      editPromotionMutation.mutate(payload);
    } else {
      makePromotionMutation.mutate(payload);
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Promotions</h2>
        <button
          onClick={() => {
            reset();
            setEditingPromoId(null);
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Create Promotion
        </button>
      </div>

      {isPromotionsLoading ? (
        <p>Loading promotions...</p>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Description</th>
              <th className="px-4 py-2 border">Discount %</th>
              <th className="px-4 py-2 border">Start Date</th>
              <th className="px-4 py-2 border">End Date</th>
              <th className="px-4 py-2 border">Cars</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions?.map((promo) => (
              <tr key={promo.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{promo.name}</td>
                <td className="border px-4 py-2">{promo.description}</td>
                <td className="border px-4 py-2">{promo.discountPercent}%</td>
                <td className="border px-4 py-2">{promo.startDate}</td>
                <td className="border px-4 py-2">{promo.endDate}</td>
                <td className="border px-4 py-2">
                  {promo.cars?.map((c) => c.licensePlate).join(", ") || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => openEditModal(promo.id)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {promotions?.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-4">
                  No promotions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <Modal
          title={editingPromoId ? "Edit Promotion" : "Create Promotion"}
          onClose={() => {
            setIsModalOpen(false);
            reset();
            setEditingPromoId(null);
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
            {/* name */}
            <input
              {...register("name")}
              type="text"
              placeholder="Name"
              className="w-full border px-3 py-2 rounded"
              required
            />

            {/* description */}
            <textarea
              {...register("description")}
              placeholder="Description"
              className="w-full border px-3 py-2 rounded"
              required
            />

            {/* discountPercent */}
            <input
              {...register("discountPercent")}
              type="number"
              placeholder="Discount Percentage"
              className="w-full border px-3 py-2 rounded"
              min={0}
              max={100}
              required
            />

            {/* startDate */}
            <input
              {...register("startDate")}
              type="date"
              className="w-full border px-3 py-2 rounded"
              required
              min={new Date().toISOString().split("T")[0]}
            />

            {/* endDate (min = startDate) */}
            <input
              {...register("endDate")}
              type="date"
              className="w-full border px-3 py-2 rounded"
              required
              min={watchStartDate}
              disabled={!watchStartDate}
            />

            {/* multi-select for carIds */}
            <label className="block text-sm font-medium text-gray-700">
              Cars
            </label>
            <select
              {...register("carIds")}
              multiple
              size={Math.min(4, (cars?.length || 4))}
              className="w-full border px-3 py-2 rounded bg-white"
              required
            >
              {cars?.map((car) => (
                <option key={car.id} value={String(car.id)}>
                  {car.licensePlate}
                </option>
              ))}
            </select>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                onClick={() => {
                  setIsModalOpen(false);
                  reset();
                  setEditingPromoId(null);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}