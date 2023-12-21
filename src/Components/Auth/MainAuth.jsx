import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useContext, useEffect, useRef, useState } from 'react';
import './authStyle.css'
import TextField from '@mui/material/TextField';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Alert, easing } from "@mui/material";
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
    const nameRef = useRef(nameField)
    const passRef = useRef(passField)
    const tabRef = useRef(tabValue)


    useEffect(()=>{
        window.addEventListener("keypress", handleEnter)
        return ()=> window.removeEventListener("keypress", handleEnter)
    }, [])

    function handleEnter(e){
        if(e.key==="Enter"){
            if(tabRef.current==="login"){
                handleLogin(e)
            }
            else if(tabRef.current==="register"){
                handleRegister(e)
            }
        }
    }

    async function handleRegister(e){
        e.preventDefault()
        try{
            setLoading(true)
            const formData = {name: nameRef.current, password: passRef.current}
            const response = await axios.post(backendUrl + "/auth/register", formData)
            storeToken(response.data.authToken);
            authenticateUser()
            console.log(response.data);
            navigate("/main/"+response.data.userId)
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
            const formData = {name: nameRef.current, password: passRef.current}
            const response = await axios.post(backendUrl + "/auth/login", formData)
            storeToken(response.data.authToken);
            authenticateUser()
            navigate("/main/"+response.data.userId)
            setErrMsg(null)
            setLoading(false)
        }
        catch(err){
            setErrMsg(err.response.data.msg)
            setLoading(false)
        }

    }

    function handleChange(e, newValue){
        setTabValue(newValue);
        tabRef.current = newValue
        setNameField("")
        setPassField("")
    }
    function handleUser(e){
       setNameField(()=>{
            nameRef.current = e.target.value
            return e.target.value
       })
    }
    function handlePass(e){
        setPassField(()=>{
             passRef.current = e.target.value
             return e.target.value
        })
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
                        <TextField required id="outlined-required" label="Username" value={nameField} onChange={(e)=>handleUser(e)}/>
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput id="outlined-adornment-password" type={showPassword ? 'text' : 'password'} value={passField} onChange={(e)=>handlePass(e)}
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