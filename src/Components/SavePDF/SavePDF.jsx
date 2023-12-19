import { Button, TextField, Box } from "@mui/material"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { createElement, useState } from "react"
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import logoPdf from '../../assets/logoPDF.png'
import logoExcel from '../../assets/logoExcel.png'
import { formattedStrToNum } from "../../utils";
import numeral from "numeral";


export default function DialogComp({dialog, setDialog, displayTable}){
    const [form, setForm] = useState({
        factoryName: displayTable.factoryName,
        fileName: `extracto-${todayDate()}-${displayTable.factoryName}`
    })
    function handleChange(e){
        const {name, value} = e.target
        setForm(prev=>{
            return {...prev, [name] : value}
        })
    }
    return (
        <Dialog open={dialog} onClose={()=>setDialog(false)}>
            <DialogTitle>Export</DialogTitle>
            <Box sx={{display: "flex", flexDirection:"column", padding: "20px", gap: "20px",width: "450px"}}>
                <TextField label="Factory Name" name="factoryName" value={form.factoryName} onChange={handleChange} />
                <TextField label="Filename" name="fileName" value={form.fileName} onChange={handleChange}/>
                <div className="btn-div-export">
                    <button onClick={()=>generatePDF(displayTable, form)}><img src={logoPdf} alt="" />Export PDF</button>
                    <button><img src={logoExcel} alt="" />Export Excel</button>
                </div>
            </Box>

        </Dialog>
    )
}


function generatePDF(displayTable, form){

    const table = createTable(displayTable)
    const tableInfo = createInfo(displayTable, form)
    const doc = new jsPDF()
    document.body.appendChild(table);
    document.body.appendChild(tableInfo);

    autoTable(doc, { 
        html : '#export-info-table',
        theme: "plain",
        margin: { top: 10 },
        styles: {
            halign:"center"
        },
    })
    autoTable(doc, { 
        html: '#export-table',
        theme: "plain",
        styles: {
            halign:"center"
        },
        columnStyles: {
            1 : {halign: "center"}
        },
    })

    doc.save(`${form.fileName}.pdf`);
    table.remove()
    tableInfo.remove()
}
function createInfo(tableData, form){
    const table = document.createElement("table");
    table.id = "export-info-table";
    const headTr = document.createElement("tr" )
    table.appendChild(headTr)
    const tdTitle = document.createElement("th")
    tdTitle.innerText = "Extracto de Contas Correntes";
    headTr.appendChild(tdTitle)

    const tbody = document.createElement("tbody")
    table.appendChild(tbody)
    const tr1 = document.createElement("tr")
    const tr2 = document.createElement("tr")
    tbody.appendChild(tr1)
    tbody.appendChild(tr2)

    const tdFactoryName = document.createElement("td")
    tdFactoryName.innerText=form.factoryName
    tr1.appendChild(tdFactoryName)

    const tdDate = document.createElement("td")
    tdDate.innerText = getDateRange(tableData)
    tr2.appendChild(tdDate)
    return table
}



function createTable(tableData){
    const headerInfo = ["Data", "Designação","Crédito", "Débito", "Saldo €"]
    const table = document.createElement("table");
    table.id = "export-table";
    const tableHeader = document.createElement("thead")
    const tableHeaderRow = document.createElement("tr")
    tableHeader.appendChild(tableHeaderRow)
    table.appendChild(tableHeader)
    for(let i=0;i<5;i++){
        const th = document.createElement("th")
        th.innerText = headerInfo[i]
        tableHeaderRow.appendChild(th)
    }
    const tableBody = document.createElement("tbody")
    table.appendChild(tableBody)
    tableData.entries.forEach(entry=>{
        if(entry.visible===undefined){
            const tr = document.createElement("tr")
            const tData = document.createElement("td")
            tData.innerText = formatDate(new Date(entry.data))
            const tDesig = document.createElement("td")
            tDesig.innerText = entry.desig
            const tCredito = document.createElement("td")
            tCredito.innerText = entry.credito
            const tDebito = document.createElement("td")
            tDebito.innerText = entry.debito
            const tSaldo = document.createElement("td")
            tSaldo.innerText = entry.saldo
            tr.appendChild(tData)
            tr.appendChild(tDesig)
            tr.appendChild(tCredito)
            tr.appendChild(tDebito)
            tr.appendChild(tSaldo)
            tableBody.appendChild(tr)
        }
    })

    const tfoot = document.createElement("tfoot");
    table.appendChild(tfoot)
    const tfootRow = document.createElement("tr");
    tfoot.appendChild(tfootRow)
    const scope = document.createElement("th");
    scope.innerText="Total"
    tfootRow.appendChild(scope)
    scope.setAttribute("scope", "row");
    const {totalCredit, totalDebit, totalSaldo} = calculateTotals(tableData.entries);
    const empty = document.createElement("th")
    const thTotalCredit = document.createElement("th")
    thTotalCredit.innerText = totalCredit+"€"
    const thTotalDebit = document.createElement("th")
    thTotalDebit.innerText = totalDebit+"€"
    const thTotalSaldo = document.createElement("th")
    thTotalSaldo.innerText = totalSaldo+"€"
    tfootRow.appendChild(empty)
    tfootRow.appendChild(thTotalCredit)
    tfootRow.appendChild(thTotalDebit)
    tfootRow.appendChild( thTotalSaldo)
    return table
}

function calculateTotals(entries){
    let totalCredit = 0
    let totalDebit = 0
    let totalSaldo = 0
    entries.forEach(entry=>{
        totalCredit+= formattedStrToNum(entry.credito)
        totalDebit+= formattedStrToNum(entry.debito)
        totalSaldo+= formattedStrToNum(entry.saldo)
    })
    return {totalCredit: numeral(totalCredit).format("0,0"), totalDebit: numeral(totalDebit).format("0,0"), totalSaldo: numeral(totalSaldo).format("0,0")};
}



function todayDate(){
    const date = new Date()
    const d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
    const m = date.getMonth() < 10 ? "0" + date.getMonth() : date.getMonth()
    return `${d}-${m}-${date.getFullYear()}`
}
function formatDate(date){
    const d = date.getDate() < 10 ? "0"+date.getDate() : date.getDate()
    const m = date.getMonth() < 10 ? "0"+date.getMonth() : date.getMonth()
    return `${d}/${m}/${date.getFullYear()}`
}

function getDateRange(tableData){
    const entryCopy = [...tableData.entries].filter(entry=>entry.visible===undefined)
    entryCopy.sort((a, b)=>{
        const aDate = new Date(a.data)
        const bDate = new Date(b.data)
        return aDate>bDate ? 1 : -1 
    })
    const date1 = formatDate(new Date(entryCopy[0].data))
    const date2 = formatDate(new Date(entryCopy[entryCopy.length-1].data))
    
    return `${date1} > ${date2}`
}
