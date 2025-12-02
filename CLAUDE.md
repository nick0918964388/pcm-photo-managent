# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Approach

Always use TDD (Test-Driven Development) to complete development tasks.

## Project Overview

PCM (Photo Construction Management) - A system for managing construction project photos and videos. Contractors upload media files organized by project and folder hierarchy, with on-the-fly thumbnail generation.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js with NestJS
- **Database**: PostgreSQL (Cloud SQL in production)
- **Storage**: MinIO locally / GCS in production
- **Image Processing**: Imgproxy (on-the-fly thumbnail generation)
- **Auth**: OIDC / OAuth2

## Infrastructure Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f [service_name]
```

### Local Service Endpoints

| Service   | Port | URL                    |
|-----------|------|------------------------|
| PostgreSQL| 5432 | localhost:5432         |
| MinIO API | 9000 | http://localhost:9000  |
| MinIO Console | 9001 | http://localhost:9001 |
| Imgproxy  | 8080 | http://localhost:8080  |

## Architecture

### Database Schema (PostgreSQL)

Three core tables with hierarchical structure:
- `projects` - Root level, contains project code/name/status
- `folders` - Nested structure via `parent_id`, belongs to project
- `media_assets` - Photos/videos, belongs to folder, stores GCS path and JSONB metadata (Exif, GPS)

### Key Workflows

**Upload Flow (Presigned URL Pattern)**:
1. Frontend calls `POST /api/upload/sign`
2. Backend validates permissions, generates presigned URL (15 min expiry)
3. Frontend uploads directly to storage (MinIO/GCS)
4. Frontend calls `POST /api/assets` to register metadata in database

**Thumbnail Flow (On-the-fly)**:
- Backend returns Imgproxy URLs instead of direct storage URLs
- Imgproxy fetches original, resizes in memory, returns to browser
- Format: `https://imgproxy/rs:fill:300:0/plain/s3://bucket/path`

### Network

All Docker services communicate via `ems-network` bridge. Imgproxy connects to MinIO using S3 protocol.
