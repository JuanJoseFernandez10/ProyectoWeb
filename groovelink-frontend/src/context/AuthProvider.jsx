// AuthProvider.js
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { loginRequest, registerRequest } from "../api/auth";

const AUTH_STORAGE_KEY = "groovelink_auth";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [authFieldErrors, setAuthFieldErrors] = useState({});
    const [authFieldLabels, setAuthFieldLabels] = useState({});

    useEffect(() => {
        const raw = localStorage.getItem(AUTH_STORAGE_KEY);
        if (!raw) return;

        try {
            const parsed = JSON.parse(raw);
            setUser(parsed.user ?? null);
            setToken(parsed.token ?? null);
        } catch {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    }, []);

    const persistSession = (sessionUser, sessionToken) => {
        setUser(sessionUser);
        setToken(sessionToken);
        localStorage.setItem(
            AUTH_STORAGE_KEY,
            JSON.stringify({ user: sessionUser, token: sessionToken }),
        );
    };

    const getUserFromAuthResponse = (response, fallbackUser = {}) => {
        if (response?.user) return response.user;

        const rootUser = {
            username: response?.username ?? fallbackUser?.username ?? null,
            email: response?.email ?? fallbackUser?.email ?? null,
            role: response?.role ?? fallbackUser?.role ?? null,
        };

        return rootUser;
    };

    const login = async ({ username, password }) => {
        setIsLoading(true);
        setAuthError(null);
        setAuthFieldErrors({});
        setAuthFieldLabels({});

        try {
            const response = await loginRequest({ username, password });
            const mappedUser = getUserFromAuthResponse(response, { username, role: null });
            persistSession(mappedUser, response.token ?? null);
            return response;
        } catch (error) {
            const message = error?.message || "No se pudo iniciar sesion";
            setAuthError(message);
            setAuthFieldErrors(
                error?.errors ||
                    (error?.field ? { [error.field]: error?.fieldMessage || message } : {}),
            );
            setAuthFieldLabels(
                error?.errorLabels ||
                    (error?.field && error?.fieldLabel ? { [error.field]: error.fieldLabel } : {}),
            );
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async ({ username, email, password, role }) => {
        setIsLoading(true);
        setAuthError(null);
        setAuthFieldErrors({});
        setAuthFieldLabels({});

        try {
            const response = await registerRequest({ username, email, password, role });
            const mappedUser = getUserFromAuthResponse(response, { username, email, role });
            persistSession(mappedUser, response.token ?? null);
            return response;
        } catch (error) {
            const message = error?.message || "No se pudo completar el registro";
            setAuthError(message);
            setAuthFieldErrors(
                error?.errors ||
                    (error?.field ? { [error.field]: error?.fieldMessage || message } : {}),
            );
            setAuthFieldLabels(
                error?.errorLabels ||
                    (error?.field && error?.fieldLabel ? { [error.field]: error.fieldLabel } : {}),
            );
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setAuthError(null);
        setAuthFieldErrors({});
        setAuthFieldLabels({});
        localStorage.removeItem(AUTH_STORAGE_KEY);
    };

    const clearAuthError = () => {
        setAuthError(null);
        setAuthFieldErrors({});
        setAuthFieldLabels({});
    };

    const value = {
        user,
        token,
        isAuthenticated: Boolean(user),
        isLoading,
        authError,
        authFieldErrors,
        authFieldLabels,
        login,
        register,
        logout,
        clearAuthError,
        setUser,
    };

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
}
