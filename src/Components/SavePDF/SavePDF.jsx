import { Button } from "@mui/material"

export default function SavePDF(){
    return (
        <Button
        id="basic-button" sx={{color:"black", fontSize:"1rem", border: "1px solid rgba(0, 0, 0, 0.2)", backgroundColor:"rgba(29, 126, 5, 0.03)"}}
    >
        Export
    </Button>
    )
}