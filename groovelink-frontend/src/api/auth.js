import { API_URL } from "./config";

async function request(path, payload) {
    const response = await fetch(`${API_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    let data = null;
    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const message = data?.fieldMessage || data?.message || "Error de autenticacion";
        const error = new Error(message);
        error.status = data?.status || response.status;
        error.errorCode = data?.errorCode || null;
        error.field = data?.field || null;
        error.fieldLabel = data?.fieldLabel || null;
        error.fieldMessage = data?.fieldMessage || null;
        error.errors = data?.errors || {};
        error.errorLabels = data?.errorLabels || {};
        throw error;
    }

    return data;
}

export function loginRequest({ username, password }) {
    return request("/auth/login", { username, password });
}

export function registerRequest({ username, email, password, role }) {
    return request("/auth/register", { username, email, password, role });
}
