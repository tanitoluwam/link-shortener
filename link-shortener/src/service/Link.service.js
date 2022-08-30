import {http} from "../plugins/Axios"

export const shortenLink = async (params) => {
    return http.get("/shorten", {
        params
    })
}