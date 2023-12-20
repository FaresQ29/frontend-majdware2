import { createContext, useEffect, useState } from "react";
import { backendUrl } from "../config";
import axios from "axios";
import { useParams } from "react-router-dom";

export const UserContext = createContext()


export function UserProviderWrapper({children}){
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null)
    const [factories, setFactories] = useState(null)
    const [currentFactory, setCurrentFactory] = useState(null)

    useEffect(()=>{
        async function startup(){
            await authenticateUser()
        }
        startup()
    }, [])


    function storeToken(token){localStorage.setItem("authToken", token)}

    async function addCode(codeObj){
        const storedToken = localStorage.getItem("authToken");

        try{
            const checkIfExists = user.codes.find(elem=>elem.code===codeObj.code)
            if(checkIfExists) throw Error("Code already exists")
            const userCopy = {...user}
            userCopy.codes.push(codeObj)
            const response = await axios.put(backendUrl+"/user/add/"+user._id, userCopy,
            { headers: { Authorization: `Bearer ${storedToken}`}}
            )
            await authenticateUser()
        }
        catch(err){
                console.log(err);
        }
    }
    async function deleteCode(codeId){
        const storedToken = localStorage.getItem("authToken");
        try{
            const userCopy = {...user}
            userCopy.codes = userCopy.codes.filter(code=>code._id!==codeId)
            const response = await axios.put(backendUrl+"/user/add/"+user._id, userCopy,
            { headers: { Authorization: `Bearer ${storedToken}`}}
            )
            await authenticateUser()
        }
        catch(err){
                console.log(err);
        }
    }
    async function getCurrentFact(factId){
        const storedToken = localStorage.getItem("authToken");
        try{
            const response = await axios.get(backendUrl+"/factory/fact/"+factId,
            { headers: { Authorization: `Bearer ${storedToken}`}}
            )
            setCurrentFactory(response.data)
            return response.data;
        }
        catch(err){
            console.log(err);
        }
    }
    async function getFactories(userId){
        const storedToken = localStorage.getItem("authToken");
        try{
            const response = await axios.get(backendUrl+"/factory/all", 
            { headers: { Authorization: `Bearer ${storedToken}`, userid:userId}}
            )
            setFactories(response.data)
            return response.data
        }
        catch(err){
            console.log(err);
        }
    }
    async function addFactoryEntry(entryForm){
        const storedToken = localStorage.getItem("authToken");
        const factCopy = {...currentFactory}
        entryForm.timestamp = Date.now()
        factCopy.entries.push(entryForm)
        try{
            const response = await axios.put(backendUrl+"/factory/"+currentFactory._id, factCopy,
            { headers: { Authorization: `Bearer ${storedToken}`}}
            )
            setCurrentFactory(response.data)
        }
        catch(err){
            console.log(err);
        }
    }
    async function editFactoryEntry(entryForm, entryId){
        const storedToken = localStorage.getItem("authToken");
        const factCopy = {...currentFactory}
        factCopy.entries = factCopy.entries.map(entry=>{
            return entry._id===entryId ? entryForm : entry;
        })
        try{
            const response = await axios.put(backendUrl+"/factory/"+currentFactory._id, factCopy,
            { headers: { Authorization: `Bearer ${storedToken}`}}
            )
            setCurrentFactory(response.data)
        }
        catch(err){
            console.log(err);
        }
    }

    async function deleteFactoryEntry(entryId){
        const storedToken = localStorage.getItem("authToken");
        const factCopy = {...currentFactory}
        factCopy.entries = factCopy.entries.filter(entry=>entry._id!==entryId)
        
        try{
            const response = await axios.put(backendUrl+"/factory/"+currentFactory._id, factCopy, 
            { headers: { Authorization: `Bearer ${storedToken}`}}
            )
            setCurrentFactory(response.data)
        }
        catch(err){
            console.log(err);
        }
    }
    async function addFactory(factObj){
        const storedToken = localStorage.getItem("authToken");

        try{
            await axios.post(backendUrl+"/factory/all", factObj,
            { headers: { Authorization: `Bearer ${storedToken}`}}
            )
            await getFactories(factObj.factoryUser)

        }
        catch(err){
            console.log(err);
        }
    }

 
    
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
                await getFactories(response.data.user._id)

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
        setFactories(null)
        setCurrentFactory(null)
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
                currentFactory,
                addFactory,
                factories,
                addFactoryEntry,
                editFactoryEntry,
                getCurrentFact,
                deleteFactoryEntry,
                addCode,
                deleteCode
            }
        }>
            {children}
        </UserContext.Provider>
    )
}