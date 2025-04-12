"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";

const languages = [
  { key: "en", label: "English" },
  { key: "zh", label: "繁體中文" },
];

const LocaleSwitcher = () => {
  const router = useRouter();
  const pathName = usePathname();

  const currentLocale = pathName?.split("/")[1] || "zh";

  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  const currentLabel =
    languages.find((lang) => lang.key === currentLocale)?.label ?? "語言";

  return (
    <Select
      value={currentLocale}
      onValueChange={(value) => {
        router.push(redirectedPathName(value));
      }}
    >
      <SelectTrigger className="w-28 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0">
        <SelectValue>{currentLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map(({ key, label }) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LocaleSwitcher;
