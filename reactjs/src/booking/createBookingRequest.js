
import s from '../css/create_booking_request_style.module.css' 
import sC from '../css/choose_table_style.module.css'

import { Formik, Form, FastField } from "formik";

import * as Yup from 'yup';

import { forwardRef, useContext, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import { MainPageContext } from "./context";
import { TableElement,ChooseTableModal} from "./chooseTable";
import {format, formatISO, parseJSON, parseISO} from 'date-fns'

import { apiRoute } from './constants';

import axios from "axios";

import {useNavigate} from "react-router-dom";


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
    }, [])


    useEffect(() => {
        let date = format(parsedBookingStartDateTime, "yyyy-MM-dd");
        const time = format(parsedBookingStartDateTime, "H:mm");

        axios.post(`${apiRoute}/get-tables`, {
        
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

        let dataForApi = Object.assign({bookingStart:formatISO(bookingStartTime), bookingEnd:formatISO(bookingEndTime)}, values)
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
                {/* {errors.clientName && touched.clientName && <div>{errors.clientName}</div>}
                {errors.clientEmail && touched.clientEmail && <div>{errors.clientEmail}</div>}
                {errors.clientTel && touched.clientTel&& <div>{errors.clientTel}</div>} */}

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
        <FastField type="text" className={`${s['form-control']} ${s['round-top']} form-control`} name="table" 
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
    <FastField type="text" className={`${s['form-control']} ${s['round-top']} form-control`} 
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

