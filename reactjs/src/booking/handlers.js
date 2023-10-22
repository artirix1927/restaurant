import axios from 'axios';
import ReactDOM from 'react-dom';

import s from '../css/choose_table_style.module.css'

import { format } from 'date-fns';

const dateFormat = "E, d LLL"



function openTableChoosingWindow(){
    document.getElementById('choose-table-modal').style.display = 'block';
}

export function closeTableChoosingWindow(){
document.getElementById('choose-table-modal').style.display = 'none';
}

export function handleFindBtnClick(e, date, time, guests){
    openTableChoosingWindow();
    let timeFieldValue = time.current.flatpickr.input.value; //get str from main input field
    let dateFieldValue = date.current.flatpickr.input.value; //get str from main input field
    let guestsFieldValue = guests.current.value;
    
    axios.post("http://127.0.0.1:8000/api/get-tables", {
        
            time: timeFieldValue,
            date: dateFieldValue,
            guests: guestsFieldValue,

    }).then((res) => {
        console.log(111)
        let free_tables = res.data.free_tables;
        let booking_frame = res.data.booking_frame;
        let listOfTablesElement = document.getElementById('list-of-tables')

        ReactDOM.unmountComponentAtNode(listOfTablesElement);
        
        let tables = [];

        free_tables.forEach((table) => {
            let dataForHandleBtn = {table:table,bookingStart: booking_frame[0],
                bookingEnd: booking_frame[1], guests: guestsFieldValue}


            let dataForTableElement ={time:timeFieldValue, table: table}
            const tableElement = <TableElement data={dataForTableElement} dataForHandleBtn={dataForHandleBtn}/>;
            tables.push(tableElement)
        })
        console.log(tables, listOfTablesElement)
        ReactDOM.render(tables, listOfTablesElement)
       
    
    });


    let currentDateFpInstace = date.current.flatpickr //flatpickr instance

    //getting latest selected date from flatpickr instance and formatting it 
    let formatedDateValue = format(currentDateFpInstace.latestSelectedDateObj, dateFormat)
    document.getElementById("short-info-date").innerText = formatedDateValue

    document.getElementById("short-info-time").innerText = timeFieldValue;
    document.getElementById("short-info-guests").innerText = guestsFieldValue;

}


const handleTableElementClick = (data) => {


    let bookingRequestData =  {
        bookingStart: data.bookingStart,
        bookingEnd: data.bookingEnd,
        guests: data.guests,
        tableChosen: data.table.id,
        tableTags: data.table.tags,
        }
        

    localStorage.setItem("userBookingRequirementsData", JSON.stringify(bookingRequestData));
    window.location.href = '/create-booking-request'
    
   
}  

const TableElement = (props) => { return  <div className={s['table-element']} id={props.data.table.id} max_guests={props.data.table.max_guests} 
    key={props.data.table.id} onClick={(e) => {handleTableElementClick(props.dataForHandleBtn);}} >
    {props.data.time}  
    <p className={s['tags-for-table']}>{props.data.table.tags.toString()} ({props.data.table.max_guests})</p>
    <p className={`${s['tags-for-table']} ${s['table-num']}`}> Table {props.data.table.id}</p>
</div>}