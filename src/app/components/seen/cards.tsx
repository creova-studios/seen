/**
 * Content organisms from the Figma design system, recomposed in the live
 * app's visual language. All cards share one layout contract so rows and
 * grids align regardless of content length:
 *   - media area has a fixed aspect ratio
 *   - titles are clamped with reserved height (min-h for 2 lines)
 *   - metadata sits at the bottom via flex `mt-auto`
 *   - the whole card is a single button (no nested click targets)
 */
import type { ReactNode } from "react";
import { Bell, BookOpen, Coins, HandCoins, ShieldCheck, Bookmark, BookmarkCheck, ChevronRight } from "lucide-react";
import { getStoryWorldById, getLocalizedText, type Language } from "../../data/storyDatabase";
import type { Collection, Creator, FundingOpportunity, SeenNotification, ApplicationStatus } from "../../services/contracts";
import { formatAmount, formatStatus, opportunityStatus } from "../../services/funding";
import { Avatar, Badge } from "./primitives";
import { SeenImage } from "./SeenImage";

const cardBase =
  "group w-full h-full text-left flex flex-col rounded-seen-lg border border-seen-border bg-seen-surface overflow-hidden transition-colors hover:border-white/20 focus-visible:border-white/40";

/** A creator's banner image: the cover of their first catalogue story, if they have one. */
export function creatorCover(creator: Creator): string | undefined {
  for (const id of creator.storyIds) {
    const cover = getStoryWorldById(id)?.coverImage;
    if (cover) return cover;
  }
  return undefined;
}

// ------------------------------------------------------------ Creator Card (570:3)
export function CreatorCard({
  creator,
  following,
  onOpen,
}: {
  creator: Creator;
  following?: boolean;
  onOpen: (id: string) => void;
}) {
  return (
    <button type="button" data-testid="creator-card" onClick={() => onOpen(creator.id)} className={cardBase}>
      {/* The creator's own work as the banner: the first story's cover, softened into the card. */}
      <div className="relative h-20 w-full overflow-hidden">
        <SeenImage src={creatorCover(creator)} alt="" decorative seed={creator.id} className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-seen-surface via-seen-surface/30 to-transparent" />
        <div aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-seen-accent" />
        {following && (
          <span className="absolute top-3 right-2">
            <Badge tone="overImage">Following</Badge>
          </span>
        )}
      </div>
      <div className="relative -mt-6 flex flex-1 flex-col gap-2 px-4 pb-4">
        <Avatar name={creator.name} size="md" ring />
        <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 min-h-[2.5em] break-words hyphens-auto">{creator.name}</h3>
        <ul aria-label="Themes" className="flex flex-wrap content-start gap-1 h-[3.25rem] overflow-hidden">
          {creator.themes.slice(0, 2).map(theme => (
            <li key={theme} className="max-w-full truncate rounded-full border border-seen-accent/30 bg-seen-accent/10 px-2 py-0.5 text-[11px] leading-snug text-seen-accent">
              {theme}
            </li>
          ))}
        </ul>
        <span className="mt-auto text-[10px] tracking-[0.14em] uppercase text-seen-accent">
          {creator.storyIds.length} {creator.storyIds.length === 1 ? "story" : "stories"}
        </span>
      </div>
    </button>
  );
}

// --------------------------------------------------------- Collection Card (570:5)
export function CollectionCard({
  collection,
  language,
  saved,
  onOpen,
}: {
  collection: Collection;
  language: Language;
  saved?: boolean;
  onOpen: (id: string) => void;
}) {
  const cover = getStoryWorldById(collection.coverStoryId);
  return (
    <button type="button" data-testid="collection-card" onClick={() => onOpen(collection.id)} className={cardBase}>
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <SeenImage
          src={cover?.coverImage}
          alt={cover ? getLocalizedText(cover.title, language) : collection.title}
          seed={collection.id}
          decorative
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge tone="overImage">
            {collection.kind === "institutional" ? "Institutional" : "Collection"}
          </Badge>
        </div>
        {saved && (
          <span className="absolute top-3 right-3" aria-label="Saved">
            <BookmarkCheck className="w-4 h-4 text-white" aria-hidden />
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4 gap-1">
        <h3 className="text-base font-light text-white leading-snug line-clamp-2 min-h-[2.75em]">{collection.title}</h3>
        <p className="mt-auto text-[10px] tracking-[0.14em] uppercase text-seen-muted">
          {collection.storyIds.length} stories · {collection.curator}
        </p>
      </div>
    </button>
  );
}

// -------------------------------------------------------- Opportunity Card (570:7)
const STATUS_LABEL: Record<ApplicationStatus, string | null> = {
  none: null,
  saved: "Saved",
  "in-progress": "In progress",
  applied: "Applied",
};

export function OpportunityCard({
  opportunity,
  status = "none",
  onOpen,
  now,
}: {
  opportunity: FundingOpportunity;
  status?: ApplicationStatus;
  onOpen: (id: string) => void;
  now?: Date;
}) {
  const state = opportunityStatus(opportunity, now);
  const tone =
    state === "closed" || state === "tba"
      ? "text-seen-muted"
      : state === "closing-soon"
        ? "text-seen-warning"
        : state === "upcoming"
          ? "text-seen-info"
          : state === "rolling"
            ? "text-seen-success"
            : "text-seen-secondary";
  return (
    <button type="button" data-testid="opportunity-card" data-status={state} onClick={() => onOpen(opportunity.id)} className={`${cardBase} p-4 gap-3`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="gold">{opportunity.type}</Badge>
          <Badge tone="surface">{opportunity.region}</Badge>
          {opportunity.isDemo && <Badge tone="surface">Demo listing</Badge>}
        </div>
        {STATUS_LABEL[status] && <Badge tone={status === "applied" ? "mint" : "purple"}>{STATUS_LABEL[status]}</Badge>}
      </div>
      <div>
        <h3 className="text-base font-semibold text-white leading-snug line-clamp-2">{opportunity.title}</h3>
        <p className="text-xs text-seen-secondary mt-1">{opportunity.funder}</p>
      </div>
      <div className="mt-auto flex flex-col items-start gap-1 min-[360px]:flex-row min-[360px]:items-end min-[360px]:justify-between min-[360px]:gap-3 pt-2 border-t border-white/5">
        <span className="text-sm text-seen-funding min-w-0">{formatAmount(opportunity)}</span>
        <span className={`text-xs text-left min-[360px]:text-right min-w-0 max-w-full break-words ${tone}`}>{formatStatus(opportunity, now)}</span>
      </div>
    </button>
  );
}

// ------------------------------------------------------ Notification Item (363:160)
const NOTIFICATION_ICON: Record<SeenNotification["type"], ReactNode> = {
  story: <BookOpen className="w-4 h-4 text-seen-story" aria-hidden />,
  funding: <HandCoins className="w-4 h-4 text-seen-funding" aria-hidden />,
  money: <Coins className="w-4 h-4 text-seen-success" aria-hidden />,
  moderation: <ShieldCheck className="w-4 h-4 text-seen-accent" aria-hidden />,
};

export function relativeTime(iso: string, now: Date = new Date()): string {
  const mins = Math.round((now.getTime() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

export function NotificationItem({ notification, onOpen }: { notification: SeenNotification; onOpen: (n: SeenNotification) => void }) {
  return (
    <button
      type="button"
      data-testid="notification-item"
      data-read={notification.read}
      onClick={() => onOpen(notification)}
      className="w-full text-left flex gap-3 px-4 py-4 rounded-seen-md border border-seen-border bg-seen-surface hover:border-white/20 transition-colors"
    >
      <span className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
        {NOTIFICATION_ICON[notification.type] ?? <Bell className="w-4 h-4" aria-hidden />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className={`text-sm ${notification.read ? "text-white/70" : "text-white font-semibold"}`}>{notification.title}</span>
          {!notification.read && <span className="w-2 h-2 rounded-full bg-seen-accent" aria-label="Unread" />}
        </span>
        <span className="block text-xs text-seen-secondary mt-1 leading-relaxed">{notification.body}</span>
        <span className="block text-[10px] tracking-[0.12em] uppercase text-seen-muted mt-2">{relativeTime(notification.createdAt)}</span>
      </span>
      {notification.target && <ChevronRight className="w-4 h-4 text-white/55 self-center flex-shrink-0" aria-hidden />}
    </button>
  );
}

// ------------------------------------------------------------- Save toggle
export function SaveToggle({ saved, onToggle, label, busy }: { saved: boolean; onToggle: () => void; label: string; busy?: boolean }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={busy}
      aria-pressed={saved}
      className="inline-flex items-center gap-2 min-h-11 px-5 rounded-full border border-white/15 text-[11px] tracking-[0.14em] uppercase text-white/80 hover:bg-white/5 disabled:opacity-50"
    >
      {saved ? <BookmarkCheck className="w-4 h-4" aria-hidden /> : <Bookmark className="w-4 h-4" aria-hidden />}
      {saved ? `Saved` : label}
    </button>
  );
}
