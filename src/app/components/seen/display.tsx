/**
 * Display organisms: Progress (296:30), List Item (302:75),
 * Subscription Card (570:19), Chapter Row (300:60).
 */
import type { ReactNode } from "react";
import { Check, ChevronRight, Lock, Pause, Play } from "lucide-react";
import { Badge, Button } from "./primitives";

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

// ------------------------------------------------------------------- Progress
export function LinearProgress({ value, max = 1, label, tone = "white" }: { value: number; max?: number; label: string; tone?: "white" | "funding" }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} className="h-1.5 rounded-full bg-white/10 overflow-hidden">
      <div className={cx("h-full transition-all", tone === "funding" ? "bg-seen-funding" : "bg-white")} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function CircularProgress({ value, size = 40, label }: { value: number; size?: number; label: string }) {
  const pct = Math.max(0, Math.min(100, value));
  const r = (size - 4) / 2;
  const c = 2 * Math.PI * r;
  return (
    <span role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)} className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={3} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} />
      </svg>
      <span aria-hidden className="absolute text-[10px] font-semibold text-white tabular-nums">
        {Math.round(pct)}
      </span>
    </span>
  );
}

// ------------------------------------------------------------------ List Item
interface ListItemProps {
  icon?: ReactNode;
  label: string;
  value?: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  trailing?: ReactNode;
}

export function ListItem({ icon, label, value, description, selected, onClick, trailing }: ListItemProps) {
  const body = (
    <>
      {icon && <span className="text-white/70 flex-shrink-0" aria-hidden>{icon}</span>}
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-sm text-white">{label}</span>
        {description && <span className="block text-xs text-seen-muted mt-0.5">{description}</span>}
      </span>
      {value && <span className="text-sm text-white/60 truncate max-w-[45%]">{value}</span>}
      {trailing ?? (onClick && <ChevronRight className="w-4 h-4 text-white/55 flex-shrink-0" aria-hidden />)}
    </>
  );
  const cls = cx(
    "w-full min-h-14 flex items-center gap-3 px-4 py-3 rounded-seen-md border transition-colors",
    selected ? "border-white/40 bg-white/10" : "border-seen-border bg-seen-surface",
    onClick && "hover:bg-white/5 active:bg-white/10",
  );
  return onClick ? (
    <button type="button" onClick={onClick} aria-current={selected || undefined} className={cls}>
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  );
}

// ---------------------------------------------------------- Subscription Card
interface SubscriptionCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  current?: boolean;
  highlight?: string;
  actionLabel?: string;
  onAction?: () => void;
  footnote?: string;
}

export function SubscriptionCard({ name, price, period, features, current, highlight, actionLabel, onAction, footnote }: SubscriptionCardProps) {
  return (
    <section
      aria-label={`${name} plan`}
      className={cx("flex flex-col rounded-seen-lg border p-5 bg-seen-surface", current ? "border-white/40" : "border-seen-border")}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-white">{name}</h3>
        {current ? <Badge tone="mint">Current plan</Badge> : highlight ? <Badge tone="gold">{highlight}</Badge> : null}
      </div>
      <p className="mt-3">
        <span className="text-3xl font-light text-white">{price}</span>
        <span className="text-sm text-seen-muted"> / {period}</span>
      </p>
      <ul className="mt-4 space-y-2 flex-1">
        {features.map(f => (
          <li key={f} className="flex gap-2 text-sm text-white/80">
            <Check className="w-4 h-4 text-seen-success flex-shrink-0 mt-0.5" aria-hidden />
            {f}
          </li>
        ))}
      </ul>
      {actionLabel && onAction && (
        <Button className="mt-5" fullWidth variant={current ? "secondary" : "primary"} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {footnote && <p className="text-xs text-seen-muted mt-3">{footnote}</p>}
    </section>
  );
}

// ---------------------------------------------------------------- Chapter Row
export type ChapterRowState = "available" | "playing" | "completed" | "locked";

interface ChapterRowProps {
  index: number;
  title: string;
  meta: string;
  state: ChapterRowState;
  onSelect?: () => void;
  lockedReason?: string;
}

export function ChapterRow({ index, title, meta, state, onSelect, lockedReason }: ChapterRowProps) {
  const locked = state === "locked";
  const icon =
    state === "completed" ? (
      <Check className="w-4 h-4 text-seen-success" aria-hidden />
    ) : state === "playing" ? (
      <Pause className="w-4 h-4 text-black" aria-hidden />
    ) : locked ? (
      <Lock className="w-4 h-4 text-white/55" aria-hidden />
    ) : (
      <Play className="w-4 h-4 text-white ml-0.5" aria-hidden />
    );
  const statusText = { available: "", playing: "Now reading", completed: "Completed", locked: lockedReason ?? "Locked" }[state];
  return (
    <button
      type="button"
      data-testid="chapter-row"
      data-state={state}
      onClick={locked ? undefined : onSelect}
      aria-disabled={locked || undefined}
      aria-current={state === "playing" ? "step" : undefined}
      className={cx(
        "w-full flex items-center gap-4 p-4 rounded-seen-md border text-left transition-colors",
        state === "playing" ? "border-white/40 bg-white/10" : "border-seen-border bg-seen-surface",
        locked ? "opacity-60 cursor-not-allowed" : "hover:border-white/20",
      )}
    >
      <span
        className={cx(
          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border",
          state === "playing" ? "bg-white border-white" : "bg-white/5 border-white/10",
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] tracking-[0.14em] uppercase text-seen-muted">Chapter {index}</span>
        <span className="block text-sm text-white font-medium mt-0.5 line-clamp-2">{title}</span>
        <span className="block text-xs text-seen-secondary mt-1">
          {meta}
          {statusText && <span className={state === "completed" ? "text-seen-success" : state === "playing" ? "text-white" : ""}> · {statusText}</span>}
        </span>
      </span>
    </button>
  );
}
