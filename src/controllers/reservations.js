import { useAuthStore } from "../stores/authStore";
export async function getReservations(filters = {}) {
    const params = new URLSearchParams();

    if (filters.from) {
        params.append('from', filters.from);
    }
    if (filters.to) {
        params.append('to', filters.to);
    }
    if (filters.status) {
        params.append('status', filters.status);
    }
    const url = `http://localhost:8080/api/private/reservations?${params.toString()}`;
    const response = await fetch(url, {
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

export async function updateReservationStatus(id, status) {
    const response = await fetch(`http://localhost:8080/api/private/reservations/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify(status)
    });

    if (!response.ok) {
        throw new Error('Failed to update reservation status');
    }

    return await response.json();
}

export async function bookCar({ carId, startDate, endDate, paymentOption }) {
    const response = await fetch('http://localhost:8080/api/protected/reservations/book', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({
            carId: carId,
            startDate: startDate,
            endDate: endDate,
            paymentOption: paymentOption
        })
    });

    if (!response.ok) {
        throw new Error('Failed to book car');
    }

    return await response.json();
}