import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import 'flatpickr/dist/flatpickr.css'


import { BookingModal } from "./booking/booking";
import {HeaderNavbar, ImageSection, ReserveByPhone, OpeningHours} from "./main/main";

import { CreateBookingRequestContent } from './booking/createBookingRequest';

import {CreatedBookingList} from './booking/bookingList'

import { useNavigate } from 'react-router-dom';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ContextWrapper } from './booking/context';

import { CreatedBookingDetail } from './booking/bookingDetail'; 
import { useEffect } from 'react';

function App() {

  const MainPage = () => {
    return <ContextWrapper>
      <div id='main-page-wrapper'>
        <HeaderNavbar/>
        <ImageSection/>
        <BookingModal/>
        <ReserveByPhone/>
        <OpeningHours/>
      </div>
    </ContextWrapper>}

  const CreateBookingRequest = () => {
    document.body.style.overflow = 'hidden';
    return <ContextWrapper>
      <div id='create-booking-request-wrapper'>
        <HeaderNavbar/>
        <CreateBookingRequestContent/>
      </div>
    </ContextWrapper>
  } 
  
  const BookingList = () => {
    document.body.style.overflow = 'hidden';
    return <div id='create-booking-info-wrapper'>
      <HeaderNavbar/>
      <CreatedBookingList/>
    </div>
  }

  const BookingDetail =() => {
    document.body.style.overflow = 'hidden';

    return <div>
      <HeaderNavbar/>
      <CreatedBookingDetail/>
    </div>
  
  }
  return (<BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage/>}/>
      <Route path="/create-booking-request" element={<CreateBookingRequest/>}/>
      <Route path="/created-booking-list" element={<BookingList/>}/>
      <Route path="/created-booking-detail/:bookingId" element={<BookingDetail/>}/>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
