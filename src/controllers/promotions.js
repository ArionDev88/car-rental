import { useAuthStore } from "../stores/authStore";

export async function makePromotion({ name, description, startDate, endDate, discountPercent, carIds }) {
    const response = await fetch('http://localhost:8080/api/private/promotions/create-promotion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({
            name: name,
            description: description,
            startDate: startDate,
            endDate: endDate,
            discountPercent: discountPercent,
            carIds: carIds
        })
    });

    if (!response.ok) {
        throw new Error('Failed to create promotion');
    }

    return await response.json();
}

export async function editPromotion(promotionId, { name, description, startDate, endDate, discountPercent, carIds }) {
    const response = await fetch(`http://localhost:8080/api/private/promotions/${promotionId}/edit-promotion`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({
            name: name,
            description: description,
            startDate: startDate,
            endDate: endDate,
            discountPercent: discountPercent,
            carIds: carIds
        })
    });

    if (!response.ok) {
        throw new Error('Failed to edit promotion');
    }

    return await response.json();
}

export async function deletePromotion(promotionId) {
    const response = await fetch(`http://localhost:8080/api/private/promotions/${promotionId}/delete-promotion`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete promotion');
    }

    return await response.json();
}

export async function getPromotions() {
    const response = await fetch('http://localhost:8080/api/public/promotions', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch promotions');
    }

    return await response.json();
}

export async function getPromotionById(promotionId) {
    const response = await fetch(`http://localhost:8080/api/public/promotions/${promotionId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch promotion');
    }

    return await response.json();
}