const key = (userId: string) => `seen.v1.creatorIntroSeen.${userId}`;

/** The "Become a creator" intro shows once per account (design decision 1A); creators and admins never see it. */
export function hasSeenCreatorIntro(userId: string | undefined): boolean {
  if (!userId) return true;
  try {
    return localStorage.getItem(key(userId)) === "true";
  } catch {
    return true; // storage unavailable: never trap someone in the intro
  }
}

export function markCreatorIntroSeen(userId: string | undefined) {
  if (!userId) return;
  try {
    localStorage.setItem(key(userId), "true");
  } catch {
    /* seen again next time at worst */
  }
}
