# Improve Data - Murcia Beaches

> **Overview**: This document serves as an index to the beach data improvement documentation.

## 📋 Documentation Structure

The beach data improvement documentation has been organized into two main areas:

### 1. [Enrich Beach Data](./ENRICH_BEACHES.md)

Documentation for adding and improving **static fields** in `@data/beaches.json`:

- Current data status and coverage
- Scripts for data enrichment
- Enrichment roadmap (Phase 1-4)
- Proposed fields schema
- Open data sources for static data
- Script templates and best practices
- Common tasks (adding beaches, updating data, validation)

**Use this document when**:
- Adding new fields to beaches.json
- Creating scripts to enrich beach data
- Understanding what data is available
- Planning new data collection efforts

### 2. [Create Services](./CREATE_SERVICES.md)

Documentation for implementing **real-time, ephemeral services**:

- Weather prediction (AEMET)
- Beach status (112 Murcia)
- Google Reviews integration
- Real-time jellyfish reporting
- Webcam feeds
- Social media integration
- Service architecture and caching strategies

**Use this document when**:
- Implementing real-time data services
- Integrating external APIs
- Building frontend widgets for dynamic data
- Setting up caching and rate limiting

---

## Quick Links

- **[ENRICH_BEACHES.md](./ENRICH_BEACHES.md)** - Static data enrichment guide
- **[CREATE_SERVICES.md](./CREATE_SERVICES.md)** - Real-time services guide

---

## Key Principles

1. **Static vs Ephemeral**: Store persistent data in `beaches.json`, fetch ephemeral data via services
2. **Quality over quantity**: Prioritize accuracy and official sources
3. **Automation**: Use scripts for large-scale data processing
4. **Maintainability**: Document sources and methods for future updates
