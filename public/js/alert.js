
export const hideMe = (el) => {
    if(el) el.parentElement.parentElement.removeChild(el.parentElement)
}



export const myAlert = (type, message) => {
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