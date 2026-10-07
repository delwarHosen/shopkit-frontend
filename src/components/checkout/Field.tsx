export const inputCls = (invalid: boolean) =>
  `h-12 w-full rounded-lg border bg-background px-3.5 text-sm outline-none transition-colors focus:border-primary ${
    invalid ? "border-rose-500" : "border-border"
  }`;

type Props = {
  id: string;
  label: string;
  error?: string;
  optionalLabel?: string; // দিলে "(ঐচ্ছিক)" দেখায়
  children: React.ReactNode;
};

export function Field({ id, label, error, optionalLabel, children }: Props) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center gap-2 text-sm font-medium"
      >
        {label}
        {optionalLabel && (
          <span className="text-xs font-normal text-muted-foreground">
            ({optionalLabel})
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1.5 text-xs font-medium text-rose-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}
