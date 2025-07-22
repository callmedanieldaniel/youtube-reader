# Deployment Guide - YouTube Subtitle Player

## Quick Start (Development)

### Prerequisites
- Python 3.8+ with pip and venv
- Node.js 16+ with npm
- Internet connection for downloading YouTube content

### 1. Start Backend Server
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
The backend will start on `http://localhost:5000`

### 2. Start Frontend Server
```bash
cd frontend
npm install
npm start
```
The frontend will start on `http://localhost:3000`

### 3. Access the Application
Open your browser and navigate to `http://localhost:3000`

## Production Deployment

### Backend (Flask API)

#### Option 1: Using Gunicorn
```bash
cd backend
source venv/bin/activate
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### Option 2: Using Docker
Create `backend/Dockerfile`:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

### Frontend (React App)

#### Build for Production
```bash
cd frontend
npm run build
```

#### Serve with Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/frontend/build;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Environment Variables

### Backend (.env)
```
FLASK_ENV=production
DOWNLOAD_DIR=/path/to/downloads
MAX_FILE_SIZE=500MB
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Security Considerations

1. **File Storage**: Configure proper file cleanup and size limits
2. **CORS**: Restrict allowed origins in production
3. **Rate Limiting**: Implement rate limiting for download endpoint
4. **Input Validation**: Validate YouTube URLs on both frontend and backend
5. **SSL/HTTPS**: Use HTTPS in production

## Troubleshooting

### Common Issues

1. **"yt-dlp not found"**
   - Ensure yt-dlp is installed: `pip install yt-dlp`

2. **"CORS error"**
   - Check Flask-CORS configuration in `app.py`
   - Verify frontend URL is allowed

3. **"Audio not playing"**
   - Check browser console for errors
   - Verify audio file is accessible at `/api/audio/{id}/{filename}`

4. **"No subtitles found"**
   - Not all YouTube videos have subtitles
   - Try videos with known subtitle availability

### Performance Optimization

1. **Backend**:
   - Use Redis for caching video metadata
   - Implement background job queue for downloads
   - Add file cleanup scheduler

2. **Frontend**:
   - Implement lazy loading for large subtitle lists
   - Add audio preloading
   - Optimize bundle size with code splitting

## Monitoring

### Health Checks
- Backend: `GET /api/health`
- Frontend: Check if main page loads

### Logs
- Backend: Flask logs and yt-dlp output
- Frontend: Browser console and network tab

## Scaling

For high-traffic deployment:
1. Use load balancer for multiple backend instances
2. Implement shared file storage (AWS S3, etc.)
3. Use CDN for serving audio files
4. Add database for tracking downloads and analytics