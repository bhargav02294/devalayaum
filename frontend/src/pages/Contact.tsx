import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();

  return (
    <section
      id="contact"
      className="pt-20 md:pt-24 pb-16 text-center px-5 md:px-6"
      style={{
        background:
          "linear-gradient(to bottom, #fff4cc 0%, #fff8e7 30%, #ffffff 80%)",
      }}
    >
      {/* HEADING */}
      <h2 className="text-3xl md:text-4xl font-bold text-orange-700 mb-4 font-[Marcellus]">
        {t("contact.heading")}
      </h2>

      {/* SUBHEADING */}
      <p className="text-gray-700 max-w-2xl mx-auto mb-8 text-base md:text-lg leading-relaxed font-[Poppins]">
        {t("contact.subheading")}
      </p>

      {/* CONTACT FORM CARD */}
      <div className="max-w-2xl mx-auto bg-white shadow-xl border border-orange-100 p-6 md:p-8 rounded-2xl">
        <form className="flex flex-col gap-4">
          <input
            placeholder={t("contact.name")!}
            className="p-3 md:p-4 rounded-xl border border-gray-300 text-base md:text-lg font-[Poppins] focus:outline-none focus:border-orange-600"
          />

          <input
            type="email"
            placeholder={t("contact.email")!}
            className="p-3 md:p-4 rounded-xl border border-gray-300 text-base md:text-lg font-[Poppins] focus:outline-none focus:border-orange-600"
          />

          <textarea
            placeholder={t("contact.message")!}
            rows={4}
            className="p-3 md:p-4 rounded-xl border border-gray-300 text-base md:text-lg font-[Poppins] focus:outline-none focus:border-orange-600"
          />

          <button
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 md:py-4 rounded-xl text-lg font-semibold transition-all"
          >
            {t("contact.send")}
          </button>
        </form>

        {/* CONTACT DETAILS */}
        <div className="mt-10 text-gray-700 space-y-1 text-base md:text-lg font-[Poppins]">
          <p>{t("contact.address")}</p>
          <p>{t("contact.email")}</p>
          <p>{t("contact.phone")}</p>
        </div>
      </div>
    </section>
  );
}
