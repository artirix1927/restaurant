import s from '../css/booking_window_style.module.css'
import sArrows from '../css/arrows_style.module.css'

import { handleArrowClick } from './arrowsHanlders';

import { useRef, useState } from 'react';

import { handleFindBtnClick } from './handlers';

import { ChooseTableModal } from './chooseTable';

import Flatpickr from "react-flatpickr";


export const BookingModal = () => {return <div id="booking" className={s.booking}>
    <div id="booking-content" className={s['booking-content']}>
        <div>
            <ChooseTableModal/>
        </div>
        
        <form>
            <ul >
                <FormFields/>
            </ul>
        </form>
    </div>
</div>}


const FormFields = () => {
    const fpTime = useRef();
    const fpDate = useRef();
    const guestsField = useRef();

    return <div><li>
    <div id="booking-date" className={s["booking-field"]}>
        <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnleft} ${sArrows['changing-arrow']} date`} onClick={(e) => {handleArrowClick(e ,fpDate, fpTime)}}><i className={`${sArrows.arrow} ${sArrows.left}`}></i></button>

        

        <span><Flatpickr className={`${s['form-control']} ${s.input} form-control date-input`} id="booking-date-field"
                        placeholder="Mon, 1, Jan" options={{
                            altInput: true,
                            altFormat: "D,d M",
                            deafultDate: new Date(),
                            disableMobile: "true",
                            minDate: new Date(),
                            }} ref={fpDate}/></span>                


        <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnright} ${sArrows['changing-arrow']} date`} onClick={(e) => {handleArrowClick(e ,fpDate, fpTime)}}><i className={`${sArrows.arrow} ${sArrows.right}`}></i></button>
    </div>
    <p className={s['booking-field-desc']}>date</p>
    </li>
    <li>
        
     <div id="booking-guests" className={s["booking-field"]}>
            <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnleft} ${sArrows['changing-arrow']} guests`} onClick={(e) => {handleArrowClick(e ,fpDate, fpTime)}}><i className={`${sArrows.arrow} ${sArrows.left}`}></i></button>
            
            <span><input className={`${s['form-control']} ${s.input} form-control guests-input`} type="number" placeholder="1" id="booking-guests-field" 
            ref={guestsField}/></span>

            <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnright} ${sArrows['changing-arrow']} guests`} onClick={(e) => {handleArrowClick(e ,fpDate, fpTime)}}><i className={`${sArrows.arrow} ${sArrows.right}`}></i></button>
    </div>

    <p className={s['booking-field-desc']}>guests</p>
    </li>                        
    <li>

    <div id="booking-time" className={s["booking-field"]}>
        <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnleft} ${sArrows['changing-arrow']} time`} onClick={(e) => {handleArrowClick(e ,fpDate, fpTime)}}><i className={`${sArrows.arrow} ${sArrows.left}`}></i></button>
        <span><Flatpickr className={`${s['form-control']} ${s.input} form-control time-input`} id="booking-time-field" placeholder='00:00' options={{
            enableTime:true,
            noCalendar:true,
            altInput: true,
            altFormat: "H:i",
            time_24hr: true,
            disableMobile: "true",
            }} ref={fpTime}/></span>
        <button type="button" className={`${sArrows.arrowbtn} ${sArrows.arrowbtnright} ${sArrows['changing-arrow']} time`} onClick={(e) => {handleArrowClick(e ,fpDate, fpTime)}}><i className={`${sArrows.arrow} ${sArrows.right}`}></i></button>
    </div>

    <p className={s['booking-field-desc']}>time</p>

    </li>                      

    <button id="booking-findbtn" className={s['booking-findbtn']} type="button" onClick={(e) => {handleFindBtnClick(e,fpDate,fpTime,guestsField)}}>FIND A TABLE</button>
    
    </div>}




