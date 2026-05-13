// AuthProvider - provider de auth
import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { loginRequest, registerRequest } from "../api/auth";
import { clearAuthSession, readAuthSession, saveAuthSession } from "../api/authSession";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [authNotice, setAuthNotice] = useState(null);
    const [authFieldErrors, setAuthFieldErrors] = useState({});
    const [authFieldLabels, setAuthFieldLabels] = useState({});

    useEffect(() => {
        const session = readAuthSession();
        if (!session.token) {
            clearAuthSession();
            setUser(null);
            setToken(null);
            return;
        }
        setUser(session.user);
        setToken(session.token);
    }, []);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key !== 'groovelink_auth') {
                return;
            }

            const session = readAuthSession();
            if (!session.token) {
                setUser(null);
                setToken(null);
                return;
            }
            setUser(session.user);
            setToken(session.token);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        const handleTokenExpired = () => {
            logout();
        };

        window.addEventListener('auth:token-expired', handleTokenExpired);

        return () => {
            window.removeEventListener('auth:token-expired', handleTokenExpired);
        };
    }, []);

    const persistSession = (sessionUser, sessionToken) => {
        setUser(sessionUser);
        setToken(sessionToken);
        saveAuthSession(sessionUser, sessionToken);
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
        setAuthNotice(null);
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
        setAuthNotice(null);
        setAuthFieldErrors({});
        setAuthFieldLabels({});

        try {
            const response = await registerRequest({ username, email, password, role });
            // El endpoint de registro ahora devuelve token para auto-login
            if (response?.token) {
                const mappedUser = getUserFromAuthResponse(response, { username, email, role });
                persistSession(mappedUser, response.token);
            } else {
                clearAuthSession();
                setUser(null);
                setToken(null);
                setAuthNotice('Cuenta creada correctamente. Ahora inicia sesión.');
            }
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
        setAuthNotice(null);
        setAuthFieldErrors({});
        setAuthFieldLabels({});
        clearAuthSession();
    };

    const clearAuthError = () => {
        setAuthError(null);
        setAuthFieldErrors({});
        setAuthFieldLabels({});
    };

    const clearAuthNotice = () => {
        setAuthNotice(null);
    };

    const value = {
        user,
        token,
        isAuthenticated: Boolean(token),
        isLoading,
        authError,
        authNotice,
        authFieldErrors,
        authFieldLabels,
        login,
        register,
        logout,
        clearAuthError,
        clearAuthNotice,
        setUser,
    };

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
}
