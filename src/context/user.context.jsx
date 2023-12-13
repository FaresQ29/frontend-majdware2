import { createContext, useEffect, useState } from "react";
import { backendUrl } from "../config";
import axios from "axios";


export const UserContext = createContext()


export function UserProviderWrapper({children}){
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(()=>{
        async function startup(){
            await authenticateUser()
        }
        startup()
    }, [])



    function storeToken(token){localStorage.setItem("authToken", token)}

    async function authenticateUser(){
        const storedToken = localStorage.getItem("authToken");
        if(!storedToken){
            setIsLoggedIn(false)
            setIsLoading(false)
            setUser(null)
        }
        else{
            try{
                const response = await axios.get(backendUrl+"/auth/verify", 
                { headers: { Authorization: `Bearer ${storedToken}`}}
                )
                setIsLoggedIn(true)
                setIsLoading(false)
                setUser(response.data.user)

            }
            catch(err){
                console.log("err at auth frontend");
                setIsLoggedIn(false)
                setIsLoading(false)
                setUser(null)

            }
        }

    }

    return (
        <UserContext.Provider value={
            {
                isLoggedIn,
                isLoading,
                user,
                storeToken,
                authenticateUser,
 
            }
        }>
            {children}
        </UserContext.Provider>
    )
}