import { createContext, useEffect, useState } from "react";
import { backendUrl } from "../config";
import axios from "axios";


export const UserContext = createContext()


export function UserProviderWrapper({children}){
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [factories, setFactories] = useState([]);
    const [currentFactory, setCurrentFactory] = useState(null)
    useEffect(()=>{
        async function startup(){
            await authenticateUser()
        }
        startup()
    }, [])


    function storeToken(token){localStorage.setItem("authToken", token)}

    async function addFactoryEntry(entry){
        const factoryCopy = {...currentFactory};
        factoryCopy.entries.push(entry)
        const userCopy = {...user}
        userCopy.factories = userCopy.factories.map(factory=>factory.factoryId===currentFactory.factoryId ? factoryCopy : factory)
        try{
            await axios.put(backendUrl+"/factory/add/" + user._id, userCopy) 
            setUser(userCopy)
            setCurrentFactory(factoryCopy)
            setFactories(userCopy.factories)
        }
        catch(err){
            console.log(err);
        }
    }
    async function editFactoryEntry(editEntry, entryId){
        const userCopy = {...user};
        const factoryCopy = {...currentFactory}
        factoryCopy.entries = factoryCopy.entries.map(entry=>entry._id === entryId ? editEntry : entry)
        userCopy.factories = userCopy.factories.map(factory=>factory.factoryId === factoryCopy.factoryId ? factoryCopy : factory)
        try{
            await axios.put(backendUrl+"/factory/add/" + user._id, userCopy) 
            setUser(userCopy)
            setFactories(userCopy.factories)
        }
        catch(err){
            console.log(err);
        }
    }


    async function addFactory(factoryName){
        const userCopy = {...user}
        userCopy.factories.push({factoryName, factoryId:crypto.randomUUID() ,entries: []})
        await axios.put(backendUrl+"/factory/add/" + user._id, userCopy) 
        setUser(userCopy)
    }

    function changeCurrentFact(factObj){setCurrentFactory(factObj)}




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
                setFactories(response.data.user.factories)

            }
            catch(err){
                console.log("err at auth frontend");
                setIsLoggedIn(false)
                setIsLoading(false)
                setUser(null)

            }
        }

    }
    function logoutUser(){
        localStorage.removeItem("authToken");
        authenticateUser()
    }

    return (
        <UserContext.Provider value={
            {
                isLoggedIn,
                isLoading,
                user,
                logoutUser,
                storeToken,
                authenticateUser,
                factories,
                addFactory,
                changeCurrentFact,
                currentFactory,
                addFactoryEntry,
                editFactoryEntry
            }
        }>
            {children}
        </UserContext.Provider>
    )
}