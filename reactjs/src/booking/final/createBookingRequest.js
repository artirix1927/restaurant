
import s from '../../css/create_booking_request_style.module.css' 
import sC from '../../css/choose_table_style.module.css'

import { useContext, useEffect, useRef, useState } from "react";

import { MainPageContext } from "../context";
import { TableElement,ChooseTableModal} from "../chooseTable";
import {format, parseJSON} from 'date-fns'

import { apiRoute } from '../../constants';

import axios from "axios";

import { openTableChoosingWindow } from '../main/booking';
import { useTableContext } from '../../tableContext';
import { useScreenSize } from '../../hooks';
import { FormikForm } from './form';


export const CreateBookingRequestContent = () => {
    // All data for booking from main page form  
    const userRequirementsData = JSON.parse(localStorage.getItem("userBookingRequirementsData")); 
    const parsedBookingStartDateTime = parseJSON(userRequirementsData.bookingStart);

    // Refs
    const tableChosen = useRef(userRequirementsData.tableChosen);
    const formikRef = useRef();

    const { setDataForShortInfo } = useContext(MainPageContext);
    const isSmallScreen = useScreenSize();
    const [isModalOpen, setIsModalOpen] = useState(false);


    const { setTables } = useTableContext();
    

    useEffect(() => {  
        const date = format(parsedBookingStartDateTime, "E, d LLL");
        const time = format(parsedBookingStartDateTime, "H:mm");
        setDataForShortInfo(date, time, userRequirementsData.guests);
    }, []);


    useEffect(() => {
        axios.post(`${apiRoute}/get-tables`, {
            time: userRequirementsData.bookingStart,
            date: userRequirementsData.bookingStart,
            guests: userRequirementsData.guests,
        }).then((res) => {
            let freeTables = res.data.free_tables;
            let tables = [];

            let isTablePresent = false;
            freeTables.forEach((table) => {
                if (table.id === tableChosen.current) isTablePresent = true;

                let dataForTableElement = { time: format(parsedBookingStartDateTime, "H:mm"), table };
                let dataForHandleBtn = { tableChosen, formikRef, nav: null };

                tables.push(
                    <TableElement 
                        data={dataForTableElement} 
                        tableElementHandler={handleTableElementClick}
                        dataForTableElementHandler={dataForHandleBtn} 
                        key={table.id} 
                        active={table.id === tableChosen.current}
                    />
                );
            });

            setTables(tables);

            if (!isTablePresent) {
                requestIdleCallback(() => {
                    if (tables.length > 0) {
                        setCurrentTableElementTo(tables[tables.length - 1], formikRef, tableChosen);
                    }
                });
            }
        });
    }, []);

    return (
        <div id="create-booking-content" className={s["create-booking-content"]}>
            <div id="form-wrapper" className={s["form-wrapper"]}>
                <FormikForm ref={{ formik: formikRef, tableChosen }} userRequirementsData={userRequirementsData} />
            </div>

            {isSmallScreen==true && <button className={s["open-modal-btn"]} onClick={() => {openTableChoosingWindow(); setIsModalOpen(true)}}>
                Choose Table
            </button>}

            <ChooseTableModal setIsModalOpen={setIsModalOpen}
                className={`${s["choose-table-modal"]} ${isSmallScreen ? s["hidden"] : ""} ${isModalOpen ? s["show-modal"] : ""}`} 
            />

        </div>
    );
};




const handleTableElementClick = (e, data, ...others) => {
    let currentTableElement = document.getElementById(data.tableChosen.current)

    if ((currentTableElement))
        currentTableElement.classList.remove(sC['table-element-active']);
    
    setCurrentTableElementTo(e.currentTarget, data.formikRef, data.tableChosen)

}



const setCurrentTableElementTo = (tableElem, formikRef, tableChosen) => {
    tableChosen.current = tableElem.id;

    tableElem.classList.add(sC['table-element-active']) ;

    const textForTableField = `${tableElem.childNodes[2].textContent} : ${tableElem.childNodes[1].textContent}`
    formikRef.current.setFieldValue('table', textForTableField);

}

