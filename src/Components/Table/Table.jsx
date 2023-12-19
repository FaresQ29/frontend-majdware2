import './tableStyle.css';
import { UserContext } from '../../context/user.context';
import { useContext, useEffect, useRef, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Button, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import {TextField }from '@mui/material';
import numeral from 'numeral'
import { dateObjToDisp, formattedStrToNum } from '../../utils';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import dayjs from 'dayjs';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterDate from "../FilterDate/FilterDate.jsx"
import DateRangeIcon from '@mui/icons-material/DateRange';
import MakeDraggable from '../MakeDraggable.jsx';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

export default function Table({setDisplayTable}){
    const {getCurrentFact, currentFactory} = useContext(UserContext)
    const [showDateDiv, setShowDateDiv] = useState(false)
    const [factory, setFactory] = useState(null)
    const [lastEntrySaldo, setLastEntrySaldo] = useState(0)
    const [showDesigMenu, setShowDesigMenu] = useState(false)
    const [filter, setFilter] = useState({
        date: "asc",
        codes: [],
        dateRange: {
            from: null,
            to: null
        }
    })
    useEffect(()=>{
        setDisplayTable(factory)
    }, [factory])
    useEffect(()=>{
        refreshFactory()
    },[])
    useEffect(()=>{
        setFactory(filterSettings(currentFactory))
    }, [currentFactory])

    useEffect(()=>{
        setFactory(filterSettings(currentFactory))
        refreshFactory()
    }, [filter])

    async function refreshFactory(){
        const response = await getCurrentFact(currentFactory._id)
        setFactory(filterSettings(response))

    }
    function changeFilterDates(from, to){
        setFilter(prev=>{
            const copy = {...prev}
            copy.dateRange.from= from;
            copy.dateRange.to= to;
            return copy
        })
    }
    function calculateSaldo(fact){
        const copyEntries = [...fact.entries]
        copyEntries.sort((a, b)=>{
            if(new Date(a.data)>new Date(b.data)){return 1}
            else{return -1}
        })
        copyEntries.sort((a, b)=>{
            if(new Date(a.data).getTime()===new Date(b.data).getTime()){
                if(a.timestap>b.timestamp){return 1}
                else{return -1}
            }
        })
        copyEntries.map((entry, index)=>{
            if(index===0){ entry.saldo = checkSaldoEntry(entry) }
            else { entry.saldo = copyEntries[index-1].saldo + checkSaldoEntry(entry)}
            if(index===copyEntries.length-1) setLastEntrySaldo(entry.saldo)
        })

        fact.entries = copyEntries
    }
    function filterSettings(fact){
        const factCopy = {...fact}
        calculateSaldo(factCopy)
        factCopy.entries.sort((a, b)=>{
            const aDate = new Date(a.data)
            const bDate = new Date(b.data)
            if(filter.date==="asc"){ 
                return aDate>bDate ? 1 : -1 
            }
            else if(filter.date==="des"){
                return aDate<bDate ? 1 : -1 
            }

        })
        factCopy.entries.sort((a,b)=>{
            const aDate = new Date(a.data).getTime()
            const bDate = new Date(b.data).getTime()
            if(aDate===bDate){
                if(filter.date==="asc"){ return a.timestamp > b.timestamp ? 1 : -1 }
                else if(filter.date==="des"){return a.timestamp < b.timestamp ? 1 : -1 }
            }
      
        })
        if(filter.codes.length>0){
            factCopy.entries = factCopy.entries.map(entry=>{
                if(!filter.codes.includes(entry.desig)){
                    entry.visible = false
                }
                return entry
            })
        }
        if(filter.dateRange.from && filter.dateRange.to ){
            factCopy.entries = factCopy.entries.map(entry=>{
                const dateEntry = new Date(entry.data)
                const fromFilt = new Date(filter.dateRange.from)
                const toFilt = new Date(filter.dateRange.to)
                if(dateEntry < fromFilt || dateEntry > toFilt){
                    entry.visible = false
                }
                return entry
            })
        }
        return factCopy
    }

    function handleDateClick(){
        setFilter(prev=>{
            const val = prev.date ==="asc" ? "des" : "asc";
            return {...prev, date: val}
        })
    }
    function clearFilter(e){
        setFilter(prev=>{return {...prev, codes: []}})
    }
    return (
        <div id="table-general-cont">
            <NewEntryAdd  refreshFactory={refreshFactory} lastEntrySaldo={lastEntrySaldo}/>
                
            {(factory) && (
                <div id="main-table">
                    <table>
                        <thead>
                            <tr>
                                <th className='table-head-date'>
                                    <div onClick={handleDateClick}>
                                     Data{(filter.dateRange.from && filter.dateRange.to) && <span>*</span> } {filter.date === "asc" ? <span><KeyboardArrowDownIcon/></span> : <span><KeyboardArrowUpIcon /></span> }
                                    </div>
                                    <button onClick={()=>setShowDateDiv(prev=>!prev)}><DateRangeIcon/></button>
                                    {showDateDiv && (
                                        <MakeDraggable><FilterDate setShowDateDiv={setShowDateDiv} changeFilterDates={changeFilterDates} /></MakeDraggable>
                                    )}
                                </th>
                                <th className='table-head-desig'>
                                    <div className='table-desig-text' onClick={()=>setShowDesigMenu(true)}> Designação{filter.codes.length>0 && "*"}</div>
                                    {filter.codes.length>0 && <span className='th-filter-num'><button onClick={clearFilter}>Clear</button></span> }
                                    {showDesigMenu && <DesigMenuTable filter={filter} setShowDesigMenu={setShowDesigMenu} setFilter={setFilter}/>}
                                </th>
                                <th>Crédito</th>
                                <th>Débito</th>
                                <th>Saldo € </th>
                            </tr>
                        </thead>
                        <tbody className='main-table-body'>
                                {factory.entries.map((entry, i)=><TableEntry key={i} entry={entry} refreshFactory={refreshFactory}/>)}
                        </tbody>

                    </table>
                </div>
            )}
        </div>

    )
}
function checkSaldoEntry(entry){
    const credito = formattedStrToNum(entry.credito)
    const debito = formattedStrToNum(entry.debito)
    if(credito!==0){return credito * -1 }
    else if(debito!==0){ return debito}
    if(credito===0 && debito===0) return 0
}
function DesigMenuTable({setShowDesigMenu, setFilter, filter}){
    const {user} = useContext(UserContext)
    return (
        <div id="table-desig-menu-cont">
            <div className="table-desig-menu-bg" onClick={()=>setShowDesigMenu(false)}></div>
            <div className="table-desig-menu">
                {user.codes.length===0 && <p className='no-desig-table'>No designation codes...</p> }
                {user.codes.length>0 && (
                    user.codes.map((elem, i)=>{
                        return (
                            <DesigMenuElement elem={elem} key={i} setFilter={setFilter} filter={filter}/>
                        )
                    })
                ) }
            </div>
        </div>
    )
}
function DesigMenuElement({elem, setFilter, filter}){
    const isFiltered = filter.codes.includes(elem.codeVal)

    const [isChecked, setIsChecked] = useState(isFiltered);
    function handleCheck(){
        setIsChecked(prev=>!prev)
        if(!isChecked){
            setFilter(prev=>{
                const copy={...prev}
                copy.codes = [...copy.codes, elem.codeVal ]
                return copy
            })
        }
        else{
            setFilter(prev=>{
                const copy={...prev}
                copy.codes = copy.codes.filter(val=>val!==elem.codeVal)
                return copy
            })
        }
    }
    return (
        <div className="table-desig-list-div" onClick={handleCheck}>
            <div>{elem.code}</div>
            <div>{elem.codeVal}</div>
            <input type="checkbox" checked={isChecked} style={{cursor:"pointer"}} readOnly/>
        </div>
    )
}




function TableEntry({entry, refreshFactory}){
    const [isEditMode, setIsEditMode]=useState(false)
    const [editForm, setEditForm] = useState( {desig: entry.desig, data: entry.data, credito: entry.credito, debito: entry.debito})
    const [delDialog, setDelDialog] = useState(false)
    const {editFactoryEntry, deleteFactoryEntry} = useContext(UserContext)
    const isVis = entry.visible === false ? "none" : ""
    useEffect(()=>{
        setEditForm( {desig: entry.desig, data: entry.data, credito: entry.credito, debito: entry.debito})
        isEditMode ? window.addEventListener("click", closeEdit) : window.removeEventListener("click", closeEdit)
        function closeEdit(e){
            if(!e.target.closest(`.row-${entry._id}`) && !e.target.closest(".MuiPickersPopper-root")  && !e.target.closest(".MuiDialog-root")){
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
    async function deleteEntry(){
        try{
            await deleteFactoryEntry(entry._id)
            await refreshFactory()
            setIsEditMode(false)
            setDelDialog(false)
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
                <tr className={`table-entry-row row-${entry._id}`} onDoubleClick={()=>setIsEditMode(true)} style={{display: isVis}}>
                    <td className='table-entry-cell'>{dateObjToDisp(entry.data)}</td>
                    <td className='table-entry-cell'>{entry.desig}</td>
                    <td className='table-entry-cell'>{entry.credito}</td>
                    <td className='table-entry-cell'>{entry.debito}</td>
                    <td className='table-entry-cell'>{numeral(entry.saldo).format('0,0')}</td>
                </tr> 
            )}
            {isEditMode && (
                <tr className={`table-entry-edit-row row-${entry._id}`}>

                    <td className='table-entry-cell'>
                        <EditIcon className='edit-icon'/>
                        <DatePicker format="DD/MM/YYYY" onChange={handleDate} defaultValue={null} value={dayjs(editForm.data)} style={{display: isVis}}/>
                        </td>
                    <td className='table-entry-cell'><TextField label="Designação" value={editForm.desig} onChange={handleDesig}/></td>
                    <td className='table-entry-cell'><TextField label="Crédito" value={editForm.credito} onChange={handleNumInput} name="credito"/></td>
                    <td className='table-entry-cell'><TextField label="Débito" value={editForm.debito} onChange={handleNumInput} name="debito"/></td>
                    <td className='table-entry-cell'>
                    {numeral(entry.saldo).format('0,0')}
                        <div className="edit-icons-div">
                            <button onClick={handleEdit}><SaveIcon/></button>
                            <button onClick={()=>{setIsEditMode(false)}}><CloseIcon/></button>
                            <button onClick={()=>{setDelDialog(true)}}><DeleteIcon/></button>
                        </div>
                    </td>
                </tr> 
            )}
            <Dialog open={delDialog} onClose={()=>setDelDialog(false)}>
                <Box className="delete-entry-dialog">
                <p>Are you sure you want to delete the following entry?</p>
                 <table id="delete-preview-table">
                    <thead >
                        <tr>
                            <th>Data</th>
                            <th>Designação</th>
                            <th>Crédito</th>
                            <th>Débito</th>
                            <th>Saldo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{dateObjToDisp(new Date(entry.data))}</td>
                            <td>{entry.desig}</td>
                            <td>{entry.credito}</td>
                            <td>{entry.debito}</td>
                            <td>{entry.saldo}</td>
                        </tr>
                    </tbody>

                 </table>
                <button onClick={deleteEntry}>Delete File</button>
                </Box>
            </Dialog>
        </>

    )
}


function NewEntryAdd({refreshFactory, lastEntrySaldo}){

    const [form, setForm] = useState({desig: "", data: null, credito: 0, debito: 0, saldo: lastEntrySaldo===null ?"":lastEntrySaldo})
    const {addFactoryEntry, user} = useContext(UserContext)
    const [showDesig, setShowDesig] = useState(false)
    useEffect(()=>{
        setForm(prev=>{
            return {...prev, saldo: lastEntrySaldo + checkSaldoEntry(form)}
        })
    }, [lastEntrySaldo, form.credito, form.debito])
    function handleNumInput(e){
        const {name, value} = e.target;
        setForm(prev=>{
            const formatNum = numeral(value).format('0,0')
            return {...prev, [name]: formatNum}
        })
    }
    function handleDates(e){
        setForm(prev=>{return {...prev, data: e}})
    }
    function handleDesig(e){
        const lastKey = e.target.value.split("").pop()
        const found = user.codes.find(elem=>elem.code===lastKey)
        if(found){
            setForm(prev=>{return {...prev, desig: found.codeVal}})
        }
        else{
            setForm(prev=>{return {...prev, desig: e.target.value}})
        }
    }
    async function handleNewEntryAdd(e){
        if(!form.data || !form.desig){return}
        try{
            
            await addFactoryEntry(form)
            setForm({desig: "", data: null, credito: "0", debito: "0"})
            refreshFactory()
            
        }
        catch(err){console.log(err)}
    }

    function handleDesigBtn(){
        setShowDesig(true)
    }
    function handleCodeClick(codeVal){
        setForm(prev=>{
            return {...prev, desig: codeVal}
        })
    }
    return (
        <div className='new-entry-div'>
            <table className="new-entry-table">
                <tbody>
                <tr>
                    <td>
                        <DatePicker sx={newEntryStyle} format="DD/MM/YYYY" onChange={handleDates}  value={!form.data ? null : form.data}/>
                    </td>
                    <td>
                        <FormControl style={newEntryStyle} sx={{position:"relative"}} variant="outlined">
                            {showDesig && <DesigMenu setShowDesig={setShowDesig}  handleCodeClick={handleCodeClick}/>}
                            <InputLabel htmlFor="outlined-desig">Designação</InputLabel>
                            <OutlinedInput onChange={handleDesig} value={form.desig} id="outlined-desig"
                                endAdornment={<InputAdornment position="end"><button className='desig-settings-btn' onClick={handleDesigBtn}> <SettingsIcon/></button></InputAdornment>}
                                label="Designação"
                            />
                        </FormControl>
                    </td>
                    <td>
                        <TextField label="Crédito" style={newEntryStyle} onChange={handleNumInput} name="credito" value={form.credito}/>
                    </td>
                    <td>
                        <TextField label="Débito" style={newEntryStyle} onChange={handleNumInput} name="debito" value={form.debito}/>
                    </td>
                    <td>
                        <TextField label="Saldo"  style={newEntryStyle} value={numeral(form.saldo).format('0,0')} disabled/>
                    </td>
                </tr>
                </tbody>
            </table>        
            <Button className='newEntryBtn' onClick={(handleNewEntryAdd)}><AddIcon/></Button>
        </div>

    )
}

function DesigMenu({setShowDesig, handleCodeClick}){
    const {addCode, deleteCode, user} = useContext(UserContext)
    const [showAdd, setShowAdd] = useState(false)

    const [code, setCode] = useState("")
    const [codeVal, setCodeVal] =  useState("")
    function handleClose(){
        setShowDesig(false)
    }
    async function handleSaveCode(){
        if(!code || !codeVal) return
        try{
            await addCode({code, codeVal})
            setCode("")
            setCodeVal("")
            setShowAdd(false)
        }
        catch(err){
            console.log(err);
        }
    }
    function codeClick(cVal){
        handleCodeClick(cVal)
        setShowDesig(false)
    }
    return (
        <div id="desig-menu-cont">
            <div className="desig-bg" onClick={handleClose}></div>
            <div className="desig-menu">
                <button className='desig-menu-add-btn' onClick={()=>setShowAdd(!showAdd)}>
                    {!showAdd ?<>Add code<AddIcon /></> : "Cancel"}
                </button>
                {showAdd && (
                    <div className="desig-menu-add-code">
                        <TextField label="Code" onChange={(e)=>setCode(e.target.value)}  value={code} sx={{background:"white"}}/>
                        <TextField label="Value" onChange={(e)=>setCodeVal(e.target.value)}  value={codeVal} sx={{background:"white"}}/>
                        <button className='desig-menu-add-code-btn' onClick={handleSaveCode}>Save</button>
                    </div>
                )}

                {user.codes.length>0 && (
                    <div className="code-container">
                        {user.codes.map((elem, i)=>{
                            return (
                                <div className="code-div" key={i}>
                                    <div className='code-div-code' onClick={()=>codeClick(elem.codeVal)}>{elem.code}</div>
                                    <div className='code-div-codeVal' onClick={()=>codeClick(elem.codeVal)}>{elem.codeVal}</div>
                                    <button onClick={()=>deleteCode(elem._id)}><DeleteIcon/></button>
                                </div>
                            )
                        })}
                    </div>

                )}
            </div>
        </div>
    )
}




const newEntryStyle = {
  width: "100%"
}