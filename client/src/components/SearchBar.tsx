

interface SearchBarProps {
  searchText: string;
  handleInputChange?: React.ChangeEventHandler<HTMLInputElement>;
}
export function Searchbar({ searchText, handleInputChange }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search by title or assigned user..."
      className="rounded px-3 py-2 bg-gray-800 text-white w-full"
      value={searchText}
      onChange={handleInputChange}
    />
  );
}
