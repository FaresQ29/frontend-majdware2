import './tableStyle.css';
import { UserContext } from '../../context/user.context';
import { useContext, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import {TextField }from '@mui/material';
import numeral from 'numeral'
import { dateObjToDisp } from '../../utils';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

import dayjs from 'dayjs';
export default function Table(){
    const {getCurrentFact, currentFactory} = useContext(UserContext)
    const [factory, setFactory] = useState(null)
    useEffect(()=>{
        refreshFactory()
    },[])

    async function refreshFactory(){
        const response = await getCurrentFact(currentFactory._id)
        setFactory(response)

    }
    return (
        <div id="table-general-cont">
            <NewEntryAdd />
            {(factory && factory.entries.length===0) && <div className="table-entry-warning">No data...</div> }        
            {(factory && factory.entries.length>0) && (
                <div id="main-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Designação</th>
                                <th>Crédito</th>
                                <th>Débito</th>
                                <th>Saldo</th>
                            </tr>
                        </thead>
                        <tbody>
                                {factory.entries.map((entry, i)=>{
                                    return <TableEntry key={i} entry={entry} refreshFactory={refreshFactory}/>
                                })}
                        </tbody>

                    </table>
                </div>
            )}
        </div>

    )
}

function TableEntry({entry, refreshFactory}){
    const [isEditMode, setIsEditMode]=useState(false)
    const defaultForm = {desig: entry.desig, data: entry.data, credito: entry.credito, debito: entry.debito}
    const [editForm, setEditForm] = useState(defaultForm)
    const {editFactoryEntry} = useContext(UserContext)

    useEffect(()=>{
        isEditMode ? window.addEventListener("click", closeEdit) : window.removeEventListener("click", closeEdit)
        function closeEdit(e){

            if(!e.target.closest(`.row-${entry._id}`) && !e.target.closest(".MuiPickersPopper-root") ){
                setIsEditMode(false)
            }
        }
        return ()=>{
            window.removeEventListener("click", closeEdit)
        }
    }, [isEditMode])

    async function handleEdit(){
        if(!editForm.desig || !editForm.data || !editForm.credito || !editForm.debito) return
        try{
            await editFactoryEntry(editForm, entry._id)
            await refreshFactory()
            setIsEditMode(false)

        }
        catch(err){
            console.log("err");
        }
    }
    function handleDesig(e){
        setEditForm(prev=>{
            return {...prev, desig: e.target.value}
        })
    }
    function handleNumInput(e){
        const {name, value} = e.target;
        setEditForm(prev=>{
            const formatNum = numeral(value).format('0,0')
            return {...prev, [name]: formatNum}
        })
    }
    function handleDate(e){
        setEditForm(prev=>{
            return {...prev, data: e.$d}
        })
    }
    return (
        <>
            {!isEditMode && (
                <tr className={`table-entry-row row-${entry._id}`} onDoubleClick={()=>setIsEditMode(true)}>
                    <td className='table-entry-cell'>{dateObjToDisp(entry.data)}</td>
                    <td className='table-entry-cell'>{entry.desig}</td>
                    <td className='table-entry-cell'>{entry.credito}</td>
                    <td className='table-entry-cell'>{entry.debito}</td>
                    <td className='table-entry-cell'></td>
                </tr> 
            )}
            {isEditMode && (
                <tr className={`table-entry-edit-row row-${entry._id}`}>

                    <td className='table-entry-cell'>
                        <EditIcon className='edit-icon'/>
                        <DatePicker format="DD/MM/YYYY" onChange={handleDate} defaultValue={null} value={dayjs(editForm.data)} />
                        </td>
                    <td className='table-entry-cell'><TextField label="Designação" value={editForm.desig} onChange={handleDesig}/></td>
                    <td className='table-entry-cell'><TextField label="Crédito" value={editForm.credito} onChange={handleNumInput} name="credito"/></td>
                    <td className='table-entry-cell'><TextField label="Débito" value={editForm.debito} onChange={handleNumInput} name="debito"/></td>
                    <td className='table-entry-cell'>
                        <div className="edit-icons-div">
                            <button onClick={handleEdit}><SaveIcon/></button>
                            <button onClick={()=>{setIsEditMode(false); setEditForm(defaultForm)}}><CloseIcon/></button>
                        </div>
                    </td>
                </tr> 
            )}
        </>

    )
}


function NewEntryAdd(){
    const [form, setForm] = useState({desig: "", data: null, credito: "0", debito: "0"})
    const {addFactoryEntry} = useContext(UserContext)
    function handleNumInput(e){
        const {name, value} = e.target;
        setForm(prev=>{
            const formatNum = numeral(value).format('0,0')
            return {...prev, [name]: formatNum}
        })
    }
    function handleDates(e){
        setForm(prev=>{return {...prev, data: e.$d}})
    }
    function handleDesig(e){
        setForm(prev=>{return {...prev, desig: e.target.value}})
    }
    async function handleNewEntryAdd(e){
        if(!form.data || !form.desig || !form.credito || !form.debito){return}
        try{
            await addFactoryEntry(form)
            setForm({desig: "", data: null, credito: "0", debito: "0"})
        }
        catch(err){console.log(err)}
    }
    return (
        <div className='new-entry-div'>
            <table className="new-entry-table">
                <tbody>
                <tr>
                    <td>
                        <DatePicker sx={newEntryStyle}  format="DD/MM/YYYY" onChange={handleDates} defaultValue={null} value={!form.data ? null : form.data}/>
                    </td>
                    <td>
                        <TextField label="Designação" style={newEntryStyle} onChange={handleDesig} value={form.desig}/>
                    </td>
                    <td>
                        <TextField label="Crédito" style={newEntryStyle} onChange={handleNumInput} name="credito" value={form.credito}/>
                    </td>
                    <td>
                        <TextField label="Débito" style={newEntryStyle} onChange={handleNumInput} name="debito" value={form.debito}/>
                    </td>
                    <td>
                        <TextField label="Saldo"  style={newEntryStyle} disabled/>
                    </td>
                </tr>
                </tbody>
            </table>        
            <Button className='newEntryBtn' onClick={(handleNewEntryAdd)}><AddIcon/></Button>
        </div>

    )
}

const newEntryStyle = {
  width: "100%"
}