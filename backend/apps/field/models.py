import uuid
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Stadium(models.Model):
    class Region(models.TextChoices):
        TOSHKENT_SHAHAR = 'TOSHKENT_SHAHAR', 'Toshkent shahri'
        TOSHKENT_VILOYATI = 'TOSHKENT_VILOYATI', 'Toshkent viloyati'
        SAMARQAND = 'SAMARQAND', 'Samarqand viloyati'
        BUXORO = 'BUXORO', 'Buxoro viloyati'
        ANDIJON = 'ANDIJON', 'Andijon viloyati'
        FARGONA = 'FARGONA', "Farg'ona viloyati"
        NAMANGAN = 'NAMANGAN', 'Namangan viloyati'
        QASHQADARYO = 'QASHQADARYO', 'Qashqadaryo viloyati'
        SURXONDARYO = 'SURXONDARYO', 'Surxondaryo viloyati'
        JIZZAX = 'JIZZAX', 'Jizzax viloyati'
        SIRDARYO = 'SIRDARYO', 'Sirdaryo viloyati'
        NAVOIY = 'NAVOIY', 'Navoiy viloyati'
        XORAZM = 'XORAZM', 'Xorazm viloyati'
        QORAQALPOGISTON = 'QORAQALPOGISTON', 'Qoraqalpog\'iston Respublikasi'

    class SurfaceType(models.TextChoices):
        ARTIFICIAL = 'ARTIFICIAL', "Sun'iy"
        NATURAL = 'NATURAL', 'Tabiiy'
        HYBRID = 'HYBRID', 'Gibrid'
        PREMIUM_ARTIFICIAL = 'PREMIUM_ARTIFICIAL', "Premium sun'iy"

    class FieldType(models.TextChoices):
        FIVE = '5x5', '5x5'
        SEVEN = '7x7', '7x7'
        ELEVEN = '11x11', '11x11'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    region = models.CharField(max_length=30, choices=Region.choices, default=Region.TOSHKENT_SHAHAR)
    address = models.CharField(max_length=500)
    district = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    field_type = models.CharField(max_length=10, choices=FieldType.choices, default=FieldType.FIVE)
    surface_type = models.CharField(max_length=20, choices=SurfaceType.choices, default=SurfaceType.ARTIFICIAL)
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    reviews_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    is_premium = models.BooleanField(default=False)
    badge = models.CharField(max_length=50, blank=True)
    image_url = models.URLField(blank=True)

    # Working schedule
    working_days = models.JSONField(default=list, help_text='List of working days: [0,1,2,3,4,5,6] where 0=Monday')
    working_hours_start = models.TimeField(default='08:00')
    working_hours_end = models.TimeField(default='23:00')
    slot_duration_minutes = models.IntegerField(default=60, help_text='Duration of each slot in minutes')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Stadium'
        verbose_name_plural = 'Stadiums'

    def __str__(self):
        return self.name

    def update_rating(self):
        from apps.comments.models import Comment
        agg = Comment.objects.filter(stadium=self).aggregate(avg=models.Avg('rating'), cnt=models.Count('id'))
        self.rating = round(agg['avg'] or 0, 2)
        self.reviews_count = agg['cnt']
        self.save(update_fields=['rating', 'reviews_count'])


class StadiumFeature(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stadium = models.ForeignKey(Stadium, on_delete=models.CASCADE, related_name='features')
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, blank=True)

    class Meta:
        verbose_name_plural = 'Stadium Features'

    def __str__(self):
        return f"{self.name} - {self.stadium.name}"


class StadiumPhoto(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    stadium = models.ForeignKey(Stadium, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='stadium/photos/')
    url = models.URLField(blank=True)
    caption = models.CharField(max_length=200, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Photo {self.order} - {self.stadium.name}"


class UserFavorite(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='favorites')
    stadium = models.ForeignKey(Stadium, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'stadium']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.stadium}"


class Advertisement(models.Model):
    class MediaType(models.TextChoices):
        IMAGE = 'IMAGE', 'Image'
        VIDEO = 'VIDEO', 'Video'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    media_type = models.CharField(max_length=10, choices=MediaType.choices, default=MediaType.IMAGE)
    media_file = models.FileField(upload_to='advertisements/')
    link = models.URLField(blank=True, help_text='Optional link when ad is clicked')
    is_active = models.BooleanField(default=True)
    show_on_website = models.BooleanField(default=True, help_text='Show in website carousel')
    show_on_telegram = models.BooleanField(default=False, help_text='Send to Telegram channel')
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Advertisement'
        verbose_name_plural = 'Advertisements'

    def __str__(self):
        return self.title


class BroadcastLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    broadcast_date = models.DateField()
    slots_sent = models.IntegerField(default=0)
    message_content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    success = models.BooleanField(default=True)

    class Meta:
        ordering = ['-sent_at']

    def __str__(self):
        return f"Broadcast {self.broadcast_date} - {self.slots_sent} slots"
