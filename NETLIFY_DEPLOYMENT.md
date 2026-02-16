# Frontend Deployment on Netlify

## Steps to Deploy:

1. **Update Environment Variables**
   - Replace `https://your-render-app.onrender.com/api` in `.env` with your actual Render backend URL

2. **Ensure SPA Routing Files Are Present**
   - ✅ `netlify.toml` (already created)
   - ✅ `public/_redirects` (already created)
   - These files ensure page reloads work correctly

3. **Test Build Locally**
   ```bash
   cd Frontend
   npm install
   npm run build
   ```

3. **Deploy to Netlify**

   **Option A: Drag & Drop (Quick)**
   - Run `npm run build` in Frontend folder
   - Go to https://netlify.com
   - Drag the `dist` folder to Netlify deploy area

   **Option B: Git Integration (Recommended)**
   - Push Frontend folder to GitHub repository
   - Go to https://netlify.com → "Add new site" → "Import from Git"
   - Connect GitHub and select your repository
   - Configure:
     - **Base directory**: `Frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `Frontend/dist`

4. **Set Environment Variables in Netlify**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://your-render-app.onrender.com/api`

5. **Verify SPA Configuration (Important!)**
   - After deployment, test by visiting any route (e.g., `/products`) and refreshing
   - If you get 404 errors on refresh, check:
     - `netlify.toml` is in the root of your Frontend folder
     - `_redirects` file is in the `public` folder
     - Both files are included in your Git repository

6. **Update Backend CORS**
   - After deployment, update `FRONTEND_URL` in Render with your Netlify URL
   - Example: `https://your-app-name.netlify.app`

## Your URLs:
- **Frontend**: `https://your-app-name.netlify.app`
- **Backend**: `https://your-render-app.onrender.com`