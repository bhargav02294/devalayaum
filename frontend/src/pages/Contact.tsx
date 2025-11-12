import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();

  return (
    <section id="contact" className="pt-24 pb-16 bg-white text-center px-6">
      <h2 className="text-4xl font-bold text-orange-700 mb-4">{t("contact.heading")}</h2>
      <p className="text-gray-700 max-w-2xl mx-auto mb-8">{t("contact.subheading")}</p>

      <div className="max-w-2xl mx-auto bg-orange-50 p-6 rounded-xl shadow-lg">
        <form className="flex flex-col gap-4">
          <input placeholder={t("contact.name")!} className="p-3 rounded-lg border border-gray-300" />
          <input type="email" placeholder={t("contact.email")!} className="p-3 rounded-lg border border-gray-300" />
          <textarea placeholder={t("contact.message")!} rows={4} className="p-3 rounded-lg border border-gray-300" />
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl">
            {t("contact.send")}
          </button>
        </form>

        <div className="mt-8 text-gray-700">
          <p>{t("contact.address")}</p>
          <p>{t("contact.email")}</p>
          <p>{t("contact.phone")}</p>
        </div>
      </div>
    </section>
  );
}
