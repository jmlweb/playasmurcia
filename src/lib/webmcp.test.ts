import { describe, expect, it, vi } from 'vitest'

import type { ModelContextLike, WebMcpTool } from './webmcp'

import { getModelContext, registerWebMcpTools } from './webmcp'

const tool = (name: string): WebMcpTool => ({
  name,
  description: `${name} tool`,
  inputSchema: { type: 'object' },
  execute: async () => ({ ok: true }),
})

describe('getModelContext', () => {
  it('returns undefined when neither document nor navigator expose it', () => {
    expect(getModelContext({}, {})).toBeUndefined()
  })

  it('ignores values without a registerTool function', () => {
    expect(getModelContext({ modelContext: {} }, {})).toBeUndefined()
    expect(getModelContext({ modelContext: 'nope' }, {})).toBeUndefined()
  })

  it('prefers document.modelContext over the deprecated navigator getter', () => {
    const onDocument = { registerTool: vi.fn() }
    const onNavigator = { registerTool: vi.fn() }
    expect(
      getModelContext(
        { modelContext: onDocument },
        { modelContext: onNavigator },
      ),
    ).toBe(onDocument)
  })

  it('falls back to navigator.modelContext', () => {
    const onNavigator = { registerTool: vi.fn() }
    expect(getModelContext({}, { modelContext: onNavigator })).toBe(onNavigator)
  })
})

describe('registerWebMcpTools', () => {
  it('registers each tool with an abort signal', () => {
    const registerTool = vi.fn()
    const tools = [tool('a'), tool('b')]

    registerWebMcpTools({ registerTool }, tools)

    expect(registerTool).toHaveBeenCalledTimes(2)
    expect(registerTool).toHaveBeenCalledWith(
      tools[0],
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    )
  })

  it('aborts the signal on cleanup', () => {
    const registerTool = vi.fn<ModelContextLike['registerTool']>()
    const cleanup = registerWebMcpTools({ registerTool }, [tool('a')])
    const signal = registerTool.mock.calls[0][1]?.signal
    if (!signal) throw new Error('no signal passed')

    expect(signal.aborted).toBe(false)
    cleanup()
    expect(signal.aborted).toBe(true)
  })

  it('also calls unregisterTool when the build exposes it', () => {
    const registerTool = vi.fn()
    const unregisterTool = vi.fn()
    const cleanup = registerWebMcpTools({ registerTool, unregisterTool }, [
      tool('a'),
      tool('b'),
    ])

    cleanup()

    expect(unregisterTool).toHaveBeenCalledWith('a')
    expect(unregisterTool).toHaveBeenCalledWith('b')
  })

  it('swallows registration errors, sync and async', async () => {
    const registerTool = vi
      .fn()
      .mockImplementationOnce(() => {
        throw new Error('sync boom')
      })
      .mockRejectedValueOnce(new Error('async boom'))

    expect(() =>
      registerWebMcpTools({ registerTool }, [tool('a'), tool('b')]),
    ).not.toThrow()
    await Promise.resolve()
    expect(registerTool).toHaveBeenCalledTimes(2)
  })
})
