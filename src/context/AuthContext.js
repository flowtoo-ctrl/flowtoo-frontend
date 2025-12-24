import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';


const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);


export function AuthProvider({ children }){
const [user, setUser] = useState(() => {
const raw = localStorage.getItem('flowtoo:user');
return raw ? JSON.parse(raw) : null;
});


useEffect(() => {
if (user) localStorage.setItem('flowtoo:user', JSON.stringify(user));
else localStorage.removeItem('flowtoo:user');
}, [user]);


const login = async (email, password) => {
const { data } = await api.post('/api/auth/login', { email, password });
setUser(data);
return data;
};


const signup = async (name, email, password) => {
const { data } = await api.post('/api/auth/register', { name, email, password });
setUser(data);
return data;
};


const logout = () => setUser(null);


const value = { user, login, signup, logout };
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}