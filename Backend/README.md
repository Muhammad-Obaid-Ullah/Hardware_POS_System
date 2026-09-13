# POS Backend

Express and Mongoose API for the POS application, organized with MVC boundaries.

## Setup

1. Copy `.env.example` to `.env`.
2. Replace `MONGODB_URI` with the MongoDB Atlas connection string.
3. Add the Backend IP address to the Atlas Network Access list.
4. Install dependencies with `npm install`.

## Commands

```bash
npm run dev
npm start
```

The API runs on `http://localhost:5000` by default.

## Routes

- `GET /` API status
- `GET /api/health` health check
- `GET /api/inventory` list inventory items
- `POST /api/inventory` create an inventory item

## Structure

- `src/config`: database configuration
- `src/controllers`: request handlers
- `src/middlewares`: shared Express middleware
- `src/models`: Mongoose models
- `src/routes`: API route definitions
- `src/utils`: reusable helpers
