import { describe, it, expect, beforeEach } from "vitest";
import { filterByVisibility } from "./by-visibility";

describe("filterByVisibility", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should keep visible links and exclude display:none links", () => {
    document.body.innerHTML = `
      <a href="https://example.com/1" id="target">Visible</a>
      <a href="https://example.com/2">Also Visible</a>
      <a href="https://example.com/3" style="display: none;">Hidden</a>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(document.querySelectorAll("a"));

    const filtered = filterByVisibility(target, allLinks);

    expect(filtered.length).toBe(2);
    expect(filtered).toContain(target);
    expect(filtered.find((l) => l.textContent === "Hidden")).toBeUndefined();
  });

  it("should exclude links hidden by hidden attribute", () => {
    document.body.innerHTML = `
      <a href="https://example.com/1" id="target">Visible</a>
      <a href="https://example.com/2">Also Visible</a>
      <a href="https://example.com/3" hidden>Hidden by attribute</a>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(document.querySelectorAll("a"));

    const filtered = filterByVisibility(target, allLinks);

    expect(filtered.length).toBe(2);
    expect(filtered).toContain(target);
    expect(
      filtered.find((l) => l.textContent === "Hidden by attribute"),
    ).toBeUndefined();
  });

  it("should exclude links hidden when parent is display:none", () => {
    document.body.innerHTML = `
      <div>
        <a href="https://example.com/1" id="target">Visible</a>
        <a href="https://example.com/2">Also Visible</a>
      </div>
      <div style="display: none;">
        <a href="https://example.com/3">Hidden by parent</a>
      </div>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(document.querySelectorAll("a"));

    const filtered = filterByVisibility(target, allLinks);

    expect(filtered.length).toBe(2);
    expect(filtered).toContain(target);
    expect(
      filtered.find((l) => l.textContent === "Hidden by parent"),
    ).toBeUndefined();
  });

  it("should exclude links with visibility:hidden", () => {
    document.body.innerHTML = `
      <a href="https://example.com/1" id="target">Visible</a>
      <a href="https://example.com/2">Also Visible</a>
      <a href="https://example.com/3" style="visibility: hidden;">Hidden by visibility</a>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(document.querySelectorAll("a"));

    const filtered = filterByVisibility(target, allLinks);

    expect(filtered.length).toBe(2);
    expect(filtered).toContain(target);
    expect(
      filtered.find((l) => l.textContent === "Hidden by visibility"),
    ).toBeUndefined();
  });

  it("should exclude links hidden by parent visibility:hidden", () => {
    document.body.innerHTML = `
      <div>
        <a href="https://example.com/1" id="target">Visible</a>
        <a href="https://example.com/2">Also Visible</a>
      </div>
      <div style="visibility: hidden;">
        <a href="https://example.com/3">Hidden by parent visibility</a>
      </div>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(document.querySelectorAll("a"));

    const filtered = filterByVisibility(target, allLinks);

    expect(filtered.length).toBe(2);
    expect(filtered).toContain(target);
    expect(
      filtered.find((l) => l.textContent === "Hidden by parent visibility"),
    ).toBeUndefined();
  });

  it("should exclude links with opacity:0", () => {
    document.body.innerHTML = `
      <a href="https://example.com/1" id="target">Visible</a>
      <a href="https://example.com/2">Also Visible</a>
      <a href="https://example.com/3" style="opacity: 0;">Hidden by opacity</a>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(document.querySelectorAll("a"));

    const filtered = filterByVisibility(target, allLinks);

    expect(filtered.length).toBe(2);
    expect(filtered).toContain(target);
    expect(
      filtered.find((l) => l.textContent === "Hidden by opacity"),
    ).toBeUndefined();
  });

  it("should exclude links hidden by parent opacity:0", () => {
    document.body.innerHTML = `
      <div>
        <a href="https://example.com/1" id="target">Visible</a>
        <a href="https://example.com/2">Also Visible</a>
      </div>
      <div style="opacity: 0;">
        <a href="https://example.com/3">Hidden by parent opacity</a>
      </div>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(document.querySelectorAll("a"));

    const filtered = filterByVisibility(target, allLinks);

    expect(filtered.length).toBe(2);
    expect(filtered).toContain(target);
    expect(
      filtered.find((l) => l.textContent === "Hidden by parent opacity"),
    ).toBeUndefined();
  });

  it("should keep links with opacity between 0 and 1", () => {
    document.body.innerHTML = `
      <a href="https://example.com/1" id="target">Visible</a>
      <a href="https://example.com/2" style="opacity: 0.5;">Semi-transparent</a>
      <a href="https://example.com/3" style="opacity: 0.1;">Almost invisible but visible</a>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const allLinks = Array.from(document.querySelectorAll("a"));

    const filtered = filterByVisibility(target, allLinks);

    expect(filtered.length).toBe(3);
    expect(filtered).toContain(target);
    expect(
      filtered.find((l) => l.textContent === "Semi-transparent"),
    ).toBeDefined();
    expect(
      filtered.find((l) => l.textContent === "Almost invisible but visible"),
    ).toBeDefined();
  });
});
