import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";


function PrivateRoute({ children, requireAdmin = false }) {

    const {user, isAdmin, loading} = useAuth()
    const navigate = useNavigate()
    
    useEffect(()=> {
        if (!loading) {
            if(!user) {
                navigate("/login")
            } else if (requireAdmin && !isAdmin) {
                toast.error("Bu sayfaya erişim için admin yetkisi gereklidir!")
                navigate("/")
            }
        }
    },[user, isAdmin, loading, requireAdmin, navigate])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return ( 
        <>
            { children }
        </>
     );
}

export default PrivateRoute;