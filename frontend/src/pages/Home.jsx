import { useState } from "react";
import ServiceCard from "../components/ServiceCard";
import Modal from "../components/Modal";
import BookingForm from "../components/BookingForm";
import AboutSection from "../components/AboutSection";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const packages = [
    {
      id: 1,
      name: "Fresh Pup",
      description: "Wash, dry & brush",
      basePrice: 250,
      included: ["Wash", "Dry", "Brush"],
    },
    {
      id: 2,
      name: "Full Groom",
      description: "Wash, cut, dry & brush",
      basePrice: 450,
      included: ["Wash", "Cut", "Dry", "Brush"],
    },
    {
      id: 3,
      name: "Premium Paws",
      description: "Full groom + paw balm & cologne",
      basePrice: 650,
      included: ["Wash", "Cut", "Dry", "Brush", "Paw Balm", "Cologne"],
    },
  ];

  const handleSelect = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-5xl font-extrabold text-center mb-4 text-gray-800">
          TailWaggers 🐶
        </h1>
        <p className="text-center text-gray-500 mb-12">
          Premium dog grooming at your doorstep
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((p) => (
            <ServiceCard
              key={p.id}
              title={p.name}
              description={p.description}
              onSelect={() => handleSelect(p)}
            />
          ))}
        </div>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          {selectedPackage && (
            <BookingForm
              selectedPackage={selectedPackage}
              onClose={() => setShowModal(false)}
            />
          )}
        </Modal>
      </div>
      <AboutSection />
    </div>
  );
};

export default Home;
