import s from '../../css/create_booking_request_style.module.css' 
import * as Yup from 'yup';
import { Formik, Form, FastField } from "formik";
import { forwardRef } from "react";
import {format, parseISO} from 'date-fns'
import { apiRoute } from '../../constants';
import axios from "axios";
import {useNavigate} from "react-router-dom";




export const FormikForm = forwardRef((props, refs)=>{
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