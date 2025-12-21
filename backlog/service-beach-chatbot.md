# Service: Beach Recommendation Chatbot

## Description

AI-powered beach finder widget using beach data and real-time weather.

## Details

- **AI Backend**: Ollama (free, local) or Claude API
- **Features**:
  - Parse user preferences from natural language
  - Filter beaches based on criteria
  - Integrate current weather from AEMET
  - Generate recommendations in user's language

## Example Queries

- "¿Qué playa me recomiendas hoy en Cartagena con poco viento?"
- "Beach for families with easy parking near La Manga?"
- "Où puis-je faire du snorkeling?"

## Implementation Notes

- Cache weather data for 30 minutes
- Support multiple languages
- Consider Ollama for cost reduction

## Source

Extracted from `docs/CREATE_SERVICES.md`
