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

    const title = seo.title[lang] || seo.title.en;
    const description = seo.description[lang] || seo.description.en;
    const url = window.location.href;
    const image = seo.ogImage || "/og-default.jpg";

    document.title = title;

    const setMeta = (attr: string, name: string, content: string) => {
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // Basic SEO
    setMeta("name", "description", description);
    setMeta("name", "keywords", seo.keywords);
    setMeta("name", "robots", "index, follow");

    // Open Graph (Facebook, WhatsApp)
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", url);
    setMeta("property", "og:image", image);

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);

    // Canonical
    let link = document.querySelector("link[rel='canonical']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", url);

  }, [pathname, lang]);

  return null;
}
