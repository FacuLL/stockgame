import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    
    const [user, setUser] = useState();
    const [error, setError] = useState();
    const [session, setSession] = useState('loading');

    const login = async (credentials, type) => {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/login/' + type, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(credentials),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(handleErrorMessage(json));
        setUser(json);
        setSession('logged');
    }

    const register = async (credentials, type) => {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/" + type, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(credentials),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(handleErrorMessage(json));
        return true;
    }

    const validate = async (mustBeLogged, typeRequied) => {
        if (mustBeLogged && session == "not logged") return reloadUser();
        if (mustBeLogged && session == "logged" && typeRequied && !typeRequied.find((type) => type === user.type)) return false;
        if (!mustBeLogged && session == "logged") return false;
        return true;
    }

    const reloadUser = async () => {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/user/profile', {method: 'GET', credentials: 'include'});
        if (!res.ok) return false;
        setUser(await res.json());
        setSession('logged');
        return true;
    }

    const logout = async () => {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/logout', {credentials: 'include', method: 'GET'});
        if (!res.ok) return false;
        setUser(null);
        setSession('not logged');
        return true;
    }

    const handleErrorMessage = (res) => {
        switch(res.statusCode) {
            case 401: return 'Usuario o contraseña incorrecto';
            case 503: return 'Error en el servidor';
            case 400: return res.message[0]
            default: return 'Error desconocido';
        }
    }

    return (
        <AuthContext.Provider value={{ user, error, session, login, validate, logout, reloadUser, register }}>
            {children}
        </AuthContext.Provider>
    );
};