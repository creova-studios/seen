import { Component, type ErrorInfo, type ReactNode } from "react";
import { fromHash } from "../navigation/routes";
import { reportError } from "../observability";
import { StateTemplate } from "./seen/primitives";

/**
 * Where a crashed screen can send the user. For You — and a blank hash, which
 * the app opens as For You — must not reload the same screen.
 */
export function crashEscape(hash: string): { actionLabel: string; target: string; continuation: string } {
  const path = hash.split("?")[0];
  const route = fromHash(path);
  const blank = path === "" || path === "#" || path === "#/";
  if (blank || route?.screen === "for-you") {
    return {
      actionLabel: "Open Explore",
      target: "#/explore",
      continuation: "Open Explore to keep going.",
    };
  }
  return {
    actionLabel: "Back to For You",
    target: "#/for-you",
    continuation: "Go back to For You to keep going.",
  };
}

export function leaveCrashedScreen(hash: string, location: { hash: string; reload: () => void }) {
  const escape = crashEscape(hash);
  location.hash = escape.target;
  location.reload();
}

/**
 * Last line of defence: a render crash anywhere shows a recoverable SEEN
 * error state (with a reference id testers can quote) instead of a blank page.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { errorId: string | null }> {
  state = { errorId: null as string | null };

  static getDerivedStateFromError() {
    return { errorId: "pending" };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ errorId: reportError(error, `render:${info.componentStack?.split("\n")[1]?.trim() ?? "unknown"}`) });
  }

  render() {
    if (!this.state.errorId) return this.props.children;
    const escape = crashEscape(typeof window === "undefined" ? "" : window.location.hash);
    return (
      <div className="min-h-dvh bg-black flex items-center justify-center px-5">
        <div className="max-w-(--seen-content-max) w-full">
          <StateTemplate
            kind="error"
            title="Something broke on this screen"
            message={`Your saved stories and progress are safe. ${escape.continuation} Reference: ${this.state.errorId}`}
            actionLabel={escape.actionLabel}
            onAction={() => leaveCrashedScreen(window.location.hash, window.location)}
          />
        </div>
      </div>
    );
  }
}
