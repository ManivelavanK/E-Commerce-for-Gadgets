#!/bin/bash

echo "🚀 Starting Mani Gadgets Deployment Process..."

# Backend Deployment (Render)
echo "📦 Deploying Backend to Render..."
echo "1. Push your code to GitHub"
echo "2. Connect your GitHub repo to Render"
echo "3. Use the render.yaml configuration"
echo "4. Backend will be available at: https://mani-gadgets-backend.onrender.com"

# Frontend Deployment (Netlify)
echo "🌐 Deploying Frontend to Netlify..."
echo "1. Build the frontend"
cd Frontend
npm install
npm run build

echo "2. Deploy to Netlify"
echo "   - Drag and drop the 'dist' folder to Netlify"
echo "   - Or connect your GitHub repo to Netlify"
echo "   - Frontend will be available at: https://mani-gadgets-frontend.netlify.app"

echo "✅ Deployment configuration complete!"
echo "📋 Next steps:"
echo "   1. Push code to GitHub"
echo "   2. Deploy backend on Render"
echo "   3. Deploy frontend on Netlify"
echo "   4. Test the application"