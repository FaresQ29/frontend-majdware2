import { useState } from "react";


export default function MakeDraggable({children}){
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const [isDragging, setIsDragging] = useState(false);

    function mouseDown(e){
        setIsDragging(true);
        let initX = e.clientX;
        let initY = e.clientY;
        
        function mouseMove(e){
          const dx = e.clientX - initX;
          const dy = e.clientY - initY;
    
          setPosition((prevPosition) => {
            const newX = Math.max(0, Math.min(window.innerWidth - 400, prevPosition.x + dx));
            const newY = Math.max(0, Math.min(window.innerHeight - 100, prevPosition.y + dy));
            return { x: newX, y: newY };
          });
    
          initX = e.clientX;
          initY = e.clientY;
        }
        function mouseUp(){
            setIsDragging(false);
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mouseup', mouseUp);
        }
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
    }


    return (
        <>
            <div id="outer-draggable-div" style={
                {
                    top: `${position.y}px`,
                    left:`${position.x}px`,
                    position: "fixed",
                    background:"white",
                    zIndex: "1100",
                    display:"flex",
                    flexDirection:"column",
                    boxShadow: "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
                    borderRadius:"5px",
                }}>
                <div className="drag-element" 
                    onMouseDown={mouseDown}
                    style={{
                        width: "100%",
                        height:"30px",
                        backgroundColor:"#607d8b",
                        cursor:"move",
                        borderRadius:"5px 5px 0px 0px",
                    }}
                >
                    
                </div>
                    {children}
           
            </div>
        </>

    )
}

