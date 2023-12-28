import React, { useContext, useState } from 'react';

const AuthContext = React.createContext({});
export const useAuth = () => {
    return useContext(AuthContext);
};


export const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false); 
    const login = (isAdminValue) => {
        setIsAdmin(isAdminValue || localStorage.getItem('isAdmin')); 
    };
    const logout = () => {
        setIsAdmin(false); 
    };

    const contextValue = {
        isAdmin,
        login,
        logout,
        setIsAdmin
    };

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};