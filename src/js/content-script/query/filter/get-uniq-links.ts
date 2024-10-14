function uniq<T, K>(items: T[], getKey: (item: T) => K): T[] {
  const keys = new Set<K>();
  return items.filter((item) => {
    const key = getKey(item);
    if (keys.has(key)) {
      return false;
    }
    keys.add(key);
    return true;
  });
}

export function getUniqLinks(links: HTMLAnchorElement[]): HTMLAnchorElement[] {
  return uniq(links, (link) => link.href);
}
