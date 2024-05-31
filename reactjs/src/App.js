import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import 'flatpickr/dist/flatpickr.css'


import { BookingModal } from "./booking/booking";
import {HeaderNavbar, ImageSection, ReserveByPhone, OpeningHours, ImageSectionContent} from "./main/main";

import { CreateBookingRequestContent } from './booking/createBookingRequest';

import {CreatedBookingList} from './booking/bookingList'

import { useLocation, useNavigate } from 'react-router-dom';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ContextWrapper } from './booking/context';

import { CreatedBookingDetail } from './booking/bookingDetail'; 

import { Menu, MenuImageSectionContent } from './menu/menu';
import { ScrollRestoration } from "react-router-dom";
import { useEffect } from 'react';



function App() {
  const MainPage = () => {
    document.body.style.overflow = 'visible';
    return <ContextWrapper>
      <div id='main-page-wrapper'>
        <HeaderNavbar/>
        <ImageSection><ImageSectionContent/></ImageSection>
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

  const MenuPage = () => {
    document.body.style.overflow = 'scroll';
    return <div>
        <HeaderNavbar/>
        <ImageSection><MenuImageSectionContent/></ImageSection>
        <Menu/>
    </div>
  }
  const ScrollToTop = (props) => {
    const location = useLocation();
    useEffect(() => {
      if (!location.hash) {
        window.scrollTo(0, 0);
      }
    }, [location]);
  
    return <>{props.children}</>
  };

  return (<BrowserRouter>
    <ScrollToTop/>
    <Routes>
      <Route path="/" element={<MainPage/>}/>
      <Route path="/create-booking-request" element={<CreateBookingRequest/>}/>
      <Route path="/created-booking-list" element={<BookingList/>}/>
      <Route path="/created-booking-detail/:bookingId" element={<BookingDetail/>}/>
      <Route path="/menu/" element={<MenuPage/>}/>
    </Routes>
  </BrowserRouter>
  );

}

export default App;
