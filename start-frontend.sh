#!/bin/bash

echo "⚛️  Starting YouTube Subtitle Player Frontend..."

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Node modules not found. Please run ./setup.sh first."
    exit 1
fi

# Navigate to frontend directory
cd frontend

# Start the React development server
echo "🚀 Starting React development server on http://localhost:3000"
npm start