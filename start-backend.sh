#!/bin/bash

echo "🐍 Starting YouTube Subtitle Player Backend..."

# Check if virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "❌ Virtual environment not found. Please run ./setup.sh first."
    exit 1
fi

# Navigate to backend directory
cd backend

# Activate virtual environment
source venv/bin/activate

# Start the Flask server
echo "🚀 Starting Flask server on http://localhost:5000"
python app.py