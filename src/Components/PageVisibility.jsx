import { useContext } from "react";
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";
export function IsPrivate({children}){
    const navigate = useNavigate()

    const {isLoggedIn, isLoading} = useContext(UserContext);
    if(isLoggedIn){
        return children
    }
    else{
        return navigate("/")
        
    }

}

export function IsAnon({children}){
    const {isLoggedIn, isLoading, user} = useContext(UserContext);
    const navigate = useNavigate()
    if(isLoggedIn){
        return navigate("/main/" + user._id)
    }
    
    else{
        return children
    }
}