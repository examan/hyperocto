import { describe, it, expect, beforeEach } from "vitest";
import { getSimilarLinks } from "./get-similar-links";

describe("getSimilarLinks", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should execute without error in NORMAL mode", () => {
    document.body.innerHTML = `
      <div class="container">
        <a href="https://example.com/1" id="target">Link 1</a>
        <a href="https://example.com/2">Link 2</a>
      </div>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const links = getSimilarLinks(target, "NORMAL");

    // Basic smoke test: function should return an array
    expect(Array.isArray(links)).toBe(true);
  });

  it("should execute without error in FLEXIBLE mode", () => {
    document.body.innerHTML = `
      <div>
        <a href="https://example.com/1" id="target">Link 1</a>
      </div>
      <p>
        <a href="https://example.com/2">Link 2</a>
      </p>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const links = getSimilarLinks(target, "FLEXIBLE");

    // Basic smoke test: function should return an array
    expect(Array.isArray(links)).toBe(true);
  });

  it("should execute without error in STRICT mode", () => {
    document.body.innerHTML = `
      <div>
        <a href="https://example.com/1" id="target">Link 1</a>
        <a href="https://example.com/2">Link 2</a>
      </div>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const links = getSimilarLinks(target, "STRICT");

    // Basic smoke test: function should return an array
    expect(Array.isArray(links)).toBe(true);
  });
});
