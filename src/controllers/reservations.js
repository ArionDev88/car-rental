import { useAuthStore } from "../stores/authStore";
export async function getReservations() {
    const response = await fetch('http://localhost:8080/api/private/reservations', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch reservations');
    }

    return await response.json();
}