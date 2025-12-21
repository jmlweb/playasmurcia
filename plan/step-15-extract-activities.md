# Step 15: Extract Activities

## Objective

Add `activities` array indicating available activities at each beach.

## Field

```typescript
activities?: string[]
```

## Valid Activities

```
["swimming", "snorkeling", "diving", "kayak", "paddleboard",
 "windsurf", "kitesurf", "sailing", "fishing", "volleyball"]
```

## Script: `scripts/extract-activities.js`

Uses Ollama to infer activities from description, location, and beach type.

- Calm waters (Mar Menor) → paddleboard, kayak
- Rocky beaches → snorkeling, diving
- Windy areas (La Manga) → windsurf, kitesurf
- Urban beaches → volleyball

**Estimated time**: ~25 min (Ollama)

## Validation

- [ ] Activities match beach characteristics
- [ ] Remote calas have fewer activities
