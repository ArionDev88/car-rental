import { useAuthStore } from "../stores/authStore";
export async function getProfile() {
    const response = await fetch('http://localhost:8080/api/protected/users/me', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch profile');
    }

    return await response.json();
}

export async function updateProfile({ firstName, lastName, username, email, password }) {
    const response = await fetch('http://localhost:8080/api/protected/users/me/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: password
        })
    });

    if (!response.ok) {
        throw new Error('Failed to update profile');
    }

    return await response.json();
}

export async function getClients(filters = {}) {
    const params = new URLSearchParams();

    if (filters.page) {
        params.append('page', filters.page);
    }

    const url = `http://localhost:8080/api/private/clients?${params.toString()}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch clients');
    }

    return await response.json();

}

export async function getManagers(filters = {}) {
    const params = new URLSearchParams();

    if (filters.page) {
        params.append('page', filters.page);
    }

    const url = `http://localhost:8080/api/private/managers?${params.toString()}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch managers');
    }

    return await response.json();
}

export async function addManager({ firstName, lastName, username, email, password }) {
    const response = await fetch('http://localhost:8080/api/private/managers/add-manager', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: password
        })
    });

    if (!response.ok) {
        throw new Error('Failed to add manager');
    }

    return await response.json();
}

export async function deleteManager(managerId) {
    const response = await fetch(`http://localhost:8080/api/private/managers/remove-manager/${managerId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to delete manager');
    }

    return await response.json();
}