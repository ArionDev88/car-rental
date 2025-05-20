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