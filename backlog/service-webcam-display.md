# Service: Webcam Display Widget

## Description

Display live webcam feeds on beach pages.

## Prerequisites

- Requires `webcamUrl` field in beaches.json (see step-12-add-webcams.md)

## Implementation Notes

- Handle different embed types (direct, iframe, image refresh)
- Verify webcam URLs are still active (periodic health checks)
- Handle webcam failures gracefully
- Some webcams have CORS restrictions or require authentication

## Source

Extracted from `docs/CREATE_SERVICES.md`
