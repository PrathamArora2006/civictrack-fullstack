# CivicTrack Deployment Guide

This guide will help you deploy both the backend and frontend of the CivicTrack application.

## Backend Deployment (Railway)

### Prerequisites
1. Railway account (https://railway.app)
2. PostgreSQL database with PostGIS extension

### Steps

1. **Create a new Railway project**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Connect your repository**
   - Select the `civictrack-finalrepo-main` repository
   - Choose the `civictrack-backend` folder as the root directory

3. **Set up PostgreSQL database**
   - In Railway dashboard, add a PostgreSQL service
   - Note down the connection details (DATABASE_URL, DB_USERNAME, DB_PASSWORD)

4. **Enable PostGIS extension**
   - Connect to your PostgreSQL database
   - Run: `CREATE EXTENSION postgis;`

5. **Configure environment variables**
   - In Railway project settings, add these environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection URL
     - `DB_USERNAME`: Database username
     - `DB_PASSWORD`: Database password
     - `PORT`: 8080 (Railway will set this automatically)

6. **Deploy**
   - Railway will automatically build and deploy your Spring Boot application
   - The backend will be available at: `https://your-app-name.up.railway.app`

## Frontend Deployment (Firebase Hosting)

### Prerequisites
1. Firebase account (https://firebase.google.com)
2. Firebase CLI installed (`npm install -g firebase-tools`)

### Steps

1. **Update API URL**
   - The frontend is already configured to use the Railway backend URL
   - Update `API_BASE_URL` in `index.html` if needed

2. **Deploy to Firebase**
   ```bash
   cd civictrack-finalrepo-main
   firebase login
   firebase init hosting
   firebase deploy
   ```

3. **Access your application**
   - Your frontend will be available at: `https://your-project-id.web.app`

## Testing the Deployment

1. **Test Backend**
   - Visit: `https://your-backend-url/api/complaints/admin-view`
   - Should return an empty array or existing complaints

2. **Test Frontend**
   - Visit your Firebase hosting URL
   - Try filing a complaint and viewing complaints

## Environment Variables Summary

### Backend (Railway)
- `DATABASE_URL`: PostgreSQL connection string
- `DB_USERNAME`: Database username  
- `DB_PASSWORD`: Database password
- `PORT`: Server port (set by Railway)

### Frontend
- `API_BASE_URL`: Backend URL (hardcoded in index.html)

## Troubleshooting

### Backend Issues
- Check Railway logs for build errors
- Verify database connection
- Ensure PostGIS extension is enabled

### Frontend Issues
- Check browser console for API errors
- Verify CORS configuration in backend
- Ensure API_BASE_URL is correct

## Production Considerations

1. **Security**
   - Update CORS settings to restrict origins
   - Use environment variables for sensitive data
   - Enable HTTPS

2. **Performance**
   - Configure database connection pooling
   - Enable caching where appropriate
   - Monitor resource usage

3. **Monitoring**
   - Set up logging
   - Monitor application health
   - Track user metrics
