import { useAuthStore } from "../stores/authStore";
export async function getProfile(){
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

export async function updateProfile({firstName, lastName, username, email, password}) {
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