import React, { useState } from "react";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    phone: "",
    dogName: "",
    dogSize: "small",
    date: "",
    address: "",
    services: [],
  });

  const [totalAmount, setTotalAmount] = useState(0);

  const dogSizes = ["small", "medium", "large"];
  const groomingServices = {
    Bath: { small: 150, medium: 200, large: 250 },
    "Nail Trim": { small: 50, medium: 70, large: 100 },
    Haircut: { small: 200, medium: 250, large: 300 },
    "Ear Cleaning": { small: 80, medium: 100, large: 120 },
    Teeth: { small: 100, medium: 120, large: 150 },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceToggle = (service) => {
    let updatedServices = [...formData.services];
    if (updatedServices.includes(service)) {
      updatedServices = updatedServices.filter((s) => s !== service);
    } else {
      updatedServices.push(service);
    }

    setFormData({ ...formData, services: updatedServices });

    let newTotal = 0;
    updatedServices.forEach(
      (s) => (newTotal += groomingServices[s][formData.dogSize])
    );
    setTotalAmount(newTotal);
  };

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    setFormData({ ...formData, dogSize: newSize });

    let newTotal = 0;
    formData.services.forEach(
      (s) => (newTotal += groomingServices[s][newSize])
    );
    setTotalAmount(newTotal);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.services.length === 0) {
      alert("Please select at least one grooming service.");
      return;
    }

    try {
      const res = await fetch(
        "https://tailwaggers-backend.onrender.com/api/bookings",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Booking failed.");
        return;
      }

      // Redirect to Yoco payment page
      const paymentUrl = data.payment?.redirectUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        alert("Payment link not received.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <section className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Book a Grooming Service
      </h2>

      <input
        type="text"
        name="ownerName"
        placeholder="Your Name"
        value={formData.ownerName}
        onChange={handleChange}
        className="w-full border p-3 rounded"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border p-3 rounded"
        required
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={formData.phone}
        onChange={handleChange}
        className="w-full border p-3 rounded"
        required
      />

      <input
        type="text"
        name="dogName"
        placeholder="Dog's Name"
        value={formData.dogName}
        onChange={handleChange}
        className="w-full border p-3 rounded"
        required
      />

      <select
        name="dogSize"
        value={formData.dogSize}
        onChange={handleSizeChange}
        className="w-full border p-3 rounded"
      >
        {dogSizes.map((size) => (
          <option key={size} value={size}>
            {size.charAt(0).toUpperCase() + size.slice(1)}
          </option>
        ))}
      </select>

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full border p-3 rounded"
        required
      />

      <input
        type="text"
        name="address"
        placeholder="Address / Pickup Info"
        value={formData.address}
        onChange={handleChange}
        className="w-full border p-3 rounded"
        required
      />

      <h3 className="font-bold">Select Services</h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.keys(groomingServices).map((s) => (
          <label key={s} className="border p-2 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={formData.services.includes(s)}
              onChange={() => handleServiceToggle(s)}
            />{" "}
            {s} - R{groomingServices[s][formData.dogSize]}
          </label>
        ))}
      </div>

      <p className="text-xl font-bold">Total: R {totalAmount}</p>

      <button
        type="submit"
        onClick={handleSubmit}
        className="w-full bg-cyan-500 text-white p-3 rounded"
      >
        Book & Pay
      </button>
    </section>
  );
};

export default BookingForm;
