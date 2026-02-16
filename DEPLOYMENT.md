# Production Deployment Guide

## Quick Fix for "Products Not Showing" Issue

The main issue is hardcoded localhost URLs. Here's what you need to do:

### 1. Backend Deployment

**Option A: Railway (Recommended)**
1. Connect your GitHub repo to Railway
2. Set environment variables in Railway dashboard:
   - `MONGO_URI`: (already correct)
   - `JWT_SECRET`: (already set)
   - `NODE_ENV`: production
   - `FRONTEND_URL`: https://your-frontend-domain.com
3. Deploy backend first, note the URL (e.g., `https://your-app.railway.app`)

**Option B: Render**
1. Create new Web Service on Render
2. Connect GitHub repo, select Backend folder
3. Set environment variables in Render dashboard
4. Deploy and note the URL

### 2. Frontend Deployment

**Update .env file:**
```
VITE_API_URL=https://your-backend-railway-url.railway.app/api
```

**Deploy to Vercel/Netlify:**
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set environment variable: `VITE_API_URL=https://your-backend-url/api`
4. Deploy

### 3. Critical Steps (This fixes the products issue)

1. **Replace URLs in .env files:**
   - Backend: Set `FRONTEND_URL` to your frontend domain
   - Frontend: Set `VITE_API_URL` to your backend domain + `/api`

2. **Test the connection:**
   - Visit: `https://your-backend-url/health`
   - Should return: `{"status":"OK","timestamp":"..."}`

3. **Verify API calls:**
   - Open browser dev tools on your frontend
   - Check Network tab for API calls
   - Should call your backend domain, not localhost

### 4. Common Deployment Platforms

| Platform | Backend | Frontend | Notes |
|----------|---------|----------|-------|
| Railway | ✅ | ✅ | Auto-detects Node.js |
| Render | ✅ | ✅ | Free tier available |
| Vercel | ✅ | ✅ | Serverless functions |
| Netlify | ❌ | ✅ | Static sites only |
| Heroku | ✅ | ❌ | Requires credit card |

### 5. Environment Variables Checklist

**Backend (.env):**
- ✅ MONGO_URI (already correct)
- ✅ JWT_SECRET (already set)
- ✅ NODE_ENV=production
- ✅ FRONTEND_URL=https://your-frontend-domain.com
- ✅ PORT (auto-assigned by platform)

**Frontend (.env):**
- ✅ VITE_API_URL=https://your-backend-domain.com/api

### 6. Troubleshooting

**Products not loading?**
- Check browser console for CORS errors
- Verify API URL in Network tab
- Ensure backend health endpoint works

**CORS errors?**
- Update FRONTEND_URL in backend .env
- Redeploy backend after changing environment variables

**Build failures?**
- Check package.json scripts
- Ensure all dependencies are in package.json
- Check build logs for specific errors