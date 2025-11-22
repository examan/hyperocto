import { describe, it, expect, beforeEach } from "vitest";
import { filterAndPassItself } from "./filter-and-pass-itself";

describe("filterAndPassItself", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should always include the target link", () => {
    document.body.innerHTML = `
      <a href="https://example.com/1" id="target">Target</a>
      <a href="https://example.com/2">Other</a>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(
      document.querySelectorAll("a"),
    ) as HTMLAnchorElement[];

    // Predicate that always returns false
    const filtered = filterAndPassItself(target, allLinks, () => false);

    expect(filtered.length).toBe(1);
    expect(filtered[0]).toBe(target);
  });

  it("should include other links that match the predicate", () => {
    document.body.innerHTML = `
      <a href="https://example.com/1" id="target">Target</a>
      <a href="https://example.com/2" id="match">Match</a>
      <a href="https://example.com/3" id="no-match">No Match</a>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(
      document.querySelectorAll("a"),
    ) as HTMLAnchorElement[];

    const filtered = filterAndPassItself(
      target,
      allLinks,
      (link) => link.id === "match",
    );

    expect(filtered.length).toBe(2);
    expect(filtered).toContain(target);
    expect(filtered.find((l) => l.id === "match")).toBeDefined();
    expect(filtered.find((l) => l.id === "no-match")).toBeUndefined();
  });
});
