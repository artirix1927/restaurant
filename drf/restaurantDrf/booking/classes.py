import datetime

from django.db.models import Q, QuerySet
from django.utils.timezone import make_aware

from .models import Table, BookingRequest

from .serializers import TableSerializer

from rest_framework.serializers import ReturnDict

from rest_framework.renderers import JSONRenderer


class DatetimeFormatter:
        def __init__(self, booking_date: str, booking_time: str):
            #iso format strings
            self.__booking_date = booking_date
            self.__booking_time = booking_time


        def get_formated_booking_start(self) -> datetime.datetime:
            booking_start_time = datetime.datetime.fromisoformat(self.__booking_time)
            booking_start_date = datetime.datetime.fromisoformat(self.__booking_date)
            
            booking_start = datetime.datetime.combine(date=booking_start_date.date(),  time=booking_start_time.time())
            booking_start = make_aware(booking_start)
            return booking_start 



class FreeTablesFinder:
    __booking_start: datetime.datetime
    __booking_end: datetime.datetime
    __booking_guests: int
    formatter: DatetimeFormatter


    # gets strings values from html form
    def __init__(self, booking_guests: str, formatter:DatetimeFormatter):
        #iso format strings
        self.__booking_start = formatter.get_formated_booking_start()
        self.__booking_guests = booking_guests
        self.formatter = formatter

    def _get_hours_for_booking_by_guests(self) -> datetime.timedelta:
        # for table of 4 and more people get 3 hours, less than for people get 2 hours
        return datetime.timedelta(hours=2 if int(self.__booking_guests) < 4 else 3)

    def get_booking_frame(self) -> tuple[datetime.datetime]:
        #getting  date and time in different iso strings
    
        hours_to_booking = self._get_hours_for_booking_by_guests()

        self.__booking_end = self.__booking_start + hours_to_booking
    
        return self.__booking_start, self.__booking_end

    @staticmethod
    def __get_intersected_booking_requests(request_start, request_end) -> QuerySet[BookingRequest]:

        reqs = BookingRequest.objects.values('id', 'tables').annotate(passing=
                                                                      Q(booking_start__lt=request_start) & Q(
                                                                          booking_end__gt=request_start) |
                                                                      Q(booking_start__lt=request_end) & Q(
                                                                          booking_end__gt=request_end) |
                                                                      Q(booking_start__lt=request_start) & Q(
                                                                          booking_end__gt=request_start) & Q(
                                                                          booking_start__lt=request_end) & Q(
                                                                          booking_end__gt=request_end) |
                                                                      Q(booking_start__gt=request_start) & Q(
                                                                          booking_end__gt=request_start) & Q(
                                                                          booking_start__lt=request_end) & Q(
                                                                          booking_end__lt=request_end) |
                                                                      (Q(booking_start=request_start) & Q(
                                                                          booking_end=request_end))
                                                                      ).filter(passing=True)
        
        return reqs

    def get_busy_tables(self) -> list[Table]:
        self.__booking_start, self.__booking_end = self.get_booking_frame()

        requests = self.__get_intersected_booking_requests(self.__booking_start, self.__booking_end)

        busy_tables_list = [Table.objects.get(pk=table['tables']) for table in
                            requests.values('tables')]  # get table objects of all busy tables

        return busy_tables_list

    def _get_free_tables(self) -> set:
        # filtering tables by max guests quantity so people only get tables that all guests can fit in
        tables_fit_by_guests = Table.objects.filter(max_guests__gte=self.__booking_guests)

        return set(tables_fit_by_guests) - set(self.get_busy_tables())

    def get_sorted_tables(self) -> list[Table]:
        # sorting tables so tables with lower max guests come before
        return sorted(self._get_free_tables(), key=lambda t: (t.max_guests, t.pk))

    #serializing tables by my own class with (pk,max_guests,tags)
    def get_serialized_tables(self) -> ReturnDict:
        sorted_tables = self.get_sorted_tables()
        return TableSerializer(sorted_tables, many=True).data
    
    def get_rendered_tables(self):
        return JSONRenderer.render(self.get_serialized_tables())
    



        