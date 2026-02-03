console.log("SERVER FILE RUNNING:", import.meta.url);
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let db;

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
     CREATE BOOKING + Yoco Payment
  ================================= */
  app.post("/api/bookings", async (req, res) => {
    try {
      const {
        ownerName,
        email,
        phone,
        dogName,
        dogSize,
        date,
        address,
        services,
      } = req.body;

      if (!services || services.length === 0) {
        return res.status(400).json({ error: "No services selected" });
      }

      const prices = {
        Bath: { small: 150, medium: 200, large: 250 },
        "Nail Trim": { small: 50, medium: 70, large: 100 },
        Haircut: { small: 200, medium: 250, large: 300 },
        "Ear Cleaning": { small: 80, medium: 100, large: 120 },
        Teeth: { small: 100, medium: 120, large: 150 },
      };

      let total = 0;
      services.forEach((s) => {
        total += prices[s][dogSize];
      });

      const [result] = await db.execute(
        `INSERT INTO bookings 
        (ownerName, email, phone, dogName, dogSize, date, address, services, amount, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ownerName,
          email,
          phone,
          dogName,
          dogSize,
          date,
          address,
          JSON.stringify(services),
          total,
          "pending",
        ]
      );

      const bookingId = result.insertId;

      const yocoRes = await fetch("https://payments.yoco.com/api/checkouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.YOCO_SECRET_KEY}`,
        },
        body: JSON.stringify({
          amount: total * 100,
          currency: "ZAR",
          successUrl: `https://tailwaggers-frontend.onrender.com/thank-you?bookingId=${bookingId}`,
          cancelUrl: `https://tailwaggers-frontend.onrender.com/`,
          metadata: { bookingId },
        }),
      });

      const yocoData = await yocoRes.json();

      if (!yocoData.redirectUrl) {
        return res.status(500).json({ error: "Yoco failed", yocoData });
      }

      res.json({
        bookingId,
        payment: {
          redirectUrl: yocoData.redirectUrl,
        },
      });
    } catch (err) {
      console.error("BOOKING ERROR:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  /* ================================
     FETCH SINGLE BOOKING
  ================================= */
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM bookings WHERE id = ?",
        [req.params.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "Booking not found" });
      }

      const booking = rows[0];
      booking.services = JSON.parse(booking.services);

      res.json(booking);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  /* ================================
     START SERVER
  ================================= */
  const PORT = 5001;
app.listen(PORT, () => {
  console.log("Listening on", PORT);
});

}
