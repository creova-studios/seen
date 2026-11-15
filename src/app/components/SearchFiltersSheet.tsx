import { Chip, Button } from "./seen/primitives";
import { Sheet } from "./seen/overlays";
import { useT } from "../i18n/useT";
import type { StringKey } from "../i18n/strings";
import { emptyFilters, type LengthBucket, type SearchFilters } from "../data/searchFilters";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: SearchFilters;
  onChange: (f: SearchFilters) => void;
  facets: { languages: string[]; themes: string[]; lengths: LengthBucket[] };
  /** Live count of results with the current filters. */
  count: number;
}

const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter(x => x !== v) : [...list, v]);

/** Filters over real facets only. Changes apply live; the footer button just closes with the count. */
export function SearchFiltersSheet({ open, onOpenChange, filters, onChange, facets, count }: Props) {
  const t = useT();
  const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="mb-5" aria-label={title}>
      <h3 className="text-[13px] font-medium text-seen-secondary mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">{children}</div>
    </section>
  );
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={t("search.filters")}
      footer={
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => onChange(emptyFilters())}>{t("search.reset")}</Button>
          <Button fullWidth disabled={count === 0} onClick={() => onOpenChange(false)}>
            {count === 0 ? t("search.show0") : count === 1 ? t("search.show1") : t("search.show", { n: String(count) })}
          </Button>
        </div>
      }
    >
      {facets.languages.length > 0 && (
        <Group title={t("search.language")}>
          {facets.languages.map(l => (
            <Chip key={l} selected={filters.languages.includes(l)} onClick={() => onChange({ ...filters, languages: toggle(filters.languages, l) })}>
              {t(`search.lang.${l}` as StringKey)}
            </Chip>
          ))}
        </Group>
      )}
      {facets.lengths.length > 0 && (
        <Group title={t("search.length")}>
          {facets.lengths.map(b => (
            <Chip key={b} selected={filters.length === b} onClick={() => onChange({ ...filters, length: filters.length === b ? null : b })}>
              {t(`search.len.${b}` as StringKey)}
            </Chip>
          ))}
        </Group>
      )}
      {facets.themes.length > 0 && (
        <Group title={t("search.theme")}>
          {facets.themes.map(th => (
            <Chip key={th} selected={filters.themes.includes(th)} onClick={() => onChange({ ...filters, themes: toggle(filters.themes, th) })}>
              {th}
            </Chip>
          ))}
        </Group>
      )}
    </Sheet>
  );
}
