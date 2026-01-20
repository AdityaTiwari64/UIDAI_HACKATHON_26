# Deployment Guide: UIDAI Hackathon Project

This project uses a **split deployment** architecture:
- **Frontend (Vercel)**: React + Vite application
- **Backend (Railway)**: Flask + ML model API

---

## Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended)

### 1.2 Deploy from GitHub
1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select your repository
3. Railway will detect the `backend` folder. If not, set:
   - **Root Directory**: `backend`
   
### 1.3 Configure Railway
1. Go to your deployed service → **Settings**
2. Under **Networking**, click **"Generate Domain"**
3. Copy the generated URL (e.g., `https://your-app.up.railway.app`)

### 1.4 Test Backend
Visit: `https://your-app.up.railway.app/health`

You should see:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "features_loaded": true,
  "data_loaded": true
}
```

---

## Step 2: Configure Vercel Frontend

### 2.1 Add Environment Variable
1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-app.up.railway.app` (your Railway URL)
   - **Environment**: Production

### 2.2 Redeploy
After adding the environment variable, redeploy your Vercel project:
- Push a commit, OR
- Vercel Dashboard → **Deployments** → **Redeploy**

---

## Step 3: Verify

1. Visit your Vercel site
2. Open browser DevTools → Network tab
3. API calls should now go to your Railway backend
4. No more CORS or connection errors!

---

## Local Development

For local development, everything still works as before:
- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:5000`
- Vite proxy handles API calls automatically

Start locally:
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend (in backend folder)
cd backend
pip install -r requirements.txt
python app.py
```

---

## Environment Variables Summary

| Variable | Platform | Value |
|----------|----------|-------|
| `VITE_API_URL` | Vercel | Your Railway URL |
| `GEMINI_API_KEY` | Vercel | Your Gemini API key |

---

## Troubleshooting

### "Failed to fetch" errors
- Check Railway logs for errors
- Verify VITE_API_URL is set correctly in Vercel
- Make sure Railway service is running

### Model not loading on Railway
- Railway should have enough memory for the ~400KB model files
- Check Railway build logs for errors

### CORS errors
- CORS is configured to allow all origins (`*`)
- If issues persist, check browser console for specific error
