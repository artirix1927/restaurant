import s from '../../css/booking_window_style.module.css'
import { BookingForm } from './form';

import { ChooseTableModal } from '../chooseTable';

import { MainPageContext } from '../context';

export const BookingModal = () => {
    return <div id="booking" className={s.booking}>
            <div id="booking-content" className={s['booking-content']}>
                <div>
                    <ChooseTableModal/>
                </div>
                
                <form>
                    <ul >
                        <BookingForm/>
                    </ul>
                </form>
            </div>
        </div> 
}

export function openTableChoosingWindow(){
    document.getElementById('choose-table-modal').style.display = 'block';
}

export function closeTableChoosingWindow(){
    document.getElementById('choose-table-modal').style.display = 'none';
}