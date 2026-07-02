import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)


def send_telegram_message(message, parse_mode='HTML'):
    bot_token = getattr(settings, 'TELEGRAM_BOT_TOKEN', '')
    channel_id = getattr(settings, 'TELEGRAM_CHANNEL_ID', '')

    if not bot_token or not channel_id:
        logger.warning("Telegram bot token yoki channel ID sozlanmagan")
        return False

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        'chat_id': channel_id,
        'text': message,
        'parse_mode': parse_mode,
    }

    try:
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 200:
            logger.info("Telegram xabar yuborildi")
            return True
        else:
            logger.error("Telegram xabar yuborishda xatolik: %s", response.text)
            return False
    except requests.RequestException as e:
        logger.error("Telegram API xatosi: %s", e)
        return False


def send_booking_notification(booking):
    message = (
        f"⚽ <b>Yangi bron!</b>\n\n"
        f"👤 Mijoz: {booking.customer_name}\n"
        f"📅 Sana: {booking.slot.date}\n"
        f"⏰ Vaqt: {booking.slot.start_time} - {booking.slot.end_time}\n"
        f"💰 Narx: {booking.total_price} so'm\n"
        f"✅ Holat: {booking.get_status_display()}"
    )
    return send_telegram_message(message)


def send_slot_notification(slot):
    message = (
        f"🏟️ <b>Yangi slot!</b>\n\n"
        f"📅 Sana: {slot.date}\n"
        f"⏰ Vaqt: {slot.start_time} - {slot.end_time}\n"
        f"💰 Narx: {slot.price} so'm\n"
        f"📊 Holat: {slot.get_status_display()}"
    )
    return send_telegram_message(message)


def send_tournament_notification(tournament):
    message = (
        f"🏆 <b>Yangi turnir!</b>\n\n"
        f"🎯 {tournament.title}\n"
        f"📅 Boshlanish: {tournament.start_date}\n"
        f"📅 Tugash: {tournament.end_date}\n"
        f"👥 Maksimal jamoalar: {tournament.max_teams}\n"
        f"💰 Kirish to'lovi: {tournament.entry_fee} so'm"
    )
    return send_telegram_message(message)
