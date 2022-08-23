import {handlePrefix} from "./index.js";

export function handleToday () {
    const date = new Date()
    const day = date.getDate()
    const month = date.getMonth()+1
    const year = date.getFullYear()

    return `${handlePrefix(day)}/${handlePrefix(month)}/${year}`
}