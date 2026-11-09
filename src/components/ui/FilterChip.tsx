// A filter button with a count, used by the projects page and the automation library.
type Props = { label: string; count: number; active: boolean; onClick: () => void };

export default function FilterChip({ label, count, active, onClick }: Props) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
        active
          ? 'border-[#D4AF37] bg-[#D4AF37]/[0.08] text-[#D4AF37]'
          : 'border-[#1F1F1F] text-[#A09882] hover:border-[#D4AF37]/30 hover:text-[#F5F0E8]'
      }`}
    >
      {label}
      <span className={`text-xs tabular-nums ${active ? 'text-[#D4AF37]/80' : 'text-[#6B6355]'}`}>{count}</span>
    </button>
  );
}
