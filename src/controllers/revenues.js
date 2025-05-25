import { useAuthStore } from "../stores/authStore";

export async function getCars(){
    const response = await fetch('http://localhost:8080/api/private/car/cars', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch cars');
    }

    return await response.json();
}

export async function getRevenues(filters = {}) {
    const params = new URLSearchParams();

    if (filters.from) {
        params.append('from', filters.from);
    }
    if (filters.to) {
        params.append('to', filters.to);
    }
    if (filters.carIds) {
        params.append('carIds', filters.carIds);
    }
    if (filters.page){
        params.append('page', filters.page);
    }

    const url = `http://localhost:8080/api/private/revenues?${params.toString()}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch revenues');
    }

    return await response.json();
}

export async function downloadRevenuesReport(filters = {}) {
    const params = new URLSearchParams();

    if (filters.from) {
        params.append('from', filters.from);
    }
    if (filters.to) {
        params.append('to', filters.to);
    }
    if (filters.carIds) {
        params.append('carIds', filters.carIds);
    }

    const url = `http://localhost:8080/api/private/revenues/report?${params.toString()}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to download revenue report');
    }

    return await response.blob();
}