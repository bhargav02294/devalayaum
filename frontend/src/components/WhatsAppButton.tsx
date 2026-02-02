import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {
  const whatsappNumber = "7666210342";
  const message = encodeURIComponent(
    "Namaste 🙏 I would like to know more about temple darshan, online puja booking, and donation services on Devalayaum."
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Devalayaum support on WhatsApp for temple, puja and donation help"
      title="WhatsApp support for temple services, puja booking and donations"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition transform hover:scale-105"
    >
      <FaWhatsapp size={28} aria-hidden="true" />
    </a>
  );
}
