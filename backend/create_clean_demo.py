import os, sys, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

import uuid
from datetime import date, timedelta
from apps.accounts.models import CustomUser
from apps.field.models import Stadium
from apps.bookings.models import BookingSlot, Booking, Payment
from apps.comments.models import Comment
from apps.notifications.models import Notification
from apps.chat.models import ChatRoom, ChatMessage
from apps.bookings.services import BookingService

admin = CustomUser.objects.get(phone='+998901111111')
customer = CustomUser.objects.get(phone='+998902222222')
stadiums = list(Stadium.objects.all()[:4])
today = date.today()

print('Creating slots...')
for s in stadiums:
    BookingService.generate_slots_for_stadium(s, start_date=today, days=7)

print('Creating bookings...')
bookings = []
for i in range(3):
    slot = BookingSlot.objects.filter(stadium=stadiums[i], status='AVAILABLE', date=today).first()
    if slot:
        slot.status = 'BOOKED'
        slot.save()
        b = Booking.objects.create(slot=slot, customer=customer, total_price=slot.price, status='CONFIRMED')
        room = ChatRoom.objects.create(booking=b)
        ChatMessage.objects.create(room=room, sender=admin, content=f'{slot.stadium.name} stadioniga xush kelibsiz! Broningiz tasdiqlandi.', is_read=True)
        ChatMessage.objects.create(room=room, sender=customer, content="Rahmat! Qachon kelishim kerak?", is_read=True)
        ChatMessage.objects.create(room=room, sender=admin, content="O'yinga 15 daqiqa qoldi. Tayyor bo'ling!", is_read=True)
        Notification.objects.create(user=admin, title='Bron tasdiqlandi', message=f'{customer.first_name} {slot.date} kuni bron yaratdi.', type='BOOKING_CONFIRMED', link='/admin/bronlar')
        Notification.objects.create(user=customer, title='Bron tasdiqlandi', message=f'{slot.stadium.name} stadionida {slot.date} kuni bron tasdiqlandi.', type='BOOKING_CONFIRMED')
        Payment.objects.create(user=customer, booking=b, amount=slot.price, method='CLICK', status='COMPLETED', transaction_id=f'TXN-{uuid.uuid4().hex[:12].upper()}')
        bookings.append(b)

for i in range(3, 5):
    slot = BookingSlot.objects.filter(stadium=stadiums[i % len(stadiums)], status='AVAILABLE', date=today).first()
    if slot:
        b = Booking.objects.create(slot=slot, customer=customer, total_price=slot.price, status='PENDING')
        Notification.objects.create(user=admin, title='Yangi bron so\'rovi', message=f'{customer.first_name} {slot.stadium.name} stadionida {slot.date} kuni {slot.start_time.strftime("%H:%M")}-{slot.end_time.strftime("%H:%M")} band qilmoqchi.', type='BOOKING_PENDING', link='/admin/bronlar')
        bookings.append(b)

slot = BookingSlot.objects.filter(stadium=stadiums[0], status='AVAILABLE', date=today + timedelta(days=1)).first()
if slot:
    b = Booking.objects.create(slot=slot, customer=customer, total_price=slot.price, status='REJECTED')
    Notification.objects.create(user=customer, title='Bron rad etildi', message=f'{slot.stadium.name} stadionida bron rad etildi.', type='BOOKING_REJECTED')

print('Creating comments...')
Comment.objects.create(user=customer, stadium=stadiums[0], title='Ajoyib stadion!', text="Professional darajadagi maydon. Tungi o'yinlar uchun yoritish juda yaxshi.", rating=5)
Comment.objects.create(user=customer, stadium=stadiums[1], title='Yaxshi maydon', text='Dush va oson bron qilish. Juma oqshomlari biroz band.', rating=4)
Comment.objects.create(user=customer, stadium=stadiums[2], title='Tavsiya qilaman', text="O'z jamoam bilan tez-tez kelamiz. Sifat yuqori.", rating=5)
for s in stadiums:
    s.update_rating()

print(f'Users: {CustomUser.objects.count()}, Bookings: {Booking.objects.count()}, Comments: {Comment.objects.count()}, Notifications: {Notification.objects.count()}, ChatRooms: {ChatRoom.objects.count()}, ChatMessages: {ChatMessage.objects.count()}, Payments: {Payment.objects.count()}')
