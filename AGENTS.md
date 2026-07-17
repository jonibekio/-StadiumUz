# StadiumUz

Football field booking platform for Uzbekistan. Django REST Framework backend + React/TypeScript frontend.

## Quick start

**Backend** (port 8000):
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py create_demo_data   # seeds users, stadiums, slots, bookings, chats
python manage.py runserver
```

**Frontend** (port 5173):
```bash
cd frontend
npm install
npm run dev
```

## Test credentials

| Role | Phone | Password |
|------|-------|----------|
| Admin | +998901111111 | admin123456 |
| Customer | +998902222222 | test123456 |

## Project structure

```
backend/
  apps/
    accounts/     # CustomUser (phone-based auth, roles: ADMIN/CUSTOMER)
    field/        # Stadium, StadiumFeature, StadiumPhoto, UserFavorite, Advertisement
    bookings/     # BookingSlot, Booking, Payment + BookingService
    chat/         # ChatRoom, ChatMessage, Attachment
    notifications/# Notification model
    comments/     # Comment (reviews with rating)
    tournaments/  # Tournament, Team (secondary feature)
    core/         # permissions, pagination, dashboard views, admin URLs
  config/         # settings.py, urls.py, wsgi.py
  manage.py
  db.sqlite3

frontend/
  src/
    components/layout/  # Navbar, Footer, UserLayout, AdminLayout, MobileNav
    pages/              # All route pages (15 total)
    services/           # api.ts, auth.ts, stadium.ts, booking.ts, chat.ts, etc.
    hooks/              # useAuth.tsx
    routes/index.tsx    # All route definitions
    data/stadiums.ts    # Legacy mock data (unused, kept for reference)
```

## Key conventions

- **Auth**: JWT via `djangorestframework-simplejwt`. Tokens stored in localStorage. Axios interceptor handles 401 refresh.
- **User model**: `CustomUser` with `phone` as `USERNAME_FIELD`. Roles: `ADMIN`, `CUSTOMER`.
- **Permissions**: `IsAdmin` checks `user.role == 'ADMIN'`. Public endpoints use `AllowAny`.
- **Slot generation**: `BookingService.generate_slots_for_stadium()` auto-creates time slots based on `stadium.working_days` and `working_hours_start/end`.
- **Chat**: Auto-created when booking is confirmed. Only admin and booking owner can chat.
- **Notifications**: Created on booking create/approve/reject/payment events.
- **Tailwind**: Custom color palette in `tailwind.config.js` (Elite Pitch dark theme). Custom classes: `ghost-border`, `pitch-glow`, `glass-panel`, `sidebar-active`.

## Gotchas

- `BookingSlot.stadium` is **required** (non-nullable). Always provide stadium when creating slots.
- `Booking.status` choices: `PENDING`, `CONFIRMED`, `REJECTED`, `CANCELLED`, `COMPLETED`.
- Backend uses `python-decouple` for env vars. `.env` file required at `backend/.env`.
- Frontend API base URL: `VITE_API_BASE` env var, defaults to `http://localhost:8000/api`.
- `seed_stadiums` command uses `--clear` flag to wipe existing data first.
- `create_demo_data` command creates a full demo dataset (users, stadiums, slots, bookings, chats, notifications).
- The `data/stadiums.ts` file is legacy mock data — all pages now use real API calls.

## Django apps

| App | Purpose |
|-----|---------|
| `accounts` | User registration, login, profile, JWT |
| `field` | Stadium CRUD, photos, features, favorites, advertisements |
| `bookings` | Slot management, booking flow, payments |
| `chat` | Per-booking chat rooms with messages |
| `notifications` | User notifications (booking events, system) |
| `comments` | Stadium reviews with rating (1-5 stars) |
| `tournaments` | Tournament & team management (secondary) |
| `core` | Shared: permissions, pagination, dashboard stats, admin URL routing |

## Frontend pages

| Route | Component | Access |
|-------|-----------|--------|
| `/` | HomePage | Public |
| `/stadionlar` | StadiumSearchPage | Public |
| `/stadion/:id` | StadiumDetailPage | Public |
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | Public |
| `/profil` | ProfilePage | Auth |
| `/bronlarim` | UserDashboard | Auth |
| `/sevimlilar` | WishlistPage | Auth |
| `/tolovlar` | PaymentsPage | Auth |
| `/bildirishnomalar` | NotificationsPage | Auth |
| `/chat` | ChatPage | Auth |
| `/admin` | AdminDashboard | Admin |
| `/admin/stadionlar` | AdminStadiums | Admin |
| `/admin/slotlar` | AdminSlots | Admin |
| `/admin/bronlar` | AdminBookings | Admin |
| `/admin/foydalanuvchilar` | AdminUsers | Admin |
| `/admin/tolovlar` | AdminPayments | Admin |
| `/admin/analitika` | AdminAnalytics | Admin |
| `/admin/sozlamalar` | AdminSettings | Admin |
