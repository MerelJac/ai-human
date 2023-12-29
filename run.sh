#!/bin/bash

# Start the MongoDB server (replace 'your-mongodb-uri' with your actual MongoDB URI)
mongod --dbpath ./data &

# Navigate to the server directory
cd server

# Install server dependencies
npm install

# Start the server
npm start &

# Navigate to the client directory
cd ../client

# Install client dependencies
npm install

# Start the React app
npm start
