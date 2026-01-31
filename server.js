import express from "express";
import axios from "axios"; // keep this if you actually use axios

const app = express(); // <-- this was missing
app.use(express.json());

// your existing route
app.post("/api/bookings", async (req, res) => {
  const { ownerName, email, phone, dogName, dogSize, date, address, services } = req.body;

  if (
    !ownerName || !email || !phone || !dogName || !dogSize ||
    !date || !address || !services || services.length === 0
  ) {
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
    const price = servicePricing[service]?.[dogSize.toLowerCase()];
    if (!price) return res.status(400).json({ error: `Invalid service or dog size: ${service}` });
    amount += price;
  }

  try {
    const [result] = await db.query(
      "INSERT INTO bookings (owner_name, email, phone, dog_name, dog_size, date, address, services, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [ownerName, email, phone, dogName, dogSize, date, address, JSON.stringify(services), amount, "pending_payment"]
    );

    res.status(201).json({
      message: "Booking received",
      booking: {
        id: result.insertId,
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
    });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
