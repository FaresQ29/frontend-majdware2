export function formattedStrToNum(val){
    return parseInt(val.replaceAll(",", ""))
}
export function dateObjToDisp(dateStrObj){
    const dateObj = new Date(dateStrObj)
    const dd = dateObj.getDate()
    const mm = dateObj.getMonth()+1
    const yy = dateObj.getFullYear()
    return `${dd<10?"0"+dd:dd}/${mm<10?"0" + mm : mm}/${yy}`
}
