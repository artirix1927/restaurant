
from rest_framework.exceptions import APIException


class BookingCreatedByAnotherUser(Exception):
    status_code = 401
    default_detail = 'Your are trying to delete another user booking, or you are unauthorized)'
    default_code = 'unauthorized_access'

class TableIsAlreadyBusy(Exception):
    status_code = 400
    default_detail = 'The table is already booked, next time think faster)'
    default_code = 'busy_table'