# YouTube Subtitle Player

A full-stack web application that allows you to parse YouTube video URLs, download subtitles and audio, and play them with synchronized highlighting.

## Features

- ✅ Parse YouTube video URLs and extract video information
- ✅ Download and extract video subtitles automatically
- ✅ Download video audio in MP3 format
- ✅ Display subtitles line by line with timestamps
- ✅ Audio player with full controls
- ✅ Real-time subtitle highlighting based on audio playback
- ✅ Click-to-jump functionality - click any subtitle line to jump to that position
- ✅ Modern, responsive UI design
- ✅ Backend API with Python Flask
- ✅ Frontend with React

## Tech Stack

### Backend
- **Python 3.8+**
- **Flask** - Web framework
- **yt-dlp** - YouTube video/audio downloading
- **youtube-transcript-api** - Subtitle extraction
- **Flask-CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI framework
- **Axios** - HTTP client
- **Modern CSS** - Styling with gradients and animations

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn
- FFmpeg (for audio processing)

### Installing FFmpeg

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

**Windows:**
Download from https://ffmpeg.org/download.html and add to PATH

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd youtube-subtitle-player
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create uploads directory
mkdir -p uploads
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

## Running the Application

### 1. Start the Backend Server
```bash
# From backend directory with activated virtual environment
cd backend
source venv/bin/activate  # On Linux/Mac
python app.py
```

The backend will start on `http://localhost:5000`

### 2. Start the Frontend Development Server
```bash
# From frontend directory (in a new terminal)
cd frontend
npm start
```

The frontend will start on `http://localhost:3000`

## Usage

1. **Open the application** in your browser at `http://localhost:3000`

2. **Enter a YouTube URL** in the input field (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)

3. **Click "Process Video"** to extract subtitles and download audio

4. **Wait for processing** - this may take a few moments depending on video length

5. **Use the audio player** to play/pause and control playback

6. **View synchronized subtitles** - the current subtitle line will be highlighted

7. **Click any subtitle line** to jump to that specific time in the audio

## API Endpoints

### POST /api/process-video
Process a YouTube video URL and extract subtitles/audio.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "success": true,
  "video_id": "VIDEO_ID",
  "title": "Video Title",
  "duration": 180,
  "subtitles": [
    {
      "id": 0,
      "start": 0.0,
      "duration": 3.5,
      "text": "Hello world",
      "end": 3.5
    }
  ],
  "audio_url": "/api/audio/VIDEO_ID"
}
```

### GET /api/audio/{video_id}
Serve the downloaded audio file for a specific video.

### GET /api/health
Health check endpoint.

## Project Structure

```
youtube-subtitle-player/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   └── uploads/           # Downloaded audio files
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styling
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json       # Node.js dependencies
└── README.md
```

## Troubleshooting

### Common Issues

1. **"No subtitles available"** - Some videos don't have subtitles or auto-generated captions
2. **Audio download fails** - Check if FFmpeg is properly installed
3. **CORS errors** - Make sure both frontend and backend are running
4. **Video processing fails** - Some videos may be region-blocked or private

### Debug Tips

- Check browser console for frontend errors
- Check backend terminal for Python errors
- Ensure all dependencies are installed correctly
- Verify FFmpeg installation with `ffmpeg -version`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please respect YouTube's Terms of Service when using this application.

## Disclaimer

This tool is for personal and educational use only. Users are responsible for complying with YouTube's Terms of Service and applicable copyright laws.