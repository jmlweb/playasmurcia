import { stripDescriptionMarkdown } from './description-markdown'

const MAX_SUMMARY_LENGTH = 160
const TIP_BLOCK = /^\s*\*\*Consejo:\*\*/
const NAME_PREFIX = /^(playa|cala)( de| del)?( la| las| el| los)? /

const normalize = (text: string): string =>
  text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

const firstNameWord = (name: string): string =>
  normalize(name).replace(NAME_PREFIX, '').split(/[ (]/)[0]

const truncateAtWord = (text: string, maxLength: number): string => {
  const cut = text.slice(0, maxLength - 1)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

// Whole leading sentences only: skipping a long one would surface a fragment
const leadingSentences = (text: string, maxLength: number): string => {
  const sentences = text.split(/(?<=[.!?])\s+/)
  const taken: string[] = []
  for (const sentence of sentences) {
    if ([...taken, sentence].join(' ').length > maxLength) break
    taken.push(sentence)
  }
  return taken.length > 0 ? taken.join(' ') : truncateAtWord(text, maxLength)
}

/**
 * Meta and structured-data summary, taken from the hand-edited description.
 * The stored `metaDescription` is generated tourism copy that contradicts it.
 */
export function getBeachSummary(name: string, description: string): string {
  const paragraphs = description
    .split(/\n\s*\n/)
    .filter((block) => !TIP_BLOCK.test(block))
    .join(' ')
  const plain = stripDescriptionMarkdown(paragraphs || description)
    .replace(/\s+/g, ' ')
    .trim()

  const summary = leadingSentences(plain, MAX_SUMMARY_LENGTH)
  if (normalize(summary).includes(firstNameWord(name))) return summary

  const prefix = `${name}: `
  return `${prefix}${leadingSentences(plain, MAX_SUMMARY_LENGTH - prefix.length)}`
}
