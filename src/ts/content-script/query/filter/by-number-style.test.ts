import { describe, it, expect, beforeEach } from "vitest";
import { filterByNumberStyle } from "./by-number-style";

describe("filterByNumberStyle", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should filter links with same numeric styles (fontSize, lineHeight)", () => {
    document.body.innerHTML = `
      <a href="https://example.com/1" id="target" style="font-size: 16px; line-height: 1.5;">Target</a>
      <a href="https://example.com/2" style="font-size: 16px; line-height: 1.5;">Similar</a>
      <a href="https://example.com/3" style="font-size: 20px; line-height: 1.5;">Different Size</a>
      <a href="https://example.com/4" style="font-size: 16px; line-height: 2.0;">Different LineHeight</a>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(
      document.querySelectorAll("a"),
    ) as HTMLAnchorElement[];
    const filtered = filterByNumberStyle(target, allLinks);

    expect(filtered).toContain(target);
    expect(filtered.length).toBe(2); // Target + Similar
    expect(
      filtered.find((l) => l.textContent === "Different Size"),
    ).toBeUndefined();
    expect(
      filtered.find((l) => l.textContent === "Different LineHeight"),
    ).toBeUndefined();
  });

  it("should handle child elements styles", () => {
    document.body.innerHTML = `
      <a href="https://example.com/1" id="target" style="font-size: 16px;"><span>Text</span></a>
      <a href="https://example.com/2" style="font-size: 16px;"><span>Text</span></a>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(
      document.querySelectorAll("a"),
    ) as HTMLAnchorElement[];

    const filtered = filterByNumberStyle(target, allLinks);
    expect(filtered.length).toBe(2);
  });

  it("should match links with em units computed to same px value", () => {
    document.body.innerHTML = `
      <style>
        .container { font-size: 16px; }
      </style>
      <div class="container">
        <a href="https://example.com/1" id="target" style="font-size: 1em;">Target (16px computed)</a>
        <a href="https://example.com/2" style="font-size: 16px;">Explicit 16px</a>
        <a href="https://example.com/3" style="font-size: 2em;">Different (32px computed)</a>
      </div>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(document.querySelectorAll("a"));
    const filtered = filterByNumberStyle(target, allLinks);

    expect(filtered.length).toBe(2);
    expect(filtered).toContain(target);
    expect(
      filtered.find((l) => l.textContent?.includes("Different")),
    ).toBeUndefined();
  });

  it("should match links with rem units", () => {
    document.body.innerHTML = `
      <style>
        html { font-size: 16px; }
      </style>
      <a href="https://example.com/1" id="target" style="font-size: 1rem;">Target (16px via rem)</a>
      <a href="https://example.com/2" style="font-size: 16px;">Explicit 16px</a>
      <a href="https://example.com/3" style="font-size: 1.5rem;">Larger (24px via rem)</a>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(document.querySelectorAll("a"));
    const filtered = filterByNumberStyle(target, allLinks);

    expect(filtered.length).toBe(2);
    expect(filtered).toContain(target);
  });

  it("should handle inherited line-height correctly", () => {
    document.body.innerHTML = `
      <style>
        .lh-normal { line-height: 1.5; }
        .lh-double { line-height: 2.0; }
      </style>
      <div class="lh-normal">
        <a href="https://example.com/1" id="target" style="font-size: 16px;">Target inherited 1.5</a>
        <a href="https://example.com/2" style="font-size: 16px;">Also inherited 1.5</a>
      </div>
      <div class="lh-double">
        <a href="https://example.com/3" style="font-size: 16px;">Inherited 2.0</a>
      </div>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(document.querySelectorAll("a"));
    const filtered = filterByNumberStyle(target, allLinks);

    expect(filtered.length).toBe(2);
    expect(filtered).toContain(target);
    expect(
      filtered.find((l) => l.textContent?.includes("Inherited 2.0")),
    ).toBeUndefined();
  });

  it("should handle child elements with different font sizes", () => {
    document.body.innerHTML = `
      <a href="https://example.com/1" id="target" style="font-size: 16px;">
        <span style="font-size: 20px;">Large child</span>
      </a>
      <a href="https://example.com/2" style="font-size: 16px;">
        <span style="font-size: 20px;">Same large child</span>
      </a>
      <a href="https://example.com/3" style="font-size: 16px;">
        <span style="font-size: 12px;">Different child</span>
      </a>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(document.querySelectorAll("a"));
    const filtered = filterByNumberStyle(target, allLinks);

    // Should match only target and link2 because they have matching min/max fontSize
    expect(filtered.length).toBe(2);
    expect(filtered).toContain(target);
    expect(
      filtered.find((l) => l.textContent?.includes("Different child")),
    ).toBeUndefined();
  });
});
