import { describe, it, expect, vi, beforeEach } from "vitest";
import { filterLinks } from "./filter";
import { filterByVisibility } from "./by-visibility";
import { filterByNumberStyle } from "./by-number-style";
import { filterByStringStyle } from "./by-string-style";
import { getUniqLinks } from "./get-uniq-links";

vi.mock("./by-visibility");
vi.mock("./by-number-style");
vi.mock("./by-string-style");
vi.mock("./get-uniq-links");

describe("filterLinks", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return links immediately if length is <= 1", () => {
    const target = document.createElement("a");
    const links = [target];

    const result = filterLinks(links, target);

    expect(result).toBe(links);
  });

  it("should pipe links through all filters", () => {
    const target = document.createElement("a");
    const link1 = document.createElement("a");
    const link2 = document.createElement("a");
    const initialLinks = [target, link1, link2];

    // Mock return values to verify flow
    const stringFiltered = [target, link1];
    const numberFiltered = [target, link1];
    const visibilityFiltered = [target, link1];
    const uniqueLinks = [target, link1];

    vi.mocked(filterByStringStyle).mockReturnValue(stringFiltered);
    vi.mocked(filterByNumberStyle).mockReturnValue(numberFiltered);
    vi.mocked(filterByVisibility).mockReturnValue(visibilityFiltered);
    vi.mocked(getUniqLinks).mockReturnValue(uniqueLinks);

    const result = filterLinks(initialLinks, target);

    expect(filterByStringStyle).toHaveBeenCalledWith(target, initialLinks);
    expect(filterByNumberStyle).toHaveBeenCalledWith(target, stringFiltered);
    expect(filterByVisibility).toHaveBeenCalledWith(target, numberFiltered);
    expect(getUniqLinks).toHaveBeenCalledWith(visibilityFiltered);
    expect(result).toBe(uniqueLinks);
  });
});
