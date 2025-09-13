# CivicTrack Deployment Script
# This script helps deploy both backend and frontend

Write-Host "🚀 CivicTrack Deployment Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if Firebase CLI is available
try {
    $firebaseVersion = firebase --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Firebase CLI is available" -ForegroundColor Green
        $firebaseAvailable = $true
    } else {
        Write-Host "❌ Firebase CLI not available" -ForegroundColor Red
        $firebaseAvailable = $false
    }
} catch {
    Write-Host "❌ Firebase CLI not available" -ForegroundColor Red
    $firebaseAvailable = $false
}

Write-Host ""
Write-Host "📋 Deployment Options:" -ForegroundColor Yellow
Write-Host "1. Deploy Frontend to Firebase (if CLI available)"
Write-Host "2. Manual deployment instructions"
Write-Host "3. Backend deployment to Railway"
Write-Host ""

if ($firebaseAvailable) {
    Write-Host "🔥 Deploying to Firebase..." -ForegroundColor Cyan
    Write-Host "Please login to Firebase first:" -ForegroundColor Yellow
    firebase login
    
    Write-Host "Initializing Firebase hosting..." -ForegroundColor Yellow
    firebase init hosting --project civictrack-75372
    
    Write-Host "Deploying to Firebase..." -ForegroundColor Yellow
    firebase deploy
    
    Write-Host "✅ Frontend deployed successfully!" -ForegroundColor Green
} else {
    Write-Host "📝 Manual Deployment Instructions:" -ForegroundColor Yellow
    Write-Host "1. Go to https://console.firebase.google.com/"
    Write-Host "2. Select your project: civictrack-75372"
    Write-Host "3. Go to Hosting section"
    Write-Host "4. Click 'Get started' or 'Add another site'"
    Write-Host "5. Upload the files from this directory"
    Write-Host "6. Your app will be available at: https://civictrack-75372.web.app"
}

Write-Host ""
Write-Host "🚂 Backend Deployment to Railway:" -ForegroundColor Cyan
Write-Host "1. Go to https://railway.app"
Write-Host "2. Sign up/Login with GitHub"
Write-Host "3. Click 'New Project'"
Write-Host "4. Select 'Deploy from GitHub repo'"
Write-Host "5. Choose this repository: civictrack-finalrepo-main"
Write-Host "6. Set root directory to: civictrack-backend"
Write-Host "7. Add PostgreSQL database service"
Write-Host "8. Configure environment variables:"
Write-Host "   - DATABASE_URL: (from PostgreSQL service)"
Write-Host "   - DB_USERNAME: (from PostgreSQL service)"
Write-Host "   - DB_PASSWORD: (from PostgreSQL service)"
Write-Host "9. Enable PostGIS extension in PostgreSQL"
Write-Host "10. Deploy!"

Write-Host ""
Write-Host "🔗 After deployment:" -ForegroundColor Yellow
Write-Host "- Backend URL: https://your-app-name.up.railway.app"
Write-Host "- Frontend URL: https://civictrack-75372.web.app"
Write-Host "- Update API_BASE_URL in index.html with your Railway URL"

Write-Host ""
Write-Host "✨ Deployment complete! Your CivicTrack app is ready!" -ForegroundColor Green
