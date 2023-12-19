import './mainStyle.css'
import Nav from '../Nav/Nav'
import FactoryMenu from '../FactoryToolbar/FactoryTool'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Divider } from '@mui/material';
import SavePDF from '../SavePDF/SavePDF';
import { UserContext } from '../../context/user.context';
import { useContext, useEffect, useState } from 'react';
import Table from '../Table/Table';
export default function Main(){
    const {currentFactory} = useContext(UserContext)

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
                        <SavePDF/>
                    </div>
                </div>
                {currentFactory && <Table/>}
                
            </LocalizationProvider>
        </div>
    )
}