import { describe, it, expect, beforeEach } from "vitest";
import { getFullSelector } from "./full";

describe("getFullSelector", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("should generate full path selector for nested link", () => {
    document.body.innerHTML = `
      <div class="container">
        <ul>
          <li>
            <a href="https://example.com" id="target">Link</a>
          </li>
        </ul>
      </div>
    `;

    const link = document.getElementById("target") as HTMLAnchorElement;
    const selector = getFullSelector(link);

    // Should include all parent elements in path
    expect(selector).toContain("HTML");
    expect(selector).toContain("BODY");
    expect(selector).toContain("DIV");
    expect(selector).toContain("UL");
    expect(selector).toContain("LI");
    expect(selector).toContain("A");
    expect(selector).toContain(">");
  });

  it("should include URI scheme filters", () => {
    document.body.innerHTML = `<a href="https://example.com" id="target">Link</a>`;

    const link = document.getElementById("target") as HTMLAnchorElement;
    const selector = getFullSelector(link);

    // Should exclude common URI schemes
    expect(selector).toContain(":not([href^='javascript:'])");
    expect(selector).toContain(":not([href^='mailto:'])");
  });

  it("should work with direct body child", () => {
    document.body.innerHTML = `<a href="https://example.com" id="target">Link</a>`;

    const link = document.getElementById("target") as HTMLAnchorElement;
    const selector = getFullSelector(link);

    expect(selector).toContain("HTML");
    expect(selector).toContain("BODY");
    expect(selector).toContain("A");
  });
});
