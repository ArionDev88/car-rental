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
        return await response.json().then(data => {
            throw new Error(data.message || 'Failed to create brand');
        });
    }

    return await response.json();
}

export async function createModel({ name, brandId }) {
    const response = await fetch('http://localhost:8080/api/private/car-model/create-model', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({
            name: name,
            brandId: brandId
        })
    });

    if (!response.ok) {
        return await response.json().then(data => {
            throw new Error(data.message || 'Failed to create model');
        });
    }

    return await response.json();
}

export async function createCar({ modelId, brandId, pricePerDay, licensePlate, year, images, mileage, branchId, category, features }) {
    const formData = new FormData();

    const carData = {
        modelId,
        brandId,
        pricePerDay: Number(pricePerDay),
        licensePlate,
        year: Number(year),
        mileage: Number(mileage),
        branchId,
        category,
        features,
    };

    const dto = new File(
        [JSON.stringify(carData)],
        "dto.json",
        { type: "application/json" }
    );
    formData.append("dto", dto);

    if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }
    }

    const response = await fetch('http://localhost:8080/api/private/car/create-car', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: formData
    });

    if (!response.ok) {
        return await response.json().then(data => {
            throw new Error(data.message || 'Failed to create car');
        });
    }

    return await response.json();
}

export async function getCar(id) {
    const response = await fetch(`http://localhost:8080/api/public/car/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch car details');
    }

    return await response.json();
}

export async function updateCar(carId, { modelId, brandId, pricePerDay, licensePlate, year, images, mileage, branchId, category, features }) {
    const formData = new FormData();

    const carData = {
        modelId,
        brandId,
        pricePerDay: Number(pricePerDay),
        licensePlate,
        year: Number(year),
        mileage: Number(mileage),
        branchId,
        category,
        features,
    };
    const dto = new File(
        [JSON.stringify(carData)],
        "dto.json",
        { type: "application/json" }
    );
    formData.append("dto", dto);

    if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }
    }

    const response = await fetch(`http://localhost:8080/api/private/car/update-car/${carId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: formData
    });

    if (!response.ok) {
        return await response.json().then(data => {
            throw new Error(data.message || 'Failed to update car');
        });
    }

    return await response.json();
}

export async function deleteCar(carId) {
    const response = await fetch(`http://localhost:8080/api/private/car/delete-car/${carId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        }
    });

    if (!response.ok) {
        return await response.json().then(data => {
            throw new Error(data.message || 'Failed to delete car');
        });
    }

    return await response.json();
}

export async function deleteCarImage(id, imageUrl) {
    const response = await fetch(
        `http://localhost:8080/api/private/car/update-car/${id}/delete-image`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useAuthStore.getState().token}`,
            },
            body: JSON.stringify({ imageUrl: imageUrl })
        }
    );

    if (!response.ok) {
        return await response.json().then(data => {
            throw new Error(data.message || 'Failed to delete car image');
        });
    }

    return await response.json();
}

export async function getAllBrands() {
    const response = await fetch('http://localhost:8080/api/private/car-brand/brands', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch brands');
    }

    return await response.json();
}

export async function getAllAvailableBrands() {
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

export async function getAllModelsByBrandId(brandId) {
    const response = await fetch(`http://localhost:8080/api/private/car-brand/${brandId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch models');
    }

    return await response.json();
}

export async function getAllModelsByBrandIds(brandIds) {
    const response = await fetch(`http://localhost:8080/api/public/car-models/selected-brands`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandIds)
    });

    if (!response.ok) {
        throw new Error('Failed to fetch models');
    }

    return await response.json();
}


export async function getAllCars(filters = {}) {
    const params = new URLSearchParams();

    if (filters.categories?.length) {
        filters.categories.forEach(cat => params.append('categories', cat));
    }
    if (filters.minRate != null) {
        params.append('minRate', filters.minRate.toString());
    }
    if (filters.maxRate != null) {
        params.append('maxRate', filters.maxRate.toString());
    }
    if (filters.brandIds?.length) {
        filters.brandIds.forEach(id => params.append('brandIds', id.toString()));
    }
    if (filters.modelIds?.length) {
        filters.modelIds.forEach(id => params.append('modelIds', id.toString()));
    }
    if (filters.branchIds?.length) {
        filters.branchIds.forEach(id => params.append('branchIds', id.toString()));
    }
    if (filters.minYear != null) {
        params.append('minYear', filters.minYear.toString());
    }
    if (filters.maxYear != null) {
        params.append('maxYear', filters.maxYear.toString());
    }
    if (filters.availFrom) {
        params.append('availFrom', filters.availFrom); // ISO date string
    }
    if (filters.availTo) {
        params.append('availTo', filters.availTo);
    }

    // Build full URL including host: Spring Boot listens on port 8080
    const baseUrl = 'http://localhost:8080/api/public/car/cars';
    const url = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch cars (status ${response.status})`);
    }
    return await response.json();
}