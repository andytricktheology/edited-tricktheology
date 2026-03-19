# Trick Theology Deployment Guide

This application is a full-stack React + Express app. To deploy it to your own server, follow these steps:

## 1. Local Build
Run these commands on your local machine:
```bash
npm install
npm run build
```
This will create a `dist/` folder containing the compiled frontend.

## 2. Prepare Files for Upload
You need to upload the following files/folders to your server:
- `dist/` (The compiled frontend)
- `server.ts` (The Express server)
- `package.json` (Dependency list)
- `data.json` (Persistent data storage)
- `.env` (If you have any environment variables like `GEMINI_API_KEY`)

## 3. Server Setup
On your server, navigate to the project folder and run:
```bash
npm install --production
```
*Note: Ensure you have Node.js installed on your server.*

## 4. Start the Server
To start the application in production mode:
```bash
NODE_ENV=production npm start
```
The server will start on port 3000 (or the port specified in your `PORT` environment variable).

### Recommended: Use a Process Manager
For production, it's recommended to use a process manager like `pm2` to keep the server running:
```bash
npm install -g pm2
NODE_ENV=production pm2 start server.ts --interpreter tsx --name trick-theology
```
