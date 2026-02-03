import { FaPhoneAlt, FaInstagram, FaFacebook, FaWhatsapp } from "react-icons/fa";

const AboutSection = () => {
  return (
    <section className="mt-20 bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

        {/* LEFT — ABOUT */}
        <div>
          <h2 className="text-4xl font-bold mb-6">About TailWaggers 🐾</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            TailWaggers is a premium mobile dog grooming service designed for
            busy pet parents who want stress-free, professional grooming at
            their doorstep.
          </p>
          <p className="text-gray-600 leading-relaxed">
            From quick refresh washes to full luxury grooming experiences,
            we treat every dog with patience, care and love — because they
            deserve it.
          </p>
        </div>

        {/* RIGHT — CONTACT */}
        <div className="bg-gray-50 rounded-2xl p-8 shadow">
          <h3 className="text-3xl font-semibold mb-6">Contact Us</h3>

          <div className="space-y-4 text-gray-700">
            <p className="flex items-center gap-3">
              <FaPhoneAlt className="text-cyan-600" />
              074 478 2262
            </p>
            <p className="flex items-center gap-3">
              <FaWhatsapp className="text-green-500" />
              WhatsApp us anytime
            </p>
          </div>

          {/* Socials */}
          <div className="mt-8">
            <p className="mb-3 font-semibold">Follow us</p>
            <div className="flex gap-5 text-2xl text-cyan-600">
              <FaInstagram className="cursor-pointer hover:scale-110 transition" />
              <FaFacebook className="cursor-pointer hover:scale-110 transition" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
