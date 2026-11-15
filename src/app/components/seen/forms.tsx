/**
 * Form atoms from the Figma design system (node ids in comments).
 * All controls: visible label, 44 px targets, error text linked with
 * aria-describedby / aria-invalid, visible focus.
 */
import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Check, Eye, EyeOff, Minus, Search, X } from "lucide-react";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

const fieldBase =
  "w-full min-h-12 rounded-seen-md bg-seen-surface border px-4 text-[15px] text-white placeholder:text-white/55 transition-colors outline-none disabled:opacity-40 disabled:cursor-not-allowed";

// ------------------------------------------------------------------ Text Input (295:27)
interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label: string;
  hint?: string;
  error?: string | null;
  /** Visually hide the label (it stays available to assistive tech). */
  hideLabel?: boolean;
  trailing?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, hideLabel, trailing, id, className, ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id ?? auto;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errId = error ? `${inputId}-err` : undefined;
  return (
    <div className={cx("text-left", className)}>
      <label htmlFor={inputId} className={cx("block text-[13px] font-medium text-white/80 mb-2", hideLabel && "sr-only")}>
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errId, hintId].filter(Boolean).join(" ") || undefined}
          className={cx(
            fieldBase,
            error ? "border-seen-error focus:border-seen-error" : "border-seen-border focus:border-white/40",
            trailing && "pr-12",
          )}
          {...rest}
        />
        {trailing && <div className="absolute inset-y-0 right-0 flex items-center pr-1">{trailing}</div>}
      </div>
      {error ? (
        <p id={errId} role="alert" className="text-xs text-seen-error mt-2">
          {error}
        </p>
      ) : (
        hint && (
          <p id={hintId} className="text-xs text-seen-muted mt-2">
            {hint}
          </p>
        )
      )}
    </div>
  );
});

// --------------------------------------------------------------- Password Field (363:132)
export const PasswordField = forwardRef<HTMLInputElement, Omit<TextFieldProps, "type" | "trailing">>(function PasswordField(props, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      ref={ref}
      {...props}
      type={visible ? "text" : "password"}
      autoComplete={props.autoComplete ?? "current-password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="w-11 h-11 flex items-center justify-center rounded-full text-white/60 hover:text-white"
        >
          {visible ? <EyeOff className="w-4 h-4" aria-hidden /> : <Eye className="w-4 h-4" aria-hidden />}
        </button>
      }
    />
  );
});

// ------------------------------------------------------------------- Search Bar (298:137)
interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
  value: string;
  onChange: (value: string) => void;
  label: string;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(function SearchBar({ value, onChange, label, className, ...rest }, ref) {
  return (
    <div role="search" className={cx("relative", className)}>
      <label className="sr-only" htmlFor={rest.id}>
        {label}
      </label>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/55 pointer-events-none" aria-hidden />
      <input
        ref={ref}
        type="search"
        aria-label={rest.id ? undefined : label}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Escape" && value) {
            e.stopPropagation();
            onChange("");
          }
        }}
        className={cx(fieldBase, "rounded-full pl-11 pr-12 border-seen-border focus:border-white/40 [&::-webkit-search-cancel-button]:hidden")}
        {...rest}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-1 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full text-white/60 hover:text-white"
        >
          <X className="w-4 h-4" aria-hidden />
        </button>
      )}
    </div>
  );
});

// ------------------------------------------------------------------------ Toggle (295:47)
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, description, disabled }: ToggleProps) {
  const id = useId();
  return (
    <div className="flex items-center justify-between gap-4 min-h-11">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm text-white">
          {label}
        </label>
        {description && <p className="text-xs text-seen-muted mt-0.5">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cx(
          "relative w-[52px] h-8 rounded-full flex-shrink-0 transition-colors disabled:opacity-40 before:absolute before:-inset-y-1.5 before:inset-x-0 before:content-['']",
          checked ? "bg-white" : "bg-white/15",
        )}
      >
        <span
          aria-hidden
          className={cx(
            "absolute top-1 left-0 w-6 h-6 rounded-full transition-transform",
            checked ? "translate-x-[24px] bg-black" : "translate-x-1 bg-white",
          )}
        />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------- Checkbox (302:42)
interface CheckboxProps {
  checked: boolean | "indeterminate";
  onChange: (checked: boolean) => void;
  label: ReactNode;
  disabled?: boolean;
  strikeWhenChecked?: boolean;
}

export function Checkbox({ checked, onChange, label, disabled, strikeWhenChecked }: CheckboxProps) {
  const on = checked === true;
  return (
    <label className={cx("flex items-center gap-3 min-h-11 cursor-pointer", disabled && "cursor-not-allowed opacity-60")}>
      <span className="relative flex-shrink-0 w-[22px] h-[22px]">
        <input
          type="checkbox"
          className="peer absolute inset-0 opacity-0 cursor-[inherit]"
          checked={on}
          ref={el => {
            if (el) el.indeterminate = checked === "indeterminate";
          }}
          aria-checked={checked === "indeterminate" ? "mixed" : on}
          disabled={disabled}
          onChange={e => onChange(e.target.checked)}
        />
        <span
          aria-hidden
          className={cx(
            "pointer-events-none absolute inset-0 rounded-[6px] border flex items-center justify-center transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-white/70 peer-focus-visible:outline-offset-2",
            on || checked === "indeterminate" ? "bg-white border-white" : "border-white/35 bg-transparent",
          )}
        >
          {on && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
          {checked === "indeterminate" && <Minus className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
        </span>
      </span>
      <span className={cx("text-sm", on && strikeWhenChecked ? "text-white/55 line-through" : "text-white/85")}>{label}</span>
    </label>
  );
}

// ------------------------------------------------------------------------- Radio (302:50)
interface RadioGroupProps<T extends string> {
  label: string;
  /** Visually hide the legend when a section heading above already names the group. */
  hideLabel?: boolean;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; description?: string; disabled?: boolean }[];
}

export function RadioGroup<T extends string>({ label, hideLabel, value, onChange, options }: RadioGroupProps<T>) {
  const name = useId();
  return (
    <fieldset>
      <legend className={hideLabel ? "sr-only" : "text-[13px] font-medium text-white/80 mb-2"}>{label}</legend>
      <div className="space-y-2">
        {options.map(o => {
          const selected = o.value === value;
          return (
            <label
              key={o.value}
              className={cx(
                "flex items-center gap-3 min-h-12 px-4 rounded-seen-md border cursor-pointer transition-colors",
                selected ? "border-white/40 bg-white/5" : "border-seen-border bg-seen-surface hover:border-white/20",
                o.disabled && "opacity-40 cursor-not-allowed",
              )}
            >
              <span className="relative w-[22px] h-[22px] flex-shrink-0">
                <input
                  type="radio"
                  name={name}
                  value={o.value}
                  checked={selected}
                  disabled={o.disabled}
                  onChange={() => onChange(o.value)}
                  className="peer absolute inset-0 opacity-0"
                />
                <span
                  aria-hidden
                  className={cx(
                    "pointer-events-none absolute inset-0 rounded-full border flex items-center justify-center peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-white/70 peer-focus-visible:outline-offset-2",
                    selected ? "border-white" : "border-white/35",
                  )}
                >
                  {selected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                </span>
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-white">{o.label}</span>
                {o.description && <span className="block text-xs text-seen-muted">{o.description}</span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
