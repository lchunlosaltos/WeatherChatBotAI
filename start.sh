#!/bin/bash

echo "Starting AI Streaming UI Demo..."
echo ""
echo "Make sure you have added your OpenAI API key to the .env file!"
echo ""

# Start backend server in background
echo "Starting backend server..."
npm run server &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend dev server
echo "Starting frontend dev server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Both servers are starting..."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "The app will be available at http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
