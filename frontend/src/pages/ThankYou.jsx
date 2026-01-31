import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ThankYou = () => {
  const [params] = useSearchParams();
  const bookingId = params.get("bookingId");
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!bookingId) return;

    fetch(`https://tailwaggers-backend.onrender.com/api/bookings/${bookingId}`)
      .then((res) => res.json())
      .then(setBooking)
      .catch((err) => console.error("Failed to load booking", err));
  }, [bookingId]);   // 👈 THIS is what fixes Vercel

  if (!booking) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Thank you!</h1>
      <p>Booking #{booking.id}</p>
      <p>Status: {booking.status}</p>
      <p>Amount: R{booking.amount}</p>
    </div>
  );
};

export default ThankYou;
