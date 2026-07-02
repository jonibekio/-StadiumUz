import os, sys, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.field.models import Stadium, StadiumPhoto

# Different images for different features/purposes
PHOTO_SETS = {
    'Bunyodkor Elite': [
        'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&h=600&fit=crop',
    ],
    'Poytaxt Arena': [
        'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=600&fit=crop',
    ],
    'Sky Arena': [
        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop',
    ],
    'The Cage': [
        'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=600&fit=crop',
    ],
    'Grand Oval': [
        'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=600&fit=crop',
    ],
    'Dinamo Samarqand': [
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&h=600&fit=crop',
    ],
    'Andijon Arena': [
        'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&h=600&fit=crop',
    ],
    'Namangan Stadium': [
        'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop',
    ],
}

for name, urls in PHOTO_SETS.items():
    try:
        stadium = Stadium.objects.get(name=name)
        for i, url in enumerate(urls):
            StadiumPhoto.objects.create(
                stadium=stadium,
                url=url,
                caption=f'{name} - Photo {i+1}',
                order=i,
            )
        print(f'Added {len(urls)} photos to {name}')
    except Stadium.DoesNotExist:
        print(f'Not found: {name}')

print(f'\nTotal photos: {StadiumPhoto.objects.count()}')
