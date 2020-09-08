import axios from 'axios'
import {myAlert} from './alert';

export const closeMe = (e) => {
    e.parentElement.parentElement.style.display = 'none'
}

export const showCreateGroup = () => {
    const joinModel = document.getElementById('createGroup')
    joinModel.style.display = 'block'
}


export const showJoinGroup = () => {
    const joinModel = document.getElementById('joinGroup')
    joinModel.style.display = 'block'
}

export const joinGroup = async (groupid, name, code) => {
    try{
        const res = await axios.post(`http://localhost:3000/api/v1/groups/${groupid}/members/request`, {
            name,
            code
        })
        
        console.log(res)
        if(res.data.status === 'Success'){
            myAlert('success', 'Request sent successfully')
        }

    } catch(err) {
        myAlert('danger', `Please try again later`)
    }
}

export const createGroup = async (name) => {
    try{
        const res = await axios.post(`http://localhost:3000/api/v1/groups`, {
            name
        })
        
        if(res.data.status === 'Success'){
            myAlert('success', 'Group created successfully')
        }

    } catch(err) {
        myAlert('danger', `${err.response.data.message}`)
    }
}