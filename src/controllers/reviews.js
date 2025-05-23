import { useAuthStore } from "../stores/authStore";

export async function makeReview( carId, rating ) {
    const response = await fetch(`http://localhost:8080/api/protected/cars/${carId}/add-review`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({
            carId: carId,
            rating: rating,
        })
    });

    if (!response.ok) {
        throw new Error('Failed to submit review');
    }

    return await response.json();
}

export async function removeReview( carId ) {
    const response = await fetch(`http://localhost:8080/api/protected/cars/${carId}/delete-my-review`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to remove review');
    }

    return await response.json();
}