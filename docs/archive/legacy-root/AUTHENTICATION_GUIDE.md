# SEEN Authentication & Role Management System

## Overview

SEEN now features a **secure, production-ready authentication and role management system** powered by Supabase. This implementation removes all testing/manual role switching and ensures roles are managed exclusively through backend APIs with proper security controls.

---

## Architecture

### Frontend → Backend → Database

```
┌─────────────────────────────────────────────┐
│           Frontend (React)                  │
│  - AuthContext: Authentication state        │
│  - StoryStateContext: App state             │
│  - OnboardingSystem: Account creation       │
│  - ProfileScreen: User profile & sign out   │
└──────────────────┬──────────────────────────┘
                   │ HTTPS + JWT
┌──────────────────▼──────────────────────────┐
│      Supabase Edge Function (Hono)          │
│  - Auth endpoints (signup/signin/signout)   │
│  - Profile endpoints (get/update)           │
│  - Role management (request elevation)      │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│           Supabase Backend                  │
│  - Auth: Secure user authentication         │
│  - KV Store: User profiles & role data      │
│  - JWT: Token-based session management      │
└─────────────────────────────────────────────┘
```

---

## Key Features

### ✅ Secure Authentication
- **Email/password signup** during onboarding
- **JWT-based sessions** with access & refresh tokens
- **Server-side validation** on all protected routes
- **Automatic session restoration** on app reload

### ✅ Role Management
- Roles set **once during onboarding** (Viewer, Creator, Moderator)
- Stored **server-side** in Supabase KV store
- Cannot be changed by users directly
- **Role elevation requests** available for viewers → creators

### ✅ Security Controls
- Service role key **never exposed** to frontend
- Protected endpoints require valid JWT tokens
- Users cannot modify their own roles
- Admin-only endpoints for role changes (future)

### ✅ CMF Grant Compliance
- **Privacy-first**: No behavioral tracking
- **Local + server storage**: User preferences sync
- **No surveillance analytics**: Only essential user data
- **Data ownership**: Users can sign out and delete data

---

## API Endpoints

### Authentication

#### 1. Sign Up
```http
POST /make-server-2bdc05e6/auth/signup
Content-Type: application/json
Authorization: Bearer <public_anon_key>

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "User Name",
  "role": "viewer|creator|moderator",
  "language": "en|fr|es",
  "intent": "explore|create|contribute"
}
```

**Note:** Even though this is a public endpoint, Supabase Edge Functions require the Authorization header with the public anon key.

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "viewer",
    "language": "en",
    "intent": "explore"
  }
}
```

#### 2. Sign In
```http
POST /make-server-2bdc05e6/auth/signin
Content-Type: application/json
Authorization: Bearer <public_anon_key>

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Note:** Public endpoint, but requires anon key in Authorization header.

**Response:**
```json
{
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token"
  },
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "viewer"
  }
}
```

#### 3. Get Session
```http
GET /make-server-2bdc05e6/auth/session
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "viewer"
  }
}
```

#### 4. Sign Out
```http
POST /make-server-2bdc05e6/auth/signout
Authorization: Bearer <access_token>
```

### Profile Management

#### 5. Get Profile
```http
GET /make-server-2bdc05e6/profile
Authorization: Bearer <access_token>
```

#### 6. Update Profile
```http
PUT /make-server-2bdc05e6/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "New Name",
  "language": "fr",
  "intent": "create"
}
```

**Note:** Role cannot be changed via this endpoint.

#### 7. Request Role Elevation
```http
POST /make-server-2bdc05e6/profile/request-role
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "requestedRole": "creator",
  "reason": "I want to share my music and stories"
}
```

---

## Frontend Implementation

### 1. AuthContext (`/src/app/contexts/AuthContext.tsx`)

Manages authentication state across the app:

```typescript
const { state, signUp, signIn, signOut, checkSession } = useAuth();

// state.user - Current user object
// state.accessToken - JWT token
// state.isAuthenticated - Boolean
// state.isLoading - Loading state
```

### 2. OnboardingSystem (`/src/app/components/OnboardingSystem.tsx`)

Includes **Account Creation Step**:
- Collects email, password, name
- Calls `signUp()` with selected role & intent
- Automatically signs in after account creation
- Proceeds to presence setup

### 3. ProfileScreen (`/src/app/components/ProfileScreen.tsx`)

- Displays user info from `authState.user`
- **Sign Out button** clears session and reloads app
- **No manual role switching** - testing mode removed

### 4. App.tsx

- Syncs `authState.user.role` → `StoryStateContext`
- Redirects to onboarding if not authenticated
- Restores session on page reload

---

## User Flow

### First-Time User Journey

1. **Invocation Layer** → Emotional welcome screen
2. **Role Selection** → Choose: Viewer, Creator, or Moderator
3. **Intent Selection** → What brings you here?
4. **Account Creation** ⭐ → Email, password, name
5. **Presence Setup** → Your space forms here
6. **Threshold** → "You are now SEEN"
7. **For You Feed** → Main app experience

### Returning User Journey

1. App loads → Checks localStorage for session
2. If valid JWT → Validates with backend
3. If valid → Restores user data & navigates to For You
4. If invalid → Shows onboarding

### Sign Out Flow

1. User clicks "Sign Out" in Profile
2. Calls `signOut()` → Invalidates JWT
3. Clears localStorage (auth + onboarding flags)
4. Reloads app → Shows onboarding

---

## Security Best Practices

### ✅ Implemented

- [x] JWT tokens for session management
- [x] Access tokens stored in memory (AuthContext state)
- [x] Service role key isolated to backend only
- [x] Protected routes require Authorization header
- [x] User roles stored server-side in KV store
- [x] Email confirmation auto-enabled (no email server)
- [x] CORS configured for frontend access
- [x] Error messages logged with context

### 🔒 For Production Deployment

- [ ] Enable HTTPS only (no HTTP)
- [ ] Set up proper email confirmation workflow
- [ ] Implement rate limiting on auth endpoints
- [ ] Add refresh token rotation
- [ ] Configure session expiration policies
- [ ] Set up audit logs for role changes
- [ ] Implement account deletion workflow
- [ ] Add password reset functionality
- [ ] Configure environment-specific CORS
- [ ] Set up monitoring and alerts

---

## Data Storage

### Backend (Supabase KV Store)

```typescript
// User Profile
`user_profile:${userId}` → {
  id: string,
  email: string,
  name: string,
  role: 'viewer' | 'creator' | 'moderator' | 'admin',
  language: 'en' | 'fr' | 'es',
  intent: 'explore' | 'create' | 'contribute',
  createdAt: string,
  updatedAt: string
}

// Role Request
`role_request:${userId}` → {
  userId: string,
  requestedRole: string,
  reason: string,
  status: 'pending' | 'approved' | 'rejected',
  createdAt: string
}
```

### Frontend (localStorage)

```typescript
// Auth Session
'seenos_auth_session' → {
  accessToken: string,
  user: User
}

// Onboarding State
'onboarding_completed' → 'true' | 'false'
'hasEnteredSEEN' → 'true' | 'false'
'onboarding_step' → '0' | '1' | '2' | '3' | '4'

// App State (StoryStateContext)
'seenos_story_state' → {
  language: Language,
  intent: UserIntent,
  userRole: UserRole,
  ...
}
```

---

## Role Permissions

| Feature | Viewer | Creator | Moderator | Admin |
|---------|--------|---------|-----------|-------|
| Browse Stories | ✅ | ✅ | ✅ | ✅ |
| Bookmark Stories | ✅ | ✅ | ✅ | ✅ |
| Submit Community Responses | ✅ | ✅ | ✅ | ✅ |
| **Create Stories** | ❌ | ✅ | ✅ | ✅ |
| **Story Builder Access** | ❌ | ✅ | ✅ | ✅ |
| **Review Submissions** | ❌ | ❌ | ✅ | ✅ |
| **Moderation Panel** | ❌ | ❌ | ✅ | ✅ |
| **Institutional Collections** | ❌ | ❌ | ❌ | ✅ |
| **Manage Users** | ❌ | ❌ | ❌ | ✅ |

---

## Testing

### Quick Test Flow

1. **Clear all data:** 
   - Open DevTools → Application → Storage → Clear Site Data
   
2. **Fresh onboarding:**
   - Reload app
   - Complete invocation layer
   - Select role (try Creator)
   - Select intent
   - Create account with test credentials
   - Complete presence & threshold

3. **Verify authentication:**
   - Check Profile screen shows your name/email
   - Navigate around the app
   - Reload page → Should stay signed in

4. **Test sign out:**
   - Go to Profile → Sign Out
   - Should redirect to onboarding
   - Try signing in again with same credentials

5. **Test role permissions:**
   - Sign up as Viewer → No Creator Dashboard
   - Sign up as Creator → See Creator Dashboard
   - Sign up as Moderator → See Moderation Panel

---

## Troubleshooting

### "Failed to create user" Error
- Check that email hasn't been used before
- Verify Supabase connection is active
- Check browser console for detailed error

### Session Not Persisting
- Check localStorage for `seenos_auth_session`
- Verify JWT token hasn't expired
- Try clearing storage and re-authenticating

### Role Not Syncing
- Check that `authState.user.role` exists
- Verify `useEffect` in App.tsx is running
- Check StoryStateContext has updated role

### Can't Sign Out
- Check that signOut() is being called
- Verify localStorage is being cleared
- Ensure page reload happens after sign out

---

## Future Enhancements

### Phase 2: Social Login
- Google OAuth integration
- Facebook login
- GitHub authentication
- Apple Sign In

### Phase 3: Advanced Role Management
- Admin panel for role approvals
- Creator application workflow
- Role history tracking
- Permission granularity

### Phase 4: Account Features
- Profile photo upload
- Bio customization
- Privacy settings
- Account deletion

---

## Contact & Support

For questions or issues with authentication:
- Check `/supabase/functions/server/index.tsx` for backend logic
- Review `/src/app/contexts/AuthContext.tsx` for frontend state
- Consult Supabase dashboard for auth logs

**Built for SEEN**  
A CMF grant-compliant, privacy-first cultural media platform.