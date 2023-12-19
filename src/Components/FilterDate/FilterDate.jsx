import './FilterDate.css';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {  useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

export default function FilterDate({setShowDateDiv, changeFilterDates}){
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    useEffect(()=>{
        if(from && to){
            const fromDate = from.$d;
            const toDate = to.$d;
            if(String(toDate)==="Invalid Date" || String(fromDate)==="Invalid Date" ){return}
            changeFilterDates(fromDate, toDate)
        }
    }, [from, to])

    function clearDates(){
        setFrom(null)
        setTo(null)
        changeFilterDates(null, null)

    }
    return (
        <div id="filter-date-toolbar">
            <CloseIcon sx={iconStyle} onClick={()=>setShowDateDiv(false)}/>
            <DatePicker label="From" value={from} format='DD/MM/YYYY' onChange={(newValue) => setFrom(newValue)} />
            <DatePicker label="To" value={to} format='DD/MM/YYYY' onChange={(newValue) => setTo(newValue)} />
            <button style={btnStyle} onClick={clearDates}>Clear</button>
        </div>
    )
}

const iconStyle = {
    position: "absolute",
    top: "-15px",
    borderRadius: "100px",
    padding: "5px",
    right: "-10px",
    cursor: "pointer",
    background: "white",
    boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px"
}
const btnStyle = {
    padding: "0px 5px",
    background: "none",
    borderRadius: "3px",
    border: "1px solid rgba(0,0,0,0.4)",
    cursor: "pointer"
}