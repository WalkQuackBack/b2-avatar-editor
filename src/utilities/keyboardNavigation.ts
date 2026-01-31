export type NavigationDirection = 'horizontal' | 'vertical' | 'both';

interface GridNavigationOptions {
  currentIndex: number;
  totalItems: number;
  columns?: number;
  direction?: NavigationDirection;
  loop?: boolean;
}

export function getNextIndex(
  key: string,
  { currentIndex, totalItems, columns = 1, direction = 'both', loop = false }: GridNavigationOptions
): number {
  let nextIndex = currentIndex;

  const isHorizontal = direction === 'horizontal' || direction === 'both';
  const isVertical = direction === 'vertical' || direction === 'both';

  switch (key) {
    case 'ArrowRight':
      if (isHorizontal) {
        nextIndex = currentIndex + 1;
        if (nextIndex >= totalItems) {
          nextIndex = loop ? 0 : currentIndex;
        }
      }
      break;
    case 'ArrowLeft':
      if (isHorizontal) {
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) {
          nextIndex = loop ? totalItems - 1 : currentIndex;
        }
      }
      break;
    case 'ArrowDown':
      if (isVertical) {
        nextIndex = currentIndex + columns;
        if (nextIndex >= totalItems) {
          nextIndex = loop ? currentIndex % columns : currentIndex;
        }
      }
      break;
    case 'ArrowUp':
      if (isVertical) {
        nextIndex = currentIndex - columns;
        if (nextIndex < 0) {
          nextIndex = loop ? (Math.floor((totalItems - 1) / columns) * columns) + currentIndex : currentIndex;
          if (nextIndex >= totalItems) nextIndex -= columns;
        }
      }
      break;
    case 'Home':
      nextIndex = 0;
      break;
    case 'End':
      nextIndex = totalItems - 1;
      break;
    default:
      return currentIndex;
  }

  return nextIndex;
}
