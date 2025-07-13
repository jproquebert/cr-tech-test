import { useState, useEffect, useRef } from "react";
import { StatusFilterBubbles } from "./StatusFilterBubbles";
import { Searchbar } from "./SearchBar";

interface SearchComponentsProps {
  onSearch: (searchText: string, statuses: string[]) => void;
  statusOptions: { label: string; value: string; color: string }[];
  selectedStatuses: string[];
  onStatusChange: (statuses: string[]) => void;
}

export function SearchComponents({
  onSearch,
  statusOptions,
  selectedStatuses,
  onStatusChange,
}: SearchComponentsProps) {
  const [searchText, setSearchText] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search input
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(searchText, selectedStatuses);
    }, 1000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, selectedStatuses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleStatusClick = (status: string) => {
    let newStatuses;
    if (selectedStatuses.includes(status)) {
      newStatuses = selectedStatuses.filter((s) => s !== status);
    } else {
      newStatuses = [...selectedStatuses, status];
    }
    onStatusChange(newStatuses);
  };

  return (
    <div className="flex flex-col gap-4 items-center w-full mb-6">
      <Searchbar
        searchText={searchText}
        handleInputChange={handleInputChange}
      />
      <div className="w-full flex flex-col items-center">
        <span className="text-sm text-blue-300 font-semibold mb-2 text-center">
          Filter by status:
        </span>
        <StatusFilterBubbles
          options={statusOptions}
          selected={selectedStatuses}
          onSelect={handleStatusClick}
        />
      </div>
    </div>
  );
}
