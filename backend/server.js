console.log("SERVER FILE RUNNING:", import.meta.url);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

// Import your routes
import bookingRoutes from "./routes/booking.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let db;

// Make db available globally for routes
export const getDB = () => db;

async function initDB() {
  db = await mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}

initDB()
  .then(() => {
    console.log("Database connected");
    startServer();
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });

function startServer() {
  /* ================================
     HEALTH CHECK
  ================================= */
  app.get("/", (req, res) => {
    res.send("TailWaggers API running");
  });

  /* ================================
     USE ROUTES
  ================================= */
  app.use("/api", bookingRoutes); // All booking routes now live under /api

  /* ================================
     START SERVER
  ================================= */
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log("Listening on", PORT);
  });
}
