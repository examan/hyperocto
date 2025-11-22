import { describe, it, expect, beforeEach } from "vitest";
import { filterByStringStyle } from "./by-string-style";

describe("filterByStringStyle", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should filter links with same font-family and display", () => {
    document.body.innerHTML = `
      <a href="https://example.com/1" id="target" style="font-family: Arial; display: block;">Target</a>
      <a href="https://example.com/2" style="font-family: Arial; display: block;">Similar</a>
      <a href="https://example.com/3" style="font-family: Times; display: block;">Different</a>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(
      document.querySelectorAll("a"),
    ) as HTMLAnchorElement[];
    const filtered = filterByStringStyle(target, allLinks);

    expect(filtered).toContain(target);
    // The similar link should be included (same styles)
    expect(filtered.length).toBeGreaterThanOrEqual(2);
    expect(filtered.find((l) => l.textContent === "Different")).toBeUndefined();
  });

  it("should match links with inherited font-family from parent", () => {
    document.body.innerHTML = `
      <style>
        .font-arial { font-family: Arial; }
        .font-times { font-family: Times; }
      </style>
      <div class="font-arial">
        <a href="https://example.com/1" id="target">Target with inherited Arial</a>
        <a href="https://example.com/2">Also inherited Arial</a>
      </div>
      <div class="font-times">
        <a href="https://example.com/3">Inherited Times</a>
      </div>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(document.querySelectorAll("a"));
    const filtered = filterByStringStyle(target, allLinks);

    expect(filtered.length).toBe(2);
    expect(filtered).toContain(target);
    expect(
      filtered.find((l) => l.textContent === "Inherited Times"),
    ).toBeUndefined();
  });

  it("should match links styled via CSS class", () => {
    document.body.innerHTML = `
      <style>
        .style-a { font-family: Arial; display: block; }
        .style-b { font-family: Times; display: block; }
      </style>
      <a href="https://example.com/1" id="target" class="style-a">Target</a>
      <a href="https://example.com/2" class="style-a">Similar via class</a>
      <a href="https://example.com/3" class="style-b">Different class</a>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(document.querySelectorAll("a"));
    const filtered = filterByStringStyle(target, allLinks);

    expect(filtered.length).toBe(2);
    expect(filtered).toContain(target);
    expect(
      filtered.find((l) => l.textContent === "Different class"),
    ).toBeUndefined();
  });

  it("should work with mix of inline and inherited styles", () => {
    document.body.innerHTML = `
      <style>
        .container { font-family: Arial; }
      </style>
      <div class="container">
        <a href="https://example.com/1" id="target" style="display: inline;">Target</a>
        <a href="https://example.com/2" style="display: inline;">Same styles</a>
        <a href="https://example.com/3" style="display: block;">Different display</a>
      </div>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(document.querySelectorAll("a"));
    const filtered = filterByStringStyle(target, allLinks);

    expect(filtered.length).toBe(2);
    expect(filtered).toContain(target);
    expect(
      filtered.find((l) => l.textContent === "Different display"),
    ).toBeUndefined();
  });
});
