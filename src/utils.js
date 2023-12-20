export function formattedStrToNum(val){
    if(typeof val==="number") return val
    return parseInt(val.replaceAll(",", ""))
}
export function dateObjToDisp(dateStrObj){
    const dateObj = new Date(dateStrObj)
    const dd = dateObj.getDate()
    const mm = dateObj.getMonth()+1
    const yy = dateObj.getFullYear()
    return `${dd<10?"0"+dd:dd}/${mm<10?"0" + mm : mm}/${yy}`
}

export function compareDates(dateObj1, dateObj2){
    const d1 = dateObjToDisp(dateObj1)
    const d2 = dateObjToDisp(dateObj2)
    return d1===d2 ? true : false
}