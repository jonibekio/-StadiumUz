import uuid
from datetime import date, timedelta, time, datetime
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.accounts.models import CustomUser
from apps.field.models import Stadium, StadiumFeature
from apps.bookings.models import BookingSlot, Booking, Payment
from apps.comments.models import Comment
from apps.notifications.models import Notification
from apps.chat.models import ChatRoom, ChatMessage


class Command(BaseCommand):
    help = 'Create comprehensive demo data for investor presentation'

    def handle(self, *args, **options):
        self.stdout.write('Creating demo data...\n')

        # 1. Create users
        users = self._create_users()

        # 2. Create stadiums with features
        stadiums = self._create_stadiums()

        # 3. Create slots for all stadiums
        self._create_slots(stadiums)

        # 4. Create bookings (confirmed, pending, cancelled)
        bookings = self._create_bookings(users, stadiums)

        # 5. Create payments
        self._create_payments(bookings)

        # 6. Create comments/reviews
        self._create_comments(users, stadiums)

        # 7. Create notifications
        self._create_notifications(users, bookings)

        # 8. Create chat rooms and messages
        self._create_chats(bookings)

        self.stdout.write(self.style.SUCCESS('\nDemo data created successfully!'))
        self._print_summary()

    def _create_users(self):
        self.stdout.write('Creating users...')
        users = []

        # Admin
        admin, created = CustomUser.objects.get_or_create(
            phone='+998901111111',
            defaults={'username': 'admin', 'first_name': 'Admin', 'last_name': 'StadiumUz', 'role': 'ADMIN'}
        )
        if created or not admin.has_usable_password():
            admin.set_password('admin123456')
            admin.save()
        users.append(admin)

        # Customers
        customer_data = [
            ('+998902222222', 'azizbek', 'Azizbek', 'Karimov'),
            ('+998903333333', 'jamshid', 'Jamshid', 'Aliyev'),
            ('+998904444444', 'nodir', 'Nodir', 'Rahimov'),
            ('+998905555555', 'sarvar', 'Sarvar', 'Toshmatov'),
        ]
        for phone, username, first, last in customer_data:
            user, created = CustomUser.objects.get_or_create(
                phone=phone,
                defaults={'username': username, 'first_name': first, 'last_name': last, 'role': 'CUSTOMER'}
            )
            if created or not user.has_usable_password():
                user.set_password('test123456')
                user.save()
            users.append(user)

        return users

    def _create_stadiums(self):
        self.stdout.write('Creating stadiums...')
        stadiums = []

        stadium_data = [
            ('Bunyodkor Elite', 'TOSHKENT_SHAHAR', 'Chilonzor', "Professional stadion. Zamonaviy yoritish.", 450000, '5x5', 'HYBRID', True),
            ('Poytaxt Arena', 'TOSHKENT_SHAHAR', 'Mirobod', 'Katta stadion, 11x11 maydon.', 800000, '11x11', 'NATURAL', True),
            ('Sky Arena', 'TOSHKENT_SHAHAR', 'Yunusobod', "Rooftop stadion. Premium xizmat.", 650000, '7x7', 'PREMIUM_ARTIFICIAL', True),
            ('The Cage', 'TOSHKENT_SHAHAR', 'Yakkasaroy', 'Yopiq mini futbol maydoni.', 300000, '5x5', 'ARTIFICIAL', False),
            ('Grand Oval', 'TOSHKENT_SHAHAR', 'Sergeli', 'Professional maydon.', 500000, '7x7', 'HYBRID', False),
            ('Dinamo Samarqand', 'SAMARQAND', 'Samarqand markazi', 'Samarqanddagi professional stadion.', 400000, '11x11', 'NATURAL', True),
            ('Andijon Arena', 'ANDIJON', 'Andijon shahri', 'Andijonning eng katta stadioni.', 350000, '7x7', 'ARTIFICIAL', False),
            ('Namangan Stadium', 'NAMANGAN', 'Namangan shahri', 'Namangan professional stadion.', 300000, '7x7', 'ARTIFICIAL', False),
        ]

        features_map = {
            'Bunyodkor Elite': ['Dush', 'Avtoturargoh', 'Wi-Fi', 'Kafe'],
            'Poytaxt Arena': ['Tribuna', 'Dush', 'Kiyinish xonasi', 'Avtoturargoh'],
            'Sky Arena': ['Rooftop', 'VIP', 'Konditsioner', 'Wi-Fi'],
            'The Cage': ['Yopiq maydon', 'Konditsioner'],
            'Grand Oval': ['Dush', 'Avtoturargoh', 'Kiyinish xonasi'],
            'Dinamo Samarqand': ['Tribuna', 'Dush', 'Avtoturargoh'],
            'Andijon Arena': ['Dush', 'Yoritish'],
            'Namangan Stadium': ['Dush', 'Avtoturargoh'],
        }

        for name, region, district, desc, price, ftype, stype, premium in stadium_data:
            stadium, _ = Stadium.objects.get_or_create(
                name=name,
                defaults={
                    'description': desc,
                    'region': region,
                    'address': f'{district}, {name}',
                    'district': district,
                    'field_type': ftype,
                    'surface_type': stype,
                    'price_per_hour': price,
                    'rating': 4.5,
                    'reviews_count': 50,
                    'is_premium': premium,
                    'working_days': [0, 1, 2, 3, 4, 5],
                    'working_hours_start': '08:00',
                    'working_hours_end': '23:00',
                    'slot_duration_minutes': 60,
                }
            )
            # Add features
            for feat_name in features_map.get(name, []):
                StadiumFeature.objects.get_or_create(
                    stadium=stadium, name=feat_name
                )
            stadiums.append(stadium)

        return stadiums

    def _create_slots(self, stadiums):
        self.stdout.write('Creating slots...')
        from apps.bookings.services import BookingService
        today = date.today()
        for stadium in stadiums:
            BookingService.generate_slots_for_stadium(stadium, start_date=today, days=14)

    def _create_bookings(self, users, stadiums):
        self.stdout.write('Creating bookings...')
        bookings = []
        today = date.today()
        customer_users = [u for u in users if u.role == 'CUSTOMER']

        # Get some available slots
        available_slots = BookingSlot.objects.filter(status='AVAILABLE')[:12]

        statuses = ['CONFIRMED', 'CONFIRMED', 'CONFIRMED', 'PENDING', 'PENDING', 'CANCELLED']

        for i, slot in enumerate(available_slots):
            if i >= len(customer_users):
                i = i % len(customer_users)
            user = customer_users[i]

            booking_status = statuses[i % len(statuses)]

            booking, _ = Booking.objects.get_or_create(
                slot=slot,
                defaults={
                    'customer': user,
                    'total_price': slot.price,
                    'status': booking_status,
                }
            )
            if booking_status == 'CONFIRMED':
                slot.status = 'BOOKED'
                slot.save()
            elif booking_status == 'CANCELLED':
                slot.status = 'AVAILABLE'
                slot.save()

            bookings.append(booking)

        return bookings

    def _create_payments(self, bookings):
        self.stdout.write('Creating payments...')
        import uuid as uuid_mod
        for booking in bookings:
            if booking.status == 'CONFIRMED' and not hasattr(booking, 'payment'):
                Payment.objects.get_or_create(
                    booking=booking,
                    defaults={
                        'user': booking.customer,
                        'amount': booking.total_price,
                        'method': 'CLICK',
                        'status': 'COMPLETED',
                        'transaction_id': f"TXN-{uuid_mod.uuid4().hex[:12].upper()}",
                    }
                )

    def _create_comments(self, users, stadiums):
        self.stdout.write('Creating comments...')
        customer_users = [u for u in users if u.role == 'CUSTOMER']

        review_data = [
            ("Ajoyib stadion!", "Professional darajadagi maydon. Tungi o'yinlar uchun yoritish juda yaxshi.", 5),
            ("Yaxshi maydon", "Dush va oson bron qilish. Juma oqshomlari biroz band.", 4),
            ("Tavsiya qilaman", "O'z jamoam bilan tez-tez kelamiz. Sifat yuqori.", 5),
            ("Oddiy lekin yaxshi", "Arzon va qulay maydon. Jamoaviy o'yinlar uchun mos.", 4),
            ("Professional atmosfera", "Turnir tashkil qilish uchun ajoyib joy. Hamma narsa bor.", 5),
        ]

        for i, stadium in enumerate(stadiums[:5]):
            user = customer_users[i % len(customer_users)]
            title, text, rating = review_data[i % len(review_data)]
            Comment.objects.get_or_create(
                user=user,
                stadium=stadium,
                title=title,
                defaults={'text': text, 'rating': rating}
            )

    def _create_notifications(self, users, bookings):
        self.stdout.write('Creating notifications...')
        admin_users = [u for u in users if u.role == 'ADMIN']

        for booking in bookings[:4]:
            for admin in admin_users:
                Notification.objects.create(
                    user=admin,
                    title='Bron so\'rovi',
                    message=f'{booking.customer.first_name} {booking.slot.stadium.name} stadionida {booking.slot.date} kuni {booking.slot.start_time.strftime("%H:%M")}-{booking.slot.end_time.strftime("%H:%M")} band qilmoqchi.',
                    type='BOOKING_PENDING' if booking.status == 'PENDING' else 'BOOKING_CONFIRMED',
                    link='/admin/bronlar',
                )

    def _create_chats(self, bookings):
        self.stdout.write('Creating chat rooms...')
        confirmed = [b for b in bookings if b.status == 'CONFIRMED'][:3]

        messages_data = [
            ("Assalomu alaykum! Broningiz tasdiqlandi.", "Rahmat! Qachon kelishim kerak?"),
            ("O'yinga 15 daqiqa qoldi. Tayyor bo'ling!", "Tayyorman, yo'ldaman!"),
            ("Maydon yoritilgan. Xush kelibsiz!", "Zo'r, kirib ketyapman."),
        ]

        for i, booking in enumerate(confirmed):
            room, _ = ChatRoom.objects.get_or_create(booking=booking)
            admin = CustomUser.objects.filter(role='ADMIN').first()
            if admin:
                for j, (admin_msg, user_msg) in enumerate(messages_data[:2]):
                    ChatMessage.objects.create(
                        room=room,
                        sender=admin,
                        content=admin_msg,
                        is_read=True,
                    )
                    ChatMessage.objects.create(
                        room=room,
                        sender=booking.customer,
                        content=user_msg,
                        is_read=j == 0,
                    )

    def _print_summary(self):
        self.stdout.write(f'\n{"="*50}')
        self.stdout.write(f'Users: {CustomUser.objects.count()}')
        self.stdout.write(f'Stadiums: {Stadium.objects.count()}')
        self.stdout.write(f'Slots: {BookingSlot.objects.count()}')
        self.stdout.write(f'Bookings: {Booking.objects.count()}')
        self.stdout.write(f'Payments: {Payment.objects.count()}')
        self.stdout.write(f'Comments: {Comment.objects.count()}')
        self.stdout.write(f'Notifications: {Notification.objects.count()}')
        self.stdout.write(f'Chat Rooms: {ChatRoom.objects.count()}')
        self.stdout.write(f'Chat Messages: {ChatMessage.objects.count()}')
        self.stdout.write(f'{"="*50}\n')
