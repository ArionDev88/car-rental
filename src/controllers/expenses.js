import { useAuthStore } from "../stores/authStore";

export async function addExpense({ carId, description, amount, date }) {
    const response = await fetch('http://localhost:8080/api/private/expenses/add-expense', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({ carId, description, amount, date }),
    });

    if (!response.ok) {
        throw new Error('Failed to add expense');
    }

    return await response.json();
}

export async function updateExpense(expenseId, { carId, description, amount, date }) {
    const response = await fetch(`http://localhost:8080/api/private/expenses/update-expense/${expenseId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
        body: JSON.stringify({ carId, description, amount, date }),
    });

    if (!response.ok) {
        throw new Error('Failed to update expense');
    }

    return await response.json();
}   

export async function deleteExpense(expenseId) {
    const response = await fetch(`http://localhost:8080/api/private/expenses/delete-expense/${expenseId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete expense');
    }

    return await response.json();
}

export async function getExpenses(filters = {}) {
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

    const url = `http://localhost:8080/api/private/expenses?${params.toString()}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch expenses');
    }

    return await response.json();
}

export async function getExpenseById(expenseId) {
    const response = await fetch(`http://localhost:8080/api/private/expenses/${expenseId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch expense');
    }

    return await response.json();
}

export async function downloadReport(filters = {}) {
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

    const url = `http://localhost:8080/api/private/expenses/report?${params.toString()}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${useAuthStore.getState().token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to download report');
    }

    return await response.blob();
}