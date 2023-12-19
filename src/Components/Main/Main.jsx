import './mainStyle.css'
import Nav from '../Nav/Nav'
import FactoryMenu from '../FactoryToolbar/FactoryTool'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Button, Divider } from '@mui/material';
import DialogComp from '../SavePDF/SavePDF';
import { UserContext } from '../../context/user.context';
import { useContext, useEffect, useRef, useState } from 'react';
import Table from '../Table/Table';
export default function Main(){
    const {currentFactory} = useContext(UserContext)
    const [displayTable, setDisplayTable] = useState(null)
    const [exportDialog, setExportDialog] = useState(false)

    return (
        <div id="main-container">
            <Nav />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div id="toolbar">
                    <div className="toolbar-left">
                    <FactoryMenu />
                    <Divider orientation="vertical" flexItem />
                    {currentFactory ? 
                        (<p id="main-factory-title">{currentFactory.factoryName}</p>) :
                        (<p id="main-factory-title-no">No factory selected...</p>)                        
                    }
                    </div>
                    <div className="toolbar-right">
                        <Divider orientation="vertical" flexItem />
                        <Button sx={btnStyle} onClick={()=>setExportDialog(true)} disabled={displayTable ? false : true}>Export</Button>
                        {exportDialog && (
                            <DialogComp dialog={exportDialog} setDialog={setExportDialog} displayTable={displayTable} />
                        )}
                    </div>
                </div>
                {currentFactory && <Table setDisplayTable={setDisplayTable}/>}
                
            </LocalizationProvider>
        </div>
    )
}


const btnStyle=
   {
    color:"black",
    fontSize:"1rem",
    border: "1px solid rgba(0, 0, 0, 0.2)", backgroundColor:"rgba(29, 126, 5, 0.03)"
}   