export async function signUp({ firstName, lastName, username, email, password }) {
    const response = await fetch('http://localhost:8080/api/public/authentication/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstName,
            lastName,
            username,
            email,
            password
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to sign up');
    }

    return await response.json();
}

export async function login({ email, password }) {
    const response = await fetch('http://localhost:8080/api/public/authentication/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to log in');
    }

    return await response.json();
}