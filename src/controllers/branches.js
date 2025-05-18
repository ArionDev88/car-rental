import { useAuthStore } from "../stores/authStore";
export async function createBranch({ name, address, city, phone }) {
    const response = await fetch('http://localhost:8080/api/private/branch/create-branch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({
            name: name,
            address: address,
            city: city,
            phone: phone
        })
    });

    if (!response.ok) {
        throw new Error('Failed to create branch');
    }

    return await response.json();
}

export async function getBranches() {
    const response = await fetch('http://localhost:8080/api/public/branch/branches', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch branches');
    }

    return await response.json();
}