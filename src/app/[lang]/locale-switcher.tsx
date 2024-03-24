"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { i18n, type Locale } from "@/../i18n-config";
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function LocaleSwitcher() {
  const pathName = usePathname();
  const router = useRouter();
  const redirectedPathName = (locale: Locale) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };
  // const [lang, setLang] = useState(pathName.split('/')[1]);
  const { lang } = useParams<{ lang: string; }>();
  const redirectToPath = (locale: string) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
  };
  return (
    <Select onValueChange={redirectToPath} defaultValue={lang}>
      <SelectTrigger className="w-16 px-2 capitalize">
        <SelectValue aria-label={lang}>{lang}</SelectValue>
      </SelectTrigger>
      <SelectContent className="w-16 min-w-16">
        {i18n.locales.map((locale) =>
          <SelectItem
            key={locale}
            value={locale}
            defaultChecked={locale === lang}
          >{locale}</SelectItem>
        )}
      </SelectContent>
    </Select>
  );
}
