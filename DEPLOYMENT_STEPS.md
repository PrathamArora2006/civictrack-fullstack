# 🚀 CivicTrack Deployment Steps

## Frontend Deployment (Firebase Hosting)

### Option 1: Using Firebase Console (Recommended)
1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `civictrack-75372`

2. **Set up Hosting**
   - Click on "Hosting" in the left sidebar
   - Click "Get started" or "Add another site"
   - Choose a hosting site name (e.g., `civictrack-app`)

3. **Upload Files**
   - Click "Upload files" or drag and drop
   - Upload these files from your project root:
     - `index.html` (main application)
     - `404.html` (error page)
     - `firebase.json` (configuration)
     - `.firebaserc` (project config)

4. **Deploy**
   - Click "Deploy" or "Publish"
   - Your app will be available at: `https://civictrack-75372.web.app`

### Option 2: Using Firebase CLI (if available)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Deploy
firebase deploy
```

## Backend Deployment (Railway)

### Step 1: Create Railway Account
1. Go to: https://railway.app
2. Sign up/Login with your GitHub account

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `civictrack-finalrepo-main`
4. Set the root directory to: `civictrack-backend`

### Step 3: Add PostgreSQL Database
1. In your Railway project dashboard
2. Click "New" → "Database" → "PostgreSQL"
3. Wait for the database to be created
4. Note down the connection details

### Step 4: Configure Environment Variables
1. Go to your backend service settings
2. Add these environment variables:
   - `DATABASE_URL`: (from PostgreSQL service connection string)
   - `DB_USERNAME`: (from PostgreSQL service)
   - `DB_PASSWORD`: (from PostgreSQL service)
   - `PORT`: 8080 (Railway sets this automatically)

### Step 5: Enable PostGIS Extension
1. Connect to your PostgreSQL database
2. Run this SQL command:
   ```sql
   CREATE EXTENSION postgis;
   ```

### Step 6: Deploy
1. Railway will automatically build and deploy your Spring Boot application
2. Your backend will be available at: `https://your-app-name.up.railway.app`

## Update Frontend API Configuration

After backend deployment:
1. Note your Railway backend URL (e.g., `https://civictrack-backend-production.up.railway.app`)
2. Update the `API_BASE_URL` in `index.html`:
   ```javascript
   const API_BASE_URL = "https://your-railway-url.up.railway.app";
   ```
3. Redeploy the frontend with the updated configuration

## Testing Your Deployment

### Test Backend
- Visit: `https://your-backend-url/api/complaints/admin-view`
- Should return: `[]` (empty array) or existing complaints

### Test Frontend
- Visit your Firebase hosting URL
- Try filing a complaint
- Check if complaints are displayed
- Test admin functionality

## Troubleshooting

### Backend Issues
- Check Railway logs for build errors
- Verify database connection
- Ensure PostGIS extension is enabled
- Check environment variables

### Frontend Issues
- Check browser console for API errors
- Verify CORS configuration
- Ensure API_BASE_URL is correct
- Check Firebase hosting logs

## Production URLs
- **Frontend**: `https://civictrack-75372.web.app`
- **Backend**: `https://your-app-name.up.railway.app`
- **Admin Panel**: `https://civictrack-75372.web.app/admin/admin.jsx`

## Next Steps After Deployment
1. Test all functionality
2. Set up monitoring
3. Configure custom domain (optional)
4. Set up SSL certificates (automatic with Firebase/Railway)
5. Monitor performance and usage
