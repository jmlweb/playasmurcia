# Step 26: Generate Translations

## Objective

Add `translations` object with name and description in EN, DE, FR.

## Field

```typescript
translations?: {
  en?: { name: string; description: string }
  de?: { name: string; description: string }
  fr?: { name: string; description: string }
}
```

## Target Languages

- English (UK tourism)
- German (significant tourism)
- French (significant tourism)

## Script: `scripts/generate-translations.js`

Uses Ollama for translation:

```javascript
const prompt = `Translate to ${language}:

Name: ${beach.name}
Description: ${beach.description}

Respond as JSON: {"name": "...", "description": "..."}`
```

**Estimated time**: ~2h (194 beaches × 3 languages)

## Note

Static translations are SEO-friendly (vs Google Translate widgets).

## Validation

- [ ] Translations are natural, not literal
- [ ] Beach names appropriately translated or kept
