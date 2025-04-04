import packageJson from "../../../../package.json";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-neutral-800 text-neutral-100 z-[999]">
      <div className="mx-auto px-4 py-2 flex justify-end">
        <p className="text-sm">
          v{packageJson.version}.{packageJson.build} © 2025 RENT-HOUSE-PLATFORM
        </p>
      </div>
    </footer>
  );
}
