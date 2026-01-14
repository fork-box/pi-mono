import { describe, expect, it } from "vitest";
import { buildAnthropicWebSearchTool, type WebSearchConfig } from "../src/websearch.js";

describe("buildAnthropicWebSearchTool", () => {
  it("builds minimal tool config", () => {
    const config: WebSearchConfig = { enabled: true };
    const tool = buildAnthropicWebSearchTool(config);
    
    expect(tool.type).toBe("web_search_20250305");
    expect(tool.name).toBe("web_search");
    expect(tool.max_uses).toBeUndefined();
  });

  it("includes maxUses when specified", () => {
    const config: WebSearchConfig = { enabled: true, maxUses: 5 };
    const tool = buildAnthropicWebSearchTool(config);
    
    expect(tool.max_uses).toBe(5);
  });

  it("includes domain filters", () => {
    const config: WebSearchConfig = {
      enabled: true,
      allowedDomains: ["example.com"],
      blockedDomains: ["blocked.com"],
    };
    const tool = buildAnthropicWebSearchTool(config);
    
    expect(tool.allowed_domains).toEqual(["example.com"]);
    expect(tool.blocked_domains).toEqual(["blocked.com"]);
  });

  it("includes user location", () => {
    const config: WebSearchConfig = {
      enabled: true,
      userLocation: { city: "NYC", country: "US" },
    };
    const tool = buildAnthropicWebSearchTool(config);
    
    expect(tool.user_location).toEqual({
      type: "approximate",
      city: "NYC",
      country: "US",
    });
  });
});
