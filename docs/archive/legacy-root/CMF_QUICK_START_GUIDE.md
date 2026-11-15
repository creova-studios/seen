# CMF Grant Readiness - Quick Start Guide

## For Administrators: Generating Your First Grant Report

### Step 1: Generate Cultural Impact Snapshot

```bash
# Using curl or Postman
GET https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/metrics/cultural-impact?format=csv
Authorization: Bearer [your-access-token]
```

**This will return:**
- Total active creators
- Canadian creator count
- Equity-deserving demographics
- Content hours
- Community engagement stats
- Geographic distribution

**Export as CSV** for easy spreadsheet import.

---

### Step 2: Check Accessibility Compliance

```bash
GET https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/accessibility/compliance-report
Authorization: Bearer [your-access-token]
```

**This will show:**
- WCAG Level A, AA, AAA compliance rates
- Content with captions/transcripts
- Alt text coverage
- Screen reader optimization status

---

### Step 3: Generate Full Grant Report

```bash
POST https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/grant/generate-report?format=csv
Authorization: Bearer [your-access-token]
Content-Type: application/json

{
  "reportType": "quarterly",
  "startDate": "2026-01-01",
  "endDate": "2026-03-31"
}
```

**This comprehensive report includes:**
- Cultural impact metrics
- Accessibility compliance
- Governance statistics
- Content & creator metrics
- Incident summaries
- Compliance verification

**Download as CSV** for CMF grant portal upload.

---

## For Moderators: Content Governance

### Reviewing Flagged Content

```bash
GET https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/governance/stats
Authorization: Bearer [your-access-token]
```

**Returns statistics on:**
- Total flags by reason
- Flags by severity
- Flags by status
- Moderation actions taken
- Appeal statistics

---

### Getting Moderation Queue

```bash
GET https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/moderation/queue
Authorization: Bearer [your-access-token]
```

**Returns pending items for review.**

---

### Curating Featured Content

```bash
POST https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/discovery/curate
Authorization: Bearer [your-access-token]
Content-Type: application/json

{
  "contentId": "content_123",
  "qualityScore": 9,
  "culturalSignificance": 8,
  "technicalExecution": 7,
  "notes": "Exceptional Indigenous storytelling",
  "featuredUntil": "2026-03-31T23:59:59Z"
}
```

**This will boost content in discovery algorithm.**

---

## For Creators: IP Management

### Setting Content License

```bash
POST https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/ip/set-license
Authorization: Bearer [your-access-token]
Content-Type: application/json

{
  "contentId": "content_123",
  "licenseType": "public",
  "rights": "creative_commons_by",
  "allowDownload": true,
  "allowRemix": false,
  "allowCommercialUse": false
}
```

**License options:**
- `private` - Only you can view
- `community` - Authenticated users only
- `public` - Anyone can view

**Rights options:**
- `all_rights_reserved`
- `creative_commons_by` (Attribution Required)
- `creative_commons_by_sa` (Share-Alike)
- `creative_commons_by_nc` (Non-Commercial)
- `creative_commons_by_nc_sa`
- `public_domain`

---

### Exporting Your Content

```bash
POST https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/ip/export
Authorization: Bearer [your-access-token]
Content-Type: application/json

{
  "contentId": "content_123",
  "format": "json",
  "includeMetadata": true,
  "includeAttribution": true
}
```

**Export formats:**
- `json` - Structured data
- `markdown` - Plain text
- `pdf` - Formatted document (future)
- `epub` - E-book format (future)

---

### Getting Attribution Text

```bash
GET https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/ip/attribution/content_123
```

**Returns:**
```json
{
  "attribution": {
    "originalCreatorName": "Jane Doe",
    "attributionChain": [...],
    "immutable": true
  },
  "attributionText": "Created by Jane Doe (original_creator). CC BY-NC - Attribution, Non-Commercial"
}
```

---

## For All Users: Ethical Discovery

### Starting a Discovery Session

```bash
POST https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/discovery/start
Authorization: Bearer [your-access-token] # Optional
```

**Returns session ID** for tracking recommendations.

---

### Getting Recommendations

```bash
GET https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/discovery/recommendations/[sessionId]?limit=10
Authorization: Bearer [your-access-token] # Optional
```

**Returns scored content** based on:
- Cultural value (30%)
- Editorial quality (25%)
- Community engagement (15%)
- Freshness (10%)
- Diversity (15%)
- Personalization (5%, opt-in only)

---

### Getting Featured Content

```bash
GET https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/discovery/featured?language=en
```

**Returns editorially curated content.**

---

## For Content Creators: Accessibility

### Adding Captions

```bash
POST https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/accessibility/captions
Authorization: Bearer [your-access-token]
Content-Type: application/json

{
  "contentId": "content_123",
  "chapterIndex": 0,
  "language": "en",
  "format": "vtt",
  "captions": [
    {
      "startTime": 0,
      "endTime": 5000,
      "text": "Welcome to our story.",
      "speakerLabel": "Narrator"
    },
    {
      "startTime": 5000,
      "endTime": 10000,
      "text": "This is an important cultural narrative."
    }
  ]
}
```

**Timestamps in milliseconds.**

---

### Adding Transcripts

```bash
POST https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/accessibility/transcript
Authorization: Bearer [your-access-token]
Content-Type: application/json

{
  "contentId": "content_123",
  "chapterIndex": 0,
  "language": "en",
  "fullText": "Welcome to our story. This is an important cultural narrative..."
}
```

**Makes content searchable and screen-reader friendly.**

---

## For Tracking: Content Metrics

### Tracking a View

```bash
POST https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/metrics/track-view
Content-Type: application/json

{
  "contentId": "content_123",
  "sessionId": "session_xyz"
}
```

**No auth required** - privacy-preserving.

---

### Tracking Progress

```bash
POST https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/metrics/track-progress
Content-Type: application/json

{
  "sessionId": "session_xyz",
  "chapterIndex": 2,
  "totalChapters": 5
}
```

**Updates completion rates** for cultural impact metrics.

---

## For Reporting: Community Safety

### Reporting Content

```bash
POST https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/governance/report
Authorization: Bearer [your-access-token] # Optional
Content-Type: application/json

{
  "contentId": "content_123",
  "reason": "cultural_appropriation",
  "description": "This content misrepresents Indigenous practices.",
  "culturalContext": "As a member of this community, I find this harmful because..."
}
```

**Flag reasons:**
- `hate_speech`
- `misinformation`
- `harassment`
- `spam`
- `copyright_violation`
- `cultural_appropriation`
- `harmful_content`
- `explicit_content`
- `community_guidelines`
- `other`

---

## For Incident Management

### Reporting an Incident

```bash
POST https://[your-project-id].supabase.co/functions/v1/make-server-2bdc05e6/grant/incident
Authorization: Bearer [your-access-token]
Content-Type: application/json

{
  "type": "security",
  "severity": "high",
  "title": "Potential data breach attempt",
  "description": "Detected unusual access patterns...",
  "affectedUsers": 0
}
```

**Incident types:**
- `security`
- `privacy`
- `content`
- `technical`
- `compliance`

**Severity levels:**
- `low`
- `medium`
- `high`
- `critical`

---

## Environment Setup

### Required Environment Variables

Already configured in your Supabase project:
- `SUPABASE_URL` ✅
- `SUPABASE_ANON_KEY` ✅
- `SUPABASE_SERVICE_ROLE_KEY` ✅
- `SUPABASE_DB_URL` ✅

### Additional Configuration (Optional)

If implementing email for password recovery:
- `FRONTEND_URL` - Your app's URL for CSRF protection

---

## Testing Endpoints

### Using curl

```bash
# Replace placeholders:
# [project-id] - Your Supabase project ID
# [access-token] - User's access token from auth

curl -X GET \
  "https://[project-id].supabase.co/functions/v1/make-server-2bdc05e6/discovery/featured?language=en" \
  -H "Authorization: Bearer [access-token]"
```

### Using Postman

1. Create new request
2. Set URL: `https://[project-id].supabase.co/functions/v1/make-server-2bdc05e6/[endpoint]`
3. Add header: `Authorization: Bearer [access-token]`
4. Set body (for POST): JSON format
5. Send request

---

## Common Workflows

### Workflow 1: Generate Quarterly CMF Report

```bash
# Step 1: Get cultural impact
GET /metrics/cultural-impact?format=csv&startDate=2026-01-01&endDate=2026-03-31

# Step 2: Get accessibility compliance
GET /accessibility/compliance-report

# Step 3: Get governance stats
GET /governance/stats?startDate=2026-01-01&endDate=2026-03-31

# Step 4: Generate full report
POST /grant/generate-report?format=csv
Body: { "reportType": "quarterly", "startDate": "2026-01-01", "endDate": "2026-03-31" }

# Download CSV and submit to CMF portal
```

---

### Workflow 2: Moderate Flagged Content

```bash
# Step 1: Get moderation queue
GET /moderation/queue

# Step 2: Review content and make decision
POST /moderation/review
Body: { "itemId": "mod_123", "action": "approve", "reason": "Content is appropriate" }

# Step 3: Check moderation stats
GET /governance/stats
```

---

### Workflow 3: Curate Featured Content

```bash
# Step 1: Curate content
POST /discovery/curate
Body: { "contentId": "content_123", "qualityScore": 9, "culturalSignificance": 8, ... }

# Step 2: Verify featured content
GET /discovery/featured?language=en

# Featured content will appear at top of discovery results
```

---

### Workflow 4: Track Content Engagement

```bash
# User starts viewing content
POST /metrics/track-view
Body: { "contentId": "content_123", "sessionId": "session_xyz" }

# User progresses through chapters
POST /metrics/track-progress
Body: { "sessionId": "session_xyz", "chapterIndex": 0, "totalChapters": 5 }

POST /metrics/track-progress
Body: { "sessionId": "session_xyz", "chapterIndex": 1, "totalChapters": 5 }

# Completion automatically tracked when chapterIndex >= totalChapters - 1
POST /metrics/track-progress
Body: { "sessionId": "session_xyz", "chapterIndex": 4, "totalChapters": 5 }

# Cultural impact snapshot now includes updated completion rates
```

---

## Troubleshooting

### "Unauthorized" Error
- Check that your access token is valid
- Verify user has required role (admin/moderator)
- Token format: `Authorization: Bearer [token]`

### "Content not found" Error
- Verify contentId exists
- Check that content status is 'published'

### Empty Results
- Check date ranges (startDate/endDate)
- Verify data exists for query parameters
- Check role permissions

### CSV Export Not Working
- Add `?format=csv` query parameter
- Check `Accept: text/csv` header
- Verify endpoint supports CSV export

---

## Next Steps

1. **Generate your first cultural impact snapshot**
2. **Set up content tracking** on your frontend
3. **Enable creator metadata collection** during onboarding
4. **Run accessibility audit** on existing content
5. **Generate quarterly report** for CMF application

---

## Support Resources

- **Full Documentation**: `/CMF_GRANT_READINESS_DOCUMENTATION.md`
- **Technical Summary**: `/CMF_TECHNICAL_SUMMARY.md`
- **CMF Grant Portal**: https://cmf-fmc.ca/
- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/

---

## Summary

✅ **21 API endpoints** ready to use  
✅ **Zero frontend integration** required to start  
✅ **CMF grant-ready** reporting available  
✅ **Privacy-first** by design  
✅ **Production-ready** backend infrastructure  

**You're ready to apply for CMF funding!**
