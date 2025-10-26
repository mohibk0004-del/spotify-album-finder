# Spotify Album Finder - Deployment Helper Script
# This script helps you deploy your app step by step

Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🚀 Spotify Album Finder Deployment" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (!(Test-Path ".git")) {
    Write-Host "❌ Git not initialized. Initializing now..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit - Spotify Album Finder"
    Write-Host "✅ Git initialized and first commit created!" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Deployment Checklist:" -ForegroundColor Cyan
Write-Host ""

# Step 1: GitHub
Write-Host "STEP 1: Push to GitHub" -ForegroundColor Yellow
Write-Host "----------------------------------------"
Write-Host "1. Go to GitHub.com and create a new repository"
Write-Host "2. Name it: spotify-album-finder"
Write-Host "3. Don't initialize with README (we already have code)"
Write-Host ""
$githubUsername = Read-Host "Enter your GitHub username"

if ($githubUsername) {
    Write-Host ""
    Write-Host "Run these commands:" -ForegroundColor Green
    Write-Host "git remote add origin https://github.com/$githubUsername/spotify-album-finder.git" -ForegroundColor White
    Write-Host "git branch -M main" -ForegroundColor White
    Write-Host "git push -u origin main" -ForegroundColor White
    Write-Host ""
    
    $pushNow = Read-Host "Push to GitHub now? (y/n)"
    if ($pushNow -eq "y") {
        try {
            git remote add origin "https://github.com/$githubUsername/spotify-album-finder.git"
            git branch -M main
            git push -u origin main
            Write-Host "✅ Code pushed to GitHub!" -ForegroundColor Green
        } catch {
            Write-Host "⚠️ Error pushing. You may need to remove existing remote or authenticate." -ForegroundColor Yellow
            Write-Host "Run: git remote remove origin" -ForegroundColor White
            Write-Host "Then try again." -ForegroundColor White
        }
    }
}

Write-Host ""
Write-Host "STEP 2: Deploy Database (Supabase)" -ForegroundColor Yellow
Write-Host "----------------------------------------"
Write-Host "1. Go to: https://supabase.com" -ForegroundColor Cyan
Write-Host "2. Click 'Start your project'" -ForegroundColor White
Write-Host "3. Create new project:" -ForegroundColor White
Write-Host "   - Name: spotify-album-finder" -ForegroundColor Gray
Write-Host "   - Database Password: (create strong password)" -ForegroundColor Gray
Write-Host "   - Region: Choose closest to you" -ForegroundColor Gray
Write-Host "4. Wait ~2 minutes for setup" -ForegroundColor White
Write-Host "5. Go to SQL Editor → New Query" -ForegroundColor White
Write-Host "6. Copy/paste from: codedex-api-template/backend/models/database.sql" -ForegroundColor White
Write-Host "7. Click Run" -ForegroundColor White
Write-Host "8. Go to Settings → Database → Copy 'Connection String (URI)'" -ForegroundColor White
Write-Host ""
$dbUrl = Read-Host "Paste your Database Connection String here (or press Enter to skip)"

Write-Host ""
Write-Host "STEP 3: Deploy Backend (Render)" -ForegroundColor Yellow
Write-Host "----------------------------------------"
Write-Host "1. Go to: https://render.com/dashboard" -ForegroundColor Cyan
Write-Host "2. Click 'New +' → 'Web Service'" -ForegroundColor White
Write-Host "3. Connect your GitHub repository" -ForegroundColor White
Write-Host "4. Settings:" -ForegroundColor White
Write-Host "   - Name: spotify-album-finder-api" -ForegroundColor Gray
Write-Host "   - Root Directory: codedex-api-template/backend" -ForegroundColor Gray
Write-Host "   - Environment: Node" -ForegroundColor Gray
Write-Host "   - Build Command: npm install" -ForegroundColor Gray
Write-Host "   - Start Command: npm start" -ForegroundColor Gray
Write-Host "   - Plan: Free" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Environment Variables (click 'Advanced'):" -ForegroundColor White

if ($dbUrl) {
    # Parse database URL
    Write-Host ""
    Write-Host "📝 Here are your environment variables:" -ForegroundColor Green
    Write-Host ""
    Write-Host "DATABASE_URL=$dbUrl" -ForegroundColor White
}

$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
Write-Host "JWT_SECRET=$jwtSecret" -ForegroundColor White
Write-Host "JWT_EXPIRE=7d" -ForegroundColor White
Write-Host "PORT=3000" -ForegroundColor White
Write-Host "NODE_ENV=production" -ForegroundColor White
Write-Host "FRONTEND_URL=(you will add this after frontend deploy)" -ForegroundColor Yellow
Write-Host ""
Write-Host "6. Click 'Create Web Service'" -ForegroundColor White
Write-Host "7. Wait ~5 minutes for deployment" -ForegroundColor White
Write-Host ""
$backendUrl = Read-Host "After deploy, paste your backend URL here (e.g., https://your-app.onrender.com)"

Write-Host ""
Write-Host "STEP 4: Deploy Frontend (Vercel)" -ForegroundColor Yellow
Write-Host "----------------------------------------"
Write-Host "1. Go to: https://vercel.com" -ForegroundColor Cyan
Write-Host "2. Click 'Add New...' → 'Project'" -ForegroundColor White
Write-Host "3. Import your GitHub repository" -ForegroundColor White
Write-Host "4. Settings:" -ForegroundColor White
Write-Host "   - Framework Preset: Vite" -ForegroundColor Gray
Write-Host "   - Root Directory: codedex-api-template" -ForegroundColor Gray
Write-Host "   - Build Command: npm run build" -ForegroundColor Gray
Write-Host "   - Output Directory: dist" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Environment Variables:" -ForegroundColor White

if ($backendUrl) {
    Write-Host ""
    Write-Host "VITE_API_URL=$backendUrl/api" -ForegroundColor White
}

Write-Host "VITE_CLIENT_ID=dc8a6ff884ef46d5bbf2109daa02edba" -ForegroundColor White
Write-Host "VITE_CLIENT_SECRET=46034d4f77ef468c9e84ade757f7ba0b" -ForegroundColor White
Write-Host ""
Write-Host "6. Click 'Deploy'" -ForegroundColor White
Write-Host "7. Wait ~2 minutes" -ForegroundColor White
Write-Host ""
$frontendUrl = Read-Host "After deploy, paste your frontend URL here (e.g., https://your-app.vercel.app)"

Write-Host ""
Write-Host "STEP 5: Update Backend CORS" -ForegroundColor Yellow
Write-Host "----------------------------------------"

if ($frontendUrl) {
    Write-Host "1. Go back to Render dashboard" -ForegroundColor White
    Write-Host "2. Click your backend service" -ForegroundColor White
    Write-Host "3. Go to 'Environment' tab" -ForegroundColor White
    Write-Host "4. Add this variable:" -ForegroundColor White
    Write-Host ""
    Write-Host "FRONTEND_URL=$frontendUrl" -ForegroundColor Green
    Write-Host ""
    Write-Host "5. Click 'Save Changes' (backend will auto-redeploy)" -ForegroundColor White
}

Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ Deployment Setup Complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($frontendUrl) {
    Write-Host "🎉 Your app is live at: $frontendUrl" -ForegroundColor Green
    Write-Host ""
    Write-Host "Test it:" -ForegroundColor Yellow
    Write-Host "1. Visit $frontendUrl" -ForegroundColor White
    Write-Host "2. Click Register and create an account" -ForegroundColor White
    Write-Host "3. Search for albums" -ForegroundColor White
    Write-Host "4. Save some favorites!" -ForegroundColor White
}

Write-Host ""
Write-Host "📚 Full deployment guide: DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""

# Save deployment info
if ($frontendUrl -and $backendUrl) {
    $deployInfo = @"
# Deployment Information
Generated: $(Get-Date)

Frontend URL: $frontendUrl
Backend URL: $backendUrl
Database: Supabase
GitHub: https://github.com/$githubUsername/spotify-album-finder

## Quick Commands

### Update Frontend
```
git add .
git commit -m 'Update'
git push
```
Vercel will auto-deploy!

### Update Backend
```
git add .
git commit -m 'Update'
git push
```
Render will auto-deploy!

### View Logs
- Backend: https://dashboard.render.com → Your Service → Logs
- Frontend: https://vercel.com → Your Project → Deployments → View Logs
"@

    $deployInfo | Out-File -FilePath "DEPLOYMENT_INFO.txt" -Encoding UTF8
    Write-Host "✅ Deployment info saved to DEPLOYMENT_INFO.txt" -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

