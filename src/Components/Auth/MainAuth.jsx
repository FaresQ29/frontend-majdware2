import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useContext, useEffect, useState } from 'react';
import './authStyle.css'
import TextField from '@mui/material/TextField';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Alert } from "@mui/material";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import { BackdropCreate } from '../Elements';
import { backendUrl } from '../../config';
import { UserContext } from '../../context/user.context';
import { useNavigate } from "react-router-dom";

import axios from 'axios';


export default function MainAuth(){
    const [tabValue, setTabValue] = useState('login');
    const [nameField, setNameField] = useState("");
    const [passField, setPassField] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const {storeToken, authenticateUser} = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [errMsg ,setErrMsg] = useState(null)

    useEffect(()=>{
        window.addEventListener("keypress", enterLogin)
        function enterLogin(e){
            console.log("Jkljds");
           if(e.key==="Enter" && (nameField && passField)){
            if(tabValue==="login"){handleLogin()}
            else if(tabValue==="register"){handleRegister()}}
        }
        return ()=> window.removeEventListener("keypress", enterLogin)
    }, [])
    async function handleRegister(e){
        e.preventDefault()
        try{
            setLoading(true)
            const formData = {name: nameField, password: passField}
            const response = await axios.post(backendUrl + "/auth/register", formData)
            storeToken(response.data.authToken);
            authenticateUser()
            navigate("/main")
            setLoading(false)
            setErrMsg(null)
            console.log("Successfully registered");
        }
        catch(err){
            setErrMsg(err.response.data.msg)
            setLoading(false)
        }
    }
    async function handleLogin(e){
        e.preventDefault()
        try{
            setLoading(true)
            const formData = {name: nameField, password: passField}
            const response = await axios.post(backendUrl + "/auth/login", formData)
            storeToken(response.data.authToken);
            authenticateUser()
            navigate("/main")
            setErrMsg(null)
            setLoading(false)
        }
        catch(err){
            setErrMsg(err.response.data.msg)
            console.log(err);
            setLoading(false)
        }

    }

    function handleChange(e, newValue){
        setTabValue(newValue);
        setNameField("")
        setPassField("")
    }
    return (
        <>
            {loading && <BackdropCreate/>}
            {!loading && (
                <div id="main-auth-cont">
                    <Tabs value={tabValue} onChange={handleChange} textColor="inherit" aria-label="Login and Register" sx={{alignSelf:"center"}}>
                        <Tab value="login" label="Login" />
                        <Tab value="register" label="Register" />
                    </Tabs>
                    <form id="auth-input-cont">
                        <TextField required id="outlined-required" label="Username" value={nameField} onChange={(e)=>setNameField(e.target.value)}/>
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput id="outlined-adornment-password" type={showPassword ? 'text' : 'password'}
                            value={passField}
                            onChange={(e)=>setPassField(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={()=>{setShowPassword(prev=>!prev)}} onMouseDown={(e)=>e.preventDefault()} edge="end" >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                                label="Password"
                            />
                        </FormControl>
                        {errMsg && <Alert severity='error'>{errMsg}</Alert>}
                            {tabValue==="login" && (<Button variant="outlined" onClick={handleLogin}>Enter</Button> )}    
                            {tabValue==="register" && (<Button variant="outlined" onClick={handleRegister}>Register</Button> )}    
                        
                    </form>
                </div>
            )}
        </>

    )
}