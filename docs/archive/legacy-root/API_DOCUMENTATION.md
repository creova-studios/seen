# SEEN by CREOVA — API Documentation
**Version**: 1.0.0  
**Base URL**: `https://[PROJECT_ID].supabase.co/functions/v1/make-server-2bdc05e6`  
**Date**: February 5, 2026

---

## Authentication

All authenticated endpoints require an `Authorization` header with a Bearer token:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## Endpoints

### 🔐 Authentication Endpoints

#### Sign Up
**POST** `/auth/signup`

Create a new user account.

**Rate Limit**: 5 requests per 15 minutes per IP

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer SUPABASE_ANON_KEY"
}
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "Jane Doe",
  "role": "viewer",
  "language": "en",
  "intent": "explore"
}
```

**Response** (201 Created):
```json
{
  "session": {
    "access_token": "eyJ...",
    "refresh_token": "v1.Mr..."
  },
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe",
    "role": "viewer",
    "language": "en",
    "intent": "explore"
  }
}
```

**Errors**:
- `400` — Missing required fields or invalid role
- `409` — Email already exists
- `429` — Too many attempts
- `500` — Server error

---

#### Sign In
**POST** `/auth/signin`

Sign in an existing user.

**Rate Limit**: 5 requests per 15 minutes per IP

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer SUPABASE_ANON_KEY"
}
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response** (200 OK):
```json
{
  "session": {
    "access_token": "eyJ...",
    "refresh_token": "v1.Mr..."
  },
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe",
    "role": "viewer",
    "language": "en",
    "intent": "explore"
  }
}
```

**Errors**:
- `400` — Missing email or password
- `401` — Invalid credentials
- `404` — Account not found
- `429` — Too many attempts
- `500` — Server error

---

#### Refresh Session
**POST** `/auth/refresh`

Refresh an expired access token.

**Rate Limit**: 10 requests per 15 minutes per IP

**Headers**:
```json
{
  "Content-Type": "application/json"
}
```

**Request Body**:
```json
{
  "refresh_token": "v1.Mr..."
}
```

**Response** (200 OK):
```json
{
  "session": {
    "access_token": "eyJ...",
    "refresh_token": "v1.Mr...",
    "expires_at": 1738761600
  },
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe",
    "role": "viewer",
    "language": "en",
    "intent": "explore"
  }
}
```

**Errors**:
- `400` — Missing refresh_token
- `401` — Invalid or expired refresh token
- `429` — Too many attempts
- `500` — Server error

---

#### Sign Out
**POST** `/auth/signout`

Sign out the current user.

**Authentication**: Required

**Headers**:
```json
{
  "Authorization": "Bearer ACCESS_TOKEN"
}
```

**Response** (200 OK):
```json
{
  "message": "Signed out successfully"
}
```

**Errors**:
- `401` — Unauthorized
- `400` — Sign out failed
- `500` — Server error

---

#### Get Session
**GET** `/auth/session`

Validate current session and get user data.

**Authentication**: Required

**Headers**:
```json
{
  "Authorization": "Bearer ACCESS_TOKEN"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe",
    "role": "viewer",
    "language": "en",
    "intent": "explore",
    "personalizationPreferences": {
      "immersiveNarratives": true,
      "richAudio": true,
      "dynamicMotion": false
    }
  }
}
```

**Errors**:
- `401` — Invalid or expired token
- `500` — Server error

---

#### Password Recovery
**POST** `/auth/recovery`

Request a password reset email.

**Rate Limit**: 3 requests per 15 minutes per IP

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer SUPABASE_ANON_KEY"
}
```

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response** (200 OK):
```json
{
  "message": "If an account exists with this email, a recovery link has been sent."
}
```

**Note**: Always returns success to prevent user enumeration.

**Errors**:
- `400` — Missing email
- `429` — Too many attempts
- `500` — Server error

---

### 👤 Profile Endpoints

#### Get Profile
**GET** `/profile`

Get current user's profile.

**Authentication**: Required

**Headers**:
```json
{
  "Authorization": "Bearer ACCESS_TOKEN"
}
```

**Response** (200 OK):
```json
{
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe",
    "role": "creator",
    "language": "en",
    "intent": "create",
    "personalizationPreferences": {
      "immersiveNarratives": true,
      "richAudio": true,
      "dynamicMotion": false
    },
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-02-05T12:00:00.000Z"
  }
}
```

**Errors**:
- `401` — Unauthorized
- `404` — Profile not found
- `500` — Server error

---

#### Update Profile
**PUT** `/profile`

Update user profile (name, language, intent).

**Authentication**: Required

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer ACCESS_TOKEN"
}
```

**Request Body**:
```json
{
  "name": "Jane Smith",
  "language": "fr",
  "intent": "contribute"
}
```

**Note**: Role cannot be changed through this endpoint. Use `/profile/request-role` for role elevation.

**Response** (200 OK):
```json
{
  "profile": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Smith",
    "role": "creator",
    "language": "fr",
    "intent": "contribute",
    "updatedAt": "2026-02-05T12:00:00.000Z"
  }
}
```

**Errors**:
- `401` — Unauthorized
- `404` — Profile not found
- `500` — Server error

---

#### Request Role Elevation
**POST** `/profile/request-role`

Submit a request for role elevation (e.g., viewer → creator).

**Authentication**: Required

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer ACCESS_TOKEN"
}
```

**Request Body**:
```json
{
  "requestedRole": "creator",
  "reason": "I am a filmmaker and want to share my cultural stories on SEEN."
}
```

**Response** (200 OK):
```json
{
  "message": "Role elevation request submitted successfully",
  "status": "pending"
}
```

**Errors**:
- `400` — Missing required fields
- `401` — Unauthorized
- `500` — Server error

---

### ⚙️ Preferences Endpoints

#### Get Preferences
**GET** `/preferences`

Get user's personalization preferences.

**Authentication**: Required

**Headers**:
```json
{
  "Authorization": "Bearer ACCESS_TOKEN"
}
```

**Response** (200 OK):
```json
{
  "preferences": {
    "immersiveNarratives": true,
    "richAudio": true,
    "dynamicMotion": false
  }
}
```

**Default Values** (if not set):
```json
{
  "immersiveNarratives": true,
  "richAudio": true,
  "dynamicMotion": true
}
```

**Errors**:
- `401` — Unauthorized
- `404` — Profile not found
- `500` — Server error

---

#### Update Preferences
**PUT** `/preferences`

Update user's personalization preferences.

**Authentication**: Required

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer ACCESS_TOKEN"
}
```

**Request Body**:
```json
{
  "immersiveNarratives": false,
  "richAudio": true,
  "dynamicMotion": true
}
```

**Preference Descriptions**:
- `immersiveNarratives` — Stories: `false` = brief, `true` = immersive/deep
- `richAudio` — Sound: `false` = minimal, `true` = rich/layered
- `dynamicMotion` — Visuals: `false` = subtle, `true` = cinematic/full

**Response** (200 OK):
```json
{
  "preferences": {
    "immersiveNarratives": false,
    "richAudio": true,
    "dynamicMotion": true
  }
}
```

**Errors**:
- `400` — Invalid preference values (must be boolean)
- `401` — Unauthorized
- `404` — Profile not found
- `500` — Server error

---

### 📝 Content Endpoints

#### Publish Content
**POST** `/content/publish`

Publish new content (story, film, audio, etc.).

**Authentication**: Required  
**Role Required**: `creator`, `moderator`, or `admin`

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer ACCESS_TOKEN"
}
```

**Request Body**:
```json
{
  "title": "A Cultural Journey",
  "description": "An immersive exploration of traditional music and storytelling.",
  "language": "en",
  "chapters": [
    {
      "id": "chapter_1",
      "title": "Introduction",
      "content": "...",
      "audioUrl": "https://...",
      "duration": 300
    }
  ],
  "tags": ["music", "culture", "storytelling"],
  "visibility": "public"
}
```

**Field Validation**:
- `title` — Required, max 200 characters
- `description` — Required, max 1000 characters
- `language` — Required, must be: `en`, `fr`, or `es`
- `chapters` — Required, must be array
- `tags` — Optional, array of strings
- `visibility` — Optional, defaults to `public` (options: `public`, `unlisted`, `private`)

**Response** (201 Created):

**For new creators** (first submission):
```json
{
  "contentId": "content_1738761600_xyz123",
  "status": "under_review",
  "message": "Content submitted for review. It will be published after moderation approval."
}
```

**For verified creators**:
```json
{
  "contentId": "content_1738761600_xyz123",
  "status": "published",
  "message": "Content published successfully."
}
```

**Errors**:
- `400` — Missing required fields or invalid values
- `401` — Unauthorized
- `403` — Insufficient permissions (role: viewer)
- `500` — Server error

---

### 🛡️ Moderation Endpoints

#### Get Moderation Queue
**GET** `/moderation/queue`

Get all pending moderation items.

**Authentication**: Required  
**Role Required**: `moderator` or `admin`

**Headers**:
```json
{
  "Authorization": "Bearer ACCESS_TOKEN"
}
```

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "mod_1738761600_abc123",
      "contentId": "content_1738761600_xyz123",
      "authorId": "user_uuid",
      "reason": "New creator - first content submission",
      "status": "pending",
      "createdAt": "2026-02-05T12:00:00.000Z",
      "content": {
        "title": "A Cultural Journey",
        "description": "An immersive exploration...",
        "language": "en",
        "authorName": "Jane Doe"
      }
    }
  ],
  "total": 1
}
```

**Errors**:
- `401` — Unauthorized
- `403` — Insufficient permissions (role: viewer or creator)
- `500` — Server error

---

#### Review Moderation Item
**POST** `/moderation/review`

Approve or reject a moderation item.

**Authentication**: Required  
**Role Required**: `moderator` or `admin`

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer ACCESS_TOKEN"
}
```

**Request Body**:
```json
{
  "itemId": "mod_1738761600_abc123",
  "action": "approve",
  "reason": "Content meets community guidelines and quality standards."
}
```

**Actions**:
- `approve` — Publish content and mark creator as verified
- `reject` — Reject content with reason

**Response** (200 OK):
```json
{
  "message": "Content approved successfully."
}
```

**Errors**:
- `400` — Missing required fields or invalid action
- `401` — Unauthorized
- `403` — Insufficient permissions
- `404` — Moderation item not found
- `500` — Server error

---

### 🗑️ Account Management

#### Delete Account
**DELETE** `/account`

Permanently delete user account and anonymize content.

**Authentication**: Required

**Headers**:
```json
{
  "Authorization": "Bearer ACCESS_TOKEN"
}
```

**Response** (200 OK):
```json
{
  "message": "Your account has been permanently deleted. All personal data has been removed, and your content contributions have been anonymized.",
  "deletedAt": "2026-02-05T12:00:00.000Z"
}
```

**What Gets Deleted**:
- ✅ User profile
- ✅ Personal information
- ✅ User from authentication system
- ✅ Role requests
- ✅ Creator verification status

**What Gets Anonymized** (not deleted):
- ⚠️ Published content (preserved for platform integrity)
  - `authorId` → `'deleted_user'`
  - `authorName` → `'Deleted User'`

**GDPR Compliance**:
- ✅ Right to erasure (Article 17)
- ⚠️ **TODO**: Data export before deletion (Article 20)

**Errors**:
- `401` — Unauthorized
- `500` — Server error

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Human-readable error message",
  "code": "machine_readable_error_code",
  "details": { /* optional additional context */ }
}
```

### Common HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| `200` | OK | Request succeeded |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid request parameters |
| `401` | Unauthorized | Missing or invalid authentication |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `409` | Conflict | Resource already exists (e.g., email) |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Server error |

---

## Rate Limiting

Rate limits are enforced per IP address per endpoint:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/auth/signup` | 5 requests | 15 minutes |
| `/auth/signin` | 5 requests | 15 minutes |
| `/auth/recovery` | 3 requests | 15 minutes |
| `/auth/refresh` | 10 requests | 15 minutes |

**Rate Limit Response** (429):
```json
{
  "error": "Too many attempts. Please try again later.",
  "retryAfter": 900
}
```

`retryAfter` is in seconds.

---

## Security

### CSRF Protection

All state-changing requests (POST, PUT, DELETE, PATCH) must include a valid `Origin` or `Referer` header matching the allowed origins.

**Allowed Origins**:
- `http://localhost:5173` (development)
- `http://127.0.0.1:5173` (development)
- Production domain (configured via `FRONTEND_URL` environment variable)

**CSRF Error** (403):
```json
{
  "error": "Invalid request origin"
}
```

---

### Role-Based Access Control

Some endpoints require specific roles:

| Role | Permissions |
|------|-------------|
| `viewer` | View content, save content, respond to stories |
| `creator` | All viewer permissions + create content, view analytics |
| `moderator` | All creator permissions + moderate content, review submissions |
| `admin` | All moderator permissions + manage users, manage collections |

**Insufficient Permissions Error** (403):
```json
{
  "error": "Forbidden: Insufficient permissions",
  "required": ["creator", "moderator", "admin"],
  "current": "viewer"
}
```

---

## Data Types

### User Roles
```typescript
type UserRole = 'viewer' | 'creator' | 'moderator' | 'admin';
```

### Languages
```typescript
type Language = 'en' | 'fr' | 'es';
```

### User Intent
```typescript
type UserIntent = 'explore' | 'create' | 'contribute';
```

### Content Visibility
```typescript
type Visibility = 'public' | 'unlisted' | 'private';
```

### Content Status
```typescript
type ContentStatus = 'draft' | 'published' | 'under_review' | 'rejected';
```

### Moderation Status
```typescript
type ModerationStatus = 'pending' | 'approved' | 'rejected';
```

---

## Examples

### Complete Authentication Flow

```typescript
// 1. Sign up
const signupResponse = await fetch(`${API_BASE}/auth/signup`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePassword123',
    name: 'Jane Doe',
    role: 'viewer',
    language: 'en',
    intent: 'explore',
  }),
});

const { session, user } = await signupResponse.json();

// Store tokens
localStorage.setItem('access_token', session.access_token);
localStorage.setItem('refresh_token', session.refresh_token);

// 2. Use access token for authenticated requests
const profileResponse = await fetch(`${API_BASE}/profile`, {
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
  },
});

const { profile } = await profileResponse.json();

// 3. Refresh token when expired (every 50 minutes)
const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    refresh_token: session.refresh_token,
  }),
});

const { session: newSession } = await refreshResponse.json();

// Update stored tokens
localStorage.setItem('access_token', newSession.access_token);
localStorage.setItem('refresh_token', newSession.refresh_token);
```

---

### Content Publication Flow

```typescript
// 1. Check if user is a creator
const sessionResponse = await fetch(`${API_BASE}/auth/session`, {
  headers: { 'Authorization': `Bearer ${accessToken}` },
});

const { user } = await sessionResponse.json();

if (!['creator', 'moderator', 'admin'].includes(user.role)) {
  console.error('User must be a creator to publish content');
  // Request role elevation
  await fetch(`${API_BASE}/profile/request-role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      requestedRole: 'creator',
      reason: 'I want to share my cultural stories',
    }),
  });
  return;
}

// 2. Publish content
const publishResponse = await fetch(`${API_BASE}/content/publish`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    title: 'My Story',
    description: 'A cultural narrative',
    language: 'en',
    chapters: [/* ... */],
    tags: ['culture', 'music'],
    visibility: 'public',
  }),
});

const { contentId, status } = await publishResponse.json();

if (status === 'under_review') {
  console.log('Content submitted for moderation');
} else if (status === 'published') {
  console.log('Content published successfully');
}
```

---

## Changelog

### Version 1.0.0 (February 5, 2026)
- ✅ Initial API release
- ✅ Authentication endpoints
- ✅ Profile management
- ✅ Personalization preferences
- ✅ Content publication
- ✅ Moderation system
- ✅ Account deletion
- ✅ Rate limiting
- ✅ CSRF protection
- ✅ Role-based access control

---

## Support

For API support or bug reports, contact:
- **Email**: dev@creova.com
- **Documentation**: https://seen.creova.com/docs
- **Status Page**: https://status.creova.com

---

**Generated**: February 5, 2026  
**API Version**: 1.0.0  
**License**: Proprietary — SEEN by CREOVA
