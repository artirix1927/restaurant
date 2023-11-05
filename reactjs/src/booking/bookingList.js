import { useEffect, useState} from "react"

import s from '../css/booking_info.module.css'
import axios from "axios";

import { format } from 'date-fns';

import { Link } from "react-router-dom";
import { Field, Form, Formik } from "formik";

const dateFormat = "E, d LLL H:mm"

export const CreatedBookingList = () => {
    const [userBookings, setUserBookings] = useState([]);

    const [isBookingNotOnListActive, setIsBookingNotOnListActive] = useState(false);
    
    useEffect(() =>{
        const userData = JSON.parse(localStorage.getItem('userData'));

        const doAxios = () => {axios.post('http://127.0.0.1:8000/api/get-user-bookings', 
        {phoneNumber: userData.phoneNumber, email:userData.email}).then(

            res => {
            setUserBookings(res.data.userBookings)

        })}

        doAxios()

        const interval = setInterval(() => {doAxios()}, 60000);
        return () => {
            clearInterval(interval);
        };
        
    }, [localStorage.getItem('userData')])

    return <div className={s['booking-list-wrapper']}>
        <div className={s['booking-list']}>
            <ul>
            {userBookings.map((booking)=>{
            return <BookingInfoCard data={booking} key={booking.id}/>
            
            })}
            </ul>
        </div>
        <p className={s['bookings-not-on-list-btn']} 
        onClick={() => {setIsBookingNotOnListActive(!(isBookingNotOnListActive))}}
        >Your bookings are not on the list?</p>

        <BookingNotOnListModal isActive={isBookingNotOnListActive} setIsActive={setIsBookingNotOnListActive}/>
    </div>




}

const BookingNotOnListModal = (props) =>{
    
    const displayProperty = props.isActive ? 'block' : 'none'

    const closeBtnOnClick = () => {props.setIsActive(!(props.isActive))}

    const formOnSubmit  = (values) => {
        const userData = {phoneNumber: values.clientTel, email: values.clientEmail}
        localStorage.setItem("userData", JSON.stringify(userData))
        closeBtnOnClick()
    }

    
    return <div className={s['bookings-not-on-list-div']} style={{display: displayProperty}}> 

        
        <i className={`${s['close-arrow']} bi bi-arrow-left-short`} onClick={closeBtnOnClick}></i>
        

        <div className={s['content']}>
            <br></br>
            <h6>
                Our site servers you bookings by your last email and phone 
                number entered while creating a booking. 
                <br/>
                Try to enter an other email and phone there:  
            </h6>

            
            <Formik initialValues={{clientTel:'', clientEmail:''}} 
            onSubmit={(values)=>formOnSubmit(values)}>

                <Form className={s['form']}>

                    <Field type="tel" className={`${s['form-control']}  form-control`} 
                    name="clientTel" placeholder="Phone number"/>

                    <Field type="email" className={`${s['form-control']}  form-control`} 
                    name="clientEmail" placeholder="Email"/>

                    <button type="submit" className={`${s['save-btn']} btn btn-success`} >Save</button>

                </Form>
            </Formik>
            

            
            
        
            
        </div>
    </div>

}


const BookingInfoCard = (props) => { 
    const [bookingStartFormatted, changeBookingStartFormatted] = useState()
    const [bookingEndFormatted, changeBookingEndFormatted] = useState()
    useEffect(() => {
        //use date-fns since i dont use here flatpickr instance \
        changeBookingStartFormatted(format(new Date(props.data.booking_start), dateFormat))
        changeBookingEndFormatted(format(new Date(props.data.booking_end), dateFormat))
    }, [props.data.booking_start, props.data.booking_end])
    
    
    return <li className={s['booking-info-card']}>
        <Link to={`/created-booking-detail/${props.data.id}`} style={{textDecoration:'none'}}>
            <div style={{color:'black'}}>

                <p>From: {bookingStartFormatted} <br/> To: {bookingEndFormatted}  

                <br/>Guests: {props.data.guests} Booking Id: {props.data.id}</p>

            </div>
        </Link>
    </li>
}

