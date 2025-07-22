import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(-1);
  
  const audioRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setVideoData(null);

    try {
      const response = await axios.post('/api/process-video', { url });
      setVideoData(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process video');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      
      // Find current subtitle
      if (videoData?.subtitles) {
        const index = videoData.subtitles.findIndex(
          subtitle => time >= subtitle.start && time <= subtitle.end
        );
        setCurrentSubtitleIndex(index);
      }
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  const jumpToTime = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('play', handlePlay);
      audioRef.current.addEventListener('pause', handlePause);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('play', handlePlay);
          audioRef.current.removeEventListener('pause', handlePause);
        }
      };
    }
  }, [videoData]);

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>YouTube Subtitle Player</h1>
          <p>Enter a YouTube URL to extract subtitles and play audio</p>
        </header>

        <form onSubmit={handleSubmit} className="url-form">
          <div className="input-group">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="url-input"
              disabled={loading}
            />
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Processing...' : 'Process Video'}
            </button>
          </div>
        </form>

        {error && <div className="error">{error}</div>}

        {videoData && (
          <div className="video-content">
            <div className="video-info">
              <h2>{videoData.title}</h2>
              <p>Duration: {formatTime(videoData.duration)}</p>
            </div>

            <div className="audio-player">
              <audio
                ref={audioRef}
                src={videoData.audio_url}
                controls
                className="audio-controls"
              />
              <div className="playback-info">
                Current time: {formatTime(currentTime)} | 
                Status: {isPlaying ? 'Playing' : 'Paused'}
              </div>
            </div>

            <div className="subtitles-container">
              <h3>Subtitles ({videoData.subtitles.length} lines)</h3>
              <div className="subtitles-list">
                {videoData.subtitles.map((subtitle, index) => (
                  <div
                    key={subtitle.id}
                    className={`subtitle-line ${
                      index === currentSubtitleIndex ? 'active' : ''
                    }`}
                    onClick={() => jumpToTime(subtitle.start)}
                  >
                    <div className="subtitle-time">
                      {formatTime(subtitle.start)} - {formatTime(subtitle.end)}
                    </div>
                    <div className="subtitle-text">{subtitle.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;