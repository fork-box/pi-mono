import { describe, expect, it } from "vitest";
import {
  buildAnthropicWebSearchTool,
  buildOpenAIWebSearchOptions,
  buildOpenAIWebSearchTool,
  buildXAIWebSearchTool,
  buildGoogleSearchTool,
  type WebSearchConfig,
} from "../src/websearch.js";

describe("buildAnthropicWebSearchTool", () => {
  it("builds minimal tool config", () => {
    const config: WebSearchConfig = { enabled: true };
    const tool = buildAnthropicWebSearchTool(config);
    
    expect(tool.type).toBe("web_search_20250305");
    expect(tool.name).toBe("web_search");
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

describe("buildOpenAIWebSearchOptions", () => {
  it("builds empty options when no config", () => {
    const config: WebSearchConfig = { enabled: true };
    const options = buildOpenAIWebSearchOptions(config);
    
    expect(options).toEqual({});
  });

  it("includes search context size", () => {
    const config: WebSearchConfig = { enabled: true, searchContextSize: "high" };
    const options = buildOpenAIWebSearchOptions(config);
    
    expect(options.search_context_size).toBe("high");
  });

  it("includes user location", () => {
    const config: WebSearchConfig = {
      enabled: true,
      userLocation: { city: "London", country: "GB" },
    };
    const options = buildOpenAIWebSearchOptions(config);
    
    expect(options.user_location).toEqual({
      type: "approximate",
      approximate: { city: "London", country: "GB" },
    });
  });
});

describe("buildOpenAIWebSearchTool", () => {
  it("builds web_search_preview tool", () => {
    const config: WebSearchConfig = { enabled: true };
    const tool = buildOpenAIWebSearchTool(config);
    
    expect(tool.type).toBe("web_search_preview");
  });
});

describe("buildXAIWebSearchTool", () => {
  it("builds minimal xAI tool", () => {
    const config: WebSearchConfig = { enabled: true };
    const tool = buildXAIWebSearchTool(config);
    
    expect(tool.type).toBe("web_search");
    expect(tool.filters).toBeUndefined();
  });

  it("includes domain filters", () => {
    const config: WebSearchConfig = {
      enabled: true,
      allowedDomains: ["x.com"],
      blockedDomains: ["spam.com"],
    };
    const tool = buildXAIWebSearchTool(config);
    
    expect(tool.filters).toEqual({
      allowed_domains: ["x.com"],
      excluded_domains: ["spam.com"],
    });
  });
});

describe("buildGoogleSearchTool", () => {
  it("builds google_search tool", () => {
    const tool = buildGoogleSearchTool();
    
    expect(tool).toEqual({ google_search: {} });
  });
});
