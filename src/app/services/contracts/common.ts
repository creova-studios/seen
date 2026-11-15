export type ISODate = string;

/** Typed failure shared by every adapter. `conflict` and `rate_limited` are added for writes. */
export type ServiceErrorCode = "not_found" | "offline" | "unavailable" | "forbidden" | "invalid" | "conflict" | "rate_limited";
