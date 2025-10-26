# 🚀 Deployment Guide - Spotify Album Finder

## Prerequisites

Before deploying, you need:
- [ ] GitHub account
- [ ] Code pushed to GitHub repository
- [ ] Render account (free) - https://render.com
- [ ] Vercel account (free) - https://vercel.com

---

## 🗄️ Step 1: Deploy PostgreSQL Database

### **Option A: Render PostgreSQL (Free)**

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"**
3. Settings:
   - Name: `spotify-album-finder-db`
   - Database: `spotify_album_finder`
   - User: `postgres` (auto-generated)
   - Region: Choose closest to you
   - Plan: **Free**
4. Click **"Create Database"**
5. **Save these credentials** (you'll see them once):
   - Internal Database URL
   - External Database URL
   - Username
   - Password
6. Go to database → **Shell** tab
7. Copy/paste your `backend/models/database.sql` content and run it

### **Option B: Supabase (Free, Easier)**

1. Go to [Supabase](https://supabase.com/)
2. Click **"Start your project"**
3. Create new project:
   - Name: `spotify-album-finder`
   - Database Password: (create strong password)
   - Region: Choose closest
4. Wait for project to initialize (~2 min)
5. Go to **SQL Editor** → New Query
6. Copy/paste your `backend/models/database.sql` content
7. Click **Run**
8. Go to **Settings** → **Database**
9. Copy **Connection String** (URI format)

---

## 🖥️ Step 2: Deploy Backend (Node.js API)

### **Render Backend Deployment**

1. Push your code to GitHub first:
```bash
cd "e:\projects\git spotify album finder"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/spotify-album-finder.git
git push -u origin main
```

2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Settings:
   - Name: `spotify-album-finder-api`
   - Root Directory: `codedex-api-template/backend`
   - Environment: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: **Free**

6. **Environment Variables** (click "Advanced"):
```env
DB_HOST=<your-db-host>
DB_PORT=5432
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>
DB_NAME=spotify_album_finder
JWT_SECRET=<generate-random-secret-key>
JWT_EXPIRE=7d
PORT=3000
NODE_ENV=production
FRONTEND_URL=<your-frontend-url>
```

7. Click **"Create Web Service"**
8. Wait for deployment (~5 min)
9. **Copy your backend URL**: `https://spotify-album-finder-api.onrender.com`

**⚠️ Important:** Free tier sleeps after 15 min of inactivity. First request may be slow.

---

## 🎨 Step 3: Deploy Frontend (React + Vite)

### **Option A: Vercel (Recommended)**

1. Go to [Vercel](https://vercel.com/)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Settings:
   - Framework Preset: **Vite**
   - Root Directory: `codedex-api-template`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Environment Variables**:
```env
VITE_API_URL=https://spotify-album-finder-api.onrender.com/api
VITE_CLIENT_ID=<your-spotify-client-id>
VITE_CLIENT_SECRET=<your-spotify-client-secret>
```

6. Click **"Deploy"**
7. Wait (~2 min)
8. Get your URL: `https://spotify-album-finder.vercel.app`

### **Option B: Netlify**

1. Go to [Netlify](https://netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect GitHub
4. Settings:
   - Base directory: `codedex-api-template`
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Environment Variables**:
```env
VITE_API_URL=https://spotify-album-finder-api.onrender.com/api
VITE_CLIENT_ID=<your-spotify-client-id>
VITE_CLIENT_SECRET=<your-spotify-client-secret>
```

6. Deploy!

---

## 🔄 Step 4: Update Backend CORS

After deploying frontend, update your backend environment variables on Render:

Go to your backend service → **Environment** → Add:
```env
FRONTEND_URL=https://spotify-album-finder.vercel.app
```

Click **"Save Changes"** - backend will auto-redeploy.

---

## ✅ Step 5: Test Everything

1. Visit your frontend URL: `https://spotify-album-finder.vercel.app`
2. Try to **Register** a new account
3. **Login** with your account
4. **Search** for albums
5. **Save** favorites
6. **Logout** and **Login** again - favorites should persist!

---

## 💰 Cost Breakdown

### Free Tier:
- ✅ PostgreSQL (Render): Free forever, 90 days retention
- ✅ Backend (Render): Free, sleeps after 15 min
- ✅ Frontend (Vercel): Free, unlimited bandwidth

### Paid Options (Optional):
- 💲 PostgreSQL (Render Pro): $7/month
- 💲 Backend (Render): $7/month (no sleep)
- 💲 Vercel Pro: $20/month (team features)

**Total Free: $0/month** ✨

---

## 🔒 Security Checklist

Before going live:

- [ ] Changed `JWT_SECRET` to strong random string (64+ characters)
- [ ] Database password is strong (16+ characters)
- [ ] Removed `.env` files from Git (check `.gitignore`)
- [ ] CORS configured for your frontend domain only
- [ ] Spotify API credentials are valid
- [ ] All environment variables set in hosting platforms

---

## 🐛 Troubleshooting

### Backend returns 503/crashes:
- Check Render logs (Dashboard → Service → Logs)
- Verify database credentials
- Check NODE_ENV=production

### Frontend can't connect to backend:
- Check CORS settings
- Verify `VITE_API_URL` is correct
- Check backend is running (Render dashboard)

### Database connection failed:
- Verify DB credentials
- Check if DB is in same region as backend
- Test connection string manually

---

## 🔄 Updating Your App

After making changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Both Vercel and Render will **auto-deploy** on push! 🚀

---

## 📱 Custom Domain (Optional)

### For Frontend (Vercel):
1. Buy domain (Namecheap, GoDaddy, etc.)
2. Vercel Dashboard → Your Project → **Settings** → **Domains**
3. Add your domain
4. Update DNS records as shown

### For Backend (Render):
1. Render Dashboard → Service → **Settings** → **Custom Domains**
2. Add `api.yourdomain.com`
3. Update DNS records

---

## 🎯 Production Best Practices

1. **Use Environment Variables** - Never hardcode secrets
2. **Enable HTTPS** - Both platforms do this automatically
3. **Monitor Logs** - Check Render logs regularly
4. **Backup Database** - Download backups from Render
5. **Rate Limiting** - Consider adding API rate limits
6. **Error Monitoring** - Consider Sentry for error tracking

---

## 🆘 Need Help?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs

Good luck with your deployment! 🚀✨

