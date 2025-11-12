import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();

  return (
    <section id="about" className="pt-24 pb-16 bg-white text-center px-6">
      <h2 className="text-4xl font-bold text-orange-700 mb-4">{t("about.heading")}</h2>
      <p className="text-gray-700 max-w-3xl mx-auto mb-6">{t("about.desc1")}</p>
      <p className="text-gray-700 max-w-3xl mx-auto mb-6">{t("about.desc2")}</p>

      <div className="flex justify-center mt-6">
        <img
          src="https://images.pexels.com/photos/1660999/pexels-photo-1660999.jpeg"
          alt="About Devalayaum"
          className="rounded-2xl shadow-lg w-3/4 md:w-1/2"
        />
      </div>

      <div className="mt-10">
        <h3 className="text-2xl font-semibold text-orange-600 mb-2">{t("about.vision")}</h3>
        <p className="text-gray-700 max-w-2xl mx-auto">{t("about.visionText")}</p>
      </div>
    </section>
  );
}
