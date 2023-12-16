import './FilterDate.css';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useState } from 'react';

export default function FilterDate(){
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);

    return (
        <div id="filter-date-toolbar">
            <DatePicker sx={{label:"red"}} label="From" value={from} format='DD/MM/YYYY' onChange={(newValue) => setFrom(newValue)} />
            <DatePicker label="To" value={to} format='DD/MM/YYYY' onChange={(newValue) => setTo(newValue)} />
        </div>
    )
}