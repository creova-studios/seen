# CMF Grant Readiness - Permissions & Access Control Matrix

## Role Definitions

### Viewer
Default role for all users consuming content.

### Creator
Users who publish original stories and cultural content.

### Moderator  
Trusted community members who review flagged content and curate featured stories.

### Admin
Platform administrators with full system access and grant reporting capabilities.

---

## Endpoint Permissions Matrix

| Endpoint | Viewer | Creator | Moderator | Admin | Public (No Auth) |
|----------|--------|---------|-----------|-------|------------------|
| **Cultural Metrics** |
| GET /metrics/cultural-impact | ❌ | ❌ | ✅ | ✅ | ❌ |
| POST /metrics/track-view | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /metrics/track-progress | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Governance & Moderation** |
| POST /governance/report | ✅ | ✅ | ✅ | ✅ | ⚠️ Optional Auth |
| GET /governance/stats | ❌ | ❌ | ✅ | ✅ | ❌ |
| GET /moderation/queue | ❌ | ❌ | ✅ | ✅ | ❌ |
| POST /moderation/review | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Creator Rights & IP** |
| POST /ip/set-license | ❌ | ✅ (own) | ✅ | ✅ | ❌ |
| GET /ip/attribution/:id | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /ip/export | ✅ (licensed) | ✅ | ✅ | ✅ | ⚠️ Optional Auth |
| **Ethical Discovery** |
| POST /discovery/start | ✅ | ✅ | ✅ | ✅ | ⚠️ Optional Auth |
| GET /discovery/recommendations/:id | ✅ | ✅ | ✅ | ✅ | ⚠️ Optional Auth |
| GET /discovery/featured | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /discovery/curate | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Accessibility** |
| POST /accessibility/captions | ❌ | ✅ (own) | ✅ | ✅ | ❌ |
| POST /accessibility/transcript | ❌ | ✅ (own) | ✅ | ✅ | ❌ |
| GET /accessibility/compliance-report | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Grant Readiness & Audit** |
| POST /grant/generate-report | ❌ | ❌ | ❌ | ✅ | ❌ |
| POST /grant/milestone | ❌ | ❌ | ❌ | ✅ | ❌ |
| GET /grant/milestones | ❌ | ❌ | ✅ | ✅ | ❌ |
| POST /grant/incident | ✅ | ✅ | ✅ | ✅ | ❌ |
| GET /grant/activity-logs | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Existing Endpoints** |
| POST /auth/signup | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /auth/signin | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /auth/signout | ✅ | ✅ | ✅ | ✅ | ❌ |
| GET /auth/session | ✅ | ✅ | ✅ | ✅ | ❌ |
| POST /auth/refresh | ✅ | ✅ | ✅ | ✅ | ❌ |
| POST /auth/recovery | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /profile | ✅ | ✅ | ✅ | ✅ | ❌ |
| PUT /profile | ✅ | ✅ | ✅ | ✅ | ❌ |
| POST /profile/request-role | ✅ | ✅ | ❌ | ❌ | ❌ |
| PUT /preferences | ✅ | ✅ | ✅ | ✅ | ❌ |
| GET /preferences | ✅ | ✅ | ✅ | ✅ | ❌ |
| POST /content/publish | ❌ | ✅ | ✅ | ✅ | ❌ |
| DELETE /account | ✅ | ✅ | ✅ | ✅ | ❌ |

**Legend:**
- ✅ Full access
- ⚠️ Optional authentication (enhanced features with auth)
- ❌ No access
- ✅ (own) Access to own content only
- ✅ (licensed) Access based on content license

---

## Permission Details

### Cultural Metrics

#### GET /metrics/cultural-impact
**Required Role**: Admin or Moderator

**Rationale**: Contains aggregated platform statistics that should only be visible to administrators and moderators for grant reporting and platform health monitoring.

**Returns**: Cultural impact snapshot with creator demographics, content metrics, geographic distribution.

---

#### POST /metrics/track-view
**Required Role**: None (public)

**Rationale**: Privacy-preserving view tracking requires no authentication. Session-based tracking ensures metrics collection without user identification.

**Returns**: Confirmation of view tracked.

---

#### POST /metrics/track-progress
**Required Role**: None (public)

**Rationale**: Same as track-view - privacy-first design allows anonymous engagement tracking via session IDs.

**Returns**: Confirmation of progress tracked.

---

### Governance & Moderation

#### POST /governance/report
**Required Role**: None (public, but authenticated users get priority)

**Rationale**: Anyone should be able to report harmful content, including unauthenticated users to protect vulnerable community members. Authenticated reports are prioritized in moderation queue.

**Returns**: Flag record with confirmation message.

---

#### GET /governance/stats
**Required Role**: Moderator or Admin

**Rationale**: Moderation statistics contain sensitive information about flagged content and should only be accessible to trusted moderators and administrators.

**Returns**: Aggregated moderation statistics (flags by reason, severity, status, actions taken, appeals).

---

#### GET /moderation/queue
**Required Role**: Moderator or Admin

**Rationale**: Only moderators and admins should see pending content reviews to maintain efficiency and prevent queue manipulation.

**Returns**: List of pending moderation items with content details.

---

#### POST /moderation/review
**Required Role**: Moderator or Admin

**Rationale**: Only trusted moderators and admins can make decisions on flagged content.

**Returns**: Confirmation of moderation action.

---

### Creator Rights & IP

#### POST /ip/set-license
**Required Role**: Creator (for own content), Moderator, or Admin

**Rationale**: Only content owners can set licensing terms. Moderators and admins may need to update licensing in exceptional cases (e.g., legal compliance).

**Returns**: Updated license details.

---

#### GET /ip/attribution/:contentId
**Required Role**: None (public)

**Rationale**: Attribution should be publicly visible to ensure creator credit is always accessible, regardless of authentication status.

**Returns**: Attribution record with creator chain and formatted attribution text.

---

#### POST /ip/export
**Required Role**: Creator (for own content) or authenticated user (for licensed content)

**Rationale**: 
- Private content: Owner only
- Community content: Authenticated users
- Public content: Anyone (including unauthenticated)

Access control enforced via `canAccessContent()` check.

**Returns**: Export request details with download URL (when ready).

---

### Ethical Discovery

#### POST /discovery/start
**Required Role**: None (public)

**Rationale**: Discovery sessions can be anonymous for privacy. Authenticated users get personalized recommendations if opt-in is enabled.

**Returns**: Discovery session ID.

---

#### GET /discovery/recommendations/:sessionId
**Required Role**: None (public)

**Rationale**: Recommendations are based on session, not user. Authentication enhances recommendations if user has opted into personalization.

**Returns**: Scored content recommendations.

---

#### GET /discovery/featured
**Required Role**: None (public)

**Rationale**: Featured content is editorially curated for public visibility and should be accessible to all users to maximize cultural reach.

**Returns**: List of featured content.

---

#### POST /discovery/curate
**Required Role**: Moderator or Admin

**Rationale**: Only trusted moderators and admins should curate content to maintain editorial quality and prevent manipulation.

**Returns**: Curation record.

---

### Accessibility

#### POST /accessibility/captions
**Required Role**: Creator (for own content), Moderator, or Admin

**Rationale**: Content owners should add captions to their own content. Moderators and admins can assist creators or add captions for accessibility compliance.

**Returns**: Caption track details.

---

#### POST /accessibility/transcript
**Required Role**: Creator (for own content), Moderator, or Admin

**Rationale**: Same as captions - owner-driven with moderator/admin support.

**Returns**: Transcript details.

---

#### GET /accessibility/compliance-report
**Required Role**: Moderator or Admin

**Rationale**: Platform-wide accessibility statistics should only be visible to moderators and admins for compliance monitoring and grant reporting.

**Returns**: Accessibility compliance statistics (WCAG levels, caption coverage, etc.).

---

### Grant Readiness & Audit

#### POST /grant/generate-report
**Required Role**: Admin

**Rationale**: Grant reports contain sensitive platform-wide data and should only be generated by administrators for official CMF submissions.

**Returns**: Comprehensive grant report (JSON or CSV).

---

#### POST /grant/milestone
**Required Role**: Admin

**Rationale**: Only administrators should create platform milestones for grant tracking.

**Returns**: Milestone record.

---

#### GET /grant/milestones
**Required Role**: Moderator or Admin

**Rationale**: Moderators may need visibility into platform milestones for coordination. Full access for admins.

**Returns**: List of milestones.

---

#### POST /grant/incident
**Required Role**: Any authenticated user

**Rationale**: All authenticated users should be able to report incidents (security issues, bugs, etc.) to maintain platform health. Anonymous reporting disabled to prevent spam.

**Returns**: Incident record.

---

#### GET /grant/activity-logs
**Required Role**: Admin

**Rationale**: Activity logs contain sensitive audit trail data and should only be accessible to administrators for compliance and security monitoring.

**Returns**: Filtered activity log entries.

---

## Special Permissions & Edge Cases

### Content Ownership Checks

When endpoints specify "own content only", the backend performs ownership verification:

```typescript
const ownership = await kv.get(`ip_ownership:${contentId}`);
if (ownership.creatorId !== userId) {
  return c.json({ error: "Unauthorized: You can only modify your own content" }, 403);
}
```

---

### License-Based Access

For content export, access is determined by license type:

```typescript
const license = await kv.get(`content_license:${contentId}`);

switch (license.licenseType) {
  case 'public':
    // Anyone can access
    return { canAccess: true };
  
  case 'community':
    // Authenticated users only
    if (!userId) {
      return { canAccess: false, reason: 'Authentication required for community content' };
    }
    return { canAccess: true };
  
  case 'private':
    // Owner and collaborators only
    if (ownership.creatorId === userId || isCollaborator(userId)) {
      return { canAccess: true };
    }
    return { canAccess: false, reason: 'Private content - owner only' };
}
```

---

### Role Elevation

Users can request role elevation via:

```
POST /profile/request-role
Body: { requestedRole: "creator", reason: "I want to publish my Indigenous stories" }
```

**Approval workflow**:
1. User submits request
2. Admin reviews in admin panel (future UI)
3. Admin approves/denies
4. User's role is updated
5. User gains access to creator-only endpoints

**Current implementation**: Backend logic complete, admin UI pending.

---

## Rate Limiting

All endpoints are protected with rate limiting:

| Endpoint Category | Max Requests | Window | Block Duration |
|------------------|--------------|--------|----------------|
| Auth endpoints (signup, signin) | 5 | 15 minutes | 15 minutes |
| Password recovery | 3 | 15 minutes | 15 minutes |
| Session refresh | 10 | 15 minutes | 15 minutes |
| Other endpoints | No limit | N/A | N/A |

**Rationale**: Auth endpoints are rate-limited to prevent brute force attacks. Other endpoints have no hard limits but can be added if abuse is detected.

---

## CSRF Protection

All POST, PUT, DELETE, PATCH requests are protected with CSRF validation:

**Allowed origins**:
- FRONTEND_URL environment variable
- localhost:5173 (development)
- Supabase Edge Functions (internal)

**Validation logic**:
```typescript
const origin = request.headers.get('origin');
const referer = request.headers.get('referer');

if (!isValidOrigin(origin) && !isValidReferer(referer)) {
  return 403 Forbidden;
}
```

---

## Security Best Practices

### Token Handling
- **Access tokens** expire after 1 hour
- **Refresh tokens** used to renew sessions
- **Tokens** transmitted via Authorization header only (never URL params)

### Password Security
- **Minimum 8 characters**
- **Must include**: uppercase, lowercase, number
- **Server-side validation** before account creation

### Data Privacy
- **No tracking** of individual user behavior
- **Anonymized metrics** only
- **Session-based** engagement tracking
- **Opt-in personalization** required

---

## Compliance Summary

| Requirement | Implementation | Status |
|------------|----------------|--------|
| Role-based access control | Per-endpoint permission checks | ✅ |
| CSRF protection | Origin/referer validation | ✅ |
| Rate limiting | Configurable per endpoint | ✅ |
| Token security | JWT with expiry + refresh | ✅ |
| Password strength | Server-side validation | ✅ |
| Data privacy | Anonymized, aggregated only | ✅ |
| Audit trail | Activity logging for all actions | ✅ |
| Content ownership | IP ownership verification | ✅ |
| License enforcement | Access control per license type | ✅ |

---

## Future Enhancements

### Phase 2: Advanced Permissions
- **Content collaborator roles** (co-author, editor, translator)
- **Organization accounts** (institutional collections)
- **Team permissions** (moderator teams with specialized roles)
- **Time-based permissions** (temporary access grants)

### Phase 3: Fine-Grained Control
- **Attribute-based access control** (ABAC)
- **Content-level permissions** (per-chapter access)
- **API key authentication** (for integrations)
- **OAuth provider support** (Google, Facebook, GitHub)

---

## Summary

✅ **21 endpoints** with clear permission boundaries  
✅ **4 role levels** (Viewer, Creator, Moderator, Admin)  
✅ **CSRF protection** on all state-changing requests  
✅ **Rate limiting** on sensitive endpoints  
✅ **Content ownership** verification  
✅ **License-based access** control  
✅ **Privacy-first** design (anonymous tracking, opt-in personalization)  

**All permissions are enforced server-side for security.**
