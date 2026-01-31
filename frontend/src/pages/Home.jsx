import { useState } from "react";
import ServiceCard from "../components/ServiceCard";
import Modal from "../components/Modal";
import BookingForm from "../components/BookingForm";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  const services = [
    { title: "Full Groom", description: "Complete dog grooming", services: ["Full Groom"] },
    { title: "Bath & Brush", description: "Quick refresh", services: ["Bath & Brush"] },
  ];

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-8">TailWaggers</h1>

      <div className="grid grid-cols-2 gap-6">
        {services.map((s) => (
          <ServiceCard
            key={s.title}
            {...s}
            onSelect={(services) => {
              setSelectedServices(services);
              setShowModal(true);
            }}
          />
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <BookingForm presetServices={selectedServices} />
      </Modal>
    </div>
  );
};

export default Home;
