import { useState } from "react";
import { pushNotification } from "../services";
import { motion, AnimatePresence } from "motion/react";
import { X, CreditCard, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useStoryState } from "../contexts/StoryStateContext";
import { formatCents } from "../data/monetizationTypes";
import { processPayment } from "../data/paymentService";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  amount: number; // USD cents
  onSuccess: (last4: string) => void;
}

type CheckoutStep = "form" | "processing" | "success" | "error";

export function CheckoutModal({ isOpen, onClose, title, description, amount, onSuccess }: CheckoutModalProps) {
  const { state } = useStoryState();
  const lang = state.language;
  const [step, setStep] = useState<CheckoutStep>("form");
  const [errorMessage, setErrorMessage] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("123");
  const [name, setName] = useState("");

  const t = (en: string, fr: string, es: string) => (lang === "en" ? en : lang === "fr" ? fr : es);

  const handlePay = async () => {
    setStep("processing");
    const result = await processPayment({
      amount,
      cardNumber,
      cardExpiry: expiry,
      cardCvc: cvc,
      cardholderName: name || "Demo User",
    });

    if (result.success) {
      setStep("success");
      pushNotification({
        type: "money",
        title: "Payment confirmed",
        body: `${title}: demo payment of ${formatCents(amount)} accepted with test card •••• ${result.last4}. Nobody was charged.`,
      });
      setTimeout(() => {
        onSuccess(result.last4);
        reset();
      }, 900);
    } else {
      setErrorMessage(result.errorMessage || "Payment failed.");
      setStep("error");
    }
  };

  const reset = () => {
    setStep("form");
    setErrorMessage("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={step === "form" || step === "error" ? handleClose : undefined}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[70] bg-black border-t border-white/10 rounded-t-3xl max-w-(--seen-content-max) mx-auto overflow-hidden"
          >
            <div className="p-6 pb-8 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-center pt-1 pb-4">
                <div className="w-12 h-1 rounded-full bg-white/20" />
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-green-400" />
                  <span className="text-xs tracking-wider uppercase text-white/55">
                    {t("Secure Checkout", "Paiement Sécurisé", "Pago Seguro")}
                  </span>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
                  aria-label={t("Close", "Fermer", "Cerrar")}
                >
                  <X className="w-4 h-4 text-white/70" />
                </button>
              </div>

              {step === "form" && (
                <>
                  <h3 className="text-lg text-white mb-1">{title}</h3>
                  <p className="text-sm text-white/55 mb-6">{description}</p>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 flex items-center justify-between">
                    <span className="text-sm text-white/60">{t("Total", "Total", "Total")}</span>
                    <span className="text-xl text-white font-semibold">{formatCents(amount)}</span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-xs text-white/55 mb-1.5 block">
                        {t("Cardholder name", "Nom du titulaire", "Nombre del titular")}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/55 mb-1.5 block">
                        {t("Card number", "Numéro de carte", "Número de tarjeta")}
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/55" />
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          placeholder="4242 4242 4242 4242"
                          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-white/55 mb-1.5 block">
                          {t("Expiry", "Expiration", "Vencimiento")}
                        </label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={e => setExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-white/55 mb-1.5 block">CVC</label>
                        <input
                          type="text"
                          value={cvc}
                          onChange={e => setCvc(e.target.value)}
                          placeholder="123"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-white/55 mb-4 leading-relaxed">
                    {t(
                      "Demo mode: no real charge occurs. Use the pre-filled test card, or 4000 0000 0000 0002 to preview a declined payment.",
                      "Mode démo : aucun débit réel n'a lieu. Utilisez la carte de test préremplie, ou 4000 0000 0000 0002 pour un refus.",
                      "Modo demo: no se realiza ningún cargo real. Usa la tarjeta de prueba precargada, o 4000 0000 0000 0002 para un rechazo."
                    )}
                  </p>

                  <button
                    onClick={handlePay}
                    className="w-full py-4 rounded-xl bg-white text-black font-medium flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    {t("Pay", "Payer", "Pagar")} {formatCents(amount)}
                  </button>
                </>
              )}

              {step === "processing" && (
                <div className="py-12 flex flex-col items-center text-center">
                  <Loader2 className="w-10 h-10 text-white/60 animate-spin mb-4" />
                  <p className="text-sm text-white/60">
                    {t("Processing payment…", "Traitement du paiement…", "Procesando el pago…")}
                  </p>
                </div>
              )}

              {step === "success" && (
                <div className="py-12 flex flex-col items-center text-center">
                  <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                    <CheckCircle2 className="w-14 h-14 text-green-400 mb-4" />
                  </motion.div>
                  <p className="text-base text-white mb-1">{t("Payment successful", "Paiement réussi", "Pago exitoso")}</p>
                  <p className="text-sm text-white/55">{formatCents(amount)} {t("charged", "débité", "cobrado")}</p>
                </div>
              )}

              {step === "error" && (
                <div className="py-8 flex flex-col items-center text-center">
                  <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                  <p className="text-base text-white mb-1">{t("Payment failed", "Échec du paiement", "Pago fallido")}</p>
                  <p className="text-sm text-white/55 mb-6">{errorMessage}</p>
                  <button
                    onClick={reset}
                    className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20"
                  >
                    {t("Try again", "Réessayer", "Intentar de nuevo")}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
