# BlockAuth Backend

This is the backend API for BlockAuth, built with Express.js.

## Setup

1. Install dependencies:
   ```bash
   cd server
   npm install
   # or
   yarn install
   ```

2. Create a `.env` file (see `.env` for example).

3. Start the server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## API Endpoints
- `/api/products` - Product registration and retrieval
- `/api/sales` - Sale recording and history
- `/api/users` - User registration and authentication

## Next Steps
- Implement actual logic for each route
- Connect to a database
- Add blockchain integration 