import { createContext } from "react";

import { useState } from "react";


export const MainPageContext = createContext()


export const ContextWrapper = (props) => {
    const [shortInfoData, setShortInfoData] = useState({});

    const setDataForShortInfo = (date,time,guests) => {setShortInfoData({date:date, time:time, guests:guests})}
    const getDataForShortInfo = () => {return shortInfoData}

    //use context to fill choose table short info after submitting form on main page 
    //or after rendering form in create booking 
    



    return <MainPageContext.Provider value={{getDataForShortInfo,setDataForShortInfo}}>
        {props.children}

    </MainPageContext.Provider>
}