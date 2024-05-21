import React, { useEffect, useState} from 'react';
import s from '../css/booking_detail.module.css'

import { useNavigate, useParams } from "react-router-dom";

import axios from 'axios';

import {format, parseJSON} from 'date-fns'

import { apiRoute } from '../constants';

const dateFormat = "E, d LLL H:mm"


export const CreatedBookingDetail = () => {
    const  { bookingId } = useParams();

    const [content, setContent] = useState()
 
    const navigate = useNavigate()
    useEffect(()=>{
        const doAxios = () => {
            const userData = JSON.parse(localStorage.getItem('userData'))
            axios.get(`${apiRoute}/get-booking-by-id/${bookingId}`, {params:userData}).then((res)=>{
                setContent(<BookingCard data={res.data.userBooking}/>)
            }
        ).catch(error=>{
            navigate('/created-booking-list')
        })}

        doAxios()

        const interval = setInterval(()=>{doAxios()}, 60000)

        return () => {
            clearInterval(interval);
        };

    },[])

    return <div className={s['booking-detail']}> 
        <div>
            {content}
        </div>
        
    </div>
}



const BookingCard = (props) => {

    const data = props.data;

    const getFormattedDateFromStr = (dateStr) => {return format(parseJSON(dateStr), dateFormat)}

    const navigate = useNavigate()

    const deleteButtonOnClick = () =>{
        const userData = JSON.parse(localStorage.getItem('userData'))

        axios.delete(`${apiRoute}/delete-booking-by-id/${data.id}`, {data:userData}).then(
            navigate('/created-booking-list')
        )
        
    }
    
    return <div>
        <div className={s['booking-detail-content']}>
            <h2 className={s['booking-info-text']}>Booking Info</h2>

            <h3 className={s['section-article']}>Table Info</h3>
            <div style={{marginBottom:20}}>
                <h5>Guests: {data.guests} guest/s</h5>
                <h5>Table {data.tables.toString()} : {data.tags_for_table.toString()}</h5>
            </div>

            <h3 className={s['section-article']}>Time</h3>
            <div style={{marginBottom:20}}>
                <h5>From : {getFormattedDateFromStr(data.booking_start)}</h5>
                <h5>To : {getFormattedDateFromStr(data.booking_end)}</h5>
            </div>

            <h3 className={s['section-article']}>Personal Info</h3>
            <div>
                <h5>Name: {data.client_name}</h5>
                <h5>Phone Number: {data.client_number}</h5>
                <h5>Email : {data.client_email}</h5>
            </div>
        </div>

        <h5 className={s['booking-id']}>Booking Id: {data.id}</h5>
        <button className='btn btn-danger' onClick={deleteButtonOnClick}>Delete</button>
    </div>
}