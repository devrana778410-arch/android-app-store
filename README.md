# Android App Store

A full-stack Android app store with React frontend and Flask backend, optimized for low RAM usage (4GB laptops).

## Features

- Browse and search Android apps
- Developer dashboard for app management
- AI-powered chatbot for app recommendations
- User authentication
- Category-based app organization

## Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Ollama (for AI chatbot) - optional, can be disabled

## Installation

1. Clone the repository
2. Install client dependencies:
   ```bash
   cd client
   npm install
   ```
3. Install server dependencies:
   ```bash
   cd server
   pip install -r requirements.txt
   ```

## Running the Application

### Low RAM Mode (Recommended for 4GB laptops)

This mode uses production builds and static file serving to minimize RAM usage.

1. **Build the client for production:**
   ```bash
   cd client
   npm run build
   ```

2. **Serve the client statically:**
   ```bash
   cd client
   npm run serve
   ```
   This will start the client on http://localhost:3000

3. **Start the server in production mode:**
   ```bash
   cd server
   python app.py
   ```
   The server will run on http://localhost:5000

### Development Mode (Higher RAM usage)

For development with hot reloading:

1. **Start the client in development mode:**
   ```bash
   cd client
   npm start
   ```

2. **Start the server in development mode:**
   ```bash
   cd server
   python app.py
   ```

## RAM Optimization Features

- **Production builds**: Static file serving instead of development server
- **Flask debug mode disabled**: Reduces memory overhead
- **AI chatbot optimized**: Limited to 1 concurrent request, 512 context limit
- **Minimal dependencies**: Only essential packages included

## API Endpoints

- `GET /api/apps` - Get all apps
- `GET /api/apps/:id` - Get app details
- `GET /api/categories` - Get app categories
- `POST /api/auth/login` - User login
- `POST /api/chatbot` - AI chatbot interaction
- `GET /api/developer/apps` - Developer app management
- `POST /api/developer/apps` - Upload new app
- `PUT /api/developer/apps/:id` - Update app
- `DELETE /api/developer/apps/:id` - Delete app

## Environment Variables

Create a `.env` file in the server directory:

```
OLLAMA_URL=http://localhost:11434
```

## Troubleshooting

- If the build fails, ensure Node.js is installed and up to date
- For AI chatbot issues, ensure Ollama is running locally
- Check that ports 3000 (client) and 5000 (server) are available
