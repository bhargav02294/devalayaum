import i18n from "../i18n";
import { Multilingual } from "../types/Temple"; // already contains multilingual type

export function getLang() {
  return (i18n.language || "en") as keyof Multilingual;
}

export function t(obj?: Multilingual): string {
  if (!obj) return "";
  const lang = getLang();
  return obj[lang] || obj["en"] || "";
}
