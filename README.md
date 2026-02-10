# Prets

## 🔐 Authentication System

This project implements a secure, stateless authentication flow using JWT (JSON Web Tokens) via the jose library and Next.js Server Actions/Route Handlers.

### 🏗 Architecture Overview

The system is split into two layers: a Server-side Session Manager (the source of truth) and a Client-side Hook (for UI state).

### 📁 Core Components

#### 1. Session Management (auth.ts)

Handles the lifecycle of the JWT stored in an httpOnly cookie.

- **createSession**: Generates a HS256 signed token valid for 7 days. It sets the cookie with `secure` and `sameSite: lax` flags to prevent CSRF and script injection.
- **getSession**: Retrieves and verifies the token. If the signature is invalid or expired, it returns null.
- **deleteSession**: Clears the session cookie for logging out.

#### 2. Authentication Hook (useAuth.ts)

A client-side utility using SWR to manage user state across the application.

- **Data Fetching**: Calls the `/api/auth/session` endpoint.
- **Caching**: Includes a 30-second deduping interval to prevent redundant API calls during navigation.
- **State**: Provides `user`, `isLoading`, and `mutate` (used to manually refresh the user state after profile updates).
