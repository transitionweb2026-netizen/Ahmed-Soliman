import { locale as getLocaleParam } from "next/root-params";
import { getDictionary } from "@/lib/dictionary";
import { defaultLocale, isLocale, localePath } from "@/lib/i18n";
import { GlassButton } from "@/components/ui/GlassButton";

export default async function NotFound() {
  const param = await getLocaleParam();
  const locale = isLocale(param) ? param : defaultLocale;
  const t = getDictionary(locale).common;

  return (
    <section className="relative isolate grid min-h-[80svh] place-items-center px-5 pt-32">
      <div className="glass glass-interactive flex max-w-lg flex-col items-center gap-6 rounded-[2.5rem] px-8 py-14 text-center">
        <p className="text-gradient font-display text-8xl leading-none">404</p>
        <h1 className="text-3xl text-white">{t.notFoundTitle}</h1>
        <p className="text-mist/70">{t.notFoundBody}</p>
        <GlassButton href={localePath(locale)} arrow>
          {t.backHome}
        </GlassButton>
      </div>
    </section>
  );
}
