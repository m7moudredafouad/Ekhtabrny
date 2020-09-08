import axios from "axios"
import { myAlert } from "./alert";


export const acceptMember = async (memberid) => {
    try{
        const groupid = window.location.pathname.split('/')[2];
        const res = await axios.post(`http://localhost:3000/api/v1/groups/${groupid}/members/accept/${memberid}`)

        if(res.data.status === "Success"){
            myAlert('success', 'Member accepted')
        }

    } catch(err){
        myAlert('danger', `Error, Please try again later`)
    }
}

export const removeMember = async (memberid) => {
    try{
        const groupid = window.location.pathname.split('/')[2];
        const res = await axios.delete(`http://localhost:3000/api/v1/groups/${groupid}/members/delete/${memberid}`)

        if(res.data.status === "Success"){
            myAlert('success', 'Member was deleted')
        }

    } catch(err){
        myAlert('danger', `Error, Please try again later`)
    }
}