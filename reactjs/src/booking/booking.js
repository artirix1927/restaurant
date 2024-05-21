import s from '../css/booking_window_style.module.css'
import sArrows from '../css/arrows_style.module.css'

import { handleArrowClick } from './arrowsHanlders';

import { useRef, useContext, forwardRef} from 'react';

import { ChooseTableModal, TableElement} from './chooseTable';

import {MainPageContext} from './context';

import Flatpickr from "react-flatpickr"; 

import axios from 'axios';

import { format } from 'date-fns';

import { useNavigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import { apiRoute } from '../constants';

const dateFormat = "E, d LLL"

export const BookingModal = () => {
    return <div id="booking" className={s.booking}>
            <div id="booking-content" className={s['booking-content']}>
                <div>
                    <ChooseTableModal context={MainPageContext}/>
                </div>
                
                <form>
                    <ul >
                        <FormFields/>
                    </ul>
                </form>
            </div>
        </div> 
}


const FormFields = (props) => {
    const fpTime = useRef();
    const fpDate = useRef();
    const guestsField = useRef();
    
    const {setDataForShortInfo} = useContext(MainPageContext)

    const navigate = useNavigate();

    function handleFindBtnClick(){
        
        openTableChoosingWindow();
        let timeFieldValue = fpTime.current.flatpickr.input.value; //get str from main input field
        let dateFieldValue = fpDate.current.flatpickr.input.value; //get str from main input field
        let guestsFieldValue = guestsField.current.value;

        setDataForShortInfo(format(fpDate.current.flatpickr.latestSelectedDateObj, dateFormat),timeFieldValue,guestsFieldValue)

        axios.post(`${apiRoute}/get-tables`, 
                {
                time: timeFieldValue,
                date: dateFieldValue,
                guests: guestsFieldValue,
                }

        ).then((res) => {
            console.log(timeFieldValue)
            let free_tables = res.data.free_tables;
            let booking_frame = res.data.booking_frame;
            const listOfTables = document.getElementById('list-of-tables')
            let root = createRoot(listOfTables)
    
            root.unmount();
            root = createRoot(listOfTables);

            let tables = [];

            free_tables.forEach((table) => {
                let dataForHandleBtn = {table:table,bookingStart: booking_frame[0],
                    bookingEnd: booking_frame[1], guests: guestsFieldValue,nav: navigate}
    
                let dataForTableElement ={time:timeFieldValue, table: table}
                const tableElement = <TableElement data={dataForTableElement} 
                                                   tableElementHandler = {handleTableElementClick}
                                                   dataForTableElementHandler={dataForHandleBtn}
                                                   key={table.id}
                                                   />;
                tables.push(tableElement)
            })
            root.render(tables)
           
        
        });
    
    }
    
    
    
    return <div><li>
    <div id="booking-date" className={s["booking-field"]}>
        <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnleft}  date`} onClick={(e) => {handleArrowClick(e ,fpDate, fpTime)}}><i class="bi bi-caret-left-fill"></i></button>

        

        <span><Flatpickr className={`${s['form-control']} ${s.input} form-control date-input`} id="booking-date-field"
                        placeholder="Mon, 1, Jan" options={{
                            altInput: true,
                            altFormat: "D,d M",
                            deafultDate: new Date(),
                            disableMobile: "true",
                            }} ref={fpDate}/></span>                


        <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnright} date`} onClick={(e) => {handleArrowClick(e ,fpDate, fpTime)}}><i class="bi bi-caret-right-fill"></i></button>
    </div>
    <p className={s['booking-field-desc']}>date</p>
    </li>
    <li>
        
     <div id="booking-guests" className={s["booking-field"]}>
            <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnleft} guests`} onClick={(e) => {handleArrowClick(e ,fpDate, fpTime)}}><i class="bi bi-caret-left-fill"></i></button>
            
            <span><input className={`${s['form-control']} ${s.input} form-control guests-input`} type="number" placeholder="1" id="booking-guests-field" 
            ref={guestsField}/></span>

            <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnright}  guests`} onClick={(e) => {handleArrowClick(e ,fpDate, fpTime)}}><i class="bi bi-caret-right-fill"></i></button>
    </div>

    <p className={s['booking-field-desc']}>guests</p>
    </li>                        
    <li>

    <div id="booking-time" className={s["booking-field"]}>
        <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnleft}  time`} onClick={(e) => {handleArrowClick(e ,fpDate, fpTime)}}><i class="bi bi-caret-left-fill"></i></button>
        <span><Flatpickr className={`${s['form-control']} ${s.input} form-control time-input`} id="booking-time-field" placeholder='00:00' options={{
            enableTime:true,
            noCalendar:true,
            altInput: true,
            altFormat: "H:i",
            time_24hr: true,
            disableMobile: "true",
            deafultDate: new Date(),
            }} ref={fpTime}/></span>
        <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnright}  time`} onClick={(e) => {handleArrowClick(e ,fpDate, fpTime)}}><i class="bi bi-caret-right-fill"></i></button>
    </div>

    <p className={s['booking-field-desc']}>time</p>

    </li>                      

    <button id="booking-findbtn" className={s['booking-findbtn']} type="button" onClick={(e) => {handleFindBtnClick()}}>FIND A TABLE</button>
    
    </div>}

const handleTableElementClick = (e, data, nav) => {

    let bookingRequestData =  {
        bookingStart: data.bookingStart,
        bookingEnd: data.bookingEnd,
        guests: data.guests,
        tableChosen: data.table.id,
        tableTags: data.table.tags,
    }
    localStorage.setItem("userBookingRequirementsData", JSON.stringify(bookingRequestData));
   
    const navigate = nav;
    navigate('/create-booking-request')
}





function openTableChoosingWindow(){
    document.getElementById('choose-table-modal').style.display = 'block';
}

export function closeTableChoosingWindow(){
document.getElementById('choose-table-modal').style.display = 'none';
}


// const Arrow = forwardRef((props, ref) => {return <button type="button" 
// className={`${sArrows.arrowbtn} ${sArrows.arrowbtnleft}  ${props.type}`} 
// onClick={(e) => {handleArrowClick(e ,fpDate, fpTime)}}>
// <i className={`${sArrows.arrow} ${sArrows.left}`}></i></button>})