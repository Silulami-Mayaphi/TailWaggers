const ServiceCard = ({ title, description, services, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(services)}
      className="bg-white border rounded-2xl p-6 shadow hover:shadow-xl transition cursor-pointer"
    >
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
      <p className="mt-4 text-cyan-600 font-semibold">
        Book now →
      </p>
    </div>
  );
};

export default ServiceCard;
