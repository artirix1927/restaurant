import { useEffect, useState} from "react"

import s from '../css/booking_info.module.css'
import axios from "axios";

import { format } from 'date-fns';

import { Link } from "react-router-dom";

const dateFormat = "E, d LLL H:mm"

export const CreatedBookingList = () => {
    const [userBookings, setUserBookings] = useState([]);


    useEffect(() =>{
        let userBookingData = JSON.parse(localStorage.getItem('userBoookingData'));

        const doAxios = () => {axios.post('http://127.0.0.1:8000/api/get-user-bookings', 
        {phoneNumber: userBookingData.phoneNumber, email:userBookingData.email}).then(

            res => {console.log(res.data.userBookings) 
            setUserBookings(res.data.userBookings)

        })}

        doAxios()

        const interval = setInterval(() => {doAxios()}, 60000);
        return () => {
            clearInterval(interval);
        };
        
    }, [])

    return <div className={s['boooking-list']}>
        <ul>
        {userBookings.map((booking)=>{
        return <BookingInfoCard data={booking} key={booking.id}/>
        
        })}
        </ul>
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
            <div style={{color:"black"}}>
                <p>From: {bookingStartFormatted} <br/> To: {bookingEndFormatted}  
                <br/>Guests: {props.data.guests} Booking Id: {props.data.id}</p>
            </div>
        </Link>
    </li>
}

