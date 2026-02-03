import express from "express";
import fetch from "node-fetch";
import axios from "axios";
import { getDB } from "../server.js"; // Access db pool

const router = express.Router();

router.post("/bookings", async (req, res) => {
  const db = getDB();
  const { ownerName, email, phone, dogName, dogSize, date, address, services } = req.body;

  if (!ownerName || !email || !phone || !dogName || !dogSize || !date || !address || !services || services.length === 0) {
    return res.status(400).json({ error: "All fields required" });
  }

  const servicePricing = {
    "Full Groom": { small: 200, medium: 300, large: 400 },
    "Bath & Brush": { small: 120, medium: 150, large: 200 },
    "Nail Trim": { small: 50, medium: 70, large: 90 },
    "Ear Cleaning": { small: 40, medium: 60, large: 80 },
    "Teeth Cleaning": { small: 60, medium: 80, large: 100 },
  };

  let amount = 0;
  for (const service of services) {
    const price = servicePricing[service]?.[dogSize];
    if (!price) return res.status(400).json({ error: `Invalid service: ${service}` });
    amount += price;
  }

  try {
    const [result] = await db.query(
      `INSERT INTO bookings 
      (owner_name, email, phone, dog_name, dog_size, date, address, services, amount, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ownerName, email, phone, dogName, dogSize, date, address, JSON.stringify(services), amount, "pending payment"]
    );

    const bookingId = result.insertId;

    const yocoRes = await axios.post(
      "https://payments.yoco.com/api/checkouts",
      {
        amount: amount * 100,
        currency: "ZAR",
        successUrl: `${process.env.APP_URL}/payment-success?booking=${bookingId}`,
        cancelUrl: `${process.env.APP_URL}/payment-cancelled`,
        metadata: { bookingId },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.YOCO_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ checkoutUrl: yocoRes.data.redirectUrl });

  } catch (err) {
    console.error("Booking/Yoco Error:", err.response?.data || err);
    res.status(500).json({ error: "Payment initialization failed" });
  }
});

export default router;
