// import {hideMe, myAlert} from './alert';

// import Axios from "axios"

const hideMe = (el) => {
    if(el) el.parentElement.parentElement.removeChild(el.parentElement)
}



const myAlert = (type, message) => {
    const html = `<div class="alert-${type}">
    <div class="alert__text"><p>${message}</p></div>
    <div id="closeAlert" onclick="hideMe(this)" class="alert__close">X</div>
    </div>`
    
    const alert = document.querySelector(".alert")
    alert.insertAdjacentHTML('afterbegin', html);
    setTimeout(() => {
        hideMe(alert.lastChild.childNodes[1])
    }, 3000);
}

const addOption = (e) => {
    const theGroup = e.parentNode;
    const optionValue = e.parentNode.children.options.value;
    if(optionValue){
        const html = `<input type="text" onclick="makeRightAnswer(this)" ondblclick="removeOption(this)" class="form__group-readOnly" name="choice" value="${optionValue}"  title="Click to make the right answer, double click to remove" readonly>`;

        theGroup.children.choices.insertAdjacentHTML('beforeend', html)
        
        e.parentNode.children.options.value = '';
    } else {
        myAlert('danger', 'The option can\'t be empty')
    }
}

const makeRightAnswer = (e) => {
    const theGroup = e.parentNode.parentNode;
    const allChoicesElements = e.parentNode.children;

    for(var i = 0; i < allChoicesElements.length; i++){
        allChoicesElements[i].classList.remove('form__group-readOnly--selected')
    }

    e.classList.add('form__group-readOnly--selected');

    theGroup.children.answer.value = e.value;

}

const removeOption = (e) => {
    const theGroup = e.parentNode;
    theGroup.removeChild(e);
}

const addQuestion = (e) => {
    const html = `<div class="form__group form__question">

    <label class="form-input--label">السؤال</label>
    <textarea name="question" class="form__group-textarea w100" style="font-size: 1.6rem;"  cols="30" rows="10" placeholder="اكتب السؤال هنا"></textarea>

    <label class="form-input--label">اضف اختيارات</label>
    <input type="text" id="options" class="form-input w60" placeholder="اكتب الاختيار هنا">
    <button type="button" class="btn btn-sm w20" onclick="addOption(this)">اضف الاختيار</button>
    <input type="text" class="form-input" name="answer" readonly hidden required>
    <div id="choices" class="form-choices"></div>
</div>`;

    e.insertAdjacentHTML('beforebegin', html)
}

const quizForm = document.forms['quiz'];

quizForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const theGroupForm = e.target.querySelectorAll('.form__group');
    const length = theGroupForm.length;

    let data = [];

    try{
        
        for(var i = 0; i < length; i++){
            
            const theChilds = theGroupForm[i].children;
            const answers = theChilds.choices.children;

            const question = theChilds.question.value;
            const solution = theChilds.answer.value;

            if(!question) {
                throw 'Question can\'t be empty';
            }

            if(!solution) {
                throw 'Right answer can\'t be empty'
            }

            let choices = [];
            for(var j = 0; j < answers.length; j++){
                choices.push(answers[j].value)
            }

            data.push({
                number: i+1,
                question,
                solution,
                choices
                
            });
            
        }
    
        // console.log(data)

        // console.log(window.location.href.origin)
        const groupId = window.location.pathname.split('/')[2];

        const res = await axios.post(`http://localhost:3000/api/v1/groups/${groupId}/quiz`, {
            questions: data
        })

        if(res.data.status === "success"){
            myAlert('success', 'Quiz has been uploaded')
            setTimeout(() => {
                location.reload();
            }, 1000)
        }

        console.log(res)

    } catch(err){
        myAlert('danger', err);
    }

})