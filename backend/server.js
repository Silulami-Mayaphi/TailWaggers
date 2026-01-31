import express from "express";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// ----------------------------
// Booking creation route
// ----------------------------
app.post("/api/bookings", async (req, res) => {
  const { ownerName, email, phone, dogName, dogSize, date, address, services } = req.body;

  // Validate input
  if (
    !ownerName || !email || !phone || !dogName || !dogSize ||
    !date || !address || !services || services.length === 0
  ) {
    return res.status(400).json({ error: "All fields required" });
  }

  // Pricing table
  const servicePricing = {
    "Full Groom": { small: 200, medium: 300, large: 400 },
    "Bath & Brush": { small: 120, medium: 150, large: 200 },
    "Nail Trim": { small: 50, medium: 70, large: 90 },
    "Ear Cleaning": { small: 40, medium: 60, large: 80 },
    "Teeth Cleaning": { small: 60, medium: 80, large: 100 },
  };

  // Calculate total amount
  let amount = 0;
  for (const service of services) {
    const price = servicePricing[service]?.[dogSize.toLowerCase()];
    if (!price) return res.status(400).json({ error: `Invalid service or dog size: ${service}` });
    amount += price;
  }

  try {
    // ----------------------------
    // Save booking in DB
    // ----------------------------
    const [result] = await db.query(
      "INSERT INTO bookings (owner_name, email, phone, dog_name, dog_size, date, address, services, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [ownerName, email, phone, dogName, dogSize, date, address, JSON.stringify(services), amount, "pending_payment"]
    );

    const bookingId = result.insertId;

    // ----------------------------
    // Create Yoco payment (test/live) with bookingId in metadata
    // ----------------------------
    const checkoutResponse = await axios.post(
      "https://online.yoco.com/v1/checkout",
      {
        amountInCents: amount * 100,
        currency: "ZAR",
        metadata: { bookingId },
        redirectUrl: "https://tailwaggers-frontend.com/success",
        cancelUrl: "https://tailwaggers-frontend.com/cancel"
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.YOCO_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Respond with booking + payment info
    res.status(201).json({
      message: "Booking created and payment initiated",
      booking: {
        id: bookingId,
        ownerName,
        email,
        phone,
        dogName,
        dogSize,
        date,
        address,
        services,
        amount,
        status: "pending_payment",
      },
      payment: checkoutResponse.data // contains Yoco redirectUrl
    });
  } catch (err) {
    console.error("Error creating booking/payment:", err.response?.data || err);
    res.status(500).json({ error: "Database or payment creation error" });
  }
});

// ----------------------------
// Yoco webhook route
// ----------------------------
app.post("/api/bookings/webhook", async (req, res) => {
  const payload = JSON.stringify(req.body);
  const signature = req.headers['x-yoco-signature'];
  const secret = process.env.YOCO_WEBHOOK_SECRET;

  // ----------------------------
  // Verify webhook signature
  // ----------------------------
  const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  if (hash !== signature) {
    console.log("Invalid webhook signature");
    return res.status(400).send("Invalid signature");
  }

  const event = req.body;
  const bookingId = event.data.metadata?.bookingId;

  if (!bookingId) {
    console.log("Webhook missing bookingId:", event);
    return res.status(400).send("Missing bookingId");
  }

  try {
    // ----------------------------
    // Update booking status
    // ----------------------------
    if (event.type === "payment.authorized") {
      await db.query("UPDATE bookings SET status = ? WHERE id = ?", ["paid", bookingId]);
      console.log("Booking marked as paid:", bookingId);
    } else if (event.type === "payment.failed") {
      await db.query("UPDATE bookings SET status = ? WHERE id = ?", ["payment_failed", bookingId]);
      console.log("Booking marked as payment_failed:", bookingId);
    } else {
      console.log("Unhandled Yoco event type:", event.type);
    }
  } catch (err) {
    console.error("DB update error:", err);
  }

  // Always return 200 OK
  res.status(200).send("Received");
});

// ----------------------------
// Start server
// ----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
