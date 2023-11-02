
import s from '../css/create_booking_request_style.module.css' 
import sC from '../css/choose_table_style.module.css'

import { Formik, Form, FastField } from "formik";

import * as Yup from 'yup';

import Flatpickr from "react-flatpickr";

import { forwardRef, useContext, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import { MainPageContext } from "./context";
import { TableElement,ChooseTableModal} from "./chooseTable";
import {format, parseJSON} from 'date-fns'


import axios from "axios";

import {json, useNavigate} from "react-router-dom";




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

    const parsedBookingStartDateTime = parseJSON(userRequirementsData.bookingStart)//parse json is date-fns function

    //refs
    const tableChosen = useRef(userRequirementsData.tableChosen);

    const formikRef = useRef();


    // context func to set short info in choose table window at the top
    const {setDataForShortInfo} = useContext(MainPageContext)

    useEffect(()=>{  

        const date = format(parsedBookingStartDateTime, "E, d LLL");
        const time = format(parsedBookingStartDateTime, "H:mm");

        setDataForShortInfo(date, time, userRequirementsData.guests)
    },[])


    useEffect(() => {
        let date = format(parsedBookingStartDateTime, "yyyy-MM-dd");
        const time = format(parsedBookingStartDateTime, "H:mm");

        axios.post("http://127.0.0.1:8000/api/get-tables", {
        
            time: time,
            date: date,
            guests: userRequirementsData.guests,


        }).then((res) => {
            let free_tables = res.data.free_tables;
            const listOfTables = document.getElementById('list-of-tables')

            let root = createRoot(listOfTables)
            root.unmount()
            
            root = createRoot(listOfTables)

            let tables = [];

            let isTablePresent = false;
            free_tables.forEach((table) => {
                //checking if there is chosenTable in free tables 
                //(when user books a table and returns to the form)
                if (table.id === tableChosen.current)
                    isTablePresent = true;

                let dataForTableElement ={ time:time, table: table}
                let dataForHandleBtn = {tableChosen:tableChosen, formikRef:formikRef, nav:null}
                const tableElement = <TableElement data={dataForTableElement} 
                                                   tableElementHandler = {handleTableElementClick}
                                                   dataForTableElementHandler={dataForHandleBtn} key={table.id} 
                                                   active={(table.id === tableChosen.current)}/>;
                tables.push(tableElement)
            })
            
            root.render(tables);

            if (!(isTablePresent)){
                requestIdleCallback(()=>{
                    const lastTableElem = listOfTables.lastChild
                    setCurrentTableElementTo(lastTableElem, formikRef, tableChosen)
                })
            }
            
        })
      },[]);  
    

    return <div id="create-booking-content" className={s['create-booking-content']}>
        <div id="form-wrapper" className={s['form-wrapper']}>
            <FormikForm ref={{formik:formikRef, tableChosen: tableChosen}}
             userRequirementsData={userRequirementsData}/>
            
            
        </div>

        <div>
            <ChooseTableModal className={s['choose-table-modal']}/>

        </div>



    </div>
}





const FormikForm = forwardRef((props, refs)=>{
    const phoneRegExp = "^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"

    const validationSchema =  Yup.object().shape({
        clientName: Yup.string().required(),
        clientEmail: Yup.string().email('Email is not valid').required(),
        clientTel: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required(),
    })

    const navigate = useNavigate();

    const submitHandler = (values) =>{ 

        let dataForApi = Object.assign({}, values)
        dataForApi.table = refs.tableChosen.current;

        axios.post('http://127.0.0.1:8000/api/create-booking-request', 
        {bookingRequestData: dataForApi}).then((res) => {
            const userBookingData = {phoneNumber: values.clientTel, email: values.clientEmail}
        
            localStorage.setItem('isBookingCreated', true);

            localStorage.setItem('userBoookingData', JSON.stringify(userBookingData))
            
            navigate('/created-booking-list')
            
    }).catch(error=>{
        alert(error.response.data)
    })}

    const userRequirementsData = props.userRequirementsData;

    return <Formik innerRef={refs.formik} enableReinitialize={true} 
            
        initialValues={

            {table: `${userRequirementsData.tableTags} : Table ${refs.tableChosen.current}`, 
            guests: userRequirementsData.guests, bookingStart: userRequirementsData.bookingStart, 
            bookingEnd:userRequirementsData.bookingEnd,clientName:'', clientEmail: '', clientTel:''}
        }

        onSubmit={values=>submitHandler(values)}

        validationSchema={validationSchema}
        >
        {({ errors, touched }) => (
            <Form>
                <TableInfoFields/>

                <BookingFrameInfoFields bookingStart={userRequirementsData.bookingStart} 
                bookingEnd={userRequirementsData.bookingEnd}/> 

                <ClientPersonalInfoFields/>
                {errors.clientName && touched.clientName && <div>{errors.clientName}</div>}
                {errors.clientEmail && touched.clientEmail && <div>{errors.clientEmail}</div>}
                {errors.clientTel && touched.clientTel&& <div>{errors.clientTel}</div>}

                <button className="btn btn-success" type="submit">Submit</button>
            </Form>
        )}

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
    <Flatpickr className={`${s['form-control']} form-control`} 
    options={optinosForFlatpickr} name="bookingStart" defaultValue={props.bookingStart} 
    disabled={true}
    />
                    
    <label htmlFor="bookingEnd">Booking End:</label>
    <Flatpickr className={`${s['form-control']} form-control`} 
    disabled={true} options={optinosForFlatpickr} name="bookingEnd" defaultValue={props.bookingEnd}/>

</div>})


const ClientPersonalInfoFields = () =>{return <div>
    <GroupFieldTitle>Personal Info</GroupFieldTitle>

    <label htmlFor="clientName">Name:</label>
    <FastField type="text" className={`${s['form-control']}  form-control`} 
    name="clientName" 
    />

    <label htmlFor="clientTel">Phone Number:</label>
    <FastField type="tel" className={`${s['form-control']}  form-control`} 
    name="clientTel" 
    />

    <label htmlFor="clientEmail">Email:</label>
    <FastField type="email" className={`${s['form-control']}  form-control`} 
    name="clientEmail"
    />
</div>}






const handleTableElementClick = (e, data, ...others) => {
    let currentTableElement = document.getElementById(data.tableChosen.current)

    if ((currentTableElement))
        currentTableElement.classList.remove(sC['table-element-active']);
    
    setCurrentTableElementTo(e.currentTarget, data.formikRef, data.tableChosen)

}



const setCurrentTableElementTo = (tableElem, formikRef, tableChosen) => {
    tableChosen.current = tableElem.id;

    tableElem.classList.add(sC['table-element-active']) ;

    const textForTableField = tableElem.childNodes[1].textContent + ': ' + tableElem.childNodes[2].textContent
    formikRef.current.setFieldValue('table', textForTableField);

}

