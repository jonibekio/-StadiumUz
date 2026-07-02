import { Routes, Route } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import MobileNav from '../components/layout/MobileNav'
import ProtectedRoute from '../components/ProtectedRoute'
import HomePage from '../pages/HomePage'
import StadiumSearchPage from '../pages/StadiumSearchPage'
import StadiumDetailPage from '../pages/StadiumDetailPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProfilePage from '../pages/ProfilePage'
import WishlistPage from '../pages/WishlistPage'
import SettingsPage from '../pages/SettingsPage'
import PaymentsPage from '../pages/PaymentsPage'
import UserDashboard from '../pages/UserDashboard'
import NotificationsPage from '../pages/NotificationsPage'
import ChatPage from '../pages/ChatPage'
import AdminDashboard from '../pages/AdminDashboard'
import AdminStadiums from '../pages/AdminStadiums'
import AdminSlots from '../pages/AdminSlots'
import AdminBookings from '../pages/AdminBookings'
import AdminUsers from '../pages/AdminUsers'
import AdminPayments from '../pages/AdminPayments'
import AdminAnalytics from '../pages/AdminAnalytics'
import AdminSettingsPage from '../pages/AdminSettings'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<><Navbar /><HomePage /><Footer /></>} />
      <Route path="/stadionlar" element={<><Navbar /><StadiumSearchPage /><Footer /></>} />
      <Route path="/stadion/:id" element={<><Navbar /><StadiumDetailPage /><Footer /></>} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected user */}
      <Route path="/profil" element={<ProtectedRoute><><Navbar /><ProfilePage /><MobileNav /></></ProtectedRoute>} />
      <Route path="/bronlarim" element={<ProtectedRoute><><Navbar /><UserDashboard /><MobileNav /></></ProtectedRoute>} />
      <Route path="/sevimlilar" element={<ProtectedRoute><><Navbar /><WishlistPage /><MobileNav /></></ProtectedRoute>} />
      <Route path="/sozlamalar" element={<ProtectedRoute><><Navbar /><SettingsPage /><MobileNav /></></ProtectedRoute>} />
      <Route path="/tolovlar" element={<ProtectedRoute><><Navbar /><PaymentsPage /><MobileNav /></></ProtectedRoute>} />
      <Route path="/bildirishnomalar" element={<ProtectedRoute><><Navbar /><NotificationsPage /><MobileNav /></></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><><Navbar /><ChatPage /></></ProtectedRoute>} />
      <Route path="/chat/:roomId" element={<ProtectedRoute><><Navbar /><ChatPage /></></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/stadionlar" element={<ProtectedRoute requiredRole="ADMIN"><AdminStadiums /></ProtectedRoute>} />
      <Route path="/admin/slotlar" element={<ProtectedRoute requiredRole="ADMIN"><AdminSlots /></ProtectedRoute>} />
      <Route path="/admin/bronlar" element={<ProtectedRoute requiredRole="ADMIN"><AdminBookings /></ProtectedRoute>} />
      <Route path="/admin/foydalanuvchilar" element={<ProtectedRoute requiredRole="ADMIN"><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/tolovlar" element={<ProtectedRoute requiredRole="ADMIN"><AdminPayments /></ProtectedRoute>} />
      <Route path="/admin/analitika" element={<ProtectedRoute requiredRole="ADMIN"><AdminAnalytics /></ProtectedRoute>} />
      <Route path="/admin/sozlamalar" element={<ProtectedRoute requiredRole="ADMIN"><AdminSettingsPage /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
