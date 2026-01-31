const ServiceCard = ({ title, description, services, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(services)}
      className="border p-6 rounded-xl shadow hover:shadow-lg cursor-pointer transition"
    >
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ServiceCard;
