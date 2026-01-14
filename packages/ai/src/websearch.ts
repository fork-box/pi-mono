/**
 * Web search configuration for server-managed search tools.
 * Supports Anthropic, OpenAI, xAI, and Google providers.
 */
export interface WebSearchConfig {
  enabled?: boolean;
  /** Max searches per request (Anthropic). */
  maxUses?: number;
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
