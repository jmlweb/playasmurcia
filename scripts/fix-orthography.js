/**
 * Spell-check Markdown via local Ollama (HTTP API).
 * Default scope: all .md files under docs/
 *
 * Requires: ollama serve + ollama pull <model>
 *
 * @example
 * pnpm run fix:orthography
 * pnpm run fix:orthography -- --write
 * pnpm run fix:orthography -- --lang es docs/dev/reports/processed/content-audit.md
 */

import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import { tmpdir } from 'node:os'

const DEFAULT_MODEL = 'gemma3:4b'
const DEFAULT_MAX_CHUNK = 16_000
const DEFAULT_DELAY_MS = 250

function getOllamaBase() {
  const raw = process.env.OLLAMA_HOST?.trim() || '127.0.0.1:11434'
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw.replace(/\/$/, '')
  }
  return `http://${raw.replace(/\/$/, '')}`
}

function parseArgs(argv) {
  let write = false
  let model = DEFAULT_MODEL
  let lang = 'en'
  const roots = []
  const files = []
  let maxChunk = DEFAULT_MAX_CHUNK
  let delayMs = DEFAULT_DELAY_MS

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--write') write = true
    else if (a === '--model') model = argv[++i] ?? model
    else if (a === '--lang') lang = argv[++i] ?? lang
    else if (a === '--root') {
      const r = argv[++i]
      if (r) roots.push(r)
    }
    else if (a === '--max-chunk') maxChunk = Number(argv[++i]) || DEFAULT_MAX_CHUNK
    else if (a === '--delay-ms') delayMs = Number(argv[++i]) || DEFAULT_DELAY_MS
    else if (a === '--help' || a === '-h') {
      printHelp()
      process.exit(0)
    } else if (a.startsWith('-')) {
      console.error(`Unknown flag: ${a}`)
      printHelp()
      process.exit(1)
    } else {
      files.push(a)
    }
  }

  if (!files.length && !roots.length) roots.push('docs')
  return { write, model, lang, roots, files, maxChunk, delayMs }
}

function printHelp() {
  console.log(`Usage: node scripts/fix-orthography.js [options] [files...]

Correct spelling/grammar in Markdown using Ollama (http://127.0.0.1:11434/api/chat).

Options:
  --write          Write changes to disk (default: dry-run, show git diff)
  --model NAME     Ollama model (default: ${DEFAULT_MODEL})
  --lang en|es     Document language for instructions (default: en)
  --root DIR       Also scan DIR recursively for *.md (repeatable)
  --max-chunk N    Max chars per API request (default: ${DEFAULT_MAX_CHUNK})
  --delay-ms N     Pause between API calls (default: ${DEFAULT_DELAY_MS})
  -h, --help       Show this help

Defaults: if no files and no --root, all **/*.md under docs/ are processed.

Environment:
  OLLAMA_HOST      Host or full URL (default: 127.0.0.1:11434)

Do not run on JSON data files or generated beach fields without a dedicated workflow.`)
}

function systemPrompt(lang) {
  if (lang === 'es') {
    return `Eres corrector ortográfico y gramatical de español.
Corrige solo ortografía y gramática. No cambies el significado, el tono ni el registro.
Conserva exactamente la estructura Markdown: encabezados, listas, enlaces, bloques de código y líneas en blanco.
No añadas preámbulos ni explicaciones: devuelve únicamente el texto corregido.`
  }
  return `You are a spelling and grammar proofreader for English.
Fix only spelling and grammar. Do not change meaning, tone, or register.
Preserve Markdown structure exactly: headings, lists, links, fenced code blocks, and blank lines.
Do not add preambles or commentary: return only the corrected text.`
}

function chunkUserInstruction(partIndex, totalParts, lang) {
  if (totalParts <= 1) return ''
  const en = `This is fragment ${partIndex + 1} of ${totalParts} of the same document. Correct only this fragment. Return only the corrected fragment with the same boundaries (no repetition of other parts).`
  const es = `Este es el fragmento ${partIndex + 1} de ${totalParts} del mismo documento. Corrige solo este fragmento. Devuelve únicamente el fragmento corregido, sin repetir otras partes.`
  return lang === 'es' ? es : en
}

function splitIntoChunks(text, maxLen) {
  if (text.length <= maxLen) return [text]
  const chunks = []
  let i = 0
  while (i < text.length) {
    let j = Math.min(i + maxLen, text.length)
    if (j < text.length) {
      const sub = text.slice(i, j)
      const lp = sub.lastIndexOf('\n\n')
      if (lp >= Math.floor(sub.length * 0.35)) {
        j = i + lp + 2
      }
    }
    chunks.push(text.slice(i, j))
    i = j
  }
  return chunks
}

async function ollamaCorrect(baseUrl, model, system, userText) {
  const res = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userText },
      ],
      stream: false,
    }),
  })
  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Ollama HTTP ${res.status}: ${errText}`)
  }
  const data = await res.json()
  const content = data?.message?.content
  if (typeof content !== 'string') {
    throw new Error('Unexpected Ollama response shape (missing message.content)')
  }
  return content.trimEnd()
}

async function correctDocument(baseUrl, model, lang, text, maxChunk, delayMs) {
  const sys = systemPrompt(lang)
  const parts = splitIntoChunks(text, maxChunk)
  const out = []
  for (let p = 0; p < parts.length; p++) {
    const extra = chunkUserInstruction(p, parts.length, lang)
    const userBody = extra ? `${extra}\n\n---\n\n${parts[p]}` : parts[p]
    const fixed = await ollamaCorrect(baseUrl, model, sys, userBody)
    out.push(fixed)
    if (p < parts.length - 1 && delayMs > 0) {
      await new Promise(r => setTimeout(r, delayMs))
    }
  }
  return out.join('')
}

async function* walkMarkdownFiles(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = join(dir, e.name)
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue
      yield* walkMarkdownFiles(full, base)
    } else if (e.isFile() && e.name.endsWith('.md')) {
      yield resolve(full)
    }
  }
}

async function collectTargets(roots, explicitFiles, cwd) {
  const set = new Set()
  for (const f of explicitFiles) {
    set.add(resolve(cwd, f))
  }
  for (const r of roots) {
    const root = resolve(cwd, r)
    for await (const p of walkMarkdownFiles(root)) {
      set.add(p)
    }
  }
  return [...set].sort()
}

function gitDiffNoIndex(aPath, bPath, relPath) {
  try {
    return execFileSync(
      'git',
      ['diff', '--no-index', '--', aPath, bPath],
      { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 },
    )
  } catch (err) {
    if (err.status === 1 && typeof err.stdout === 'string') {
      let d = err.stdout
      d = d.replace(/^diff --git a\/[^\s]+ b\/[^\s]+/m, `diff --git a/${relPath} b/${relPath}`)
      d = d.replace(/^--- a\/[^\n]+/m, `--- a/${relPath}`)
      d = d.replace(/^\+\+\+ b\/[^\n]+/m, `+++ b/${relPath}`)
      return d
    }
    throw err
  }
}

async function main() {
  const cwd = process.cwd()
  const { write, model, lang, roots, files, maxChunk, delayMs } = parseArgs(
    process.argv.slice(2),
  )

  const targets = await collectTargets(roots, files, cwd)
  if (!targets.length) {
    console.error('No Markdown files found.')
    process.exit(1)
  }

  const baseUrl = getOllamaBase()
  console.error(`Ollama: ${baseUrl}  model: ${model}  lang: ${lang}  files: ${targets.length}`)

  let changed = 0
  let failed = 0

  for (const filePath of targets) {
    const rel = relative(cwd, filePath) || filePath
    let original
    try {
      original = await readFile(filePath, 'utf8')
    } catch (e) {
      console.error(`Skip (read error): ${rel}`, e.message)
      failed++
      continue
    }

    let corrected
    try {
      corrected = await correctDocument(baseUrl, model, lang, original, maxChunk, delayMs)
    } catch (e) {
      console.error(`Fail: ${rel}`, e.message)
      failed++
      continue
    }

    if (corrected === original) {
      console.error(`OK (unchanged): ${rel}`)
      continue
    }

    changed++
    if (write) {
      await writeFile(filePath, corrected, 'utf8')
      console.error(`Wrote: ${rel}`)
    } else {
      const tmp = await mkdtemp(join(tmpdir(), 'ortho-'))
      const a = join(tmp, 'a.md')
      const b = join(tmp, 'b.md')
      try {
        await writeFile(a, original, 'utf8')
        await writeFile(b, corrected, 'utf8')
        const diff = gitDiffNoIndex(a, b, rel.replace(/\\/g, '/'))
        process.stdout.write(diff)
      } finally {
        await rm(tmp, { recursive: true, force: true })
      }
    }

    if (delayMs > 0) {
      await new Promise(r => setTimeout(r, delayMs))
    }
  }

  console.error(`Done. changed=${changed} failed=${failed} write=${write}`)
  if (failed > 0) process.exit(1)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
