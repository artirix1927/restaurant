from .classes import FreeTablesFinder, DatetimeFormatter

from .models import BookingRequest, Table



def checkForTableBusiness(data, table:Table) -> bool:

    dt_formatter = DatetimeFormatter(data.get('bookingStart'), data.get('bookingStart'))
    tables_finder = FreeTablesFinder(dt_formatter, data.get('guests'))

    return not (table in tables_finder.get_busy_tables())


def checkForBookingCreator(booking: BookingRequest, data: dict) -> bool:
    userData = data
    return (booking.client_email == userData.get('email') and 
            booking.client_number == userData.get('phoneNumber'))