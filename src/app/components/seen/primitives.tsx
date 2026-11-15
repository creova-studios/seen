/**
 * SEEN design-system primitives.
 *
 * Each component maps to a component set on the Figma "02 — Design System"
 * page (node ids in comments). They bind to the tokens in
 * src/styles/seen-tokens.css and keep the visual language of the live app:
 * black canvas, hairline borders, uppercase tracked labels, light headings.
 */
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, Info, Loader2, RefreshCw, TriangleAlert, WifiOff, Inbox } from "lucide-react";
import { SeenImage } from "./SeenImage";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

// ---------------------------------------------------------------------------
// Button — Figma 294:54 (Primary / Secondary / Ghost / Destructive × states)
// ---------------------------------------------------------------------------
type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-white text-black hover:bg-white/90 active:bg-white/80",
  secondary: "bg-seen-elevated text-white border border-seen-border hover:bg-white/10 active:bg-white/15",
  ghost: "bg-transparent text-white/80 hover:bg-white/5 hover:text-white active:bg-white/10",
  destructive: "bg-seen-error text-white hover:brightness-110 active:brightness-95",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  size?: "md" | "sm";
  /** pill is the default; rounded uses the md radius (Figma hero CTA). */
  shape?: "pill" | "rounded";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", loading = false, icon, fullWidth, size = "md", shape = "pill", className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        "inline-flex items-center justify-center gap-2 uppercase font-semibold tracking-[0.12em] transition-colors duration-[var(--seen-duration-fast)]",
        shape === "pill" ? "rounded-full" : "rounded-seen-md",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        size === "md" ? "min-h-11 px-6 text-[13px]" : "min-h-11 px-4 text-[11px]",
        BUTTON_STYLES[variant],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
});

// ---------------------------------------------------------------------------
// Icon Button — Figma 302:32 (Ghost / Filled). Always ≥ 44px hit area.
// ---------------------------------------------------------------------------
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: "ghost" | "filled";
  badge?: number;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = "filled", badge, className, children, ...rest },
  ref,
) {
  // The accessible name repeats exactly what the badge shows ("3", or "9+" above nine),
  // so the visible text is part of the name (WCAG 2.5.3 Label in Name).
  const shownBadge = badge && badge > 9 ? "9+" : badge;
  return (
    <button
      ref={ref}
      type="button"
      aria-label={badge ? `${label}, ${shownBadge} unread` : label}
      className={cx(
        "relative w-11 h-11 -m-1 rounded-full flex items-center justify-center transition-colors flex-shrink-0",
        "disabled:opacity-40",
        className,
      )}
      {...rest}
    >
      <span
        className={cx(
          "w-9 h-9 rounded-full flex items-center justify-center",
          variant === "filled" ? "bg-white/5 border border-white/10 hover:bg-white/10" : "hover:bg-white/5",
        )}
      >
        {children}
      </span>
      {!!badge && badge > 0 && (
        <span
          aria-hidden
          className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-seen-accent text-black text-[10px] font-semibold flex items-center justify-center"
        >
          {shownBadge}
        </span>
      )}
    </button>
  );
});

// ---------------------------------------------------------------------------
// Chip — Figma 295:37 (Default / Selected / Disabled)
// ---------------------------------------------------------------------------
interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export function Chip({ selected, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cx(
        "min-h-11 px-4 rounded-full text-xs tracking-wider uppercase whitespace-nowrap transition-colors border flex-shrink-0",
        selected ? "bg-white text-black border-white" : "bg-transparent text-white/60 border-white/15 hover:text-white hover:border-white/30",
        "disabled:opacity-40",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Badge — Figma 296:10 (Gold / Mint / Purple / Surface)
// ---------------------------------------------------------------------------
type BadgeTone = "gold" | "mint" | "purple" | "surface" | "info" | "error" | "overImage";
const BADGE_TONES: Record<BadgeTone, string> = {
  gold: "text-seen-funding bg-seen-funding/10 border-seen-funding/30",
  mint: "text-seen-success bg-seen-success/10 border-seen-success/30",
  purple: "text-seen-accent bg-seen-accent/10 border-seen-accent/30",
  surface: "text-white/70 bg-white/5 border-white/15",
  info: "text-seen-info bg-seen-info/10 border-seen-info/30",
  error: "text-seen-error bg-seen-error/10 border-seen-error/30",
  /** For badges that sit directly on a photograph: dark backing so the label stays readable on any image. */
  overImage: "text-white bg-black/65 border-white/25 backdrop-blur-md",
};

export function Badge({ tone = "surface", children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 h-5 px-2 rounded-full border text-[10px] font-medium tracking-[0.12em] uppercase whitespace-nowrap",
        BADGE_TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Avatar — Figma 296:20 (Small 32 / Medium 48 / Large 80)
// ---------------------------------------------------------------------------
const AVATAR_SIZES = { sm: "w-8 h-8 text-[11px]", md: "w-12 h-12 text-sm", lg: "w-20 h-20 text-xl", xl: "w-16 h-16 text-lg" } as const;

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase())
    .join("");
}

export function Avatar({ name, src, size = "md", ring }: { name: string; src?: string; size?: keyof typeof AVATAR_SIZES; ring?: boolean }) {
  return (
    <span
      className={cx(
        "relative rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-seen-elevated border border-seen-border text-white/80 font-medium",
        ring && "ring-2 ring-seen-accent ring-offset-2 ring-offset-black text-white",
        AVATAR_SIZES[size],
      )}
      aria-hidden
    >
      {src ? <SeenImage src={src} alt="" decorative seed={name} className="absolute inset-0 w-full h-full object-cover" /> : initialsOf(name)}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Skeleton — Figma 296:43 (Line / Block / Card / Circle)
// ---------------------------------------------------------------------------
export function Skeleton({ kind = "line", className }: { kind?: "line" | "block" | "card" | "circle"; className?: string }) {
  const shape = {
    line: "h-3 w-full rounded",
    block: "h-20 w-full rounded-seen-md",
    card: "aspect-[3/4] w-full rounded-seen-md",
    circle: "w-12 h-12 rounded-full",
  }[kind];
  return <div aria-hidden className={cx("bg-white/5 animate-pulse", shape, className)} />;
}

export function SkeletonList({ count = 3, kind = "block", label = "Loading" }: { count?: number; kind?: "line" | "block" | "card"; label?: string }) {
  return (
    <div role="status" aria-live="polite" className="space-y-3">
      <span className="sr-only">{label}…</span>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} kind={kind} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// State Template — Figma 301:79 (Empty / Error / Offline) + permission denied
// ---------------------------------------------------------------------------
type StateKind = "empty" | "error" | "offline" | "denied";

const STATE_ICONS: Record<StateKind, ReactNode> = {
  empty: <Inbox className="w-6 h-6 text-white/55" />,
  error: <AlertCircle className="w-6 h-6 text-seen-error" />,
  offline: <WifiOff className="w-6 h-6 text-seen-warning" />,
  denied: <TriangleAlert className="w-6 h-6 text-seen-warning" />,
};

interface StateTemplateProps {
  kind: StateKind;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export function StateTemplate({ kind, title, message, actionLabel, onAction, icon }: StateTemplateProps) {
  return (
    <div
      role={kind === "error" || kind === "offline" ? "alert" : "status"}
      data-state={kind}
      className="flex flex-col items-center text-center px-6 py-12 rounded-seen-lg border border-seen-border bg-seen-surface"
    >
      <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5">
        {icon ?? STATE_ICONS[kind]}
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-seen-secondary max-w-[280px] leading-relaxed">{message}</p>
      {actionLabel && onAction && (
        <Button
          variant="secondary"
          size="sm"
          className="mt-6"
          onClick={onAction}
          icon={kind === "error" || kind === "offline" ? <RefreshCw className="w-3.5 h-3.5" aria-hidden /> : undefined}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Banner — Figma 305:53 (Info / Success / Warning / Error)
// ---------------------------------------------------------------------------
type BannerTone = "info" | "success" | "warning" | "error";
const BANNER: Record<BannerTone, { cls: string; icon: ReactNode }> = {
  info: { cls: "border-seen-info/30 bg-seen-info/10", icon: <Info className="w-4 h-4 text-seen-info" aria-hidden /> },
  success: { cls: "border-seen-success/30 bg-seen-success/10", icon: <CheckCircle2 className="w-4 h-4 text-seen-success" aria-hidden /> },
  warning: { cls: "border-seen-warning/30 bg-seen-warning/10", icon: <TriangleAlert className="w-4 h-4 text-seen-warning" aria-hidden /> },
  error: { cls: "border-seen-error/30 bg-seen-error/10", icon: <AlertCircle className="w-4 h-4 text-seen-error" aria-hidden /> },
};

export function Banner({ tone = "info", children, className }: { tone?: BannerTone; children: ReactNode; className?: string }) {
  return (
    <div role={tone === "error" ? "alert" : "note"} className={cx("flex gap-3 items-start rounded-seen-md border px-4 py-3 text-sm text-white/80", BANNER[tone].cls, className)}>
      <span className="mt-0.5 flex-shrink-0">{BANNER[tone].icon}</span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Segmented Tabs — Figma 298:162 (Stories / Creators / Collections)
// ---------------------------------------------------------------------------
interface SegmentedTabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
}

export function SegmentedTabs<T extends string>({ tabs, value, onChange, label }: SegmentedTabsProps<T>) {
  return (
    <div role="tablist" aria-label={label} className="flex p-1 rounded-full bg-seen-surface border border-seen-border">
      {tabs.map(t => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            onKeyDown={e => {
              const idx = tabs.findIndex(x => x.id === value);
              if (e.key === "ArrowRight") onChange(tabs[(idx + 1) % tabs.length].id);
              if (e.key === "ArrowLeft") onChange(tabs[(idx - 1 + tabs.length) % tabs.length].id);
            }}
            tabIndex={active ? 0 : -1}
            className={cx(
              "flex-1 min-h-11 px-2 min-[360px]:px-3 rounded-full text-[10px] min-[360px]:text-[11px] font-medium tracking-[0.06em] min-[360px]:tracking-[0.14em] uppercase transition-colors",
              active ? "bg-white text-black" : "text-white/55 hover:text-white",
            )}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top Bar with back — Figma 298:118 (Variant=WithBack) + 248:68 Back Button
// ---------------------------------------------------------------------------
export function TopBar({ title, onBack, action }: { title: string; onBack: () => void; action?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/70 border-b border-white/5">
      <div className="max-w-(--seen-content-max) mx-auto px-gutter h-14 flex items-center gap-3">
        <IconButton label="Back" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 text-white/80" />
        </IconButton>
        <h1 className="flex-1 min-w-0 truncate text-base font-semibold text-white">{title}</h1>
        {action}
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Section Header — Figma 248:71
// ---------------------------------------------------------------------------
export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div className="min-w-0">
        <h2 className="text-xl font-semibold leading-[1.3] text-white">{title}</h2>
        {subtitle && <p className="text-xs leading-[1.4] tracking-[0.02em] text-seen-muted mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Metric Card — Figma 570:17
// ---------------------------------------------------------------------------
export function MetricCard({ label, value, hint, className }: { label: string; value: string | number; hint?: string; className?: string }) {
  return (
    <div className={cx("flex flex-col justify-between min-h-[96px] min-w-0 rounded-seen-md border border-seen-border bg-seen-surface p-3 min-[360px]:p-4", className)}>
      <span className="text-[10px] tracking-[0.08em] min-[360px]:tracking-[0.14em] uppercase text-seen-muted">{label}</span>
      <span className="text-xl min-[360px]:text-2xl font-light text-white mt-2 break-words">{value}</span>
      {hint && <span className="text-xs text-seen-secondary mt-1">{hint}</span>}
    </div>
  );
}

/** Tab and page title (Figma Heading 1: Fraunces 34 / 1.16 / -0.5). One h1 per screen. */
export function PageTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h1 className={cx("font-seen-display text-[34px] font-normal leading-[1.16] tracking-[-0.5px] text-white break-words", className)}>{children}</h1>;
}

/** Page container shared by feature screens so every screen uses the same column + gutters. */
export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cx("max-w-(--seen-content-max) mx-auto px-gutter pt-5 pb-28", className)}>{children}</main>;
}
