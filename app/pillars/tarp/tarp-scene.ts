export const assetRoot = "/pillars/research-conservation/tarp";

export const invaders = [
  {
    id: "rat-1",
    kind: "rat",
    x: 30,
    y: 44,
    width: 13,
    mirror: false,
    returns: "seedling",
    returnX: 32,
    returnY: 46,
  },
  {
    id: "rat-2",
    kind: "rat",
    x: 55,
    y: 36,
    width: 12,
    mirror: true,
    returns: "tern",
    returnX: 55,
    returnY: 28,
  },
  {
    id: "rat-3",
    kind: "rat",
    x: 75,
    y: 48,
    width: 13,
    mirror: false,
    returns: "booby",
    returnX: 76,
    returnY: 48,
  },
  {
    id: "ants-1",
    kind: "ants",
    x: 24,
    y: 60,
    width: 10,
    mirror: false,
    returns: "crab",
    returnX: 27,
    returnY: 63,
  },
  {
    id: "ants-2",
    kind: "ants",
    x: 45,
    y: 54,
    width: 10,
    mirror: false,
    returns: "ghostCrab",
    returnX: 45,
    returnY: 65,
  },
  {
    id: "ants-3",
    kind: "ants",
    x: 65,
    y: 60,
    width: 10,
    mirror: false,
    returns: "coconutCrab",
    returnX: 62,
    returnY: 58,
  },
] as const;

export type InvaderId = (typeof invaders)[number]["id"];

export const regrowth = [
  { x: 39, y: 36, width: 9, after: 2 },
  { x: 64, y: 42, width: 9, after: 2 },
  { x: 52, y: 58, width: 10, after: 3 },
  { x: 34, y: 61, width: 8, after: 4 },
  { x: 71, y: 55, width: 10, after: 4 },
  { x: 67, y: 34, width: 10, after: 5 },
  { x: 39, y: 48, width: 9, after: 6 },
  { x: 59, y: 48, width: 8, after: 6 },
] as const;

export function removeInvader(
  removed: readonly InvaderId[],
  id: InvaderId,
): InvaderId[] {
  return removed.includes(id) ? [...removed] : [...removed, id];
}

export function recoveryState(removed: readonly InvaderId[]) {
  const cleared = invaders.filter((item) => removed.includes(item.id));
  const rats = cleared.filter((item) => item.kind === "rat").length;
  const returning = [
    ...cleared.map((item) => ({
      id: item.id as string,
      species: item.returns,
      x: item.returnX,
      y: item.returnY,
    })),
    ...(rats === 3
      ? [{ id: "sooty-nest", species: "sootyTern" as const, x: 47, y: 43 }]
      : []),
  ];
  return {
    cleared,
    returning,
    rats,
    ants: cleared.filter((item) => item.kind === "ants").length,
    species: [...new Set(returning.map((item) => item.species))],
    complete: cleared.length === invaders.length,
  };
}
