export const removeChild = (el) => {
    if(el) {
        const memberElement = el.parentElement.parentElement

        memberElement.parentElement.removeChild(memberElement)
    }
}

export const timer = (el) => {
    const nextDate = Date.parse(el.getAttribute('data-date'));
    setInterval(() => {
        const now = Date.now();
        // const remaining = nextDate - now;
        const remaining = nextDate - now > 0 ? nextDate - now : now - nextDate;

        if(now - nextDate) {
            el.style.color = 'red'
        }
        
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        const min = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const hours = Math.floor((remaining % (1000 * 60 * 60 * 24))/(1000 * 60 * 60));
        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        
        if(now > nextDate ) {
            el.style.color = 'red'
            el.textContent = `الاختبار بدا منذ ${days>= 10?days:'0'+days}:${hours>=10?hours:'0'+hours}:${min>=10?min:'0'+min}:${seconds >= 10 ? seconds: '0'+seconds}`
        } else {
            el.textContent = `الاختبار سيبدا بعد ${days>= 10?days:'0'+days}:${hours>=10?hours:'0'+hours}:${min>=10?min:'0'+min}:${seconds >= 10 ? seconds: '0'+seconds}`
            el.style.color = 'inherit'
        }
        
    }, 1000)
    // const date = ;
}


export const timeFormatter = (time) => {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Satur"];

    const date = new Date(time)
    const year = date.getFullYear()
    const mon = months[date.getMonth()]
    const day = days[date.getDate()]

    return mon +` ${date.getDate()}, ` + day + ` ${year}`
}