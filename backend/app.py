import os
import json
import tempfile
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi
import re
from urllib.parse import urlparse, parse_qs

app = Flask(__name__)
CORS(app)

# Create uploads directory if it doesn't exist
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def extract_video_id(url):
    """Extract YouTube video ID from URL"""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)',
        r'youtube\.com\/watch\?.*v=([^&\n?#]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    return None

@app.route('/api/process-video', methods=['POST'])
def process_video():
    """Process YouTube video: extract subtitles and download audio"""
    try:
        data = request.get_json()
        video_url = data.get('url')
        
        if not video_url:
            return jsonify({'error': 'Video URL is required'}), 400
        
        # Extract video ID
        video_id = extract_video_id(video_url)
        if not video_id:
            return jsonify({'error': 'Invalid YouTube URL'}), 400
        
        # Get video info
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            video_title = info.get('title', 'Unknown Title')
            video_duration = info.get('duration', 0)
        
        # Extract subtitles
        try:
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            
            # Try to get English subtitles first, then any available
            transcript = None
            try:
                transcript = transcript_list.find_transcript(['en'])
            except:
                # Get first available transcript
                for t in transcript_list:
                    transcript = t
                    break
            
            if transcript:
                subtitles = transcript.fetch()
            else:
                return jsonify({'error': 'No subtitles available for this video'}), 400
                
        except Exception as e:
            return jsonify({'error': f'Failed to extract subtitles: {str(e)}'}), 400
        
        # Download audio
        audio_filename = f"{video_id}.mp3"
        audio_path = os.path.join(UPLOAD_FOLDER, audio_filename)
        
        ydl_opts_audio = {
            'format': 'bestaudio/best',
            'outtmpl': audio_path.replace('.mp3', '.%(ext)s'),
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'quiet': True,
            'no_warnings': True,
        }
        
        try:
            with yt_dlp.YoutubeDL(ydl_opts_audio) as ydl:
                ydl.download([video_url])
        except Exception as e:
            return jsonify({'error': f'Failed to download audio: {str(e)}'}), 400
        
        # Process subtitles to add line numbers and format timestamps
        processed_subtitles = []
        for i, subtitle in enumerate(subtitles):
            processed_subtitles.append({
                'id': i,
                'start': subtitle['start'],
                'duration': subtitle['duration'],
                'text': subtitle['text'].strip(),
                'end': subtitle['start'] + subtitle['duration']
            })
        
        return jsonify({
            'success': True,
            'video_id': video_id,
            'title': video_title,
            'duration': video_duration,
            'subtitles': processed_subtitles,
            'audio_url': f'/api/audio/{video_id}'
        })
        
    except Exception as e:
        return jsonify({'error': f'Processing failed: {str(e)}'}), 500

@app.route('/api/audio/<video_id>')
def get_audio(video_id):
    """Serve audio file"""
    audio_path = os.path.join(UPLOAD_FOLDER, f"{video_id}.mp3")
    
    if not os.path.exists(audio_path):
        return jsonify({'error': 'Audio file not found'}), 404
    
    return send_file(audio_path, mimetype='audio/mpeg')

@app.route('/api/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)