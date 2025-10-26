# 🚀 Quick Start - Deploy in 20 Minutes

## Option 1: Automated Script (Easiest)

```powershell
.\deploy.ps1
```

Follow the prompts! The script will guide you through each step.

---

## Option 2: Manual Steps

### 1️⃣ Deploy Database (5 min)

**Supabase** (Recommended):
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create project: `spotify-album-finder`
4. Copy database password (save it!)
5. Wait 2 minutes for setup
6. Go to **SQL Editor** → New Query
7. Copy all content from `codedex-api-template/backend/models/database.sql`
8. Paste and click **Run**
9. Go to **Settings** → **Database** → Copy **Connection String**

---

### 2️⃣ Deploy Backend (10 min)

**Render**:
1. Go to [render.com/dashboard](https://render.com/dashboard)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Settings:
   ```
   Name: spotify-album-finder-api
   Root Directory: codedex-api-template/backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

5. Click **"Advanced"** → Add Environment Variables:
   ```env
   DATABASE_URL=<paste-supabase-connection-string>
   JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
   JWT_EXPIRE=7d
   PORT=3000
   NODE_ENV=production
   ```

6. Click **"Create Web Service"**
7. Wait ~5 minutes
8. **Copy your backend URL**: `https://your-app.onrender.com`

---

### 3️⃣ Deploy Frontend (5 min)

**Vercel**:
1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Settings:
   ```
   Framework: Vite
   Root Directory: codedex-api-template
   Build Command: npm run build
   Output Directory: dist
   ```

5. Environment Variables:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_CLIENT_ID=dc8a6ff884ef46d5bbf2109daa02edba
   VITE_CLIENT_SECRET=46034d4f77ef468c9e84ade757f7ba0b
   ```

6. Click **"Deploy"**
7. Wait ~2 minutes
8. **Copy your frontend URL**: `https://your-app.vercel.app`

---

### 4️⃣ Update Backend CORS

1. Go back to **Render Dashboard**
2. Click your backend service
3. Go to **Environment** tab
4. Add variable:
   ```env
   FRONTEND_URL=https://your-app.vercel.app
   ```
5. Click **"Save Changes"**

---

## ✅ Done! Test Your App

1. Visit your frontend URL
2. Register a new account
3. Login
4. Search for albums (try "Drake")
5. Save favorites
6. Logout and login - favorites persist! 🎉

---

## 🔄 Updating Your App

After making changes:

```powershell
.\update.ps1
```

Or manually:
```bash
git add .
git commit -m "Your changes"
git push
```

Both Render and Vercel auto-deploy on push! 🚀

---

## 📊 Free Tier Limits

- ✅ Database: 500 MB storage
- ✅ Backend: Unlimited, sleeps after 15 min
- ✅ Frontend: Unlimited bandwidth

**Total: $0/month** 💰

---

## 🆘 Troubleshooting

### Backend won't start:
- Check Render logs
- Verify DATABASE_URL
- Check JWT_SECRET is set

### Frontend can't connect:
- Check VITE_API_URL in Vercel
- Verify CORS (FRONTEND_URL) in Render
- Wait 30 sec for backend to wake from sleep

### Database errors:
- Verify SQL script ran successfully
- Check Supabase connection string
- Ensure DATABASE_URL is correct

---

## 📚 More Info

See **DEPLOYMENT.md** for detailed guide.

---

**Need help?** Check the logs:
- Render: Dashboard → Service → Logs
- Vercel: Dashboard → Project → Deployments → View Logs

