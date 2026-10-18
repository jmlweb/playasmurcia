/**
 * Thin adapter over the WebMCP `ModelContext` API (W3C WebML CG draft).
 * The API is still moving: Chromium ships it as `document.modelContext`
 * (the older `navigator.modelContext` getter is deprecated), behind an
 * origin trial. Everything here feature-detects and no-ops otherwise.
 */

export type WebMcpToolAnnotations = {
  readOnlyHint?: boolean
  consequentialHint?: boolean
  untrustedContentHint?: boolean
}

export type WebMcpToolInput = Record<string, unknown>

export type WebMcpTool = {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  annotations?: WebMcpToolAnnotations
  execute: (input: WebMcpToolInput) => Promise<unknown>
}

export type ModelContextLike = {
  registerTool: (
    tool: WebMcpTool,
    options?: { signal?: AbortSignal },
  ) => Promise<void> | void
  // Early Chromium builds exposed this instead of the AbortSignal option
  unregisterTool?: (name: string) => Promise<void> | void
}

type ModelContextHost = { modelContext?: unknown }

const ignore = (): void => undefined

function isModelContext(value: unknown): value is ModelContextLike {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ModelContextLike).registerTool === 'function'
  )
}

/**
 * Returns the page's `ModelContext`, preferring the spec location on
 * `document` and falling back to the deprecated `navigator` getter.
 */
export function getModelContext(
  doc: ModelContextHost = globalThis.document as ModelContextHost,
  nav: ModelContextHost = globalThis.navigator as ModelContextHost,
): ModelContextLike | undefined {
  const candidates = [doc.modelContext, nav.modelContext]
  return candidates.find(isModelContext)
}

/**
 * Registers every tool and returns a function that removes them again.
 * Registration failures are swallowed: an agent-less page must never break.
 */
export function registerWebMcpTools(
  context: ModelContextLike,
  tools: readonly WebMcpTool[],
): () => void {
  const controller = new AbortController()

  for (const tool of tools) {
    try {
      void Promise.resolve(
        context.registerTool(tool, { signal: controller.signal }),
      ).catch(ignore)
    } catch {
      // Unsupported tool shape in this browser build
    }
  }

  return () => {
    controller.abort()
    if (typeof context.unregisterTool !== 'function') return
    for (const tool of tools) {
      try {
        void Promise.resolve(context.unregisterTool(tool.name)).catch(ignore)
      } catch {
        // Already gone
      }
    }
  }
}
