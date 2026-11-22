"use client";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  id?: string;
  label?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  id,
  label = "Quantity",
}: QuantitySelectorProps) {
  return (
    <div className="inline-flex flex-col gap-2">
      <label htmlFor={id} className="eyebrow">
        {label}
      </label>
      <div className="inline-flex items-stretch border border-line bg-surface">
        <button
          type="button"
          className="min-h-11 min-w-11 px-3 text-espresso hover:bg-sand/50 disabled:opacity-40"
          aria-label="Decrease quantity"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
        >
          −
        </button>
        <input
          id={id}
          type="number"
          className="w-14 border-x border-line bg-transparent text-center text-sm"
          min={min}
          max={max}
          value={value}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (Number.isNaN(next)) return;
            onChange(Math.min(max, Math.max(min, next)));
          }}
          aria-label={label}
        />
        <button
          type="button"
          className="min-h-11 min-w-11 px-3 text-espresso hover:bg-sand/50 disabled:opacity-40"
          aria-label="Increase quantity"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}
