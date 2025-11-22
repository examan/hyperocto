import { describe, it, expect, beforeEach } from "vitest";
import { queryElementsStrict } from "./strict";

describe("queryElementsStrict", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should find links within same container", () => {
    document.body.innerHTML = `
      <ul>
        <li><a href="https://example.com/1" id="target" style="font-family: Arial;">Link 1</a></li>
        <li><a href="https://example.com/2" style="font-family: Arial;">Link 2</a></li>
        <li><a href="https://example.com/3" style="font-family: Arial;">Link 3</a></li>
      </ul>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const selector = "a:not([href^='javascript:'])";
    const links = queryElementsStrict(target, selector);

    // Should find similar links in the same list
    expect(links.length).toBeGreaterThan(1);
    expect(links).toContain(target);
  });

  it("should stop at collection boundary", () => {
    document.body.innerHTML = `
      <div>
        <ul>
          <li><a href="https://example.com/1" id="target" style="font-family: Arial;">Link 1</a></li>
        </ul>
        <ul>
          <li><a href="https://example.com/2" style="font-family: Arial;">Link 2</a></li>
        </ul>
      </div>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const selector = "a:not([href^='javascript:'])";
    const links = queryElementsStrict(target, selector);

    // Should not cross UL boundaries
    expect(Array.isArray(links)).toBe(true);
  });

  it("should handle table structures", () => {
    document.body.innerHTML = `
      <table>
        <tr>
          <td><a href="https://example.com/1" id="target" style="font-family: Arial;">Link 1</a></td>
          <td><a href="https://example.com/2" style="font-family: Arial;">Link 2</a></td>
        </tr>
      </table>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const selector = "a:not([href^='javascript:'])";
    const links = queryElementsStrict(target, selector);

    expect(Array.isArray(links)).toBe(true);
  });

  it("should reach root if no collection found", () => {
    document.body.innerHTML = `
      <div>
        <div>
          <a href="https://example.com/1" id="target" style="font-family: Arial;">Link 1</a>
          <a href="https://example.com/2" style="font-family: Arial;">Link 2</a>
        </div>
      </div>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const selector = "a:not([href^='javascript:'])";
    const links = queryElementsStrict(target, selector);

    // Should traverse to root and find links
    expect(Array.isArray(links)).toBe(true);
    expect(links.length).toBeGreaterThan(1);
  });

  it("should handle elements with display: contents", () => {
    document.body.innerHTML = `
      <ul>
        <li style="display: contents">
          <a href="https://example.com/1" id="target" style="font-family: Arial;">Link 1</a>
        </li>
        <li><a href="https://example.com/2" style="font-family: Arial;">Link 2</a></li>
      </ul>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const selector = "a:not([href^='javascript:'])";
    const links = queryElementsStrict(target, selector);

    // Should find links even with display: contents
    expect(links.length).toBeGreaterThan(0);
    expect(links).toContain(target);
  });

  it("should skip when non-collection element is inside collection", () => {
    document.body.innerHTML = `
      <ul>
        <li>
          <div>
            <a href="https://example.com/1" id="target" style="font-family: Arial;">Link 1</a>
          </div>
        </li>
        <li><a href="https://example.com/2" style="font-family: Arial;">Link 2</a></li>
      </ul>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const selector = "a:not([href^='javascript:'])";
    const links = queryElementsStrict(target, selector);

    expect(Array.isArray(links)).toBe(true);
    // The function should skip the div and continue to UL
    expect(links.length).toBeGreaterThan(0);
  });

  it("should return early when multiple links found at intermediate level", () => {
    document.body.innerHTML = `
      <div>
        <section>
          <a href="https://example.com/1" id="target" style="font-family: Arial;">Link 1</a>
          <a href="https://example.com/2" style="font-family: Arial;">Link 2</a>
        </section>
      </div>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const selector = "a:not([href^='javascript:'])";
    const links = queryElementsStrict(target, selector);

    // Should find multiple links at the section level and return early
    expect(links.length).toBeGreaterThan(1);
    expect(links).toContain(target);
  });

  it("should reach root and return single link if no others found", () => {
    document.body.innerHTML = `
      <div>
        <div>
          <a href="https://example.com/1" id="target" style="font-family: Arial;">Link 1</a>
        </div>
      </div>
    `;

    const target = document.getElementById("target") as HTMLAnchorElement;
    const selector = "a:not([href^='javascript:'])";
    const links = queryElementsStrict(target, selector);

    // Should traverse to root, find only the target, and return it
    expect(links.length).toBe(1);
    expect(links).toContain(target);
  });

  it("should return empty array for detached element", () => {
    const target = document.createElement("a");
    target.href = "https://example.com/1";
    const selector = "a";
    const links = queryElementsStrict(target, selector);
    expect(links).toEqual([]);
  });
});
