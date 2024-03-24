"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { i18n, type Locale } from "@/i18n-config";
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "@/components/ui/select";

export default function LocaleSwitcher() {
  const pathName = usePathname();
  const router = useRouter();
  const { lang } = useParams<{ lang: Locale; }>();

  const redirectToPath = (locale: Locale) => {
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
