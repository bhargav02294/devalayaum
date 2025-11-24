import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();

  return (
    <section
      id="about"
      className="pt-20 md:pt-24 pb-16 text-center px-5 md:px-6"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 25%, #ffffff 70%)",
      }}
    >
      {/* HEADING */}
      <h2 className="text-3xl md:text-4xl font-bold text-orange-700 mb-4 font-[Marcellus]">
        {t("about.heading")}
      </h2>

      {/* PARAGRAPHS */}
      <p className="text-gray-700 max-w-3xl mx-auto mb-5 text-base md:text-lg leading-relaxed font-[Poppins]">
        {t("about.desc1")}
      </p>
      <p className="text-gray-700 max-w-3xl mx-auto mb-8 text-base md:text-lg leading-relaxed font-[Poppins]">
        {t("about.desc2")}
      </p>

      {/* IMAGE */}
      <div className="flex justify-center mt-6">
        <img
          src="https://images.pexels.com/photos/1660999/pexels-photo-1660999.jpeg"
          alt="About Devalayaum"
          className="rounded-2xl shadow-xl w-[85%] sm:w-3/4 md:w-1/2 object-cover"
        />
      </div>

      {/* VISION SECTION */}
      <div className="mt-12">
        <h3 className="text-2xl md:text-3xl font-semibold text-orange-600 mb-3 font-[Marcellus]">
          {t("about.vision")}
        </h3>

        <p className="text-gray-700 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-[Poppins]">
          {t("about.visionText")}
        </p>
      </div>
    </section>
  );
}
