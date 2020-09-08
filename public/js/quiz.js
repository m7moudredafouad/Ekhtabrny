import {myAlert} from './alert'
import {removeChild} from './utils'
import axios from 'axios';

export const nextQuiz = async (quizid) => {
    const nextQuizDate = document.forms['nextQuizDate'];
    const startsAt = nextQuizDate.startsAt.value;
    const endsAt = nextQuizDate.endsAt.value;
    const groupid = window.location.pathname.split('/')[2];

    try{

        if(!startsAt || !endsAt){
            throw 'You Have to provide start and end date'
        }
        
        if(Date.parse(startsAt) < new Date(Date.now())){
            throw 'The quiz should start is the future'
        }
        
        if(endsAt < startsAt){
            throw 'The end date of the quiz should be after the begining'
        }

        const res = await axios.patch(`http://localhost:3000/api/v1/groups/${groupid}/quiz/${quizid}/next`, {
            startsAt,
            endsAt
        });

        if(res.data.status === "Success"){
            myAlert('success', 'The quiz is now in the next list')
        }

    } catch(err) {
            myAlert('danger', err)
    }

}

export const removeQuiz = async (quizid, element) => {
    try{
        const groupid = window.location.pathname.split('/')[2];
        const res = await axios.delete(`http://localhost:3000/api/v1/groups/${groupid}/quiz/${quizid}`);

        if(res.data.status === "success"){
            myAlert('success', 'Quiz was deleted')
        }

        removeChild(element)
    } catch(err){
        myAlert('danger', err)
    }
}