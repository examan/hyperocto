import { describe, it, expect } from "vitest";
import { getSimpleSelector } from "./simple";
import { URI_SCHEME_FILTER_SELECTOR } from "./uri-scheme-filter";

describe("getSimpleSelector", () => {
  it("should return the correct selector string", () => {
    expect(getSimpleSelector()).toBe(`a${URI_SCHEME_FILTER_SELECTOR}`);
  });
});
