interface StatusOption {
  label: string;
  value: string;
  color: string;
}

interface StatusFilterBubblesProps {
  options: StatusOption[];
  selected: string[];
  onSelect: (status: string) => void;
}

export function StatusFilterBubbles({
  options,
  selected,
  onSelect,
}: StatusFilterBubblesProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8 w-full justify-center">
      {options.map((option) => (
        <button
          key={option.value}
          className={`px-4 py-1 rounded-full text-xs font-bold shadow transition
            ${option.color}
            ${
              selected.includes(option.value)
                ? "ring-2 ring-white scale-105"
                : "opacity-70"
            }
            hover:opacity-100`}
          style={
            option.value === "inprogress"
              ? { minWidth: "110px" }
              : { minWidth: "80px" }
          }
          onClick={() => onSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
