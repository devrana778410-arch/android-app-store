import os
from dotenv import load_dotenv

load_dotenv()

# Sample categories
categories = [
    {'id': '1', 'name': 'Games', 'description': 'Fun and entertaining games'},
    {'id': '2', 'name': 'Productivity', 'description': 'Tools to boost your productivity'},
    {'id': '3', 'name': 'Social', 'description': 'Connect with friends and family'},
    {'id': '4', 'name': 'Education', 'description': 'Learn new skills and knowledge'},
]

# Sample apps
apps = [
    {
        'id': '1',
        'name': 'Angry Birds',
        'category': 'Games',
        'description': 'Classic slingshot game',
        'version': '2.0',
        'size': '50MB',
        'downloads': '1000000',
        'rating': 4.5,
        'icon': 'https://example.com/angrybirds.png',
        'screenshots': ['https://example.com/screenshot1.png'],
        'developer': 'Rovio Entertainment',
        'price': 'Free'
    },
    {
        'id': '2',
        'name': 'Microsoft Office',
        'category': 'Productivity',
        'description': 'Complete office suite',
        'version': '16.0',
        'size': '2GB',
        'downloads': '500000',
        'rating': 4.2,
        'icon': 'https://example.com/office.png',
        'screenshots': ['https://example.com/office_screenshot.png'],
        'developer': 'Microsoft',
        'price': '$9.99/month'
    },
    {
        'id': '3',
        'name': 'Facebook',
        'category': 'Social',
        'description': 'Connect with friends',
        'version': '400.0',
        'size': '200MB',
        'downloads': '5000000',
        'rating': 4.0,
        'icon': 'https://example.com/facebook.png',
        'screenshots': ['https://example.com/fb_screenshot.png'],
        'developer': 'Meta',
        'price': 'Free'
    },
    {
        'id': '4',
        'name': 'Duolingo',
        'category': 'Education',
        'description': 'Learn languages for free',
        'version': '5.0',
        'size': '150MB',
        'downloads': '2000000',
        'rating': 4.7,
        'icon': 'https://example.com/duolingo.png',
        'screenshots': ['https://example.com/duolingo_screenshot.png'],
        'developer': 'Duolingo',
        'price': 'Free'
    },
]

# Import to global variables in app.py
from app import apps_data, categories_data, save_data, APPS_FILE, CATEGORIES_FILE

apps_data.extend(apps)
categories_data.extend(categories)

# Save to files
save_data(APPS_FILE, apps_data)
save_data(CATEGORIES_FILE, categories_data)

print("Sample data seeded successfully!")
