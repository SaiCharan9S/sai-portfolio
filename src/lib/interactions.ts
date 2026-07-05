/**
 * Reusable className fragments for tappable surfaces on mobile.
 *
 * - `interactive` adds an active/pressed scale and visible focus ring so
 *   touch users get press feedback and keyboard users see focus. Apply via
 *   `cn(existingClasses, interactive)` next to existing `hover:*` classes.
 * - `interactiveSubtle` is the press feedback variant for cards that already
 *   have a hover lift (avoids the double-transform).
 */
export const interactive =
  "active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const interactiveSubtle =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
