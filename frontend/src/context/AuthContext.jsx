import { createContext, useEffect, useState } from "react";
import { refreshApi,logout } from "../api/auth.api";
import { setAccessToken, clearAccessToken } from "../api/axios";

export const AuthContext = createContext(null);
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)
    const [accessToken, setAccessTokenState] = useState(null);
    // app start hone par auth restore
    useEffect(() => {
        const initAuth = async () => {
            try {
                const storedUser = localStorage.getItem("user")
                if (!storedUser) {
                    setLoading(false)
                    return
                }
                const res = await refreshApi();
                setUser(JSON.parse(storedUser))
                setAccessTokenState(res.data.accessToken)
                setAccessToken(res.data.accessToken)
            } catch (error) {
                localStorage.removeItem("user")
                clearAccessToken();
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        initAuth();
    }, [])

    const signUp = ({ user, accessToken }) => {
        setUser(user);
        setAccessTokenState(accessToken);
        setAccessToken(accessToken)
        localStorage.setItem("user", JSON.stringify(user))
    }

    const login = ({ user, accessToken }) => {
        setUser(user);
        setAccessTokenState(accessToken);
        setAccessToken(accessToken)
        localStorage.setItem("user", JSON.stringify(user))
    };
    const logout = async () => {
        try {
            await logout()
        } catch { }
        setUser(null);
        clearAccessToken();
        localStorage.removeItem("user");
    };


    const value = {
        user,
        signUp,
        isAuthenticated: !!user,
        login,
        logout
    };
    if (loading) {
        return <div>Loading....</div>
    }
    return <>
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
}