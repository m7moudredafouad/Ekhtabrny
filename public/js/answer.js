import Axios from "axios"
import { myAlert } from "./alert";

export const finishQuiz = async (quizid, answers) => {
    try{
        const groupid = window.location.pathname.split('/')[2];
        const res = await Axios.patch(`http://localhost:3000/api/v1/groups/${groupid}/quiz/${quizid}/answer`,{answers})

        if(res.data.status === 'Success') {
            location.assign(`/groups/${groupid}/quiz/${quizid}/answer`)
        }
    } catch (err) {
        myAlert('danger', err)
    }
}