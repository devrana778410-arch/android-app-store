# Deployment Plan for Android App Store

## 1. Integrate Chatbot
- [x] Import and add ChatbotWidget to client/src/App.js for global availability
- [x] Keep /api/chatbot route active in server/app.py (no changes needed)

## 2. Build Frontend
- [x] Run `npm run build` in client/ to create production build

## 3. Modify Backend for Static Serving
- [x] Update server/app.py to serve static files from client/build and handle React routing

## 4. Create Deployment Files
- [x] Create Procfile in root: `web: python server/app.py`
- [x] Create runtime.txt in root: `python-3.8.10`

## 5. Deploy to Render.com (free alternative)
- [x] Sign up for Render.com account (free, no payment required)
- [x] Create GitHub repository for the project
- [x] Push code to GitHub
- [x] Create new Web Service on Render.com
- [x] Connect GitHub repo and deploy
- [x] Provide live link (without testing chatbot)
