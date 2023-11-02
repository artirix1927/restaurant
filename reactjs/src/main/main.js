

import logo from '../static/logo.png'
import sectionImage from '../static/restsection.jpg'

import s from '../css/main_style.module.css'
import { useEffect, useRef, useState } from 'react'

import { Link } from 'react-router-dom'

const navbarBackGroundHandler = () =>{
    if (window.scrollY == 0){
    document.getElementById('navbar').style.backgroundColor = 'transparent';
    } else{
    document.getElementById('navbar').style.backgroundColor = '#1C1C1C';}
  }


//header
const HeaderNavbar = () => {
    const navbarRef = useRef();
    const [showBtn, changeShowBtn] = useState('dont-show');

    useEffect(() => {
    if (localStorage.getItem('isBookingCreated')){
        changeShowBtn('show');
    }

    window.addEventListener('scroll', navbarBackGroundHandler);
    
    return () => {
        window.removeEventListener('scroll', navbarBackGroundHandler);
    };
    }, []);

    return <header id="navbar" className={s.navbar} ref={navbarRef}>

    <div className={s['header-content']}>
        <Link><button id="bookatablenavbar" type="button" className={`${s['book-a-table-navbar']} btn btn-outline-secondary `}>BOOK A TABLE</button></Link>
        <Link to='/created-booking-list' className={s['link']}><button type="button" className={` btn btn-outline-secondary ${s['my-bookings-btn']} ${s[showBtn]}`}>MY BOOKINGS</button></Link>
        <a className={`btn ${s.seeourmenu}`} id="seeourmenu">SEE OUR MENU</a>

        <LogoLink/>
        
    </div>
    
    </header>

}



const LogoLink = () => {return <div className={s.logolink}>
        <a href="/"><img className={s.logoimglink} src={logo}/></a>
    </div>
}


//restaurant image section 

const ImageSection = () => { return <div className={s.imagesection} style={{backgroundImage:`linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${sectionImage})`}}>

    <ImageSectionContent/>

</div>
}

const ImageSectionContent = () => {return <div className={s.sectioncontent}>
    <h3>BOOK A TABLE</h3>
    
    <ImageSectionButtons/>


</div>}

const ImageSectionButtons = () =>  {return <div className={s.sectionbuttons}>
    <ImageSectionButton text="Reserve by phone"/>
    <ImageSectionButton text="Online booking"/>

</div>}


const ImageSectionButton = (props) => {return <button className={`btn btn-outline-secondary ${s.sectionbtn}`}>{props.text}</button>
}

//reserve by phone text
const ReserveByPhone = () => {return <div className={s['reserve-by-phone-div']}>
    <h2>RESERVE BY PHONE</h2>
    <br/>
    <ReserveByPhoneContent/>
</div>
}

const ReserveByPhoneContent = () => {return <div id="reserve-by-phone-content">
    <p className={s['reserve-by-phone-desc']}>We take reservations for lunch and dinner. To make a reservation, please call
        us at +971 4 20 49 299 between 11 am and 11 pm, Monday to Sunday.</p>
    <p className={s['reserve-by-phone-desc']}>Seating is not guaranteed during busy periods so we recommend letting us know
        if you are thinking of coming down to eat.</p>
</div>
}


//opening hours 

const OpeningHours = () => {return <div className={s['opening-hours']}>
    <h2 className={s['opening-hours-text']}><strong>OPENING HOURS</strong></h2>
    <h2 className={s['opening-hours-text']} style={{fontWeight:400}}>Mon – Sat: 12 PM – 12 AM</h2>
    <h2 className={s['opening-hours-text']} ><strong>All Days of the Week</strong></h2>
    <h2 className={s['opening-hours-text']}><strong>Delivery: www.</strong></h2>
</div>
}


export {HeaderNavbar, ImageSection, ReserveByPhone, OpeningHours}