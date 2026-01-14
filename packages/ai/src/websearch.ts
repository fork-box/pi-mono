/**
 * Web search configuration for server-managed search tools.
 * Supports Anthropic, OpenAI, xAI, and Google providers.
 */
export interface WebSearchConfig {
  enabled?: boolean;
  /** Max searches per request (Anthropic). */
  maxUses?: number;
  /** Search context size (OpenAI): low, medium, high. */
  searchContextSize?: "low" | "medium" | "high";
  /** Restrict search to these domains. */
  allowedDomains?: string[];
  /** Exclude these domains from search. */
  blockedDomains?: string[];
  /** Approximate user location for localized results. */
  userLocation?: {
    city?: string;
    region?: string;
    country?: string;
    timezone?: string;
  };
}

/**
 * Build Anthropic web search tool definition.
 * @see https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool
 */
export function buildAnthropicWebSearchTool(config: WebSearchConfig): Record<string, unknown> {
  const tool: Record<string, unknown> = {
    type: "web_search_20250305",
    name: "web_search",
  };
  if (config.maxUses) {
    tool.max_uses = config.maxUses;
  }
  if (config.allowedDomains?.length) {
    tool.allowed_domains = config.allowedDomains;
  }
  if (config.blockedDomains?.length) {
    tool.blocked_domains = config.blockedDomains;
  }
  if (config.userLocation) {
    tool.user_location = {
      type: "approximate",
      ...config.userLocation,
    };
  }
  return tool;
}

/**
 * Build OpenAI web search options for Chat Completions.
 * @see https://platform.openai.com/docs/guides/tools-web-search
 */
export function buildOpenAIWebSearchOptions(config: WebSearchConfig): Record<string, unknown> {
  const options: Record<string, unknown> = {};
  if (config.searchContextSize) {
    options.search_context_size = config.searchContextSize;
  }
  if (config.userLocation) {
    options.user_location = {
      type: "approximate",
      approximate: {
        city: config.userLocation.city,
        region: config.userLocation.region,
        country: config.userLocation.country,
        timezone: config.userLocation.timezone,
      },
    };
  }
  return options;
}

/**
 * Build OpenAI web search tool for Responses API.
 */
export function buildOpenAIWebSearchTool(config: WebSearchConfig): Record<string, unknown> {
  const tool: Record<string, unknown> = {
    type: "web_search_preview",
  };
  if (config.searchContextSize) {
    tool.search_context_size = config.searchContextSize;
  }
  if (config.userLocation) {
    tool.user_location = {
      type: "approximate",
      approximate: config.userLocation,
    };
  }
  return tool;
}

/**
 * Build xAI/Grok web search tool definition.
 * @see https://docs.x.ai/docs/guides/tools/search-tools
 */
export function buildXAIWebSearchTool(config: WebSearchConfig): Record<string, unknown> {
  const tool: Record<string, unknown> = {
    type: "web_search",
  };
  const filters: Record<string, unknown> = {};
  if (config.allowedDomains?.length) {
    filters.allowed_domains = config.allowedDomains;
  }
  if (config.blockedDomains?.length) {
    filters.excluded_domains = config.blockedDomains;
  }
  if (Object.keys(filters).length > 0) {
    tool.filters = filters;
  }
  return tool;
}

/**
 * Build Google Gemini search tool definition.
 * @see https://ai.google.dev/gemini-api/docs/google-search
 */
export function buildGoogleSearchTool(): Record<string, unknown> {
  return { google_search: {} };
}
