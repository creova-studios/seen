import type { ReactNode } from "react";
import { isOffline, type ResourceState } from "../../hooks/useResource";
import { ServiceError } from "../../services/runtime";
import { Banner, SkeletonList, StateTemplate } from "./primitives";

/**
 * Renders the standard async states for a resource (docs/ux STATE_COVERAGE):
 * loading → skeleton, error → actionable error/offline template with retry,
 * empty → caller-provided empty state, ready → children. When a refresh fails
 * but stale data exists, the stale data stays visible under a warning banner.
 */
interface ResourceViewProps<T> {
  resource: ResourceState<T> & { retry: () => void };
  isEmpty?: (data: T) => boolean;
  empty?: ReactNode;
  skeleton?: ReactNode;
  children: (data: T) => ReactNode;
  what: string; // e.g. "creators" → "Couldn't load creators"
}

export function ResourceView<T>({ resource, isEmpty, empty, skeleton, children, what }: ResourceViewProps<T>) {
  if (resource.status === "loading" && resource.data === undefined) {
    return <>{skeleton ?? <SkeletonList label={`Loading ${what}`} />}</>;
  }

  if (resource.status === "error") {
    const offline = isOffline(resource.error);
    const notFound = resource.error instanceof ServiceError && resource.error.code === "not_found";
    if (resource.data !== undefined) {
      return (
        <>
          <Banner tone="warning" className="mb-4">
            {offline ? "You're offline — showing what was loaded earlier." : `Couldn't refresh ${what}. Showing earlier results.`}{" "}
            <button type="button" onClick={resource.retry} className="underline underline-offset-2">
              Retry
            </button>
          </Banner>
          {children(resource.data)}
        </>
      );
    }
    if (notFound) {
      return <StateTemplate kind="empty" title="Not found" message={`This ${what} doesn't exist or is no longer available.`} />;
    }
    return offline ? (
      <StateTemplate
        kind="offline"
        title="You're offline"
        message="Check your connection. Anything you've already opened is still available."
        actionLabel="Try again"
        onAction={resource.retry}
      />
    ) : (
      <StateTemplate
        kind="error"
        title={`Couldn't load ${what}`}
        message="This is on our side, not yours. Try again in a moment."
        actionLabel="Try again"
        onAction={resource.retry}
      />
    );
  }

  const data = resource.data as T;
  if (isEmpty?.(data) && empty) return <>{empty}</>;
  return <>{children(data)}</>;
}
