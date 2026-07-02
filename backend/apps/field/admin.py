from django.contrib import admin
from apps.field.models import Stadium, StadiumFeature, StadiumPhoto, Advertisement, BroadcastLog, UserFavorite


class StadiumFeatureInline(admin.TabularInline):
    model = StadiumFeature
    extra = 1


class StadiumPhotoInline(admin.TabularInline):
    model = StadiumPhoto
    extra = 1


@admin.register(Stadium)
class StadiumAdmin(admin.ModelAdmin):
    list_display = ['name', 'district', 'field_type', 'surface_type', 'price_per_hour', 'rating', 'is_active', 'is_premium']
    list_filter = ['is_active', 'is_premium', 'field_type', 'surface_type', 'district']
    search_fields = ['name', 'address', 'district']
    inlines = [StadiumFeatureInline, StadiumPhotoInline]


@admin.register(StadiumFeature)
class StadiumFeatureAdmin(admin.ModelAdmin):
    list_display = ['name', 'stadium']


@admin.register(StadiumPhoto)
class StadiumPhotoAdmin(admin.ModelAdmin):
    list_display = ['stadium', 'caption', 'order']


@admin.register(UserFavorite)
class UserFavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'stadium', 'created_at']


@admin.register(Advertisement)
class AdvertisementAdmin(admin.ModelAdmin):
    list_display = ['title', 'media_type', 'is_active', 'show_on_website', 'show_on_telegram', 'order']
    list_filter = ['is_active', 'show_on_website', 'show_on_telegram', 'media_type']


@admin.register(BroadcastLog)
class BroadcastLogAdmin(admin.ModelAdmin):
    list_display = ['broadcast_date', 'slots_sent', 'success', 'sent_at']
    list_filter = ['success']
