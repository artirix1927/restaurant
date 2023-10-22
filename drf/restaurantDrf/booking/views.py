from datetime import datetime, timezone

from rest_framework.views import APIView
from rest_framework.response import Response
import json
from .models import BookingRequest, Table


from .classes import FreeTablesFinder

from .serializers import BookingRequestSerializer

# Create your views here.
class GetTables(APIView):
    def post(self, request):
    
        data = request.data
        print(data['date'], data['time'])
        tf = FreeTablesFinder(data['date'], data['time'], data['guests'])
        free_tables = tf.get_serialized_tables()
        booking_frame = tf.get_booking_frame()

        
        # return Response({"free_tables": free_tables, "booking_frame": (booking_start, booking_end)})
    
        return Response({"free_tables": free_tables, "booking_frame": booking_frame})


class CreateBookingRequest(APIView):
    def post(self, request):
        data = request.data['bookingRequestData']
        t = Table.objects.all().filter(pk=data['table'])
        booking_request = BookingRequest.objects.create(guests=data['guests'], booking_start=data['bookingStart'], booking_end=data['bookingEnd'], client_name=data['clientName'], client_number=data['clientTel'], client_email=data['clientEmail'])
        booking_request.tables.set(t)
        return Response({"message": "successfully created new booking", "bookingRequestId":booking_request.id})


    
class GetBookingsRequestsForUser(APIView):
    def post(self, request):
        user_bookings = BookingRequest.objects.filter(client_number= request.data['phoneNumber'], client_email=request.data['email'])
        serialized_user_bookings = BookingRequestSerializer(user_bookings, many=True).data
        return Response({'userBookings': serialized_user_bookings})

