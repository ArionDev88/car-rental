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

export async function updateBranch({ id, name, address, city, phone }) {
    const response = await fetch(`http://localhost:8080/api/private/branch/update-branch/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({
            name,
            address,
            city,
            phone
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update branch');
    }

    return await response.json();
}

export async function deleteBranch(id) {
    const response = await fetch(`http://localhost:8080/api/private/branch/delete-branch/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        }
    });

    if (!response.ok) {
        return await response.json().then(data => {
            throw new Error(data.message || 'Failed to delete branch');
        });
    }

    return await response.json();
}

export async function getBranchById(id) {
    const response = await fetch(`http://localhost:8080/api/public/branch/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch branch');
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