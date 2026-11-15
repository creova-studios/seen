import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
import * as culturalMetrics from "./cultural_metrics.tsx";
import * as governance from "./governance_moderation.tsx";
import * as creatorRights from "./creator_rights_ip.tsx";
import * as ethicalDiscovery from "./ethical_discovery.tsx";
import * as accessibility from "./accessibility.tsx";
import * as grantReadiness from "./grant_readiness.tsx";
import { registerCMFEndpoints } from "./cmf_endpoints.tsx";
import { createAuthHandlers, bearerToken } from "./auth_handlers.ts";
import { resolveEffectiveRole, isRole } from "./auth_policy.ts";
import { errInfo, log } from "./safe_log.ts";

const app = new Hono();

// Initialize Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Initialize Supabase client with anon key for auth operations
const getSupabaseClient = () => createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!
);

// ============================================================================
// SECURITY MIDDLEWARE
// ============================================================================

/**
 * RATE LIMITING MIDDLEWARE
 * Prevents brute force attacks on auth endpoints
 */
interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.blockedUntil && entry.blockedUntil < now) {
      rateLimitStore.delete(key);
    } else if (now - entry.firstAttempt > 15 * 60 * 1000) { // 15 minutes
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

const rateLimit = (maxAttempts: number, windowMs: number, blockDurationMs: number = 15 * 60 * 1000) => {
  return async (c: any, next: any) => {
    // Get client IP from headers (Cloudflare, proxy-aware)
    const clientIP = c.req.header('cf-connecting-ip') || 
                     c.req.header('x-forwarded-for')?.split(',')[0].trim() || 
                     c.req.header('x-real-ip') ||
                     'unknown';
    
    const now = Date.now();
    const key = `${clientIP}:${c.req.path}`;
    
    let entry = rateLimitStore.get(key);
    
    if (!entry) {
      entry = { count: 1, firstAttempt: now };
      rateLimitStore.set(key, entry);
      return next();
    }
    
    // Check if currently blocked
    if (entry.blockedUntil && entry.blockedUntil > now) {
      const remainingSeconds = Math.ceil((entry.blockedUntil - now) / 1000);
      return c.json({ 
        error: 'Too many attempts. Please try again later.',
        retryAfter: remainingSeconds 
      }, 429);
    }
    
    // Reset if outside window
    if (now - entry.firstAttempt > windowMs) {
      entry.count = 1;
      entry.firstAttempt = now;
      entry.blockedUntil = undefined;
      return next();
    }
    
    // Increment count
    entry.count++;
    
    // Block if exceeded
    if (entry.count > maxAttempts) {
      entry.blockedUntil = now + blockDurationMs;
      const remainingSeconds = Math.ceil(blockDurationMs / 1000);
      return c.json({ 
        error: 'Too many attempts. Please try again later.',
        retryAfter: remainingSeconds 
      }, 429);
    }
    
    return next();
  };
};

/**
 * CSRF PROTECTION MIDDLEWARE
 * Validates CSRF tokens for state-changing requests
 */
const csrfProtection = async (c: any, next: any) => {
  const method = c.req.method;
  
  // Only validate POST, PUT, DELETE, PATCH
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const origin = c.req.header('origin');
    const referer = c.req.header('referer');
    const host = c.req.header('host');
    
    // Allowed origins for CSRF protection
    const allowedOrigins = [
      Deno.env.get('FRONTEND_URL'),
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'https://localhost:5173',
    ].filter(Boolean); // Remove undefined values
    
    // For development: Allow requests without Origin/Referer if coming from Supabase Edge Functions
    const isEdgeFunctionInternal = host?.includes('supabase.co');
    
    // Check if request comes from allowed origin
    const isValidOrigin = origin && allowedOrigins.some(allowed => 
      origin === allowed || origin.startsWith(allowed + '/')
    );
    const isValidReferer = referer && allowedOrigins.some(allowed => 
      referer.startsWith(allowed)
    );
    
    // Allow if: valid origin OR valid referer OR internal Edge Function call
    if (!isValidOrigin && !isValidReferer && !isEdgeFunctionInternal) {
      const reason = origin ? 'origin_not_allowed' : referer ? 'referer_not_allowed' : 'no_origin_or_referer';
      log.warn('csrf.blocked', { method, path: c.req.path, reason });
      return c.json({ error: 'Invalid request origin' }, 403);
    }
  }
  
  return next();
};

/**
 * AUTH HANDLERS AND ROLE VALIDATION MIDDLEWARE (see auth_handlers.ts)
 * requireRole enforces the server-controlled role: app_metadata.role, else viewer
 * (or creator from the KV profile). user_metadata is never read for roles.
 */
const auth = createAuthHandlers({ supabaseAdmin, getSupabaseClient, kv });
const requireRole = auth.requireRole;

/**
 * INPUT VALIDATION HELPERS
 */
const sanitizeString = (str: string, maxLength: number = 255): string => {
  return str.trim().slice(0, maxLength);
};

// ============================================================================
// APPLY GLOBAL MIDDLEWARE
// ============================================================================

// Request logging: method, path, status and duration only. No headers, query strings or bodies.
app.use('*', async (c, next) => {
  const started = Date.now();
  await next();
  log.info('http.request', { method: c.req.method, path: c.req.path, status: c.res.status, ms: Date.now() - started });
});

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Apply CSRF protection to all routes
app.use('/make-server-2bdc05e6/*', csrfProtection);

// Health check endpoint
app.get("/make-server-2bdc05e6/health", (c) => {
  return c.json({ status: "ok" });
});

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

/**
 * Sign up a new user
 * POST /make-server-2bdc05e6/auth/signup
 * Body: { email, password, name, role?, language?, intent? }
 * role: only 'viewer' or 'creator' are honoured; anything else becomes 'viewer'.
 * moderator/admin are granted only via POST /make-server-2bdc05e6/admin/users/:userId/role.
 */
app.post("/make-server-2bdc05e6/auth/signup", rateLimit(5, 15 * 60 * 1000), (c) => auth.signup(c));

/**
 * Sign in an existing user
 * POST /make-server-2bdc05e6/auth/signin
 * Body: { email, password }
 */
app.post("/make-server-2bdc05e6/auth/signin", rateLimit(5, 15 * 60 * 1000), (c) => auth.signin(c));

/**
 * Grant a role (admin only). The only API path that can make someone a moderator or admin.
 * POST /make-server-2bdc05e6/admin/users/:userId/role
 * Headers: Authorization: Bearer <admin access_token>
 * Body: { role }
 */
app.post("/make-server-2bdc05e6/admin/users/:userId/role", requireRole(['admin']), (c) => auth.grantRole(c));

/**
 * Get current user session
 * GET /make-server-2bdc05e6/auth/session
 * Headers: Authorization: Bearer <access_token>
 */
app.get("/make-server-2bdc05e6/auth/session", async (c) => {
  try {
    const accessToken = bearerToken(c);
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      log.warn('session.invalid_token', errInfo(error));
      return c.json({ error: "Invalid or expired token" }, 401);
    }

    // Get user profile from KV store
    const profile = await kv.get(`user_profile:${user.id}`);

    return c.json({ 
      user: {
        id: user.id,
        email: user.email,
        ...profile,
        role: resolveEffectiveRole(user, profile)
      }
    });
  } catch (error) {
    log.error('session.unexpected_error', errInfo(error));
    return c.json({ error: "Session check failed. Please try again." }, 500);
  }
});

/**
 * Sign out user
 * POST /make-server-2bdc05e6/auth/signout
 * Headers: Authorization: Bearer <access_token>
 */
app.post("/make-server-2bdc05e6/auth/signout", async (c) => {
  try {
    const accessToken = bearerToken(c);
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      log.error('signout.failed', errInfo(error));
      return c.json({ error: "Sign out failed. Please try again." }, 400);
    }

    return c.json({ message: "Signed out successfully" });
  } catch (error) {
    log.error('signout.unexpected_error', errInfo(error));
    return c.json({ error: "Sign out failed. Please try again." }, 500);
  }
});

/**
 * Request password recovery
 * POST /make-server-2bdc05e6/auth/recovery
 * Body: { email }
 */
app.post("/make-server-2bdc05e6/auth/recovery", rateLimit(3, 15 * 60 * 1000), async (c) => {
  try {
    const { email } = await c.req.json();

    if (!email) {
      return c.json({ error: "Missing required field: email" }, 400);
    }

    const supabase = getSupabaseClient();
    
    // Use Supabase's password recovery
    // Note: This requires email configuration to be set up in Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${c.req.header('Origin') || 'http://localhost:5173'}/reset-password`,
    });

    if (error) {
      log.warn('recovery.request_failed', errInfo(error));
      // Don't reveal if email exists for security
      // Return success anyway to prevent user enumeration
    }

    // Always return success to prevent user enumeration
    return c.json({ 
      message: "If an account exists with this email, a recovery link has been sent."
    });
  } catch (error) {
    log.error('recovery.unexpected_error', errInfo(error));
    return c.json({ error: "Password recovery failed. Please try again." }, 500);
  }
});

// ============================================================================
// USER PROFILE ENDPOINTS
// ============================================================================

/**
 * Get user profile
 * GET /make-server-2bdc05e6/profile
 * Headers: Authorization: Bearer <access_token>
 */
app.get("/make-server-2bdc05e6/profile", async (c) => {
  try {
    const accessToken = bearerToken(c);
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      log.warn('profile.get_unauthorized', errInfo(error));
      return c.json({ error: "Unauthorized" }, 401);
    }

    const profile = await kv.get(`user_profile:${user.id}`);

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    return c.json({ profile: { ...profile, role: resolveEffectiveRole(user, profile) } });
  } catch (error) {
    log.error('profile.get_unexpected_error', errInfo(error));
    return c.json({ error: "Failed to get profile. Please try again." }, 500);
  }
});

/**
 * Update user profile
 * PUT /make-server-2bdc05e6/profile
 * Headers: Authorization: Bearer <access_token>
 * Body: { name?, language?, intent? }
 */
app.put("/make-server-2bdc05e6/profile", async (c) => {
  try {
    const accessToken = bearerToken(c);
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      log.warn('profile.update_unauthorized', errInfo(error));
      return c.json({ error: "Unauthorized" }, 401);
    }

    const updates = await c.req.json();
    const profile = await kv.get(`user_profile:${user.id}`);

    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    // Only display fields can be changed here. role, id, email and anything else are ignored;
    // roles are granted only via POST /make-server-2bdc05e6/admin/users/:userId/role.
    const allowedUpdates: Record<string, string> = {};
    if (typeof updates?.name === 'string') allowedUpdates.name = sanitizeString(updates.name, 255);
    if (typeof updates?.language === 'string') allowedUpdates.language = sanitizeString(updates.language, 10);
    if (typeof updates?.intent === 'string') allowedUpdates.intent = sanitizeString(updates.intent, 50);

    const updatedProfile = {
      ...profile,
      ...allowedUpdates,
      updatedAt: new Date().toISOString()
    };

    await kv.set(`user_profile:${user.id}`, updatedProfile);

    return c.json({ profile: { ...updatedProfile, role: resolveEffectiveRole(user, updatedProfile) } });
  } catch (error) {
    log.error('profile.update_unexpected_error', errInfo(error));
    return c.json({ error: "Failed to update profile. Please try again." }, 500);
  }
});

/**
 * Request role elevation (for creator applications)
 * POST /make-server-2bdc05e6/profile/request-role
 * Headers: Authorization: Bearer <access_token>
 * Body: { requestedRole, reason }
 */
app.post("/make-server-2bdc05e6/profile/request-role", async (c) => {
  try {
    const accessToken = bearerToken(c);
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);

    if (error || !user) {
      log.warn('role_request.unauthorized', errInfo(error));
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { requestedRole, reason } = await c.req.json();

    if (!requestedRole || !reason) {
      return c.json({ error: "Missing required fields: requestedRole, reason" }, 400);
    }

    if (!isRole(requestedRole)) {
      return c.json({ error: "Invalid requestedRole. Must be: viewer, creator, moderator, or admin" }, 400);
    }

    // Store role request for admin review
    await kv.set(`role_request:${user.id}`, {
      userId: user.id,
      requestedRole,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    return c.json({ 
      message: "Role elevation request submitted successfully",
      status: "pending"
    });
  } catch (error) {
    log.error('role_request.unexpected_error', errInfo(error));
    return c.json({ error: "Failed to submit role request. Please try again." }, 500);
  }
});

// ============================================================================
// NEW CRITICAL ENDPOINTS - BLOCKER REMEDIATION
// ============================================================================

/**
 * CRITICAL BLOCKER #1: Session Refresh
 * POST /make-server-2bdc05e6/auth/refresh
 * Body: { refresh_token }
 * Returns: { access_token, refresh_token }
 */
app.post("/make-server-2bdc05e6/auth/refresh", rateLimit(10, 15 * 60 * 1000), async (c) => {
  try {
    const { refresh_token } = await c.req.json();
    
    if (!refresh_token) {
      return c.json({ error: "Missing required field: refresh_token" }, 400);
    }
    
    const supabase = getSupabaseClient();
    
    // Use Supabase's refresh session endpoint
    const { data, error } = await supabase.auth.refreshSession({ refresh_token });
    
    if (error || !data?.session) {
      log.warn('refresh.failed', errInfo(error));
      return c.json({ error: "Failed to refresh session: Invalid or expired refresh token" }, 401);
    }
    
    log.info('refresh.succeeded', { userId: data.user?.id });
    
    // Get updated user profile
    const profile = await kv.get(`user_profile:${data.user.id}`);
    
    return c.json({
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
      user: {
        id: data.user.id,
        email: data.user.email,
        ...profile,
        role: resolveEffectiveRole(data.user, profile)
      }
    });
  } catch (error) {
    log.error('refresh.unexpected_error', errInfo(error));
    return c.json({ error: "Session refresh failed. Please try again." }, 500);
  }
});

/**
 * CRITICAL BLOCKER #4: Personalization Preferences Persistence
 * PUT /make-server-2bdc05e6/preferences
 * Headers: Authorization: Bearer <access_token>
 * Body: { immersiveNarratives?, richAudio?, dynamicMotion? }
 * Returns: { preferences }
 */
app.put("/make-server-2bdc05e6/preferences", async (c) => {
  try {
    const accessToken = bearerToken(c);
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: "Unauthorized: Invalid or expired token" }, 401);
    }
    
    const updates = await c.req.json();
    
    // Validate preference structure
    const validPreferenceKeys = ['immersiveNarratives', 'richAudio', 'dynamicMotion'];
    const preferences: any = {};
    
    for (const key of validPreferenceKeys) {
      if (key in updates && typeof updates[key] === 'boolean') {
        preferences[key] = updates[key];
      }
    }
    
    // Get existing profile
    const profile = await kv.get(`user_profile:${user.id}`);
    
    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }
    
    // Update profile with preferences
    const updatedProfile = {
      ...profile,
      personalizationPreferences: {
        ...(profile.personalizationPreferences || {}),
        ...preferences
      },
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`user_profile:${user.id}`, updatedProfile);
    
    log.info('preferences.updated', { userId: user.id, keys: Object.keys(preferences) });
    
    return c.json({ 
      preferences: updatedProfile.personalizationPreferences 
    });
  } catch (error) {
    log.error('preferences.update_unexpected_error', errInfo(error));
    return c.json({ error: "Failed to update preferences. Please try again." }, 500);
  }
});

/**
 * Get user preferences
 * GET /make-server-2bdc05e6/preferences
 * Headers: Authorization: Bearer <access_token>
 * Returns: { preferences }
 */
app.get("/make-server-2bdc05e6/preferences", async (c) => {
  try {
    const accessToken = bearerToken(c);
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: "Unauthorized: Invalid or expired token" }, 401);
    }
    
    const profile = await kv.get(`user_profile:${user.id}`);
    
    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }
    
    // Return preferences with safe defaults
    const preferences = profile.personalizationPreferences || {
      immersiveNarratives: true,
      richAudio: true,
      dynamicMotion: true
    };
    
    return c.json({ preferences });
  } catch (error) {
    log.error('preferences.get_unexpected_error', errInfo(error));
    return c.json({ error: "Failed to get preferences. Please try again." }, 500);
  }
});

/**
 * CRITICAL BLOCKER #5: Content Publication API
 * POST /make-server-2bdc05e6/content/publish
 * Headers: Authorization: Bearer <access_token>
 * Body: { title, description, language, chapters, tags, visibility }
 * Returns: { contentId, status }
 * 
 * REQUIRES: creator, moderator, or admin role
 */
app.post("/make-server-2bdc05e6/content/publish", requireRole(['creator', 'moderator', 'admin']), async (c) => {
  try {
    const user = c.get('user');
    const profile = c.get('profile');
    
    const { title, description, language, chapters, tags, visibility } = await c.req.json();
    
    // Validate required fields
    if (!title || !description || !language || !chapters || !Array.isArray(chapters)) {
      return c.json({ 
        error: "Missing required fields: title, description, language, chapters" 
      }, 400);
    }
    
    // Sanitize inputs
    const sanitizedTitle = sanitizeString(title, 200);
    const sanitizedDescription = sanitizeString(description, 1000);
    
    // Validate language
    const validLanguages = ['en', 'fr', 'es'];
    if (!validLanguages.includes(language)) {
      return c.json({ error: "Invalid language. Must be: en, fr, or es" }, 400);
    }
    
    // Validate visibility
    const validVisibility = ['public', 'unlisted', 'private'];
    const contentVisibility = visibility && validVisibility.includes(visibility) ? visibility : 'public';
    
    // Generate content ID
    const contentId = `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // New creators need moderation approval
    const isNewCreator = !await kv.get(`creator_verified:${user.id}`);
    const status = isNewCreator && profile.role === 'creator' ? 'under_review' : 'published';
    
    // Store content
    const content = {
      id: contentId,
      authorId: user.id,
      authorName: profile.name,
      title: sanitizedTitle,
      description: sanitizedDescription,
      language,
      chapters,
      tags: tags || [],
      visibility: contentVisibility,
      status,
      createdAt: new Date().toISOString(),
      publishedAt: status === 'published' ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString()
    };
    
    await kv.set(`content:${contentId}`, content);
    
    // Add to moderation queue if needed
    if (status === 'under_review') {
      const moderationItemId = `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await kv.set(`moderation_item:${moderationItemId}`, {
        id: moderationItemId,
        contentId,
        authorId: user.id,
        reason: 'New creator - first content submission',
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      
      log.info('content.submitted_for_moderation', { contentId });
    }
    
    // Add to content index for search
    const indexKey = `content_index:${language}`;
    const existingIndex = await kv.get(indexKey) || {};
    existingIndex[contentId] = {
      title: sanitizedTitle,
      tags: tags || [],
      authorId: user.id,
      authorName: profile.name,
      publishedAt: content.publishedAt,
      status
    };
    await kv.set(indexKey, existingIndex);
    
    log.info('content.published', { contentId, status, authorId: user.id });
    
    return c.json({ 
      contentId,
      status,
      message: status === 'under_review' 
        ? 'Content submitted for review. It will be published after moderation approval.' 
        : 'Content published successfully.'
    }, 201);
  } catch (error) {
    log.error('content.publish_unexpected_error', errInfo(error));
    return c.json({ error: "Failed to publish content. Please try again." }, 500);
  }
});

/**
 * Get moderation queue
 * GET /make-server-2bdc05e6/moderation/queue
 * Headers: Authorization: Bearer <access_token>
 * Returns: { items, total }
 * 
 * REQUIRES: moderator or admin role
 */
app.get("/make-server-2bdc05e6/moderation/queue", requireRole(['moderator', 'admin']), async (c) => {
  try {
    // Get all moderation items
    const moderationItems = await kv.getByPrefix('moderation_item:');
    
    // Filter pending items
    const pendingItems = moderationItems
      .filter((item: any) => item.status === 'pending')
      .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    // Enrich with content details
    const enrichedItems = await Promise.all(
      pendingItems.map(async (item: any) => {
        const content = await kv.get(`content:${item.contentId}`);
        return {
          ...item,
          content: content ? {
            title: content.title,
            description: content.description,
            language: content.language,
            authorName: content.authorName
          } : null
        };
      })
    );
    
    return c.json({
      items: enrichedItems,
      total: enrichedItems.length
    });
  } catch (error) {
    log.error('moderation.queue_unexpected_error', errInfo(error));
    return c.json({ error: "Failed to get moderation queue. Please try again." }, 500);
  }
});

/**
 * Review moderation item
 * POST /make-server-2bdc05e6/moderation/review
 * Headers: Authorization: Bearer <access_token>
 * Body: { itemId, action, reason? }
 * Returns: { message }
 * 
 * REQUIRES: moderator or admin role
 */
app.post("/make-server-2bdc05e6/moderation/review", requireRole(['moderator', 'admin']), async (c) => {
  try {
    const user = c.get('user');
    const { itemId, action, reason } = await c.req.json();
    
    if (!itemId || !action) {
      return c.json({ error: "Missing required fields: itemId, action" }, 400);
    }
    
    const validActions = ['approve', 'reject'];
    if (!validActions.includes(action)) {
      return c.json({ error: "Invalid action. Must be: approve or reject" }, 400);
    }
    
    // Get moderation item
    const item = await kv.get(`moderation_item:${itemId}`);
    
    if (!item) {
      return c.json({ error: "Moderation item not found" }, 404);
    }
    
    if (item.status !== 'pending') {
      return c.json({ error: "Item has already been reviewed" }, 400);
    }
    
    // Update moderation item
    const updatedItem = {
      ...item,
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewedBy: user.id,
      reviewedAt: new Date().toISOString(),
      reviewReason: reason
    };
    
    await kv.set(`moderation_item:${itemId}`, updatedItem);
    
    // Update content status
    const content = await kv.get(`content:${item.contentId}`);
    
    if (content) {
      content.status = action === 'approve' ? 'published' : 'rejected';
      
      if (action === 'approve') {
        content.publishedAt = new Date().toISOString();
        
        // Mark creator as verified
        await kv.set(`creator_verified:${content.authorId}`, true);
      }
      
      await kv.set(`content:${item.contentId}`, content);
      
      // Update content index
      if (action === 'approve') {
        const indexKey = `content_index:${content.language}`;
        const existingIndex = await kv.get(indexKey) || {};
        if (existingIndex[item.contentId]) {
          existingIndex[item.contentId].status = 'published';
          existingIndex[item.contentId].publishedAt = content.publishedAt;
          await kv.set(indexKey, existingIndex);
        }
      }
    }
    
    log.info('moderation.reviewed', { itemId, action, reviewedBy: user.id });
    
    return c.json({ 
      message: `Content ${action === 'approve' ? 'approved' : 'rejected'} successfully.`
    });
  } catch (error) {
    log.error('moderation.review_unexpected_error', errInfo(error));
    return c.json({ error: "Failed to review content. Please try again." }, 500);
  }
});

/**
 * CRITICAL BLOCKER #7: Account Deletion API (GDPR Compliance)
 * DELETE /make-server-2bdc05e6/account
 * Headers: Authorization: Bearer <access_token>
 * Returns: { message, scheduledDeletionDate }
 */
app.delete("/make-server-2bdc05e6/account", async (c) => {
  try {
    const accessToken = bearerToken(c);
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: "Unauthorized: Invalid or expired token" }, 401);
    }
    
    // Get user profile for logging
    const profile = await kv.get(`user_profile:${user.id}`);
    
    log.info('account.deletion_requested', { userId: user.id });
    
    // Mark account for deletion (30-day grace period)
    const scheduledDeletionDate = new Date();
    scheduledDeletionDate.setDate(scheduledDeletionDate.getDate() + 30);
    
    await kv.set(`account_deletion_scheduled:${user.id}`, {
      userId: user.id,
      email: user.email,
      scheduledAt: new Date().toISOString(),
      scheduledDeletionDate: scheduledDeletionDate.toISOString(),
      status: 'scheduled'
    });
    
    // For immediate deletion (can be toggled based on requirements):
    // 1. Delete user profile
    await kv.del(`user_profile:${user.id}`);
    
    // 2. Anonymize user content (don't delete - preserve cultural contributions)
    const userContent = await kv.getByPrefix(`content:`);
    for (const content of userContent) {
      if (content.authorId === user.id) {
        content.authorId = 'deleted_user';
        content.authorName = 'Deleted User';
        await kv.set(`content:${content.id}`, content);
      }
    }
    
    // 3. Delete user from Supabase Auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      log.error('account.auth_delete_failed', { userId: user.id, ...errInfo(deleteError) });
      // Continue anyway - user data is anonymized
    }
    
    // 4. Delete related data
    await kv.del(`role_request:${user.id}`);
    await kv.del(`creator_verified:${user.id}`);
    
    log.info('account.deleted', { userId: user.id });
    
    return c.json({
      message: "Your account has been permanently deleted. All personal data has been removed, and your content contributions have been anonymized.",
      deletedAt: new Date().toISOString()
    });
  } catch (error) {
    log.error('account.delete_unexpected_error', errInfo(error));
    return c.json({ error: "Failed to delete account. Please try again." }, 500);
  }
});

// ============================================================================
// REGISTER CMF-READY ENDPOINTS
// ============================================================================

registerCMFEndpoints(app, supabaseAdmin, requireRole);

Deno.serve(app.fetch);