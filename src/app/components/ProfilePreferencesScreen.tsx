import { Info, MessageSquareText, Shield, UserCog } from "lucide-react";
import { useStoryState, type Language } from "../contexts/StoryStateContext";
import { useAppNav } from "../navigation/AppNav";
import { ScreenFrame } from "../screens/ScreenFrame";
import { RadioGroup, Toggle } from "./seen/forms";
import { ListItem } from "./seen/display";
import { SectionTitle } from "./seen/primitives";

interface ProfilePreferencesScreenProps {
  onBack: () => void;
}

const COPY = {
  en: {
    title: "Preferences",
    language: "Language",
    languageHint: "Changes the interface and the story text together, straight away.",
    a11y: "Accessibility",
    contrast: "High contrast",
    contrastHint: "Brighter secondary text and stronger borders",
    largeText: "Larger text",
    largeTextHint: "Increases text size across the app",
    motion: "Reduce motion",
    motionHint: "Turns off animations and transitions",
    privacy: "Privacy",
    privacyText:
      "Your preferences, library and follows are stored on this device. SEEN records anonymous usage events (like “story opened”) to improve the app — never your name, email, what you type into search, or payment details.",
    about: "About SEEN",
  },
  fr: {
    title: "Préférences",
    language: "Langue",
    languageHint: "Change l’interface et le texte des histoires en même temps, tout de suite.",
    a11y: "Accessibilité",
    contrast: "Contraste élevé",
    contrastHint: "Texte secondaire plus lumineux et bordures plus marquées",
    largeText: "Texte plus grand",
    largeTextHint: "Augmente la taille du texte dans toute l’application",
    motion: "Réduire les animations",
    motionHint: "Désactive les animations et transitions",
    privacy: "Confidentialité",
    privacyText:
      "Vos préférences, votre bibliothèque et vos abonnements sont stockés sur cet appareil. SEEN enregistre des événements d’utilisation anonymes (comme « histoire ouverte ») pour améliorer l’application — jamais votre nom, votre courriel, vos recherches ni vos informations de paiement.",
    about: "À propos de SEEN",
  },
  es: {
    title: "Preferencias",
    language: "Idioma",
    languageHint: "Cambia la interfaz y el texto de las historias a la vez, de inmediato.",
    a11y: "Accesibilidad",
    contrast: "Alto contraste",
    contrastHint: "Texto secundario más brillante y bordes más marcados",
    largeText: "Texto más grande",
    largeTextHint: "Aumenta el tamaño del texto en toda la app",
    motion: "Reducir movimiento",
    motionHint: "Desactiva animaciones y transiciones",
    privacy: "Privacidad",
    privacyText:
      "Tus preferencias, biblioteca y seguimientos se guardan en este dispositivo. SEEN registra eventos de uso anónimos (como «historia abierta») para mejorar la app — nunca tu nombre, correo, lo que buscas ni datos de pago.",
    about: "Acerca de SEEN",
  },
} as const;

/**
 * Settings. Every control here changes real, persisted state — the earlier
 * version had audio-quality buttons, an autoplay box and a privacy link that
 * did nothing; those were removed rather than left as decoration.
 */
export function ProfilePreferencesScreen({ onBack }: ProfilePreferencesScreenProps) {
  const { state, setLanguage, setAccessibilityPreferences } = useStoryState();
  const nav = useAppNav();
  const t = COPY[state.language] ?? COPY.en;
  const a11y = state.accessibilityPreferences;

  return (
    <ScreenFrame title={t.title} onBack={onBack}>
      <section className="mb-10">
        <SectionTitle title={t.language} />
        <RadioGroup<Language>
          label={t.language}
          hideLabel
          value={state.language}
          onChange={setLanguage}
          options={[
            { value: "en", label: "English" },
            { value: "fr", label: "Français", description: "French" },
            { value: "es", label: "Español", description: "Spanish" },
          ]}
        />
        <p className="text-xs text-seen-muted mt-2">{t.languageHint}</p>
      </section>

      <section className="mb-10">
        <SectionTitle title={t.a11y} />
        <div className="rounded-seen-md border border-seen-border bg-seen-surface px-4 divide-y divide-white/5">
          <div className="py-2">
            <Toggle checked={a11y.highContrast} onChange={v => setAccessibilityPreferences({ highContrast: v })} label={t.contrast} description={t.contrastHint} />
          </div>
          <div className="py-2">
            <Toggle checked={!!a11y.largeText} onChange={v => setAccessibilityPreferences({ largeText: v })} label={t.largeText} description={t.largeTextHint} />
          </div>
          <div className="py-2">
            <Toggle checked={a11y.reducedMotion} onChange={v => setAccessibilityPreferences({ reducedMotion: v })} label={t.motion} description={t.motionHint} />
          </div>
        </div>
      </section>

      <section className="mb-10">
        <SectionTitle title={t.privacy} />
        <div className="flex gap-3 rounded-seen-md border border-seen-border bg-seen-surface p-4">
          <Shield className="w-4 h-4 text-white/60 flex-shrink-0 mt-0.5" aria-hidden />
          <p className="text-xs text-seen-secondary leading-relaxed">{t.privacyText}</p>
        </div>
      </section>

      <div className="flex flex-col gap-3">
        <ListItem icon={<UserCog className="w-5 h-5" />} label="Account and privacy" description="Notifications, your data, sign out" onClick={() => nav.go("account")} />
        {(state.userRole === "creator" || state.userRole === "admin") && (
          <ListItem icon={<MessageSquareText className="w-5 h-5" />} label="Notes from readers" description="Private notes people sent you" onClick={() => nav.go("notes")} />
        )}
        <ListItem icon={<Info className="w-5 h-5" />} label={t.about} onClick={() => nav.go("about")} />
      </div>

      <p className="text-center text-xs text-seen-muted mt-10">SEEN · CREOVA</p>
    </ScreenFrame>
  );
}
