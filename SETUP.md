# Setup Guide

## Prerequisites
- Node.js 18+
- npm
- MongoDB Atlas cluster or local MongoDB instance

## Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file with:
   ```
   MONGODB_URI=<your Mongo connection string>
   JWT_SECRET=<random string>
   PORT=5001
   ```
4. `npm run dev`
5. Verify at `http://localhost:5001/api/health`

## Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create `.env.local` with `VITE_API_URL=http://localhost:5001/api`
4. `npm run dev` (runs on `http://localhost:5173`)
5. Build check: `npm run build`

## Running Checks
- Backend: use the Postman collection or curl requests against `http://localhost:5001/api`
- Frontend: run `npm run build` to ensure the production bundle compiles

## Postman Collection
- Import `assignment_api.postman_collection.json`
- Ensure the collection variables point to `http://localhost:5001/api`

## Troubleshooting
### Network Errors
- Confirm backend is running (`npm run dev`) and health endpoint returns JSON
- Ensure `.env.local` uses `http://localhost:5001/api`

### MongoDB Issues
- Confirm `MONGODB_URI` is valid and the cluster allows your IP
- Restart `npm run dev` after credential changes

### Port 5001 In Use
```
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

## Scaling & Production Notes
- Build the frontend with `npm run build`, host the static bundle on a CDN, and serve the backend via a dedicated Node process or container
- Store secrets (Mongo URI, JWT secret) in a managed secret vault and inject them through environment variables
- Place a reverse proxy (NGINX, CloudFront, etc.) in front of both services for TLS termination and caching
- Use separate environments (dev/stage/prod) with matching `.env` files and CI/CD pipelines to automate deploys
- Introduce observability (structured logs, metrics, uptime probes) and horizontal scaling for both the API layer and the database when traffic grows
