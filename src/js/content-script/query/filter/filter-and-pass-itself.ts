export function filterAndPassItself(
  targetLink: HTMLAnchorElement,
  links: HTMLAnchorElement[],
  callbackfn: (value: HTMLAnchorElement) => boolean
): HTMLAnchorElement[] {
  return links.filter((link: HTMLAnchorElement): boolean => {
    if (link === targetLink) {
      return true;
    }

    return callbackfn(link);
  });
}
