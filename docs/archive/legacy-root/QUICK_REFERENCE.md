# ⚡ QUICK REFERENCE — SEEN by CREOVA
**Critical Information for Developers**

---

## 🔑 API BASE URL
```
https://[PROJECT_ID].supabase.co/functions/v1/make-server-2bdc05e6
```

---

## 🔐 AUTHENTICATION FLOW

### Sign Up
```typescript
const response = await fetch(`${API_BASE}/auth/signup`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ANON_KEY}`,
  },
  body: JSON.stringify({
    email, password, name, role, language, intent
  })
});
const { session, user } = await response.json();
// Store: session.access_token, session.refresh_token
```

### Sign In
```typescript
const response = await fetch(`${API_BASE}/auth/signin`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${ANON_KEY}`,
  },
  body: JSON.stringify({ email, password })
});
const { session, user } = await response.json();
```

### Refresh Token (Every 50 min)
```typescript
const response = await fetch(`${API_BASE}/auth/refresh`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refresh_token })
});
const { session, user } = await response.json();
```

### Authenticated Request
```typescript
const response = await fetch(`${API_BASE}/profile`, {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
```

---

## 🛡️ SECURITY FEATURES

### Rate Limits
- **Sign up**: 5/15min per IP
- **Sign in**: 5/15min per IP
- **Password recovery**: 3/15min per IP
- **Token refresh**: 10/15min per IP

### CSRF Protection
Automatic — include `Origin` or `Referer` header (browsers do this automatically)

### Role Requirements
- **Publish content**: creator, moderator, admin
- **Moderation queue**: moderator, admin
- **Review content**: moderator, admin

---

## 📝 KEY ENDPOINTS

### Auth
- `POST /auth/signup` — Create account
- `POST /auth/signin` — Sign in
- `POST /auth/signout` — Sign out
- `POST /auth/refresh` — Refresh token
- `GET /auth/session` — Validate session
- `POST /auth/recovery` — Password reset

### Profile
- `GET /profile` — Get profile
- `PUT /profile` — Update profile
- `POST /profile/request-role` — Request role change

### Preferences
- `GET /preferences` — Get preferences
- `PUT /preferences` — Update preferences

### Content
- `POST /content/publish` — Publish content (creator+)

### Moderation
- `GET /moderation/queue` — Get queue (moderator+)
- `POST /moderation/review` — Review item (moderator+)

### Account
- `DELETE /account` — Delete account

---

## 🎨 USER ROLES

| Role | Permissions |
|------|-------------|
| **viewer** | View, save, respond |
| **creator** | + create content, analytics |
| **moderator** | + moderate, review |
| **admin** | + manage users/collections |

---

## 🌍 SUPPORTED LANGUAGES
- `en` — English
- `fr` — Français
- `es` — Español

---

## 🎯 USER INTENTS
- `explore` — Discover content
- `create` — Make content
- `contribute` — Community engagement

---

## ⚙️ PREFERENCES

```typescript
interface PersonalizationPreferences {
  immersiveNarratives: boolean; // Stories: brief vs deep
  richAudio: boolean;           // Sound: minimal vs rich
  dynamicMotion: boolean;       // Visuals: subtle vs cinematic
}
```

**Default**: All `true`

---

## 🚨 ERROR CODES

| Code | Meaning |
|------|---------|
| 400 | Bad request |
| 401 | Unauthorized |
| 403 | Forbidden (role) |
| 404 | Not found |
| 409 | Conflict (email exists) |
| 429 | Rate limited |
| 500 | Server error |

---

## 🧪 TESTING COMMANDS

### Health Check
```bash
curl https://[PROJECT_ID].supabase.co/functions/v1/make-server-2bdc05e6/health
```

### Sign Up
```bash
curl -X POST $API_BASE/auth/signup \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{"email":"test@example.com","password":"SecurePass123","name":"Test","role":"viewer","language":"en","intent":"explore"}'
```

### Get Profile
```bash
curl $API_BASE/profile \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

## 📦 ENVIRONMENT VARIABLES

```bash
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=[ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[SERVICE_ROLE_KEY]
FRONTEND_URL=https://seen.creova.com  # Production
```

---

## 🔥 CRITICAL FILES

### Backend
- `/supabase/functions/server/index.tsx` — Main server (928 lines)

### Frontend
- `/src/app/contexts/AuthContext.tsx` — Auth state + token refresh
- `/src/app/contexts/StoryStateContext.tsx` — App state

### Documentation
- `/PRODUCTION_LAUNCH_AUDIT.md` — Feature audit
- `/CRITICAL_BLOCKER_REMEDIATION_COMPLETE.md` — Implementation details
- `/API_DOCUMENTATION.md` — Complete API reference
- `/SECURITY_VERIFICATION_CHECKLIST.md` — Security testing
- `/LAUNCH_READINESS_SUMMARY.md` — Launch status

---

## ⏱️ TOKEN LIFECYCLE

1. **Sign up/Sign in** → Get `access_token` (60 min expiry) + `refresh_token`
2. **Every 50 minutes** → Auto-refresh with `refresh_token`
3. **On refresh** → Get new `access_token` + `refresh_token`
4. **On sign out** → Invalidate all tokens

---

## 🛠️ COMMON ISSUES

### "Invalid login credentials"
- Check email/password spelling
- User may not exist — try sign up
- Password must meet requirements (8+ chars, uppercase, lowercase, number)

### "Too many attempts"
- Rate limit hit — wait 15 minutes
- Affects: sign up, sign in, password recovery
- Clearing cookies won't help (IP-based)

### "Forbidden: Insufficient permissions"
- User role doesn't match endpoint requirement
- Check role with `GET /auth/session`
- Request role elevation with `POST /profile/request-role`

### "Invalid request origin"
- CSRF protection triggered
- Check `Origin` or `Referer` header
- Must match allowed origins (localhost:5173 or production domain)

### Session expired
- Token refresh failed
- Sign in again
- Check if `refresh_token` is stored

---

## 📞 SUPPORT

- **Docs**: `/API_DOCUMENTATION.md`
- **Security**: `/SECURITY_VERIFICATION_CHECKLIST.md`
- **Testing**: See "Testing Commands" above
- **Issues**: Check error logs in browser console

---

## ✅ PRE-LAUNCH CHECKLIST

- [ ] Configure SMTP in Supabase
- [ ] Set `FRONTEND_URL` environment variable
- [ ] Test auth flow end-to-end
- [ ] Verify rate limiting works
- [ ] Test role-based access control
- [ ] Review security logs

---

**Last Updated**: February 5, 2026  
**Version**: 1.0.0
