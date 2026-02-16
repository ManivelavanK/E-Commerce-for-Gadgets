# Backend Deployment on Render

## Steps to Deploy:

1. **Push to GitHub**
   - Create a GitHub repository
   - Push your Backend folder to the repository

2. **Create Render Account**
   - Go to https://render.com
   - Sign up/Login with GitHub

3. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the Backend folder as root directory

4. **Configure Service**
   - **Name**: mani-gadgets-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)

5. **Set Environment Variables**
   Add these in Render dashboard:
   ```
   MONGO_URI=mongodb+srv://manivelavan420534_db_user:tQ22teVHHdfKP1YY@cluster0.vjvarcp.mongodb.net/manisgadgets?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure_123456789
   NODE_ENV=production
   FRONTEND_URL=https://your-netlify-app.netlify.app
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://your-app-name.onrender.com`

## Important Notes:
- Free tier sleeps after 15 minutes of inactivity
- First request after sleep takes ~30 seconds
- Consider paid tier for production use