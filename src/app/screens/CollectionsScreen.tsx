import type { CollectionKind } from "../services";
import { useAppNav } from "../navigation/AppNav";
import { CollectionsPanel } from "./CollectionsPanel";
import { ScreenFrame } from "./ScreenFrame";

/** Standalone collections index (Profile → Institutional collections). */
export function CollectionsScreen({ kind }: { kind?: CollectionKind }) {
  const nav = useAppNav();
  return (
    <ScreenFrame title={kind === "institutional" ? "Institutional collections" : "Collections"} onBack={nav.back}>
      <CollectionsPanel initialKind={kind} />
    </ScreenFrame>
  );
}
