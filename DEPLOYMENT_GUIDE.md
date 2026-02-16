# Mani Gadgets - Deployment Guide

## Backend Deployment (Render)

### Prerequisites
1. Create account on [Render.com](https://render.com)
2. Connect your GitHub repository

### Steps
1. **Create Web Service**
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `Backend` folder as root directory

2. **Configuration**
   - **Name**: `mani-gadgets-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

3. **Environment Variables**
   Add these in Render dashboard:
   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://manivelavan420534_db_user:tQ22teVHHdfKP1YY@cluster0.vjvarcp.mongodb.net/manisgadgets?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure_123456789
   PORT=10000
   ```

4. **Health Check**
   - Path: `/health`
   - This will monitor your service

### Backend URL
Your backend will be available at: `https://mani-gadgets-backend.onrender.com`

## Frontend Deployment (Netlify)

### Prerequisites
1. Create account on [Netlify](https://netlify.com)
2. Install Netlify CLI: `npm install -g netlify-cli`

### Steps
1. **Build the Project**
   ```bash
   cd Frontend
   npm install
   npm run build
   ```

2. **Deploy via Netlify Dashboard**
   - Go to Netlify Dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Select the `Frontend` folder

3. **Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

4. **Environment Variables**
   Add in Netlify dashboard:
   ```
   VITE_API_URL=https://mani-gadgets-backend.onrender.com/api
   VITE_APP_NAME=Mani Gadgets
   VITE_APP_VERSION=1.0.0
   ```

### Frontend URL
Your frontend will be available at: `https://your-site-name.netlify.app`

## Post-Deployment Steps

### 1. Update CORS Origins
Update the backend `Server.js` file with your actual Netlify URL:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://your-actual-netlify-url.netlify.app', // Replace with actual URL
  /\.netlify\.app$/,
  /\.vercel\.app$/
];
```

### 2. Test All Features
- [ ] User registration/login
- [ ] Product browsing
- [ ] Cart functionality
- [ ] Order placement
- [ ] PDF bill generation
- [ ] Admin dashboard (if applicable)

### 3. Monitor Logs
- Check Render logs for backend issues
- Check Netlify function logs for frontend issues
- Monitor MongoDB Atlas for database connections

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure frontend URL is added to backend CORS configuration
   - Check that API calls use correct backend URL

2. **Environment Variables**
   - Verify all required env vars are set in deployment platforms
   - Check that VITE_ prefix is used for frontend variables

3. **Build Failures**
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Review build logs for specific errors

4. **Database Connection**
   - Verify MongoDB connection string
   - Check IP whitelist in MongoDB Atlas
   - Ensure database user has proper permissions

### Performance Optimization

1. **Backend**
   - Enable gzip compression
   - Implement caching strategies
   - Optimize database queries

2. **Frontend**
   - Code splitting is already configured
   - Images are optimized
   - Static assets are cached

## Security Checklist

- [ ] Environment variables are secure
- [ ] JWT secret is strong and unique
- [ ] CORS is properly configured
- [ ] Security headers are set
- [ ] Database credentials are secure
- [ ] No sensitive data in client-side code

## Monitoring

### Health Checks
- Backend: `https://mani-gadgets-backend.onrender.com/health`
- Frontend: Check main page loads correctly

### Logs
- Render: Check service logs in dashboard
- Netlify: Check function logs and deploy logs
- MongoDB: Monitor connection and query performance

## Backup Strategy

1. **Database**: MongoDB Atlas provides automatic backups
2. **Code**: GitHub repository serves as code backup
3. **Environment Variables**: Document all variables securely

## Support

For deployment issues:
1. Check logs in respective platforms
2. Verify environment variables
3. Test API endpoints individually
4. Check network connectivity between services