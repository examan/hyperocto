function uniq<T>(urls: T[]): T[] {
  return Array.from(new Set(urls));
}

export function getUniqLinks(links: HTMLAnchorElement[]): string[] {
  const urls = links.map(({ href }: HTMLAnchorElement): string => href);
  return uniq(urls);
}
