import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { useAuth, SELF_ASSIGNABLE_ROLES } from "../contexts/AuthContext";
import { PasswordField, TextField } from "./seen/forms";
import { Banner, Button } from "./seen/primitives";
import { localizeError } from "../i18n/strings";
import { useT } from "../i18n/useT";
import { useStoryState } from "../contexts/StoryStateContext";
import type { UserRole, UserIntent, Language } from "../contexts/StoryStateContext";
import { LanguageSelectionScreen } from "./LanguageSelectionScreen";
import { OnboardingPurpose } from "./OnboardingPurpose";
import { FirstScreenBackdrop } from "./FirstScreenBackdrop";
import { PurposeStep, InterestsStep, roleAndIntentFor, type Purpose } from "./OnboardingOrientation";

/**
 * ONBOARDING SYSTEM
 * SEEN by CREOVA
 *
 * Six screens (was nine). Each earns its place:
 * 0. Language: drives every string; required before anything else.
 * 0b. Invocation: the first screen with the glowing S.E.E.N button. PROTECTED:
 *    never remove or merge it (owner decision; an e2e test guards it).
 * 0c. Manifesto ("This is not social media", OnboardingPurpose.tsx). PROTECTED likewise.
 * 1. Purpose: "What brings you to SEEN?" (tap, multi-select). Sets role and intent.
 * 2. Interests: topics from the real catalogue (tap, optional). Feeds For You.
 * 3. Account: needed to save progress.
 * Then straight into For You. Accessibility and experience preferences live in
 * Settings; creator-specific questions are asked when someone starts a story.
 * See docs/product/ONBOARDING_DECISION_MATRIX.md.
 */

interface OnboardingSystemProps {
  onComplete: (data: {
    role: UserRole;
    intent: UserIntent;
  }) => void;
  initialStep?: number;
  /** True once the first screen (the glowing S.E.E.N entry button) has been passed. */
  hasEnteredSEEN?: boolean;
  /** "Explore without an account": leave onboarding as a guest (limited guest mode, D2). */
  onGuest?: () => void;
}

type OnboardingLayer = "language" | "invocation" | "manifesto" | "orientation";
type OrientationStep = "purpose" | "interests" | "account" | "entering";
const ORIENTATION_STEPS: OrientationStep[] = ["purpose", "interests", "account"];

export function OnboardingSystem({ onComplete, initialStep = 0, hasEnteredSEEN = false, onGuest }: OnboardingSystemProps) {
  const { signUp, signIn, state: authState } = useAuth();
  const { state, setLanguage, setInterests } = useStoryState();

  const [currentLayer, setCurrentLayer] = useState<OnboardingLayer>(!state.language ? "language" : !hasEnteredSEEN ? "invocation" : "orientation");
  // Choices live in memory, so a reload can only safely resume before the account step.
  const [currentStep, setCurrentStep] = useState<OrientationStep>(ORIENTATION_STEPS[Math.min(Math.max(initialStep, 0), 1)] ?? "purpose");
  const [purposes, setPurposes] = useState<Purpose[]>([]);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const { role: wantedRole, intent: selectedIntent } = roleAndIntentFor(purposes);

  useEffect(() => {
    if (currentLayer === "orientation" && currentStep !== "entering") {
      localStorage.setItem("onboarding_step", String(ORIENTATION_STEPS.indexOf(currentStep)));
    }
  }, [currentLayer, currentStep]);

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setCurrentLayer("invocation");
  };

  const handleInvocationComplete = () => setCurrentLayer("manifesto");

  const handleManifestoComplete = () => {
    localStorage.setItem("hasEnteredSEEN", "true");
    setCurrentLayer("orientation");
    setCurrentStep("purpose");
  };

  const handleAccountCreate = async (email: string, password: string, name: string) => {
    setIsCreatingAccount(true);
    setAccountError(null);
    try {
      await signUp(email, password, name, SELF_ASSIGNABLE_ROLES.includes(wantedRole) ? wantedRole : "viewer", state.language, selectedIntent);
      setCurrentStep("entering");
    } catch (error) {
      console.error("Error creating account:", error);
      setAccountError(error instanceof Error ? error.message : "Failed to create account");
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setIsCreatingAccount(true);
    setAccountError(null);
    try {
      await signIn(email, password);
      setCurrentStep("entering");
    } catch (error) {
      console.error("Error signing in:", error);
      setAccountError(error instanceof Error ? error.message : "Failed to sign in");
    } finally {
      setIsCreatingAccount(false);
    }
  };

  // Password reset email is not available: nothing is sent, and /reset-password
  // is not a route. Tell the user that instead of claiming a recovery link was sent.
  const handlePasswordRecovery = async (_email: string) => {
    return "Password reset isn't available yet. Contact support.";
  };

  // Once the account exists and its record has loaded, hand over to the app.
  // The stored account is authoritative: the role asked for here is only a request.
  useEffect(() => {
    if (currentStep !== "entering" || !authState.user) return;
    const role = authState.user.role ?? "viewer";
    const intent = authState.user.intent ?? selectedIntent;
    localStorage.setItem("onboarding_completed", "true");
    localStorage.removeItem("onboarding_step");
    onComplete({ role, intent });
  }, [currentStep, authState.user]); // eslint-disable-line react-hooks/exhaustive-deps

  const back = currentStep === "interests" ? () => setCurrentStep("purpose") : currentStep === "account" ? () => setCurrentStep("interests") : null;
  const stepNumber = Math.max(0, ORIENTATION_STEPS.indexOf(currentStep)) + 1;

  return (
    <div className="min-h-dvh bg-black">
      <AnimatePresence mode="wait">
        {currentLayer === "language" && <LanguageSelectionScreen key="language" onSelectLanguage={handleLanguageSelect} />}

        {currentLayer === "invocation" && <InvocationLayer key="invocation" onComplete={handleInvocationComplete} />}

        {currentLayer === "manifesto" && <OnboardingPurpose key="manifesto" onNext={handleManifestoComplete} />}

        {currentLayer === "orientation" && currentStep !== "entering" && (
          <motion.div key="orientation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="min-h-dvh flex flex-col">
            <header className="px-gutter pt-[max(1rem,env(safe-area-inset-top))] flex items-center gap-3 min-h-14">
              {back ? (
                <button type="button" onClick={back} aria-label="Back" className="-ml-2 w-11 h-11 rounded-full flex items-center justify-center text-white/80 hover:bg-white/5">
                  <ArrowLeft className="w-5 h-5" aria-hidden />
                </button>
              ) : (
                <span className="w-11 h-11" aria-hidden />
              )}
              <p className="text-xs text-white/70 tabular-nums" aria-live="polite">
                Step {stepNumber} of {ORIENTATION_STEPS.length}
              </p>
            </header>
            {currentStep === "purpose" && (
              <PurposeStep
                key="purpose"
                selected={purposes}
                onChange={setPurposes}
                onNext={() => setCurrentStep("interests")}
                onGuest={onGuest}
              />
            )}
            {currentStep === "interests" && (
              <InterestsStep
                key="interests"
                selected={state.interests ?? []}
                onChange={setInterests}
                onNext={() => setCurrentStep("account")}
              />
            )}
            {currentStep === "account" && (
              <div className="flex-1 flex items-center justify-center">
                <AccountStep
                  key="account"
                  onComplete={handleAccountCreate}
                  onSignIn={handleSignIn}
                  onRecover={handlePasswordRecovery}
                  isLoading={isCreatingAccount}
                  error={accountError}
                />
              </div>
            )}
          </motion.div>
        )}

        {currentStep === "entering" && (
          <motion.div key="entering" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-dvh flex items-center justify-center" role="status">
            <p className="text-white/70 text-sm">Opening SEEN…</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Step 3: Account Creation (also the sign-in form behind the guest sheet)
export function AccountStep({ 
  onComplete, 
  onSignIn,
  onRecover,
  isLoading, 
  error,
  initialMode,
}: { 
  initialMode?: 'signup' | 'signin';
  onComplete: (email: string, password: string, name: string) => void; 
  onSignIn: (email: string, password: string) => void;
  onRecover: (email: string) => Promise<string | null>;
  isLoading: boolean; 
  error: string | null;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { state: authState, signInWithGoogle } = useAuth();
  const { state: story } = useStoryState();
  const [mode, setMode] = useState<'signup' | 'signin' | 'recovery'>(initialMode ?? (authState.sessionExpired ? 'signin' : 'signup'));
  const [online, setOnline] = useState(typeof navigator === 'undefined' ? true : navigator.onLine);
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener('online', up);
    window.addEventListener('offline', down);
    return () => {
      window.removeEventListener('online', up);
      window.removeEventListener('offline', down);
    };
  }, []);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const showSignInSuggestion = (error || localError) && (
    (error || localError || '').includes('exists. Sign in') || 
    (error || localError || '').includes('already been registered')
  );
  
  // Password validation state
  const passwordValidation = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
  
  const isPasswordValid = Object.values(passwordValidation).every(v => v);

  const handleSubmit = () => {
    if (mode === 'signup') {
      // Client-side validation before submitting
      if (!isPasswordValid) {
        setLocalError('Please ensure your password meets all requirements');
        return;
      }
      setLocalError(null); // Clear local error before submitting
      onComplete(email, password, name);
    } else if (mode === 'signin') {
      setLocalError(null);
      onSignIn(email, password);
    } else if (mode === 'recovery') {
      setLocalError(null);
      onRecover(recoveryEmail).then((message) => {
        if (message) setRecoveryMessage(message);
      });
    }
  };

  // Determine if form is valid
  const isFormValid = () => {
    if (mode === 'signup') {
      return email && name && password && isPasswordValid;
    } else if (mode === 'signin') {
      return email && password;
    } else if (mode === 'recovery') {
      return recoveryEmail;
    }
    return false;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-center max-w-md px-6 w-full"
    >
      <AnimatePresence mode="wait">
        <motion.h2 
          key={mode}
          className="text-xl leading-relaxed text-white/80 mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.6 }}
        >
          {mode === 'signup' && 'Create your account'}
          {mode === 'signin' && 'Welcome back'}
          {mode === 'recovery' && 'Reset your password'}
        </motion.h2>
      </AnimatePresence>
      
      {authState.sessionExpired && mode === 'signin' && (
        <Banner tone="warning" className="mb-4 text-left">
          Your session expired. Sign in again to pick up where you left off.
        </Banner>
      )}
      {!online && (
        <Banner tone="warning" className="mb-4 text-left">
          You're offline. Reconnect to sign in or create an account.
        </Banner>
      )}

      {signInWithGoogle && mode !== 'recovery' && (
        <div className="mb-4">
          <Button
            variant="secondary"
            fullWidth
            disabled={!online}
            onClick={() => signInWithGoogle().catch(() => setLocalError("Couldn't start Google sign-in. Try again."))}
          >
            Continue with Google
          </Button>
          <p className="text-center text-xs text-white/55 mt-3">or use your email</p>
        </div>
      )}

      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <AnimatePresence mode="wait">
          {mode === 'recovery' ? (
            // Password Recovery Form
            <motion.div
              key="recovery-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <TextField
                label="Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="Email"
              />
              {recoveryMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  className="text-sm text-seen-secondary"
                >
                  {recoveryMessage}
                </motion.p>
              )}
            </motion.div>
          ) : (
            // Sign Up / Sign In Form
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {mode === 'signup' && (
                <TextField
                  label="Name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                />
              )}
              <TextField
                label="Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
              <PasswordField
                label="Password"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                aria-describedby={mode === 'signup' ? 'password-rules' : undefined}
              />
              {mode === 'signup' && (
                <ul id="password-rules" aria-label="Password requirements" aria-live="polite" className="text-xs space-y-1.5 text-left">
                  {([
                    ['length', 'At least 8 characters'],
                    ['uppercase', 'One uppercase letter'],
                    ['lowercase', 'One lowercase letter'],
                    ['number', 'One number'],
                  ] as const).map(([key, text]) => {
                    const ok = passwordValidation[key];
                    return (
                      <li key={key} className={`flex items-center gap-2 ${ok ? 'text-seen-success' : 'text-white/55'}`}>
                        <span aria-hidden>{ok ? '✓' : '○'}</span>
                        <span>{text}</span>
                        <span className="sr-only">{ok ? '(met)' : '(not met)'}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Messages */}
        {(error || localError) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <p role="alert" className="text-sm text-seen-error">
              {localizeError(error || localError || '', story.language)}
            </p>
            {showSignInSuggestion && (
              <button
                onClick={() => setMode('signin')}
                className="text-sm text-white/60 hover:text-white/90 underline underline-offset-2 transition-all duration-300"
              >
                Sign in instead
              </button>
            )}
          </motion.div>
        )}

        {/* Primary Action Button */}
        <motion.button
          onClick={handleSubmit}
          className="w-full py-5 text-sm tracking-wider uppercase text-white/90 hover:text-white border-t border-white/10 hover:border-white/20 transition-all duration-500 group disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/10"
          disabled={!isFormValid() || isLoading || !online}
          whileHover={{ y: !isFormValid() || isLoading ? 0 : -2 }}
          whileTap={{ scale: !isFormValid() || isLoading ? 1 : 0.98 }}
        >
          <span className="inline-flex items-center gap-2">
            {isLoading ? (
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Processing...
              </motion.span>
            ) : (
              <>
                {mode === 'signup' && 'Create Account'}
                {mode === 'signin' && 'Sign In'}
                {mode === 'recovery' && 'Contact support'}
              </>
            )}
          </span>
        </motion.button>
        
        {/* Mode Switching Links */}
        <div className="pt-6 space-y-2 border-t border-white/5">
          {mode === 'signin' && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => { setRecoveryMessage(""); setMode('recovery'); }}
              className="w-full min-h-11 py-2 text-xs text-white/55 hover:text-white/75 transition-all duration-300"
            >
              Forgot password?
            </motion.button>
          )}
          
          {mode === 'signup' ? (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setMode('signin')}
              className="w-full min-h-11 py-2 text-xs text-white/55 hover:text-white/75 transition-all duration-300"
            >
              Already have an account? Sign in
            </motion.button>
          ) : mode === 'signin' ? (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setMode('signup')}
              className="w-full min-h-11 py-2 text-xs text-white/55 hover:text-white/75 transition-all duration-300"
            >
              Need an account? Create one
            </motion.button>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => setMode('signin')}
              className="w-full min-h-11 py-2 text-xs text-white/55 hover:text-white/75 transition-all duration-300"
            >
              Back to sign in
            </motion.button>
          )}
        </div>

        {/* OAuth/Social Login Placeholder - Future Implementation */}
      </motion.div>
    </motion.div>
  );
}

/**
 * LAYER 0: INVOCATION
 * The emotional entry point - first thing user sees
 * Simple, grounding, no choices
 */
function InvocationLayer({ onComplete }: { onComplete: () => void }) {
  const t = useT();
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
      // Scrolls vertically so the button stays reachable at large text on short screens.
      className="fixed inset-0 bg-black overflow-y-auto overflow-x-hidden px-6"
    >
      <div className="min-h-full flex flex-col items-center justify-center py-10">
      <FirstScreenBackdrop reduce={!!reduce} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-md">
        {/* Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl tracking-tight text-white mb-2">
            SEEN
          </h1>
          <p className="text-xs tracking-[0.4em] uppercase text-white/70">
            by CREOVA
          </p>
        </motion.div>

        {/* Poetic tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1.5 }}
          className="text-base text-white/75 text-center leading-relaxed mb-16"
        >
          {t("onboard.tagline1")}
          <br />
          {t("onboard.tagline2")}
        </motion.p>

        {/* Primary invocation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1.2 }}
          className="text-lg text-white/80 text-center leading-relaxed mb-16"
        >
          {t("onboard.entering")}
        </motion.p>

        {/* Call to action */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.0, duration: 0.8 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="group relative px-10 py-3 text-sm font-bold tracking-[0.3em] uppercase text-white/95 transition-all duration-500"
          style={{
            background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.05) 100%)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            boxShadow: '0 4px 20px rgba(76, 175, 80, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
          }}
        >
          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(76, 175, 80, 0.3) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />
          
          {/* Subtle pulse animation */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={reduce ? { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)' } : {
              boxShadow: [
                '0 0 0 0 rgba(76, 175, 80, 0.4)',
                '0 0 0 8px rgba(76, 175, 80, 0)',
              ],
            }}
            transition={reduce ? { duration: 0 } : {
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            style={{ borderRadius: '2px' }}
          />
          
          {/* Button text with letter emphasis */}
          <span className="relative z-10 inline-flex items-center gap-[0.15em]">
            <span className="group-hover:text-white transition-colors duration-300">S</span>
            <span className="opacity-90 group-hover:opacity-100 group-hover:text-white transition-all duration-300">.</span>
            <span className="group-hover:text-white transition-colors duration-300">E</span>
            <span className="opacity-90 group-hover:opacity-100 group-hover:text-white transition-all duration-300">.</span>
            <span className="group-hover:text-white transition-colors duration-300">E</span>
            <span className="opacity-90 group-hover:opacity-100 group-hover:text-white transition-all duration-300">.</span>
            <span className="group-hover:text-white transition-colors duration-300">N</span>
          </span>
          
          {/* Focus indicator for accessibility */}
          <motion.div
            className="absolute inset-0 border-2 border-white/50 opacity-0 focus-visible:opacity-100 pointer-events-none"
            style={{ borderRadius: '2px' }}
          />
        </motion.button>
      </div>
      </div>
    </motion.div>
  );
}
