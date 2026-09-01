import { describe, expect, it } from "vitest";
import { consultationServiceFor, estimateFee } from "../src/data/fees";

describe("legacy fee estimator", () => {
  it("preserves the published fee table", () => {
    expect(estimateFee("종합소득세", "1")).toBe(150_000);
    expect(estimateFee("법인세", "100")).toBe(3_000_000);
    expect(estimateFee("상속증여", "50")).toBe(3_000_000);
  });

  it("rejects unknown inputs and maps to the secure consultation form", () => {
    expect(estimateFee("unknown", "1")).toBeNull();
    expect(estimateFee("법인세", "999")).toBeNull();
    expect(consultationServiceFor("부가세")).toBe("부가가치세");
  });
});
