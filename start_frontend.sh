#!/bin/bash

echo "Starting YouTube Subtitle Player Frontend..."

# Navigate to frontend directory
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

# Start the React development server
echo "Starting React development server on http://localhost:3000"
npm start