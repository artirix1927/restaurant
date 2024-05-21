from datetime import datetime

from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework import viewsets

from .models import BookingRequest, Table

from .classes import FreeTablesFinder

from .serializers import BookingRequestSerializer

from django_filters import rest_framework as filters

from django.db import transaction

class BookingListFilter(filters.FilterSet):
    email = filters.CharFilter(field_name='client_email')
    phoneNumber = filters.CharFilter(field_name='client_number')



# Create your views here.
class GetTablesView(APIView):
    '''returns tables free at the time + date entered'''
    def post(self, request):
        data = request.data
        tf = FreeTablesFinder(data['date'], data['time'], data['guests'])
        free_tables = tf.get_serialized_tables()
        booking_frame = tf.get_booking_frame()
    
        return Response({"free_tables": free_tables, "booking_frame": booking_frame})

class BookingRequestViewSet(viewsets.ModelViewSet):
    queryset = BookingRequest.objects.all()
    lookup_field = ('id')
    serializer_class = BookingRequestSerializer
    filterset_class = BookingListFilter
    filter_backends = (filters.DjangoFilterBackend,)

    @transaction.atomic
    def create(self, request):
        '''creates a booking'''
        data = request.data['bookingRequestData']

        date_time = datetime.fromisoformat(data['bookingStart'])
        guests = data['guests']
     
        ft = FreeTablesFinder(date_time.strftime("%Y-%m-%d"),date_time.strftime("%H:%M"),guests)
        
        table = Table.objects.get(pk=data['table'])
        table_tags = table.tags.all()

        #check if table is busy
        if not checkForTableBusiness(table,ft.get_busy_tables()):
            raise TableIsAlreadyBusy
        
        booking_request = BookingRequest.objects.create(guests=data['guests'], booking_start=data['bookingStart'], 
                                                        booking_end=data['bookingEnd'], client_name=data['clientName'], 
                                                        client_number=data['clientTel'], client_email=data['clientEmail']
                                                        )
        
        booking_request.tables.add(table)
        booking_request.tags_for_table.set(table_tags)

        return Response({"bookingRequestId":booking_request.id})
    
    def list(self, request):
        '''returns all user bookings'''
        user_bookings = self.filter_queryset(self.queryset)
        serialized_user_bookings = BookingRequestSerializer(user_bookings, many=True).data
        return Response({'userBookings': serialized_user_bookings})
    
    @transaction.atomic
    def retrieve (self, request, id):
        '''returns booking request by id'''
        #must return 1 booking by id 
        booking = self.get_object()
        #print(booking)
        serialized_booking = BookingRequestSerializer(booking).data

        if not checkForBookingCreator(booking, request.query_params):
            raise BookingCreatedByAnotherUser
        
        return Response({'userBooking': serialized_booking})

    
    @transaction.atomic
    def destroy(self, request, id):
        '''deletes booking request if user has premission'''
        #must return 1 booking by id 
        booking = self.get_object()

        if not checkForBookingCreator(booking, request.data):
            raise BookingCreatedByAnotherUser
        
        booking.delete()
        return Response({'message': "successfully deleted your booking request"})
    


def checkForTableBusiness(table, busy_tables):
    return not (table in busy_tables)

def checkForBookingCreator(booking: BookingRequest, data):
    userData = data
    return (booking.client_email == userData['email'] and booking.client_number == userData['phoneNumber'])
     

class BookingCreatedByAnotherUser(Exception):
    pass

class TableIsAlreadyBusy(Exception):
    pass