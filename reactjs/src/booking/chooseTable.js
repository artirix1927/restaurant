

import s from '../css/choose_table_style.module.css'
import sArrows from '../css/arrows_style.module.css'

import { useContext} from 'react'

import { closeTableChoosingWindow } from './main/booking'

import { MainPageContext } from './context'

import { useTableContext } from '../tableContext'


export const ChooseTableModal = (props) => { 
    return <div id="choose-table-modal" className={props.className ? props.className : s['choose-table-modal']}>
        <CloseArrow setIsModalOpen={props.setIsModalOpen}/>

        <TableShortInfo />

        <ChooseTableContent/>
    </div>
}


export const CloseArrow = (props) => {
    return <button id="close_arrow" 
                    className={`${s['close_arrow']} ${sArrows.arrowbtn} 
                            ${sArrows.arrowbtnleft} ${sArrows['arr-no-hover']} ${sArrows['arr-no-focus']}`} 
                    type="button"
                    onClick={() => {
                        if (props.setIsModalOpen) {
                            props.setIsModalOpen(false);
                        }
                        closeTableChoosingWindow();
                    }} >
                        
                <i className={`${sArrows.arrow} ${sArrows.left} ${sArrows['arr-w']}`}></i>
            </button>}


export const TableShortInfo = (props) => {
    const {getDataForShortInfo} = useContext(MainPageContext);

    const data = getDataForShortInfo();

    return <div id="table-short-info" className={`${s['table-short-info']} centered-element`}> 
        <p className={s['table-short-info-p']}>
            <span id="short-info-date">{data.date}</span> | <span id="short-info-time">{data.time}</span> | <span id="short-info-guests">{data.guests}</span><span> guest/s</span>
        </p>
    </div>}

export const ChooseTableContent = () => {
    const { tables } = useTableContext();

    return (
        <div id="main-content" className={s['main-content']}>
            <div id="list-of-tables" className={s['list-of-tables']}>
                {tables.length > 0 ? tables : <p>No tables available</p>}
            </div>
        </div>
    );
};


export const TableElement = (props) => {
    
    let isActiveClass = props.active ? s['table-element-active'] : ''

    return <div className={`${s['table-element']} ${isActiveClass}`} id={props.data.table.id} max_guests={props.data.table.max_guests} 
    key={props.data.table.id} onClick={(e) => {props.tableElementHandler(e, props.dataForTableElementHandler, props.dataForTableElementHandler.nav);}}>
    {props.data.time}  
    <p className={s['tags-for-table']}>{props.data.table.tags.toString()} ({props.data.table.max_guests})</p>
    <p className={`${s['tags-for-table']} ${s['table-num']}`}>Table {props.data.table.id}</p>
</div>}




