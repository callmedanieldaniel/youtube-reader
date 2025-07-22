import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(-1);
  const [error, setError] = useState('');
  
  const audioRef = useRef(null);

  const handleDownload = async () => {
    if (!youtubeUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setError('');
    setVideoData(null);

    try {
      const response = await axios.post('/api/download', {
        url: youtubeUrl
      });

      setVideoData(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while downloading');
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);

      // Find current subtitle
      if (videoData?.subtitles) {
        const currentIndex = videoData.subtitles.findIndex(
          (subtitle, index) => {
            return time >= subtitle.start && time <= subtitle.end;
          }
        );
        setCurrentSubtitleIndex(currentIndex);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (event) => {
    if (audioRef.current) {
      const seekTime = (event.target.value / 100) * duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleSubtitleClick = (subtitle) => {
    if (audioRef.current) {
      audioRef.current.currentTime = subtitle.start;
      setCurrentTime(subtitle.start);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getAudioUrl = () => {
    if (videoData) {
      return `/api/audio/${videoData.download_id}/${videoData.audio_file}`;
    }
    return '';
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>YouTube Subtitle Player</h1>
        
        <div className="url-input-section">
          <input
            type="text"
            placeholder="Enter YouTube URL"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="url-input"
            disabled={loading}
          />
          <button 
            onClick={handleDownload} 
            disabled={loading}
            className="download-btn"
          >
            {loading ? 'Processing...' : 'Download & Process'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {videoData && (
          <div className="player-section">
            <h2 className="video-title">{videoData.title}</h2>
            
            <audio
              ref={audioRef}
              src={getAudioUrl()}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />

            <div className="audio-controls">
              <button onClick={handlePlayPause} className="play-pause-btn">
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              
              <div className="time-info">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
                className="progress-slider"
              />
            </div>

            <div className="content-container">
              <div className="subtitles-section">
                <h3>Subtitles</h3>
                {videoData.has_subtitles ? (
                  <div className="subtitles-list">
                    {videoData.subtitles.map((subtitle, index) => (
                      <div
                        key={index}
                        className={`subtitle-item ${
                          index === currentSubtitleIndex ? 'active' : ''
                        }`}
                        onClick={() => handleSubtitleClick(subtitle)}
                      >
                        <div className="subtitle-time">
                          {formatTime(subtitle.start)} - {formatTime(subtitle.end)}
                        </div>
                        <div className="subtitle-text">{subtitle.text}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-subtitles">No subtitles available for this video</p>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;