# YouTube Subtitle Player

A web application that allows you to download YouTube videos, extract their audio content and subtitles, and play them with synchronized subtitle highlighting. Built with Python Flask backend and React frontend.

## Features

- 🎵 **Audio Extraction**: Download and play audio from YouTube videos
- 📝 **Subtitle Parsing**: Automatically extract and parse video subtitles
- 🎯 **Synchronized Playback**: Highlight current subtitle line during audio playback
- 🖱️ **Click to Seek**: Click any subtitle line to jump to that position in the audio
- 🎮 **Audio Controls**: Play/pause, seek, and time display
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Beautiful gradient design with smooth animations

## Project Structure

```
youtube-subtitle-player/
├── backend/                 # Python Flask backend
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   └── downloads/          # Downloaded audio files (created automatically)
├── frontend/               # React frontend
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styling
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   ├── public/
│   │   └── index.html     # HTML template
│   └── package.json       # Node.js dependencies
├── start_backend.sh        # Backend startup script
├── start_frontend.sh       # Frontend startup script
└── README.md              # This file
```

## Prerequisites

- Python 3.7 or higher
- Node.js 14 or higher
- npm or yarn

## Installation & Setup

### Option 1: Using Startup Scripts (Recommended)

1. **Start the Backend** (in one terminal):
   ```bash
   ./start_backend.sh
   ```
   This will:
   - Create a Python virtual environment
   - Install all Python dependencies
   - Start the Flask server on `http://localhost:5000`

2. **Start the Frontend** (in another terminal):
   ```bash
   ./start_frontend.sh
   ```
   This will:
   - Install Node.js dependencies
   - Start the React development server on `http://localhost:3000`

### Option 2: Manual Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the Flask server:
   ```bash
   python app.py
   ```

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Usage

1. Open your browser and go to `http://localhost:3000`
2. Paste a YouTube video URL in the input field
3. Click "Download & Process" to extract audio and subtitles
4. Once processed, you'll see:
   - The video title
   - Audio player controls (play/pause, seek bar, time display)
   - List of subtitles with timestamps
5. Use the audio controls to play/pause and seek through the audio
6. The current subtitle line will be highlighted in blue
7. Click any subtitle line to jump to that position in the audio

## API Endpoints

### Backend API

- `POST /api/download`: Download YouTube video and extract audio/subtitles
  - Body: `{ "url": "youtube_video_url" }`
  - Returns: Video metadata, download ID, and parsed subtitles

- `GET /api/audio/<download_id>/<filename>`: Serve audio files

- `GET /api/health`: Health check endpoint

## Technical Details

### Backend (Python Flask)

- **yt-dlp**: For downloading YouTube videos and extracting audio
- **Flask-CORS**: For handling cross-origin requests
- **SRT Parsing**: Custom parser for subtitle files
- **File Management**: Organized storage of downloaded content

### Frontend (React)

- **Audio API**: HTML5 audio element for playback control
- **State Management**: React hooks for managing player state
- **Real-time Sync**: Time-based subtitle highlighting
- **Responsive Design**: CSS Grid and Flexbox for layout

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Troubleshooting

### Common Issues

1. **"No subtitles available"**: Not all YouTube videos have subtitles. Try with a different video.

2. **Download fails**: Check if the YouTube URL is valid and the video is publicly accessible.

3. **Audio won't play**: Ensure your browser supports the audio format. Some browsers may require user interaction before playing audio.

4. **CORS errors**: Make sure both backend (port 5000) and frontend (port 3000) are running.

### Dependencies Issues

If you encounter issues with yt-dlp, try updating it:
```bash
pip install --upgrade yt-dlp
```

## Development

### Adding New Features

1. **Backend changes**: Modify `backend/app.py` and add new endpoints as needed
2. **Frontend changes**: Update React components in `frontend/src/`
3. **Styling**: Modify CSS files for visual changes

### Environment Variables

You can set these environment variables for customization:

- `FLASK_ENV=development` for debug mode
- `PORT=5000` to change backend port

## License

This project is for educational purposes. Please respect YouTube's Terms of Service and copyright laws when using this application.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

If you encounter any issues or have questions, please check the troubleshooting section above or create an issue in the repository.