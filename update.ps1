# Quick Update Script - Push changes to production

Write-Host "🚀 Pushing updates to production..." -ForegroundColor Cyan
Write-Host ""

# Check for changes
$status = git status --porcelain
if (!$status) {
    Write-Host "✅ No changes to commit!" -ForegroundColor Green
    exit
}

# Show changes
Write-Host "📝 Changes detected:" -ForegroundColor Yellow
git status --short
Write-Host ""

# Get commit message
$message = Read-Host "Enter commit message (or press Enter for 'Update app')"
if (!$message) {
    $message = "Update app"
}

# Commit and push
Write-Host ""
Write-Host "Committing changes..." -ForegroundColor Yellow
git add .
git commit -m $message

Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push

Write-Host ""
Write-Host "✅ Done! Your changes will auto-deploy in ~2-5 minutes" -ForegroundColor Green
Write-Host ""
Write-Host "Monitor deployment:" -ForegroundColor Cyan
Write-Host "- Render: https://dashboard.render.com" -ForegroundColor White
Write-Host "- Vercel: https://vercel.com/dashboard" -ForegroundColor White
Write-Host ""

Start-Sleep -Seconds 3

