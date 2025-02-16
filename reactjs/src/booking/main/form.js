import s from '../../css/booking_window_style.module.css'
import sArrows from '../../css/arrows_style.module.css'

import { useRef, useContext, forwardRef} from 'react';

import {TableElement} from '../chooseTable';

import {MainPageContext} from '../context';

import Flatpickr from "react-flatpickr"; 

import axios from 'axios';

import { format, formatISO} from 'date-fns';

import { useNavigate } from 'react-router-dom';

import { apiRoute } from '../../constants';
import { useTableContext } from '../../tableContext';
import { openTableChoosingWindow } from './booking';



export const BookingForm = (props) => {
    const fpTime = useRef();
    const fpDate = useRef();
    const guestsField = useRef();

    const dateFormat = "E, d LLL"
    
    const {setDataForShortInfo} = useContext(MainPageContext)

    const navigate = useNavigate();

    const { setTables, setBookingFrame } = useTableContext();

    function handleFindBtnClick() {
        
    
        openTableChoosingWindow();
        let timeFieldValue = fpTime.current.flatpickr.input.value; // like 12:00
        let guestsFieldValue = guestsField.current.value;
    
        setDataForShortInfo(
            format(fpDate.current.flatpickr.latestSelectedDateObj, dateFormat),
            timeFieldValue,
            guestsFieldValue
        );
    
        axios
            .post(`${apiRoute}/get-tables`, {
                time: formatISO(fpTime.current.flatpickr.latestSelectedDateObj),
                date: formatISO(fpDate.current.flatpickr.latestSelectedDateObj),
                guests: guestsFieldValue,
            })
            .then((res) => {
                let freeTables = res.data.free_tables;
                let bookingFrame = res.data.booking_frame;
                setBookingFrame(bookingFrame);
    
                let tableElements = freeTables.map((table) => {
                    let dataForHandleBtn = {
                        table: table,
                        bookingStart: bookingFrame[0],
                        bookingEnd: bookingFrame[1],
                        guests: guestsFieldValue,
                        nav: navigate,
                    };
    
                    let dataForTableElement = { time: timeFieldValue, table: table };
                    return (
                        <TableElement
                            data={dataForTableElement}
                            tableElementHandler={handleTableElementClick}
                            dataForTableElementHandler={dataForHandleBtn}
                            key={table.id}
                        />
                    );
                });
    
                setTables(tableElements); // ✅ Update context instead of manually mounting
            });
    }
    
    
    
    return <div><li>
    <div id="booking-date" className={s["booking-field"]}>
        <FormDateField fpDate={fpDate} fpTime={fpTime} ref={fpDate}></FormDateField>
    </div>
    <p className={s['booking-field-desc']}>date</p>
    </li>
    <li>
        
    <div id="booking-guests" className={s["booking-field"]}>
           <FormGuestsField ref={guestsField}/>
    </div>

    <p className={s['booking-field-desc']}>guests</p>
    </li>                        
    <li>

    <div id="booking-time" className={s["booking-field"]}>
        
        <FormTimeField ref={fpTime}></FormTimeField>
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



const FormDateField  = forwardRef((props, ref) => {
    const handleArrowClick = (e) => {
        // Get the current selected date
        let date = ref.current.flatpickr.latestSelectedDateObj;
        // Define the minimum date (today)
        const minDate = new Date();
    
        // Clone the date so you can try to modify it
        let newDate = new Date(date);
    
        if (e.currentTarget.className.includes("right")) {
          newDate.setDate(newDate.getDate() + 1);
        } else {
          newDate.setDate(newDate.getDate() - 1);
          // If newDate is before minDate, set it to minDate
          if (newDate.getTime() < minDate.getTime()) {
            newDate = minDate;
          }
        }
        // Update the input and flatpickr instance
        ref.current.flatpickr.input.value = newDate;
        ref.current.flatpickr.setDate(newDate, false, "D,d M");
      };

    return <>
        <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnleft}  date`} 
         onClick={handleArrowClick}><i className="bi bi-caret-left-fill"></i></button>


        <span><Flatpickr className={`${s['form-control']} form-control date-input`} id="booking-date-field"
                        placeholder="Mon, 1, Jan" options={{
                            altInput: true,
                            altFormat: "D,d M",
                            deafultDate: new Date(),
                            disableMobile: "true",
                            minDate: new Date(),
                            }} ref={ref} value={new Date()} /></span>                


        <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnright} date`} 
        onClick={handleArrowClick}><i className="bi bi-caret-right-fill"></i></button>
    </>



});



const FormTimeField  = forwardRef((props, ref) => {
    const handleArrowClick = (e) => {
        // Get the current selected time
        let time = ref.current.flatpickr.latestSelectedDateObj;
        // Define the minimum time (now)
        const minTime = new Date();
    
        // Clone the time so you can modify it
        let newTime = new Date(time);
    
        if (e.currentTarget.className.includes("right")) {
          newTime.setMinutes(newTime.getMinutes() + 30);
        } else {
          newTime.setMinutes(newTime.getMinutes() - 30);
          // If newTime is before minTime, set it to minTime
          if (newTime.getTime() < minTime.getTime()) {
            newTime = minTime;
          }
        }
        // Update the input and flatpickr instance
        ref.current.flatpickr.input.value = newTime;
        ref.current.flatpickr.setDate(newTime, false, "H:i");
      };


    return <> <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnleft} time`} 
        onClick={handleArrowClick}><i className="bi bi-caret-left-fill"></i></button>


        <span><Flatpickr className={`${s['form-control']} form-control time-input`} id="booking-time-field" placeholder='00:00' options={{
            enableTime:true,
            noCalendar:true,
            altInput: true,
            altFormat: "H:i",
            time_24hr: true,
            disableMobile: "true",
            deafultDate: new Date(),
            minDate: new Date(),
            }} ref={ref} value={new Date().setHours(new Date().getHours() + 1)}/></span>

        <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnright}  time`}
         onClick={handleArrowClick}><i className="bi bi-caret-right-fill"></i></button>
    </>



});



const FormGuestsField = forwardRef((props, ref)=>{
    

    const handleArrowClick = (e) => {
        if (e.currentTarget.className.includes("right")){
            ref.current.value = parseInt(ref.current.value) + 1;
        }else{
            if (ref.current.value > 1)
                ref.current.value = parseInt(ref.current.value) - 1;
        }
    }

    return <>
            <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnleft} guests`}
            onClick={handleArrowClick}><i className="bi bi-caret-left-fill"></i></button>

            <span><input className={`${s['form-control']} form-control guests-input`} type="number" placeholder="1" id="booking-guests-field" min={1}
            ref={ref}
            defaultValue={1}
            onChange={(e) => {
                if (e.target.value < 1) {
                e.target.value = 1; // Force the value to stay at or above 1
                }
            }}
            /></span>

            <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnright}  guests`} 
                    onClick={handleArrowClick}><i className="bi bi-caret-right-fill"></i></button>
    </>
    

})