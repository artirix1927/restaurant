
import s from '../css/create_booking_request_style.module.css' 
import sC from '../css/choose_table_style.module.css'

import { Formik, Form, FastField } from "formik";

import * as Yup from 'yup';

import { forwardRef, useContext, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import { MainPageContext } from "./context";
import { TableElement,ChooseTableModal} from "./chooseTable";
import {format, formatISO, parseJSON, parseISO} from 'date-fns'

import { apiRoute } from '../constants';

import axios from "axios";

import {useNavigate} from "react-router-dom";
import { openTableChoosingWindow } from './booking';
import { useTableContext } from '../tableContext';
import { useScreenSize } from '../hooks';


export const CreateBookingRequestContent = () => {
    // All data for booking from main page form  
    const userRequirementsData = JSON.parse(localStorage.getItem("userBookingRequirementsData")); 
    const parsedBookingStartDateTime = parseJSON(userRequirementsData.bookingStart);

    // Refs
    const tableChosen = useRef(userRequirementsData.tableChosen);
    const formikRef = useRef();

    const { setDataForShortInfo } = useContext(MainPageContext);
    const isSmallScreen = useScreenSize();
    const [isModalOpen, setIsModalOpen] = useState(false);


    const { setTables } = useTableContext();
    

    useEffect(() => {  
        const date = format(parsedBookingStartDateTime, "E, d LLL");
        const time = format(parsedBookingStartDateTime, "H:mm");
        setDataForShortInfo(date, time, userRequirementsData.guests);
    }, []);


    useEffect(() => {
        axios.post(`${apiRoute}/get-tables`, {
            time: userRequirementsData.bookingStart,
            date: userRequirementsData.bookingStart,
            guests: userRequirementsData.guests,
        }).then((res) => {
            let freeTables = res.data.free_tables;
            let tables = [];

            let isTablePresent = false;
            freeTables.forEach((table) => {
                if (table.id === tableChosen.current) isTablePresent = true;

                let dataForTableElement = { time: format(parsedBookingStartDateTime, "H:mm"), table };
                let dataForHandleBtn = { tableChosen, formikRef, nav: null };

                tables.push(
                    <TableElement 
                        data={dataForTableElement} 
                        tableElementHandler={handleTableElementClick}
                        dataForTableElementHandler={dataForHandleBtn} 
                        key={table.id} 
                        active={table.id === tableChosen.current}
                    />
                );
            });

            setTables(tables);

            if (!isTablePresent) {
                requestIdleCallback(() => {
                    if (tables.length > 0) {
                        setCurrentTableElementTo(tables[tables.length - 1], formikRef, tableChosen);
                    }
                });
            }
        });
    }, []);

    return (
        <div id="create-booking-content" className={s["create-booking-content"]}>
            <div id="form-wrapper" className={s["form-wrapper"]}>
                <FormikForm ref={{ formik: formikRef, tableChosen }} userRequirementsData={userRequirementsData} />
            </div>

            {isSmallScreen==true && <button className={s["open-modal-btn"]} onClick={() => {openTableChoosingWindow(); setIsModalOpen(true)}}>
                Choose Table
            </button>}

            <ChooseTableModal setIsModalOpen={setIsModalOpen}
                className={`${s["choose-table-modal"]} ${isSmallScreen ? s["hidden"] : ""} ${isModalOpen ? s["show-modal"] : ""}`} 
            />

        </div>
    );
};


const FormikForm = forwardRef((props, refs)=>{
    const phoneRegExp = `^[/+]?[(]?[0-9]{3}[)]?[-/s/.]?[0-9]{3}[-/s/.]?[0-9]{4,6}$`

    const userRequirementsData = props.userRequirementsData;

    const bookingStartTime = parseISO(userRequirementsData.bookingStart)
    const bookingEndTime = parseISO(userRequirementsData.bookingEnd)
    const bookingTimeFieldValue = `${format(bookingStartTime, "E, d LLL")} ${format(bookingStartTime, "H:mm")}-${format(bookingEndTime, "H:mm")}`

    const navigate = useNavigate();

    const validationSchema =  Yup.object().shape({
        clientName: Yup.string().required(),
        clientEmail: Yup.string().email('Email is not valid').required(),
        clientTel: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required(),
    })


    const submitHandler = (values) =>{ 
        
        let dataForApi = Object.assign({bookingStart:userRequirementsData.bookingStart, 
                                        bookingEnd:userRequirementsData.bookingEnd}, values)

        dataForApi.table = refs.tableChosen.current;

        axios.post(`${apiRoute}/create-booking-request`, 
        {bookingRequestData: dataForApi}).then((res) => {
            const userData = {phoneNumber: values.clientTel, email: values.clientEmail}
        
            localStorage.setItem('isBookingCreated', true);

            localStorage.setItem('userData', JSON.stringify(userData))
            
            navigate('/created-booking-list')
            
    }).catch(error=>{
        alert(error.response.data)
    })}

    return <Formik innerRef={refs.formik} enableReinitialize={true} 
            
        initialValues={

            {table:`Table ${refs.tableChosen.current} : ${userRequirementsData.tableTags}` , 
            guests: userRequirementsData.guests, 
            clientName:'', clientEmail: '', clientTel:'', bookingTime: bookingTimeFieldValue}
        }

        onSubmit={values=>submitHandler(values)}

        validationSchema={validationSchema}
        >
        {({ errors, touched }) => (
            <Form>
                <ClientPersonalInfoFields/>
                
                <br/>
                <TableInfoFields/>

                <br/>
                <button className="btn btn-success" type="submit">Submit</button>
            </Form>
        )}

    </Formik>
}
)

const FormFieldWrapper = (props) => {return <div className={s['form-field-wrapper']}>
        <i className={`${s['icon-inside-input']} bi bi-${props.iconName}`}></i>
        {props.children}
</div>}

const TableInfoFields = () => {return <div>
    <FormFieldWrapper iconName='journal'>
        <FastField type="text" className={`${s['form-control']} form-control`} name="table" 
        disabled={true}/>
    </FormFieldWrapper>

    <FormFieldWrapper iconName='person'>
        <FastField type="number" className={`${s['form-control']} form-control`} name="guests"
        disabled={true}/>
    </FormFieldWrapper>

    <FormFieldWrapper iconName='alarm'>
        <FastField className={`${s['form-control']} form-control`} 
        name="bookingTime" 
        disabled={true}/>
    </FormFieldWrapper>

</div>}





const ClientPersonalInfoFields = () =>{return <div>
    <FastField type="text" className={`${s['form-control']} form-control`} 
    name="clientName" placeholder="Name"
    />

    <FastField type="tel" className={`${s['form-control']}  form-control`} 
    name="clientTel" placeholder="Phone number"
    />

    <FastField type="email" className={`${s['form-control']}  form-control`} 
    name="clientEmail" placeholder="Email"
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

    const textForTableField = `${tableElem.childNodes[2].textContent} : ${tableElem.childNodes[1].textContent}`
    formikRef.current.setFieldValue('table', textForTableField);

}

