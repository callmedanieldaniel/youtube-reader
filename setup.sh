#!/bin/bash

# YouTube Subtitle Player Setup Script
echo "🎬 Setting up YouTube Subtitle Player..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ first."
    exit 1
fi

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  FFmpeg is not installed. Audio processing may not work."
    echo "   Please install FFmpeg:"
    echo "   - Ubuntu/Debian: sudo apt install ffmpeg"
    echo "   - macOS: brew install ffmpeg"
    echo "   - Windows: Download from https://ffmpeg.org/"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "📦 Setting up backend..."

# Create backend virtual environment
cd backend
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create uploads directory
mkdir -p uploads

echo "⚛️  Setting up frontend..."

# Install frontend dependencies
cd ../frontend
npm install

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "   1. Backend: cd backend && source venv/bin/activate && python app.py"
echo "   2. Frontend: cd frontend && npm start"
echo "   3. Open http://localhost:3000 in your browser"
echo ""
echo "📖 See README.md for detailed instructions"