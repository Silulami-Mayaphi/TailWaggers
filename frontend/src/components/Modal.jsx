const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
