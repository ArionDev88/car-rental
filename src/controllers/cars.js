import { useAuthStore } from "../stores/authStore";

export async function createBrand({ name, logo }) {
    const formData = new FormData();

    const dto = new File(
        [JSON.stringify({ name })],
        "dto.json",
        { type: "application/json" }
    );
    formData.append("dto", dto);

    if (logo instanceof FileList) {
        formData.append("logo", logo[0]);
    } else if (logo instanceof File) {
        formData.append("logo", logo);
    }

    const response = await fetch(
        "http://localhost:8080/api/private/car-brand/create-brand",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${useAuthStore.getState().token}`,
            },
            body: formData,
            credentials: "include"
        }
    );

    if (!response.ok) {
        throw new Error("Failed to create brand");
    }

    return await response.json();
}

export async function createModel({ name,brandId }) {
    const response = await fetch('http://localhost:8080/api/private/car-model/create-model', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({
            name: name,
            brandId: brandId
        })
    });

    if (!response.ok) {
        throw new Error('Failed to create model');
    }

    return await response.json();
}

export async function createCar({ carModel, carBrand, carPrice, licensePlate, year, carImages, mileage, carBranch, category, features }) {
    const formData = new FormData();
    formData.append('carModel', carModel);
    formData.append('carBrand', carBrand);
    formData.append('carPrice', carPrice);
    formData.append('licensePlate', licensePlate);
    formData.append('year', year);
    formData.append('mileage', mileage);
    formData.append('carBranch', carBranch);
    formData.append('category', category);
    formData.append('features', features);

    for (let i = 0; i < carImages.length; i++) {
        formData.append('carImages', carImages[i]);
    }

    const response = await fetch('http://localhost:8080/api/private/car/create-car', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error('Failed to create car');
    }

    return await response.json();
}

export async function getAllBrands() {
    const response = await fetch('http://localhost:8080/api/public/car-brand/brands', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch brands');
    }

    return await response.json();
}