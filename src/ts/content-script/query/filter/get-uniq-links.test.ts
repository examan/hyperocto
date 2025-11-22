import { describe, it, expect, beforeEach } from "vitest";
import { getUniqLinks } from "./get-uniq-links";

describe("getUniqLinks", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should remove duplicate links by href", () => {
    document.body.innerHTML = `
      <a href="https://example.com/1" id="link1">Link 1</a>
      <a href="https://example.com/1" id="link2">Link 1 Duplicate</a>
      <a href="https://example.com/2" id="link3">Link 2</a>
    `;

    const links = Array.from(
      document.querySelectorAll("a"),
    ) as HTMLAnchorElement[];
    const unique = getUniqLinks(links);

    expect(unique.length).toBe(2);
    expect(unique.map((l) => l.href)).toContain("https://example.com/1");
    expect(unique.map((l) => l.href)).toContain("https://example.com/2");
  });

  it("should keep all links if they have unique hrefs", () => {
    document.body.innerHTML = `
      <a href="https://example.com/1">Link 1</a>
      <a href="https://example.com/2">Link 2</a>
      <a href="https://example.com/3">Link 3</a>
    `;

    const links = Array.from(
      document.querySelectorAll("a"),
    ) as HTMLAnchorElement[];
    const unique = getUniqLinks(links);

    expect(unique.length).toBe(3);
  });
});
