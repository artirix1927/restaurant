import { Formik, Field, Form, FastField } from "formik";
import Flatpickr from "react-flatpickr";


import { useEffect, useRef, useState } from "react";

import ReactDOM from 'react-dom';

import s from '../css/create_booking_request_style.module.css' 

import sC from '../css/choose_table_style.module.css'

import {format} from 'date-fns'


import {ChooseTableModal } from "./chooseTable";

import axios from "axios";

//flatpickr cfg 
const optinosForFlatpickr = {
    allowInput:false,
    enableTime:true,
    altInput: true,
    altFormat: "D, d M H:i",
    time_24hr: true,
    disableMobile: "true",
    }


export const CreateBookingRequestContent = () => {
    // date, time, guests, table data from main page 
    const userRequirementsData = JSON.parse(localStorage.getItem("userBookingRequirementsData")); 

    const startTimeFp = useRef();

    const tableChosen = useRef(userRequirementsData.tableChosen);

    const formikRef = useRef();

    useEffect(() => {
        const fpInstance = startTimeFp.current.flatpickr;
        const parsedDateTime = fpInstance.parseDate(userRequirementsData.bookingStart)

        let date = format(parsedDateTime, "yyyy-MM-dd");
        
        let time = format(parsedDateTime, "H:mm");

        let guests = userRequirementsData.guests;
        
        axios.post("http://127.0.0.1:8000/api/get-tables", {
        
            time: time,
            date: date,
            guests: guests,


        }).then((res) => {
            let free_tables = res.data.free_tables;
            let listOfTablesElement = document.getElementById('list-of-tables');

            ReactDOM.unmountComponentAtNode(listOfTablesElement);
            
            let tables = [];
            
            free_tables.forEach((table) => {
                let dataForTableElement ={ time:time, table: table}
                let dataForHandleBtn = {tableChosen:tableChosen, formikInstance:formikRef}

                const tableElement = <TableElement data={dataForTableElement} dataForHandleBtn={dataForHandleBtn}></TableElement>;
                
                tables.push(tableElement)
            })
            ReactDOM.render(tables, listOfTablesElement)
        })
        let formatedDate= format(parsedDateTime,"E, d LLL");

        document.getElementById("short-info-date").innerText = formatedDate
        document.getElementById("short-info-time").innerText = time;
        document.getElementById("short-info-guests").innerText = guests;
      }, [userRequirementsData]);  
    
    const getTableFieldInitialValue = () => {return `${userRequirementsData.tableTags} : Table ${tableChosen.current}`}



    return <div id="create-booking-content" className={s['create-booking-content']}>
    <div id="form-wrapper" className={s['form-wrapper']}>
        <Formik innerRef={formikRef} enableReinitialize={true} initialValues={
            {table: getTableFieldInitialValue(), 
            guests: userRequirementsData.guests,bookingStart: userRequirementsData.bookingStart, 
            bookingEnd:userRequirementsData.bookingEnd}
        }

        onSubmit={(values) => {
                let dataForApi = Object.assign({}, values)
                dataForApi.table = tableChosen.current;

                axios.post('http://127.0.0.1:8000/api/create-booking-request', {bookingRequestData: dataForApi}).then((res) => {

                    const userBookingData = {phoneNumber: values.clientTel, email: values.clientEmail}

                    localStorage.setItem('isBookingCreated', true);

                    localStorage.setItem('userBookingData',  JSON.stringify(userBookingData));

                    window.location.href = '/created-booking-list'
                })
        }}
        
        >
            
        <Form>
                <label htmlFor="table">Table:</label>
                <Field type="text" className={`${s['form-control']} form-control`} name="table" 
                disabled={true} 
                />

                <label htmlFor="guests">Guests:</label>
                <FastField type="number" className={`${s['form-control']} form-control`} name="guests" //innerRef={guestsRef} 
                />

                <label htmlFor="bookingStart">Booking Start:</label>
                <Flatpickr className={`${s['form-control']} ${s['create-booking-field']} form-control`} 
                options={optinosForFlatpickr} name="bookingStart" defaultValue={userRequirementsData.bookingStart} 
                ref={startTimeFp} disabled={true}
                />
                
                <label htmlFor="bookingEnd">Booking End:</label>
                <Flatpickr className={`${s['form-control']} ${s['create-booking-field']} form-control`} disabled={true} 
                options={optinosForFlatpickr} name="bookingEnd" defaultValue={userRequirementsData.bookingEnd}/>

                <label htmlFor="client-name">Name:</label>
                <FastField type="text" className={`${s['form-control']} ${s['create-booking-field']} form-control`} 
                name="clientName" 
                />

                <label htmlFor="client-tel">Phone Number:</label>
                <FastField type="tel" className={`${s['form-control']} ${s['create-booking-field']} form-control`} 
                name="clientTel" 
                />

                <label htmlFor="client-email">Email:</label>
                <FastField type="email" className={`${s['form-control']} ${s['create-booking-field']} form-control`} 
                name="clientEmail"
                />

                <button className="btn btn-success" type="submit">Submit</button>

            </Form>
            
            
        </Formik>
    </div>

    <div>
        <ChooseTableModal className={s['choose-table-modal']} />

    </div>


</div>
}



const TableElement = (props) => { 
    const handleTableElementClick = (e, data) => {
        document.getElementById(data.tableChosen.current).classList.remove(sC['table-element-active']);
        e.currentTarget.classList.add(sC['table-element-active']);
    
        data.tableChosen.current = e.currentTarget.id;
        
        var textForField = e.currentTarget.childNodes[1].textContent + ': ' + e.currentTarget.childNodes[2].textContent 
        
        data.formikInstance.current.setFieldValue('table', textForField);
    
    }


    return <div className={sC['table-element']} id={props.data.table.id} max_guests={props.data.table.max_guests} 
    key={props.data.table.id} onClick={(e) => {handleTableElementClick(e, props.dataForHandleBtn);}} >
    {props.data.time}  
    <p className={sC['tags-for-table']}>{props.data.table.tags.toString()} ({props.data.table.max_guests})</p>
    <p className={`${sC['tags-for-table']} ${sC['table-num']}`}> Table {props.data.table.id}</p>
</div>}
