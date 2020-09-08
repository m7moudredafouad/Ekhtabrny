import axios from 'axios'
import {myAlert} from './alert';

export const login = async (email, password) => {
    try{

        const res = await axios.post('http://localhost:3000/api/v1/users/login', {
            email,
            password
        });

        if(res.data.status === 'success'){
            location.assign('/');
        }
        
        console.log(res);
    } catch(err){
        myAlert('danger', `${err.response.data.message}`)
    }
}


export const logout = async () => {
    try{
        const res = await axios.get('http://localhost:3000/api/v1/users/logout');

        if(res.data.status === 'success') location.assign('/');
        
    } catch(err){
        myAlert('danger', `${err.response.data.message}`)
    }
}