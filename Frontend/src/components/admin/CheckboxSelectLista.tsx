"use client";

interface CheckboxOption {
  id: number;
  label: string;
  sublabel?: string;
}

interface CheckboxSelectListProps {
  options: CheckboxOption[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  emptyMessage?: string;
}

export default function CheckboxSelectList({
  options,
  selectedIds,
  onToggle,
  emptyMessage = "Nenhuma opção cadastrada ainda.",
}: CheckboxSelectListProps) {
  if (options.length === 0) {
    return (
      <div className="rounded-lg border border-[#334155] bg-[#0f1726] px-4 py-3 text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-[#334155] bg-[#0f1726] p-2">
      {options.map((option) => {
        const checked = selectedIds.includes(option.id);

        return (
          <label
            key={option.id}
            className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-white transition hover:bg-[#1d2a3d]"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(option.id)}
              className="h-4 w-4 shrink-0 accent-red-500"
            />

            <span>
              {option.label}
              {option.sublabel ? (
                <span className="ml-1 text-[#7c95b8]">{option.sublabel}</span>
              ) : null}
            </span>
          </label>
        );
      })}
    </div>
  );
}
