# MangaDex Full API

## Overview

This is a TypeScript wrapper library for the MangaDex API, providing a comprehensive interface for interacting with MangaDex's manga reading platform. The library offers typed access to manga, chapters, authors, covers, user lists, scanlation groups, and authentication services. It includes an Express server for API documentation and can be used as both a standalone library (npm package) and a development server.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Core Design Pattern
The library follows an **Object-Oriented wrapper pattern** where each MangaDex resource (Manga, Chapter, Author, Cover, etc.) is represented by a class that:
- Extends a base `IDObject` class for consistent UUID handling
- Implements static methods for fetching/searching (`get()`, `search()`, `getByQuery()`, `getMultiple()`)
- Contains instance methods for resource-specific operations
- Uses a `Relationship` class to handle lazy-loading of related resources

### Key Architectural Decisions

**1. Relationship System**
- Problem: MangaDex API returns related resources as UUID references
- Solution: A `Relationship<T>` class that can resolve references on-demand or use cached data from "includes" parameters
- Benefit: Reduces API calls when data is already available, provides type-safe access to related entities

**2. Localization Support**
- Problem: MangaDex content exists in multiple languages
- Solution: `LocalizedString` class that maps locales to strings with a global locale preference
- Usage: `setGlobalLocale('en')` sets default, `localString` property returns appropriate translation

**3. Authentication Architecture**
- Two auth clients: `PersonalAuthClient` (OAuth - recommended) and `LegacyAuthClient` (deprecated username/password)
- Token refresh is handled automatically within `getSessionToken()`
- Active client is set globally via `setActiveAuthClient()`

**4. Network Layer**
- Centralized in `src/util/Network.ts`
- Supports origin overrides for testing (`useDebugServer()`, `overrideApiOrigin()`, `overrideAuthOrigin()`)
- Helper functions: `fetchMD`, `fetchMDData`, `fetchMDSearch`, `fetchMDByArrayParam`, `fetchMDAuth`
- Automatic error handling via `APIResponseError` and `AuthError` classes

**5. Type System**
- Schema types are auto-generated from MangaDex's Swagger/OpenAPI spec via `swagger-typescript-api`
- Located in `src/types/schema.ts`
- Helper types in `src/types/helpers.ts` (Merge, DeepRequire, IAuthClient interface)

### Project Structure
```
src/
├── index.ts          # Main exports, relationship type registration
├── internal/         # Core infrastructure (IDObject, Relationship, LocalizedString, Links)
├── shared/           # Resource classes (Manga, Chapter, Author, Cover, Tag, User, Group, List, UploadSession)
├── types/            # TypeScript types (schema.ts is auto-generated)
└── util/             # Network layer, error classes
```

### Build System
- Uses `tsup` for bundling (outputs CJS, ESM, and type definitions)
- Schema generation via custom script (`scripts/build-schema.mjs`)
- TypeDoc for documentation generation
- Jest with ts-jest for testing

## External Dependencies

### Runtime Dependencies
- **express** (v5.x): HTTP server for serving documentation
- **cors**: CORS middleware for the Express server

### MangaDex API Integration
- **API Origin**: `https://api.mangadex.org/`
- **Auth Origin**: `https://auth.mangadex.org/`
- **Debug/Sandbox**: `https://api.mangadex.dev/` and `https://auth.mangadex.dev/`

### Authentication Requirements
For authenticated operations, the following environment variables are needed:
- `MFA_TEST_CLIENT_ID`: OAuth client ID
- `MFA_TEST_CLIENT_SECRET`: OAuth client secret
- `MFA_TEST_USERNAME`: MangaDex username
- `MFA_TEST_PASSWORD`: MangaDex password

### Development Dependencies
- **TypeScript** (v5.x): Primary language
- **swagger-typescript-api**: Generates types from MangaDex OpenAPI spec
- **Jest**: Testing framework
- **ESLint + Prettier**: Code quality and formatting
- **TypeDoc**: API documentation generation
- **dotenv**: Environment variable loading for tests

### Node.js Requirements
- Requires Node.js >= 19.0.0 (uses experimental VM modules for Jest ESM support)