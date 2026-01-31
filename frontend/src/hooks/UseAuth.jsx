import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth=()=>{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("user must be used within authProvider")
    }

    return context
}