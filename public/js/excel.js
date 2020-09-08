export const exportToExcel = () => {
    let tab_text="<table border='2px'><tr bgcolor='#87AFC6'>";

    const tab = document.getElementById('member_table');
    const tableHTML = tab.outerHTML.replace(/ /g, '%20');


    for(let j = 0 ; j < tab.rows.length ; j++) { 
        tab_text = tab_text + tab.rows[j].innerHTML + "</tr>"
    }

    tab_text=tab_text+"</table>";
    tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, ""); //remove if u want links in your table
    tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
    tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params


    let downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    downloadLink.href = 'data:application/vnd.ms-excel,' + tableHTML;
    downloadLink.download = 'members-data.xls'
    downloadLink.click()
    document.body.removeChild(downloadLink)    
}
