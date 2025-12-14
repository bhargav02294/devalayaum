import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import i18n from "../i18n";
import { seoConfig } from "./seoConfig";

export default function SeoManager() {
  const { pathname } = useLocation();
  const lang = (i18n.language || "en") as "en" | "hi" | "mr";

  useEffect(() => {
    const seo = seoConfig[pathname];
    if (!seo) return;

    document.title = seo.title[lang] || seo.title.en;

    const setMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    setMeta("description", seo.description[lang] || seo.description.en);
    setMeta("keywords", seo.keywords);
  }, [pathname, lang]);

  return null;
}
