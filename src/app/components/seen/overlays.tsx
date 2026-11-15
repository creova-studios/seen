/**
 * Surfaces from the Figma design system: Dialog (570:15), Sheet (570:13),
 * Drawer (570:21), Tooltip (570:11). Built on Radix so focus trapping,
 * Escape to close, scroll lock and ARIA roles come for free.
 */
import { useEffect, useRef, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { X } from "lucide-react";
import { Button } from "./primitives";

const overlay = "fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0";

function CloseButton() {
  return (
    <DialogPrimitive.Close
      aria-label="Close"
      className="w-11 h-11 -mr-2 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/5"
    >
      <X className="w-4 h-4" aria-hidden />
    </DialogPrimitive.Close>
  );
}

/**
 * Returns focus to whatever opened a dialog, sheet or drawer when it closes
 * (or unmounts, for sheets that only mount while open). Without this, keyboard
 * and screen-reader users are dropped back at the top of the page.
 */
function useReturnFocus(open: boolean) {
  const opener = useRef<HTMLElement | null>(null);
  if (open && !opener.current && typeof document !== "undefined") {
    const el = document.activeElement;
    if (el instanceof HTMLElement && el !== document.body) opener.current = el;
  }
  const restore = () => {
    const el = opener.current;
    opener.current = null;
    if (el && el.isConnected) setTimeout(() => el.focus(), 0);
  };
  useEffect(() => {
    if (!open) restore();
  }, [open]);
  useEffect(() => restore, []);
}

// ------------------------------------------------------------------------ Dialog
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}

export function Dialog({ open, onOpenChange, title, description, children, footer }: DialogProps) {
  useReturnFocus(open);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={overlay} />
        <DialogPrimitive.Content
          className="fixed z-[61] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-40px)] max-w-[360px] rounded-seen-xl border border-seen-border bg-seen-elevated p-6 shadow-[var(--seen-elevation-2)] focus:outline-none"
        >
          <DialogPrimitive.Title className="text-lg font-semibold text-white">{title}</DialogPrimitive.Title>
          {description ? (
            <DialogPrimitive.Description className="text-sm text-seen-secondary mt-2 leading-relaxed">{description}</DialogPrimitive.Description>
          ) : (
            <DialogPrimitive.Description className="sr-only">{title}</DialogPrimitive.Description>
          )}
          {children && <div className="mt-4">{children}</div>}
          {footer && <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">{footer}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/** Destructive confirmation (Figma Dialog + Destructive button). */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  destructive = true,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  destructive?: boolean;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      footer={
        <>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant={destructive ? "destructive" : "primary"}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}

// ------------------------------------------------------------------ Sheet (bottom)
interface PanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Sheet({ open, onOpenChange, title, description, children, footer }: PanelProps) {
  useReturnFocus(open);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={overlay} />
        <DialogPrimitive.Content className="fixed z-[61] inset-x-0 bottom-0 mx-auto max-w-(--seen-content-max) max-h-[85vh] overflow-y-auto rounded-t-seen-xl border-t border-x border-seen-border bg-seen-elevated px-5 pt-3 pb-8 focus:outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom">
          <div aria-hidden className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
          <div className="flex items-center justify-between gap-4">
            <DialogPrimitive.Title className="text-base font-semibold text-white">{title}</DialogPrimitive.Title>
            <CloseButton />
          </div>
          <DialogPrimitive.Description className={description ? "text-sm text-seen-secondary mt-1" : "sr-only"}>
            {description ?? title}
          </DialogPrimitive.Description>
          <div className="mt-4">{children}</div>
          {footer && <div className="mt-6">{footer}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ------------------------------------------------------------------ Drawer (side)
export function Drawer({ open, onOpenChange, title, description, children, footer }: PanelProps) {
  useReturnFocus(open);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={overlay} />
        <DialogPrimitive.Content className="fixed z-[61] inset-y-0 right-0 w-[min(380px,88vw)] flex flex-col border-l border-seen-border bg-seen-elevated focus:outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-right">
          <div className="flex items-center justify-between gap-4 px-5 h-14 border-b border-white/5">
            <DialogPrimitive.Title className="text-base font-semibold text-white">{title}</DialogPrimitive.Title>
            <CloseButton />
          </div>
          <DialogPrimitive.Description className={description ? "px-5 pt-3 text-sm text-seen-secondary" : "sr-only"}>
            {description ?? title}
          </DialogPrimitive.Description>
          <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {footer && <div className="px-5 py-4 border-t border-white/5">{footer}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ------------------------------------------------------------------------ Tooltip
export function TooltipProvider({ children }: { children: ReactNode }) {
  return <TooltipPrimitive.Provider delayDuration={400}>{children}</TooltipPrimitive.Provider>;
}

/** Visual hint for icon-only controls. The control must still carry its own aria-label. */
export function Tooltip({ content, children }: { content: string; children: ReactNode }) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="bottom"
          sideOffset={6}
          aria-hidden
          className="z-[70] rounded-seen-sm border border-seen-border bg-seen-elevated px-2.5 py-1.5 text-xs text-white shadow-[var(--seen-elevation-2)]"
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
