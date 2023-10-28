import { Formik, Form, FastField, isInteger } from "formik";
import Flatpickr from "react-flatpickr";


import { forwardRef, useContext, useEffect, useRef, useState } from "react";

import { createRoot } from "react-dom/client";

import s from '../css/create_booking_request_style.module.css' 

import sC from '../css/choose_table_style.module.css'

import {format, parseJSON} from 'date-fns'

import { TableElement } from "./chooseTable";

import {ChooseTableModal } from "./chooseTable";

import { MainPageContext } from "./context";

import axios from "axios";

import {useNavigate} from "react-router-dom";

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

    // all data for booking from main page form  
    const userRequirementsData = JSON.parse(localStorage.getItem('userBookingRequirementsData')); 

    //putting it in constants because I use it in two of the useEffects
    const parsedBookingStartDateTime = parseJSON(userRequirementsData.bookingStart)//parse json is date-fns function

    const time = format(parsedBookingStartDateTime, "H:mm");

    const guests = userRequirementsData.guests;


    //refs
    const tableChosen = useRef(userRequirementsData.tableChosen);

    const formikRef = useRef();

    // context func to set short info in choose table window at the top
    const {setDataForShortInfo} = useContext(MainPageContext)

    useEffect(()=>{
        let date = format(parsedBookingStartDateTime, "E, d LLL");
        setDataForShortInfo(date, time, guests)
    },[])


    useEffect(() => {
        let date = format(parsedBookingStartDateTime, "yyyy-MM-dd");
        
        axios.post("http://127.0.0.1:8000/api/get-tables", {
        
            time: time,
            date: date,
            guests: guests,


        }).then((res) => {
            let free_tables = res.data.free_tables;
            let root = createRoot(document.getElementById('list-of-tables'))

            let tables = [];
            
            free_tables.forEach((table) => {
                let dataForTableElement ={ time:time, table: table}
                let dataForHandleBtn = {tableChosen:tableChosen, formikInstance:formikRef, nav:null}
                const tableElement = <TableElement data={dataForTableElement} 
                                                   tableElementHandler = {handleTableElementClick}
                                                   dataForTableElementHandler={dataForHandleBtn} key={table.id} 
                                                   active={(table.id == tableChosen.current)}/>;

                tables.push(tableElement)
            })
            root.render(tables)

           
        })
      },[]);  
    

    return <div id="create-booking-content" className={s['create-booking-content']}>
        <div id="form-wrapper" className={s['form-wrapper']}>
            <FormikInit ref={{formik:formikRef, tableChosen: tableChosen}} userRequirementsData={userRequirementsData} >
                <Form>
                    <TableInfoFields/>

                    <BookingFrameInfoFields bookingStart={userRequirementsData.bookingStart} 
                    bookingEnd={userRequirementsData.bookingEnd}/> 

                    <ClientPersonalInfoFields/>

                    <button className="btn btn-success" type="submit">Submit</button>
                </Form>
            </FormikInit>
        </div>

        <div>
            <ChooseTableModal className={s['choose-table-modal']}/>

        </div>



    </div>
}

const FormikInit = forwardRef((props, refs)=>{
    const userRequirementsData = props.userRequirementsData;

    const navigate = useNavigate();

    return <Formik innerRef={refs.formik} enableReinitialize={true} 
            
        initialValues={
            {table: `${userRequirementsData.tableTags} : Table ${refs.tableChosen.current}`, 
            guests: userRequirementsData.guests, bookingStart: userRequirementsData.bookingStart, 
            bookingEnd:userRequirementsData.bookingEnd,clientName:'', clientEmail: '', clientTel:''
            }
        }

        onSubmit={(values) => {
                let dataForApi = Object.assign({}, values)
                dataForApi.table = refs.tableChosen.current;
                console.log(dataForApi)
                axios.post('http://127.0.0.1:8000/api/create-booking-request', 
                {bookingRequestData: dataForApi}).then((res) => {

                    const userBookingData = {phoneNumber: values.clientTel, email: values.clientEmail}
                    console.log(dataForApi)
                    localStorage.setItem('isBookingCreated', true);

                    localStorage.setItem('userBoookingData', JSON.stringify(userBookingData))

                    navigate('/created-booking-list')
                })
        }}
        
        >
        <div>
            {props.children}
        </div>

    </Formik>
}
)



const GroupFieldTitle = (props) => {return <h4 style={{textAlign:"center"}}>{props.children}</h4>}

const TableInfoFields = () => {return <div>
    <GroupFieldTitle>Table Info</GroupFieldTitle>

    <label htmlFor="table">Table:</label>
    <FastField type="text" className={`${s['form-control']} form-control`} name="table" 
    disabled={true} 
    />

    <label htmlFor="guests">Guests:</label>
    <FastField type="number" className={`${s['form-control']} form-control`} name="guests"
    disabled={true}
    />

</div>}


const BookingFrameInfoFields = forwardRef((props)=>{return <div>
    <GroupFieldTitle>Booking Time</GroupFieldTitle>

    <label htmlFor="bookingStart">Booking Start:</label>
    <Flatpickr className={`${s['form-control']} ${s['create-booking-field']} form-control`} 
    options={optinosForFlatpickr} name="bookingStart" defaultValue={props.bookingStart} 
    disabled={true}
    />
                    
    <label htmlFor="bookingEnd">Booking End:</label>
    <Flatpickr className={`${s['form-control']} ${s['create-booking-field']} form-control`} 
    disabled={true} options={optinosForFlatpickr} name="bookingEnd" defaultValue={props.bookingEnd}/>

</div>})


const ClientPersonalInfoFields = () =>{return <div>
    <GroupFieldTitle>Personal Info</GroupFieldTitle>

    <label htmlFor="clientName">Name:</label>
    <FastField type="text" className={`${s['form-control']} ${s['create-booking-field']} form-control`} 
    name="clientName" 
    />

    <label htmlFor="clientTel">Phone Number:</label>
    <FastField type="tel" className={`${s['form-control']} ${s['create-booking-field']} form-control`} 
    name="clientTel" 
    />

    <label htmlFor="clientEmail">Email:</label>
    <FastField type="email" className={`${s['form-control']} ${s['create-booking-field']} form-control`} 
    name="clientEmail"
    />
</div>}









const handleTableElementClick = (e, data, ...others) => {
    const currentTableElement = document.getElementById(data.tableChosen.current)

    if (currentTableElement)
        currentTableElement.classList.remove(sC['table-element-active']);

    e.currentTarget.classList.add(sC['table-element-active']);

    data.tableChosen.current = e.currentTarget.id;
    
    var textForTableField = e.currentTarget.childNodes[1].textContent + ': ' + e.currentTarget.childNodes[2].textContent 
    
    data.formikInstance.current.setFieldValue('table', textForTableField);

}
