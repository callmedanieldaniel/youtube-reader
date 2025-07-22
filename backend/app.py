from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
import os
import tempfile
import uuid
import json
from datetime import datetime
import subprocess
import re

app = Flask(__name__)
CORS(app)

# Directory to store downloaded files
DOWNLOAD_DIR = os.path.join(os.getcwd(), 'downloads')
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

def parse_srt_time(time_str):
    """Convert SRT time format to seconds"""
    time_str = time_str.replace(',', '.')
    parts = time_str.split(':')
    hours = int(parts[0])
    minutes = int(parts[1])
    seconds = float(parts[2])
    return hours * 3600 + minutes * 60 + seconds

def parse_srt_file(srt_path):
    """Parse SRT file and return subtitle data"""
    subtitles = []
    
    with open(srt_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by double newlines to separate subtitle blocks
    blocks = content.strip().split('\n\n')
    
    for block in blocks:
        lines = block.strip().split('\n')
        if len(lines) >= 3:
            # Parse time range
            time_line = lines[1]
            time_match = re.match(r'(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})', time_line)
            if time_match:
                start_time = parse_srt_time(time_match.group(1))
                end_time = parse_srt_time(time_match.group(2))
                
                # Join text lines
                text = '\n'.join(lines[2:])
                
                subtitles.append({
                    'start': start_time,
                    'end': end_time,
                    'text': text
                })
    
    return subtitles

@app.route('/api/download', methods=['POST'])
def download_video():
    try:
        data = request.json
        youtube_url = data.get('url')
        
        if not youtube_url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Generate unique ID for this download
        download_id = str(uuid.uuid4())
        download_path = os.path.join(DOWNLOAD_DIR, download_id)
        os.makedirs(download_path, exist_ok=True)
        
        # Configure yt-dlp options
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': os.path.join(download_path, 'audio.%(ext)s'),
            'writesubtitles': True,
            'writeautomaticsub': True,
            'subtitleslangs': ['en', 'en-US', 'en-GB'],
            'subtitlesformat': 'srt',
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Get video info
            info = ydl.extract_info(youtube_url, download=False)
            video_title = info.get('title', 'Unknown')
            duration = info.get('duration', 0)
            
            # Download audio and subtitles
            ydl.download([youtube_url])
        
        # Find downloaded files
        audio_file = None
        subtitle_file = None
        
        for file in os.listdir(download_path):
            if file.startswith('audio.') and not file.endswith('.srt'):
                audio_file = file
            elif file.endswith('.srt'):
                subtitle_file = file
        
        if not audio_file:
            return jsonify({'error': 'Failed to download audio'}), 500
        
        # Parse subtitles if available
        subtitles = []
        if subtitle_file:
            subtitle_path = os.path.join(download_path, subtitle_file)
            try:
                subtitles = parse_srt_file(subtitle_path)
            except Exception as e:
                print(f"Error parsing subtitles: {e}")
        
        return jsonify({
            'download_id': download_id,
            'title': video_title,
            'duration': duration,
            'audio_file': audio_file,
            'subtitles': subtitles,
            'has_subtitles': len(subtitles) > 0
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/audio/<download_id>/<filename>')
def serve_audio(download_id, filename):
    try:
        file_path = os.path.join(DOWNLOAD_DIR, download_id, filename)
        if os.path.exists(file_path):
            return send_file(file_path)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health')
def health_check():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)