# Deployment Guide

## Local Development
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the dev server:
   ```sh
   npm run dev
   ```

## Production Build
1. Build the app:
   ```sh
   npm run build
   ```
2. Start in production mode:
   ```sh
   npm start
   ```

## Live App Deployment (Vercel)

### How the Live App is Configured and Deployed

- The frontend is deployed on [Vercel](https://vercel.com/) for automatic builds and hosting.
- The GitHub repository is connected to Vercel. On every push to `main`, Vercel runs `npm install` and `npm run build` automatically.
- The app is served at your Vercel-assigned domain (e.g., `https://your-app.vercel.app`).
- Environment variables (such as backend API URLs) are configured in the Vercel dashboard under Project Settings > Environment Variables.
- The FastAPI backend must be deployed and accessible from the Vercel frontend (CORS enabled, public endpoint).

### Steps to Deploy on Vercel
1. Push your code to GitHub (or GitLab/Bitbucket).
2. Import the repo into Vercel and select the project root.
3. Set environment variables (e.g., `NEXT_PUBLIC_API_URL`).
4. Vercel will build and deploy automatically on every push.
5. Visit your live app at the provided Vercel URL.

## Custom Domains
- You can add a custom domain in the Vercel dashboard.

## Backend
- Ensure the FastAPI backend is deployed (e.g., on Render, Heroku, AWS, or your own server).
- The backend API URL must be accessible from the frontend and set as an environment variable in Vercel.

---
For more details, see the Vercel documentation: https://vercel.com/docs

# Author

Rainer Hamal