import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    
    const [user, setUser] = useState();
    const [error, setError] = useState();

    const login = async (credentials, type) => {
        const res = await fetch(process.env.BACKEND_URL + '/auth/login/' + type, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(handleErrorMessage(json));
        setUser(json);
    }

    const validate = async (mustBeLogged, typeRequied) => {
        if (mustBeLogged && !user) return reloadUser();
        if (mustBeLogged && user && typeRequied && !typeRequied.find((type) => type === user.type)) return false;
        if (!mustBeLogged && user) return false;
        return true;
    }

    const reloadUser = async () => {
        const res = await fetch(process.env.BACKEND_URL + '/auth/user', {method: 'GET'});
        if (!res.ok) return false;
        setUser(await res.json());
        return true;
    }

    const logout = async () => {
        const res = await fetch(process.env.BACKEND_URL + '/auth/logout', {method: 'GET'});
        if (!res.ok) return false;
        setUser(undefined);
        return true;
    }

    const handleErrorMessage = (res) => {
        switch(res.code) {
            case 401: return 'Usuario o contraseña incorrecto';
            case 503: return 'Error en el servidor';
            default: return 'Error desconocido';
        }
    }

    return (
        <AuthContext.Provider value={{ user, error, validate, logout, reloadUser }}>
            {children}
        </AuthContext.Provider>
    );
};