import './Nav.css'
import { UserContext } from '../../context/user.context'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Nav(){
    const {logoutUser} = useContext(UserContext)
    const navigate = useNavigate()
    function logout(){
        logoutUser()
        navigate("/")
    }
    return (
        <nav>
            <h3 style={{fontFamily:"Roboto"}}>MAJDWARE</h3>
            <button id="logout-btn" onClick={logout}>Logout</button>
        </nav>
    )
}
