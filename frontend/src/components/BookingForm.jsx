import { useState } from "react";

const BookingForm = ({ selectedPackage }) => {
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    phone: "",
    dogName: "",
    dogSize: "small",
    date: "",
    address: "",
    addons: [],
  });

  const sizeMultiplier = {
    small: 1,
    medium: 1.3,
    large: 1.6,
    xl: 2,
  };

  const addons = {
    "Nail Trim": 60,
    "De-shedding": 120,
    "Flea & Tick": 150,
    "Teeth Cleaning": 100,
    "Ear Cleaning": 80,
  };

  const basePrice = Math.round(
    selectedPackage.basePrice * sizeMultiplier[formData.dogSize]
  );

  const addonsTotal = formData.addons.reduce(
    (sum, a) => sum + addons[a],
    0
  );

  const totalAmount = basePrice + addonsTotal;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleAddon = (addon) => {
    setFormData((prev) => ({
      ...prev,
      addons: prev.addons.includes(addon)
        ? prev.addons.filter((a) => a !== addon)
        : [...prev.addons, addon],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      package: selectedPackage.name,
      basePrice,
      addons: formData.addons,
      total: totalAmount,
    };

    try {
      const res = await fetch(
        "https://tailwaggers-backend.onrender.com/api/bookings",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Booking failed.");
        return;
      }

      if (data.payment?.redirectUrl) {
        window.location.href = data.payment.redirectUrl;
      } else {
        alert("Payment link not received.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-center">
        {selectedPackage.name}
      </h2>

      <p className="text-center text-gray-500">
        Includes: {selectedPackage.included.join(", ")}
      </p>

      <div className="bg-gray-100 p-4 rounded-xl text-center font-bold">
        Base Price: R{basePrice}
      </div>

      <input
        name="ownerName"
        placeholder="Your Name"
        onChange={handleChange}
        className="w-full border p-3 rounded"
        required
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full border p-3 rounded"
        required
      />

      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
        className="w-full border p-3 rounded"
        required
      />

      <input
        name="dogName"
        placeholder="Dog's Name"
        onChange={handleChange}
        className="w-full border p-3 rounded"
        required
      />

      <select
        name="dogSize"
        onChange={handleChange}
        className="w-full border p-3 rounded"
      >
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
        <option value="xl">XL</option>
      </select>

      <input
        type="date"
        name="date"
        onChange={handleChange}
        className="w-full border p-3 rounded"
        required
      />

      <input
        name="address"
        placeholder="Pickup Address"
        onChange={handleChange}
        className="w-full border p-3 rounded"
        required
      />

      <h3 className="font-bold">Optional Add-Ons</h3>

      <div className="grid grid-cols-2 gap-2">
        {Object.keys(addons).map((a) => (
          <label key={a} className="border p-2 rounded cursor-pointer">
            <input
              type="checkbox"
              checked={formData.addons.includes(a)}
              onChange={() => toggleAddon(a)}
            />{" "}
            {a} – R{addons[a]}
          </label>
        ))}
      </div>

      <p className="text-xl font-bold text-center mt-4">
        Total: R{totalAmount}
      </p>

      <button
        onClick={handleSubmit}
        className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-4 rounded-xl font-bold"
      >
        Book & Pay
      </button>
    </section>
  );
};

export default BookingForm;
