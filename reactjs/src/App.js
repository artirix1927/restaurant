import 'bootstrap/dist/css/bootstrap.css';
import 'flatpickr/dist/flatpickr.css'


import { BookingModal } from "./booking/booking";
import {HeaderNavbar, ImageSection, ReserveByPhone, OpeningHours} from "./main/main";

import { CreateBookingRequestContent } from './booking/createBookingRequest';

import {BookingInfoList} from './booking/bookingList'


import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ContextWrapper } from './booking/context';

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
  
  const CreatedBookingInfo = () => {
    document.body.style.overflow = 'hidden';
    return <div id='create-booking-info-wrapper'>
      <HeaderNavbar/>
      <BookingInfoList/>
    </div>
  }

  return (<BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage/>}/>
      <Route path="/create-booking-request" element={<CreateBookingRequest/>}/>
      <Route path="/created-booking-list" element={<CreatedBookingInfo/>}/>
      <Route path="/created-booking-detail/:bookingRequestId" element={<CreatedBookingInfo/>}/>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
