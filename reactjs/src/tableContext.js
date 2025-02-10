import { createContext, useState, useContext } from "react";

export const TableContext = createContext();

export const TableProvider = ({ children }) => {
    const [tables, setTables] = useState([]);
    const [bookingFrame, setBookingFrame] = useState(null);

    return (
        <TableContext.Provider value={{ tables, setTables, bookingFrame, setBookingFrame }}>
            {children}
        </TableContext.Provider>
    );
};

export const useTableContext = () => useContext(TableContext);