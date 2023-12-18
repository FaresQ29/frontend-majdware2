import './factoryToolStyle.css';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useContext, useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { UserContext } from '../../context/user.context';
import {Alert} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../../config';

export default function FactoryMenu(){
    const [anchorEl, setAnchorEl] = useState(null);
    const [showAdd, setShowAdd] = useState(false)
    const [newFactVal, setNewFactVal] = useState("")
    const [alert, setAlert] = useState(null)
    const [searchVal, setSearchVal] = useState("")
    const {user, addFactory, factories, getFactories} = useContext(UserContext)

    const open = Boolean(anchorEl);
    function handleSearch(e){
        setSearchVal(e.target.value);

    }

    async function addFactoryFunc(){
        if(!newFactVal){return}
        const factObj = {factoryName: newFactVal, factoryUser: user._id, entries:[]}

        await  addFactory(factObj)
        setAlert(null)
        setShowAdd(false)
}



    function closeMenu(){
        setAnchorEl(null);
        setShowAdd(false);
        setSearchVal("")
        setAlert(null)
    }
    return (
        <div className='factory-menu-div'>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={e=>setAnchorEl(e.currentTarget)}
                sx={{color:"black", fontSize:"1rem"}}
            >
                Factories
            </Button>
            <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={closeMenu}>
                <div className="menu-style-div">
                    <TextField id="factory-search" label="Search factories" variant="standard" sx={{marginBottom:"10px"}} value={searchVal} onChange={handleSearch}/>
                    {factories  && <ListFactories searchVal={searchVal} closeMenu={closeMenu}/> }    
                    <div className="add-cancel-div" style={showAdd ? {background: "#0000000b"} : {background: "none"}}>
                        <Button color='inherit' onClick={()=>{setShowAdd(prev=>!prev); setNewFactVal(""); setAlert(null)}}> {!showAdd ? <AddIcon/> : "CANCEL"} </Button>
                        {showAdd && (
                            <>
                                <div className='menu-add-fact'>
                                    <TextField id="factory-name-add" label="Factory name" variant="outlined" sx={{background:"white"}} value={newFactVal} onChange={(e)=>setNewFactVal(e.target.value)}/>
                                    <Button color='inherit' variant='outlined' sx={{background:"white"}} onClick={addFactoryFunc}>Add</Button>                        
                                </div>
                                {alert && <Alert severity='error'>{alert}</Alert>}
                            </>
                        )}
                    </div>

                </div>
            </Menu>
            </div>
    )
}

function ListFactories({searchVal, closeMenu}){
    const {factories, getCurrentFact} = useContext(UserContext)

    function handleFactBtn(factObj){
        getCurrentFact(factObj._id)
        closeMenu()
    }
    return (
        <div className="list-factories">
            {factories.length===0 && <p className='empty-fac'>Factory list empty...</p>}
            {factories.length>0 && (
                factories.map((fact, i)=>{
                    let show = true;
                    if(searchVal.length>0 && !fact.factoryName.toLowerCase().includes(searchVal.toLowerCase())){show=false}
                    return (
                            <div className={`factory-menu-item${!show?" fact-hide":""}`} key={i}>
                               <button style={{fontFamily: "Roboto, serif"}} onClick={()=>handleFactBtn(fact)}>{fact.factoryName}</button> 
                            </div>
                    )
                }).reverse()
            )}
        </div>
    )
}