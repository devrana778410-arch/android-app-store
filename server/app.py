from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import json
from dotenv import load_dotenv
import requests
from werkzeug.utils import secure_filename

load_dotenv()

app = Flask(__name__,
            static_folder='../client/build',
            static_url_path='/')
CORS(app)

# File-based data storage
DATA_DIR = 'data'
USERS_FILE = os.path.join(DATA_DIR, 'users.json')
APPS_FILE = os.path.join(DATA_DIR, 'apps.json')
CATEGORIES_FILE = os.path.join(DATA_DIR, 'categories.json')
UPLOAD_FOLDER = 'uploads/apks'
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB limit

# Ensure directories exist
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Configure Flask app for file uploads
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Initialize data files if they don't exist
def init_data_files():
    if not os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'w') as f:
            json.dump([], f)
    if not os.path.exists(APPS_FILE):
        with open(APPS_FILE, 'w') as f:
            json.dump([], f)
    if not os.path.exists(CATEGORIES_FILE):
        with open(CATEGORIES_FILE, 'w') as f:
            json.dump([], f)

init_data_files()

# Load data from files
def load_data(filename):
    try:
        with open(filename, 'r') as f:
            return json.load(f)
    except:
        return []

# Save data to files
def save_data(filename, data):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)

# In-memory data storage (will be loaded from files)
apps_data = load_data(APPS_FILE)
categories_data = load_data(CATEGORIES_FILE)
users_data = load_data(USERS_FILE)

# Global token system to limit concurrent AI requests
active_requests = 0
MAX_CONCURRENT_REQUESTS = 1  # Only allow 1 AI request at a time

# Function to get AI response using Ollama (local AI) with token system
def get_ollama_response(query, context):
    global active_requests

    # Check if we can process this request
    if active_requests >= MAX_CONCURRENT_REQUESTS:
        return "I'm currently helping another user. Please try again in a moment."

    active_requests += 1

    try:
        ollama_url = os.getenv('OLLAMA_URL', 'http://localhost:11434')
        url = f"{ollama_url}/api/generate"
        prompt = f"""
You are an AI assistant for an Android App Store. Help users find apps, provide recommendations, and answer questions about the store.

{context}

User Query: {query}

Please provide a helpful, friendly response. If recommending apps, be specific about why they're good choices. Keep responses conversational and engaging. Keep your response under 100 words.
"""
        payload = {
            "model": "llama3:latest",  # Use the available model
            "prompt": prompt,
            "stream": False,
            "options": {
                "num_ctx": 512,  # Limit context window to save RAM
                "num_thread": 2,  # Limit threads to reduce RAM usage
                "num_predict": 100  # Limit response length
            }
        }
        response = requests.post(url, json=payload, timeout=15)  # Shorter timeout
        if response.status_code == 200:
            result = response.json()['response'].strip()
            return result
        else:
            return None
    except Exception as e:
        print(f"Ollama error: {e}")
        return None
    finally:
        active_requests -= 1

@app.route('/api/apps', methods=['GET'])
def get_apps():
    return jsonify(apps_data)

@app.route('/api/apps/<app_id>', methods=['GET'])
def get_app(app_id):
    app = next((a for a in apps_data if a['id'] == app_id), None)
    if app:
        return jsonify(app)
    return jsonify({'error': 'App not found'}), 404

@app.route('/api/categories', methods=['GET'])
def get_categories():
    return jsonify(categories_data)

@app.route('/api/search', methods=['POST'])
def search_apps():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        query = data.get('query', '').lower()
        apps = [a for a in apps_data if query in a['name'].lower()]
        return jsonify(apps)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    user_query = data.get('query', '')

    # Try Ollama first (local AI, no API key needed)
    context = f"""
Available Apps:
{chr(10).join([f"- {app['name']}: {app['description']} (Category: {app['category']}, Rating: {app['rating']}, Downloads: {app['downloads']})" for app in apps_data])}

Available Categories:
{chr(10).join([f"- {cat['name']}: {cat['description']}" for cat in categories_data])}
"""

    ollama_response = get_ollama_response(user_query, context)
    if ollama_response:
        return jsonify({'response': ollama_response})

    # Fallback to simple responses if Ollama is not available or fails
    user_query_lower = user_query.lower()
    if 'hello' in user_query_lower or 'hi' in user_query_lower:
        response_text = "Hello! I'm your Android App Store assistant. I can help you find apps, answer questions about the store, or provide recommendations. What can I help you with today?"
    elif 'recommend' in user_query_lower or 'suggest' in user_query_lower:
        games = [app for app in apps_data if app['category'] == 'Games']
        productivity = [app for app in apps_data if app['category'] == 'Productivity']
        if 'game' in user_query_lower and games:
            response_text = f"I recommend {games[0]['name']} - {games[0]['description']}"
        elif 'productivity' in user_query_lower and productivity:
            response_text = f"For productivity, I suggest {productivity[0]['name']} - {productivity[0]['description']}"
        else:
            response_text = f"I have {len(apps_data)} apps available. Some popular ones include {', '.join([app['name'] for app in apps_data[:3]])}. What type of app are you looking for?"
    elif 'categories' in user_query_lower or 'category' in user_query_lower:
        response_text = f"We have these categories: {', '.join([cat['name'] for cat in categories_data])}. Which one interests you?"
    elif 'apps' in user_query_lower:
        response_text = f"We currently have {len(apps_data)} apps in our store. You can browse them by category or search for specific apps."
    else:
        response_text = "I'm here to help you with the Android App Store! You can ask me about available apps, categories, or recommendations. What would you like to know?"

    return jsonify({'response': response_text})

# Authentication endpoints
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    # Check if user already exists
    if any(u['username'] == username for u in users_data):
        return jsonify({'error': 'Username already exists'}), 400

    # Create new user
    user = {
        'id': len(users_data) + 1,
        'username': username,
        'password': password,  # In production, hash this!
        'email': email or '',
        'role': 'user'
    }

    users_data.append(user)
    save_data(USERS_FILE, users_data)

    return jsonify({'message': 'User registered successfully', 'user': {'id': user['id'], 'username': user['username'], 'role': user['role']}})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = next((u for u in users_data if u['username'] == username and u['password'] == password), None)

    if user:
        return jsonify({'message': 'Login successful', 'user': {'id': user['id'], 'username': user['username'], 'role': user['role']}})
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# Developer endpoints
@app.route('/api/developer/apps', methods=['GET'])
def get_developer_apps():
    # In a real app, you'd check authentication here
    # For now, return all apps (assuming developer access)
    return jsonify(apps_data)

@app.route('/api/developer/apps', methods=['POST'])
def upload_app():
    data = request.json

    # Generate new app ID
    new_id = str(max([int(a['id']) for a in apps_data] + [0]) + 1)

    app = {
        'id': new_id,
        'name': data['name'],
        'category': data['category'],
        'description': data['description'],
        'version': data['version'],
        'size': data['size'],
        'downloads': data['downloads'],
        'rating': data['rating'],
        'icon': data['icon'],
        'screenshots': data['screenshots'],
        'developer': data['developer'],
        'price': data['price'],
        'apk_filename': None  # Will be set when APK is uploaded
    }

    apps_data.append(app)
    save_data(APPS_FILE, apps_data)

    return jsonify({'message': 'App uploaded successfully', 'app': app})

@app.route('/api/developer/apps/<app_id>', methods=['PUT'])
def update_app(app_id):
    data = request.json
    app = next((a for a in apps_data if a['id'] == app_id), None)

    if not app:
        return jsonify({'error': 'App not found'}), 404

    # Update app data
    app.update({
        'name': data['name'],
        'category': data['category'],
        'description': data['description'],
        'version': data['version'],
        'size': data['size'],
        'downloads': data['downloads'],
        'rating': data['rating'],
        'icon': data['icon'],
        'screenshots': data['screenshots'],
        'developer': data['developer'],
        'price': data['price']
    })

    save_data(APPS_FILE, apps_data)
    return jsonify({'message': 'App updated successfully', 'app': app})

@app.route('/api/developer/apps/<app_id>/upload-apk', methods=['POST'])
def upload_apk(app_id):
    app = next((a for a in apps_data if a['id'] == app_id), None)

    if not app:
        return jsonify({'error': 'App not found'}), 404

    if 'apk' not in request.files:
        return jsonify({'error': 'No APK file provided'}), 400

    file = request.files['apk']

    if file.filename == '':
        return jsonify({'error': 'No APK file selected'}), 400

    if not file.filename.lower().endswith('.apk'):
        return jsonify({'error': 'File must be an APK (.apk extension)'}), 400

    # Generate secure filename
    filename = secure_filename(f"{app_id}_{file.filename}")
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    try:
        file.save(filepath)

        # Update app metadata with APK filename
        app['apk_filename'] = filename
        save_data(APPS_FILE, apps_data)

        return jsonify({
            'message': 'APK uploaded successfully',
            'filename': filename,
            'app_id': app_id
        })
    except Exception as e:
        return jsonify({'error': f'Failed to save APK: {str(e)}'}), 500

@app.route('/api/apps/<app_id>/download', methods=['GET'])
def download_apk(app_id):
    app = next((a for a in apps_data if a['id'] == app_id), None)

    if not app:
        return jsonify({'error': 'App not found'}), 404

    if not app.get('apk_filename'):
        return jsonify({'error': 'APK not available for this app'}), 404

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], app['apk_filename'])

    if not os.path.exists(filepath):
        return jsonify({'error': 'APK file not found on server'}), 404

    try:
        return send_from_directory(
            app.config['UPLOAD_FOLDER'],
            app['apk_filename'],
            as_attachment=True,
            download_name=f"{app['name']}_{app['version']}.apk"
        )
    except Exception as e:
        return jsonify({'error': f'Failed to download APK: {str(e)}'}), 500

@app.route('/api/developer/apps/<app_id>', methods=['DELETE'])
def delete_app(app_id):
    global apps_data
    app = next((a for a in apps_data if a['id'] == app_id), None)

    if not app:
        return jsonify({'error': 'App not found'}), 404

    apps_data = [a for a in apps_data if a['id'] != app_id]
    save_data(APPS_FILE, apps_data)

    return jsonify({'message': 'App deleted successfully'})

# Catch all handler: serve React app for any non-API routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # For low-RAM laptops, run in production mode without debug
    # To enable debug for development, set debug=True but note it uses more RAM
    app.run(debug=False, host='0.0.0.0', port=5000)
