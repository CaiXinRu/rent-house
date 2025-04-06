import { LatLngLiteral } from "leaflet";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import TriggerMenu from "./TriggerMenu";

type SearchBarProps = {
  onSearch: (result: LatLngLiteral | null) => void;
  setIsLoading: (loading: boolean) => void;
  setProgress: (progress: number) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  setIsLoading,
  setProgress,
}) => {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setProgress(50);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );

      setProgress(80);

      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        onSearch({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setProgress(90);
      } else {
        alert("No results found");
        setProgress(90);
      }
    } catch (error) {
      console.error("Search error:", error);
      setProgress(90);
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  return (
    <div className="absolute top-4 left-4 bg-neutral-700 shadow-lg rounded-lg p-3 z-[999] flex gap-2">
      <input
        ref={inputRef}
        type="text"
        className="rounded p-2 w-60 bg-neutral-800 text-neutral-100"
        placeholder={`${t("search-placeholder")}`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <button
        onClick={handleSearch}
        className="bg-neutral-700 text-neutral-100 px-4 py-2 rounded hover:bg-neutral-800"
      >
        {t("search")}
      </button>
      <TriggerMenu />
    </div>
  );
};

export default SearchBar;
