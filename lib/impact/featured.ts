import type { ImpactFeedItem } from "./types";

export function isFeaturedImpactItem(
  item: Pick<ImpactFeedItem, "isFeatured">,
) {
  return item.isFeatured;
}

export function shuffleImpactItems<T>(
  items: readonly T[],
  random: () => number = Math.random,
) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffledItems[index], shuffledItems[swapIndex]] = [
      shuffledItems[swapIndex],
      shuffledItems[index],
    ];
  }

  return shuffledItems;
}

export function getRandomizedFeaturedImpactItems(
  items: readonly ImpactFeedItem[],
  random: () => number = Math.random,
) {
  return shuffleImpactItems(items.filter(isFeaturedImpactItem), random);
}
