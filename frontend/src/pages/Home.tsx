import { useTranslation } from "react-i18next";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-b from-orange-100 via-white to-white pt-24 pb-16 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-orange-700 mb-4">
          {t("title")}
        </h1>
        <p className="text-gray-700 text-lg md:text-xl mb-8">{t("tagline")}</p>
        <a
          href="#donate"
          className="bg-orange-600 text-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-orange-700 transition"
        >
          {t("button")}
        </a>
      </div>

      <div className="mt-10 flex justify-center">
        <img
          src="https://res.cloudinary.com/demo/image/upload/v1727456000/temple_banner.jpg"
          alt="Temple"
          className="w-4/5 md:w-2/3 rounded-2xl shadow-lg"
        />
      </div>
    </section>
  );
}
