import { useAuthStore } from "../stores/authStore";

export async function createBrand({ brandName, brandLogo }) {
    const formData = new FormData();
    formData.append('brandName', brandName);
    formData.append('brandLogo', brandLogo);

    const response = await fetch('http://localhost:8080/api/private/car-brand/create-brand', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to create brand');
    }

    return await response.json();
}

export async function createModel({ modelName }) {
    const response = await fetch('http://localhost:8080/api/private/car-model/create-model', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({
            modelName: modelName
        })
    });

    if (!response.ok) {
        throw new Error('Failed to create model');
    }

    return await response.json();
}