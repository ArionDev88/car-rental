import { useAuthStore } from "../stores/authStore";

export async function getClientDashboard() {
    const response = await fetch('http://localhost:8080/api/protected/landing-page', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch client dashboard');
    }

    return await response.json();
}