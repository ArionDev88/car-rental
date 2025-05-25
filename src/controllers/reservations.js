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
    if (filters.page) {
        params.append('page', filters.page);
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

export async function getMyReservations() {
    const response = await fetch('http://localhost:8080/api/protected/reservations', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch my reservations');
    }

    return await response.json();
}

export async function cancelReservation(id) {
    const response = await fetch(`http://localhost:8080/api/protected/reservations/cancel/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to cancel reservation');
    }

    return await response.json();
}

export async function editReservation(id, { carId, startDate, endDate, paymentOption }) {
    const response = await fetch(`http://localhost:8080/api/protected/reservations/edit-reservation/${id}`, {
        method: 'PUT',
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
        throw new Error('Failed to edit reservation');
    }

    return await response.json();
}

export async function getPastReservation() {
    const response = await fetch('http://localhost:8080/api/protected/landing-page/past-reservations', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch past reservations');
    }
    return await response.json();
}

export async function getFutureReservations() {
    const response = await fetch('http://localhost:8080/api/protected/landing-page/future-reservations', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch future reservations');
    }
    return await response.json();
}

export async function getCurrentReservation() {
    const response = await fetch('http://localhost:8080/api/protected/landing-page/current-reservations', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch current reservations');
    }
    return await response.json();
}

export async function downloadReservationsReport() {
    const url = `http://localhost:8080/api/private/reservations/report`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to download reservations report');
    }

    return await response.blob();
}