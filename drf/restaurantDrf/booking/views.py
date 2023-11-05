from datetime import datetime

from rest_framework.views import APIView
from rest_framework.response import Response


from .models import BookingRequest, Table

from .classes import FreeTablesFinder

from .serializers import BookingRequestSerializer

from django.http import QueryDict

# Create your views here.
class GetTables(APIView):
    def post(self, request):
    
        data = request.data
        tf = FreeTablesFinder(data['date'], data['time'], data['guests'])
        free_tables = tf.get_serialized_tables()
        booking_frame = tf.get_booking_frame()


        
        # return Response({"free_tables": free_tables, "booking_frame": (booking_start, booking_end)})
    
        return Response({"free_tables": free_tables, "booking_frame": booking_frame})


class CreateBookingRequest(APIView):
    def post(self, request):
        data = request.data['bookingRequestData']

        date = datetime.fromisoformat(data['bookingStart']).strftime("%Y-%m-%d")
        time = datetime.fromisoformat(data['bookingStart']).strftime("%H:%M")
        guests = data['guests']

        ft = FreeTablesFinder(date,time,guests)

        table = Table.objects.get(pk=data['table'])
        table_tags = table.tags.all()

        if table in ft.get_busy_tables():
            msg = '''Oops, it seems like the table is already booked. 
            Please try another table or pick a different time'''
            return Response(data=msg, status=400)

        
        booking_request = BookingRequest.objects.create(guests=data['guests'], booking_start=data['bookingStart'], 
                                                        booking_end=data['bookingEnd'], client_name=data['clientName'], 
                                                        client_number=data['clientTel'], client_email=data['clientEmail']
                                                        )
        
        booking_request.tables.add(table)
        booking_request.tags_for_table.set(table_tags)

        return Response({"bookingRequestId":booking_request.id})


    
class GetBookingsRequestsForUser(APIView):
    def post(self, request):
        user_bookings = BookingRequest.objects.filter(client_number = request.data['phoneNumber'], client_email=request.data['email'])
        serialized_user_bookings = BookingRequestSerializer(user_bookings, many=True).data
        return Response({'userBookings': serialized_user_bookings})
    

class GetBookingRequestById(APIView):
    def post(self, request, id): 
        booking = BookingRequest.objects.get(pk=id)

        if not checkForBookingCreator(booking, request):
            return Response(status=403)

        serialized_booking = BookingRequestSerializer(booking).data
        return Response({'userBooking': serialized_booking})


class DeleteBookingRequestById(APIView):
    def delete(self, request, id):
        booking = BookingRequest.objects.get(pk=id)

        if not checkForBookingCreator(booking, request):
            return Response(status=403)
        
        booking.delete()
        return Response({'message': "successfully deleted your booking request"})

def checkForBookingCreator(booking: BookingRequest, request):
    userData = request.data['userData']
    return (booking.client_email == userData['email'] and booking.client_number == userData['phoneNumber'])