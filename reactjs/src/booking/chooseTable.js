

import s from '../css/choose_table_style.module.css'
import sArrows from '../css/arrows_style.module.css'

import { useEffect, useState } from 'react'

import { closeTableChoosingWindow } from "./handlers"

export const ChooseTableModal = (props) => { 
    const [showModal, changeShowModal] = useState(false)


    return <div id="choose-table-modal" className={props.className ? props.className : s['choose-table-modal']}>
        <CloseArrow/>

        <TableShortInfo/>

        <ChooseTableContent/>
    </div>
}


export const CloseArrow = () => {return <button id="close_arrow" className={`${s['close_arrow']} ${sArrows.arrowbtn} ${sArrows.arrowbtnleft} ${sArrows['arr-no-hover']} ${sArrows['arr-no-focus']}`} type="button"
onClick={closeTableChoosingWindow}><i className={`${sArrows.arrow} ${sArrows.left} ${sArrows['arr-w']}`}></i></button>}


export const TableShortInfo = (props) => {
   
    
    
    return <div id="table-short-info" className={`${s['table-short-info']} centered-element`}> 
    <p className={s['table-short-info-p']}>
        <span id="short-info-date"></span> | <span id="short-info-time"></span> | <span id="short-info-guests"></span>  
        <span> guest/s</span>
    </p>

</div>}

export const ChooseTableContent = () => {
    return <div id="main-content" className={s['main-content']}>
        <div id="list-of-tables" className={s['list-of-tables']}>

        </div>

    </div>
}




