# DBTMitra

DBT Mitra is now a full-stack Node.js + Express + MongoDB application with:

- Login and registration for institution heads / SPOCs
- JWT-protected dashboard
- Activity logging stored in MongoDB
- Image and video report uploads with Multer
- Modern Bootstrap-based landing page and dashboard UI

## Run Locally

1. Copy `.env.example` to `.env`
2. Set `MONGODB_URI` and `JWT_SECRET`
3. Install dependencies with `npm install`
4. Start the app with `npm run dev` or `npm start`
5. Open `http://localhost:5000`

## Structure

- `public/` frontend files
- `models/` Mongoose schemas
- `routes/` API routes
- `middleware/` authorization middleware
- `uploads/` uploaded media
- `server.js` app entry point
