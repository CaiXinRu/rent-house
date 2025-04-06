import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Footer from "../components/Footer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

//   export async function generateMetadata() {
//     const t = await getTranslations();
//     return {
//       title: `${t("web-title")}`,
//       description:
//         "Let's travel around Taiwan! Explore this beautiful island through this website and discover the myriad attractions and destinations it has to offer.",
//     };
//   }

export default async function ListLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <div className="max-w-7xl min-h-screen mx-auto px-4 py-8 space-y-6">
      {children}
      <Footer />
    </div>
  );
}
