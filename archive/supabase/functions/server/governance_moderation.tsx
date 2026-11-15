/**
 * GOVERNANCE & MODERATION SYSTEM
 * 
 * Purpose: Tiered moderation system for content governance
 * Approach: Non-punitive, culturally-sensitive, restorative justice-aligned
 * 
 * Tier 1: Automated flag detection (keywords, patterns, community reports)
 * Tier 2: Human moderator review
 * Tier 3: Cultural escalation / admin review
 * 
 * Features:
 * - Content flag reasons with cultural context
 * - Decision logging for audit trail
 * - Appeal workflow
 * - Non-punitive resolution paths
 * - Creator education vs. punishment
 */

import * as kv from "./kv_store.tsx";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type FlagReason =
  | 'hate_speech'
  | 'misinformation'
  | 'harassment'
  | 'spam'
  | 'copyright_violation'
  | 'cultural_appropriation'
  | 'harmful_content'
  | 'explicit_content'
  | 'community_guidelines'
  | 'other';

export type FlagSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ModerationTier = 'tier1_automated' | 'tier2_human' | 'tier3_cultural';

export type ModerationAction =
  | 'approve'
  | 'require_edit'
  | 'educate'
  | 'temporary_hold'
  | 'remove'
  | 'escalate';

export type ModerationStatus =
  | 'pending'
  | 'under_review'
  | 'resolved'
  | 'appealed'
  | 'escalated';

export interface ContentFlag {
  id: string;
  contentId: string;
  authorId: string;
  reason: FlagReason;
  severity: FlagSeverity;
  tier: ModerationTier;
  description?: string;
  reportedBy?: string; // User ID or 'system' for automated
  reportedAt: string;
  status: ModerationStatus;
  culturalContext?: string; // Additional cultural considerations
  metadata?: {
    automatedScore?: number; // 0-1 confidence score for automated flags
    communityReportCount?: number;
    previousFlags?: number; // Historical flag count for this creator
  };
}

export interface ModerationDecision {
  id: string;
  flagId: string;
  contentId: string;
  moderatorId: string;
  moderatorRole: 'moderator' | 'admin' | 'cultural_advisor';
  action: ModerationAction;
  reasoning: string;
  educationalResources?: string[]; // Links to community guidelines, cultural resources
  editRequirements?: string; // What needs to change
  decidedAt: string;
  tier: ModerationTier;
}

export interface ModerationAppeal {
  id: string;
  flagId: string;
  decisionId: string;
  contentId: string;
  authorId: string;
  appealReason: string;
  additionalContext?: string;
  culturalConsiderations?: string;
  submittedAt: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'denied';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export interface ModerationAuditLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  targetId: string; // Flag, decision, or appeal ID
  targetType: 'flag' | 'decision' | 'appeal';
  details: any;
}

// ============================================================================
// TIER 1: AUTOMATED FLAG DETECTION
// ============================================================================

/**
 * Automated content analysis (keyword matching, pattern detection)
 * Returns flag if content matches problematic patterns
 */
export async function automaticContentAnalysis(
  contentId: string,
  content: {
    title: string;
    description: string;
    chapters: any[];
    authorId: string;
  }
): Promise<ContentFlag | null> {
  // Combine all text for analysis
  const fullText = [
    content.title,
    content.description,
    ...content.chapters.map(c => c.text || c.content || '')
  ].join(' ').toLowerCase();
  
  // Simple keyword-based detection (real implementation would use ML/NLP)
  const hateSpeechKeywords = ['hate', 'slur', 'discriminate']; // Simplified example
  const spamKeywords = ['click here', 'buy now', 'limited time'];
  
  // Check for hate speech patterns
  let hateSpeechScore = 0;
  for (const keyword of hateSpeechKeywords) {
    if (fullText.includes(keyword)) hateSpeechScore++;
  }
  
  // Check for spam patterns
  let spamScore = 0;
  for (const keyword of spamKeywords) {
    if (fullText.includes(keyword)) spamScore++;
  }
  
  // Determine if flagging is needed
  if (hateSpeechScore > 2) {
    return await createFlag({
      contentId,
      authorId: content.authorId,
      reason: 'hate_speech',
      severity: 'high',
      tier: 'tier1_automated',
      reportedBy: 'system',
      description: 'Automated detection: potential hate speech patterns',
      metadata: {
        automatedScore: Math.min(hateSpeechScore / 5, 1),
      },
    });
  }
  
  if (spamScore > 3) {
    return await createFlag({
      contentId,
      authorId: content.authorId,
      reason: 'spam',
      severity: 'low',
      tier: 'tier1_automated',
      reportedBy: 'system',
      description: 'Automated detection: potential spam content',
      metadata: {
        automatedScore: Math.min(spamScore / 5, 1),
      },
    });
  }
  
  return null;
}

/**
 * Community-driven flag reporting
 */
export async function createCommunityFlag(
  contentId: string,
  authorId: string,
  reportedBy: string,
  reason: FlagReason,
  description?: string,
  culturalContext?: string
): Promise<ContentFlag> {
  // Check if content already has flags
  const existingFlags = await kv.getByPrefix(`flag:${contentId}:`);
  const existingCommunityFlags = existingFlags.filter(f => f.reportedBy !== 'system');
  
  // Determine severity based on community report count
  let severity: FlagSeverity = 'low';
  if (existingCommunityFlags.length >= 5) severity = 'high';
  else if (existingCommunityFlags.length >= 2) severity = 'medium';
  
  return await createFlag({
    contentId,
    authorId,
    reason,
    severity,
    tier: 'tier1_automated',
    reportedBy,
    description,
    culturalContext,
    metadata: {
      communityReportCount: existingCommunityFlags.length + 1,
    },
  });
}

/**
 * Create a content flag
 */
async function createFlag(params: {
  contentId: string;
  authorId: string;
  reason: FlagReason;
  severity: FlagSeverity;
  tier: ModerationTier;
  reportedBy: string;
  description?: string;
  culturalContext?: string;
  metadata?: any;
}): Promise<ContentFlag> {
  const flagId = `flag_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Get creator's historical flag count
  const creatorFlags = await kv.getByPrefix(`flag:`);
  const previousFlags = creatorFlags.filter(f => f.authorId === params.authorId).length;
  
  const flag: ContentFlag = {
    id: flagId,
    contentId: params.contentId,
    authorId: params.authorId,
    reason: params.reason,
    severity: params.severity,
    tier: params.tier,
    description: params.description,
    reportedBy: params.reportedBy,
    reportedAt: new Date().toISOString(),
    status: 'pending',
    culturalContext: params.culturalContext,
    metadata: {
      ...params.metadata,
      previousFlags,
    },
  };
  
  await kv.set(`flag:${params.contentId}:${flagId}`, flag);
  
  // Create audit log
  await logModerationAction({
    action: 'flag_created',
    performedBy: params.reportedBy,
    targetId: flagId,
    targetType: 'flag',
    details: flag,
  });
  
  // Auto-escalate to Tier 2 if high severity or multiple flags
  if (params.severity === 'high' || params.severity === 'critical' || previousFlags >= 3) {
    await escalateToTier2(flagId);
  }
  
  return flag;
}

// ============================================================================
// TIER 2: HUMAN MODERATOR REVIEW
// ============================================================================

/**
 * Escalate flag to Tier 2 (human review)
 */
export async function escalateToTier2(flagId: string): Promise<void> {
  const flagKeys = await kv.getByPrefix('flag:');
  const flag = flagKeys.find(f => f.id === flagId);
  
  if (flag) {
    flag.tier = 'tier2_human';
    flag.status = 'under_review';
    await kv.set(`flag:${flag.contentId}:${flagId}`, flag);
    
    await logModerationAction({
      action: 'escalated_to_tier2',
      performedBy: 'system',
      targetId: flagId,
      targetType: 'flag',
      details: { previousTier: 'tier1_automated' },
    });
  }
}

/**
 * Moderator makes a decision on flagged content
 */
export async function createModerationDecision(params: {
  flagId: string;
  moderatorId: string;
  moderatorRole: 'moderator' | 'admin' | 'cultural_advisor';
  action: ModerationAction;
  reasoning: string;
  educationalResources?: string[];
  editRequirements?: string;
}): Promise<ModerationDecision> {
  const flagKeys = await kv.getByPrefix('flag:');
  const flag = flagKeys.find(f => f.id === params.flagId);
  
  if (!flag) {
    throw new Error('Flag not found');
  }
  
  const decisionId = `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const decision: ModerationDecision = {
    id: decisionId,
    flagId: params.flagId,
    contentId: flag.contentId,
    moderatorId: params.moderatorId,
    moderatorRole: params.moderatorRole,
    action: params.action,
    reasoning: params.reasoning,
    educationalResources: params.educationalResources,
    editRequirements: params.editRequirements,
    decidedAt: new Date().toISOString(),
    tier: flag.tier,
  };
  
  await kv.set(`moderation_decision:${decisionId}`, decision);
  
  // Update flag status
  if (params.action === 'escalate') {
    await escalateToTier3(params.flagId);
  } else {
    flag.status = 'resolved';
    await kv.set(`flag:${flag.contentId}:${params.flagId}`, flag);
  }
  
  // Log decision
  await logModerationAction({
    action: 'decision_made',
    performedBy: params.moderatorId,
    targetId: decisionId,
    targetType: 'decision',
    details: decision,
  });
  
  // Apply action to content
  await applyModerationAction(flag.contentId, params.action, decision);
  
  return decision;
}

/**
 * Apply moderation action to content
 */
async function applyModerationAction(
  contentId: string,
  action: ModerationAction,
  decision: ModerationDecision
): Promise<void> {
  const content = await kv.get(`content:${contentId}`);
  
  if (!content) return;
  
  switch (action) {
    case 'approve':
      content.moderationStatus = 'approved';
      content.status = 'published';
      break;
      
    case 'require_edit':
      content.moderationStatus = 'requires_edit';
      content.editRequirements = decision.editRequirements;
      content.status = 'draft';
      break;
      
    case 'educate':
      content.moderationStatus = 'educational_hold';
      content.educationalResources = decision.educationalResources;
      // Content remains visible but creator is notified
      break;
      
    case 'temporary_hold':
      content.moderationStatus = 'temporary_hold';
      content.status = 'under_review';
      break;
      
    case 'remove':
      content.moderationStatus = 'removed';
      content.status = 'removed';
      content.removalReason = decision.reasoning;
      break;
      
    case 'escalate':
      content.moderationStatus = 'escalated';
      content.status = 'under_review';
      break;
  }
  
  content.lastModerationAction = action;
  content.lastModerationAt = new Date().toISOString();
  
  await kv.set(`content:${contentId}`, content);
}

// ============================================================================
// TIER 3: CULTURAL ESCALATION / ADMIN REVIEW
// ============================================================================

/**
 * Escalate to Tier 3 for cultural sensitivity or complex cases
 */
export async function escalateToTier3(flagId: string): Promise<void> {
  const flagKeys = await kv.getByPrefix('flag:');
  const flag = flagKeys.find(f => f.id === flagId);
  
  if (flag) {
    flag.tier = 'tier3_cultural';
    flag.status = 'escalated';
    await kv.set(`flag:${flag.contentId}:${flagId}`, flag);
    
    await logModerationAction({
      action: 'escalated_to_tier3',
      performedBy: 'system',
      targetId: flagId,
      targetType: 'flag',
      details: { previousTier: flag.tier, reason: 'cultural_sensitivity' },
    });
  }
}

// ============================================================================
// APPEAL WORKFLOW
// ============================================================================

/**
 * Creator submits an appeal for a moderation decision
 */
export async function submitAppeal(params: {
  flagId: string;
  decisionId: string;
  contentId: string;
  authorId: string;
  appealReason: string;
  additionalContext?: string;
  culturalConsiderations?: string;
}): Promise<ModerationAppeal> {
  const appealId = `appeal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const appeal: ModerationAppeal = {
    id: appealId,
    flagId: params.flagId,
    decisionId: params.decisionId,
    contentId: params.contentId,
    authorId: params.authorId,
    appealReason: params.appealReason,
    additionalContext: params.additionalContext,
    culturalConsiderations: params.culturalConsiderations,
    submittedAt: new Date().toISOString(),
    status: 'pending',
  };
  
  await kv.set(`appeal:${appealId}`, appeal);
  
  // Update flag status
  const flagKeys = await kv.getByPrefix('flag:');
  const flag = flagKeys.find(f => f.id === params.flagId);
  if (flag) {
    flag.status = 'appealed';
    await kv.set(`flag:${flag.contentId}:${params.flagId}`, flag);
  }
  
  // Log appeal
  await logModerationAction({
    action: 'appeal_submitted',
    performedBy: params.authorId,
    targetId: appealId,
    targetType: 'appeal',
    details: appeal,
  });
  
  return appeal;
}

/**
 * Review an appeal
 */
export async function reviewAppeal(
  appealId: string,
  reviewerId: string,
  decision: 'accepted' | 'denied',
  reviewNotes: string
): Promise<void> {
  const appeal = await kv.get(`appeal:${appealId}`);
  
  if (!appeal) {
    throw new Error('Appeal not found');
  }
  
  appeal.status = decision;
  appeal.reviewedBy = reviewerId;
  appeal.reviewedAt = new Date().toISOString();
  appeal.reviewNotes = reviewNotes;
  
  await kv.set(`appeal:${appealId}`, appeal);
  
  // If accepted, reverse moderation action
  if (decision === 'accepted') {
    const content = await kv.get(`content:${appeal.contentId}`);
    if (content) {
      content.moderationStatus = 'approved';
      content.status = 'published';
      content.appealAccepted = true;
      await kv.set(`content:${appeal.contentId}`, content);
    }
  }
  
  // Log review
  await logModerationAction({
    action: 'appeal_reviewed',
    performedBy: reviewerId,
    targetId: appealId,
    targetType: 'appeal',
    details: { decision, reviewNotes },
  });
}

// ============================================================================
// AUDIT LOGGING
// ============================================================================

/**
 * Log moderation action for audit trail
 */
export async function logModerationAction(params: {
  action: string;
  performedBy: string;
  targetId: string;
  targetType: 'flag' | 'decision' | 'appeal';
  details: any;
}): Promise<void> {
  const logId = `audit_log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const log: ModerationAuditLog = {
    id: logId,
    timestamp: new Date().toISOString(),
    action: params.action,
    performedBy: params.performedBy,
    targetId: params.targetId,
    targetType: params.targetType,
    details: params.details,
  };
  
  await kv.set(`moderation_audit_log:${logId}`, log);
}

/**
 * Get moderation audit logs for a specific time period
 */
export async function getAuditLogs(
  startDate?: Date,
  endDate?: Date
): Promise<ModerationAuditLog[]> {
  const allLogs = await kv.getByPrefix('moderation_audit_log:');
  
  if (!startDate && !endDate) {
    return allLogs;
  }
  
  const start = startDate || new Date(0);
  const end = endDate || new Date();
  
  return allLogs.filter(log => {
    const timestamp = new Date(log.timestamp);
    return timestamp >= start && timestamp <= end;
  });
}

// ============================================================================
// REPORTING & ANALYTICS
// ============================================================================

/**
 * Get moderation statistics for reporting
 */
export async function getModerationStats(
  startDate?: Date,
  endDate?: Date
): Promise<{
  totalFlags: number;
  flagsByReason: { [reason: string]: number };
  flagsBySeverity: { [severity: string]: number };
  flagsByTier: { [tier: string]: number };
  flagsByStatus: { [status: string]: number };
  totalDecisions: number;
  decisionsByAction: { [action: string]: number };
  totalAppeals: number;
  appealsAccepted: number;
  appealsDenied: number;
}> {
  const allFlags = await kv.getByPrefix('flag:');
  const allDecisions = await kv.getByPrefix('moderation_decision:');
  const allAppeals = await kv.getByPrefix('appeal:');
  
  // Filter by date if specified
  const start = startDate || new Date(0);
  const end = endDate || new Date();
  
  const flags = allFlags.filter(f => {
    const reported = new Date(f.reportedAt);
    return reported >= start && reported <= end;
  });
  
  const decisions = allDecisions.filter(d => {
    const decided = new Date(d.decidedAt);
    return decided >= start && decided <= end;
  });
  
  const appeals = allAppeals.filter(a => {
    const submitted = new Date(a.submittedAt);
    return submitted >= start && submitted <= end;
  });
  
  // Aggregate statistics
  const flagsByReason: { [reason: string]: number } = {};
  const flagsBySeverity: { [severity: string]: number } = {};
  const flagsByTier: { [tier: string]: number } = {};
  const flagsByStatus: { [status: string]: number } = {};
  
  for (const flag of flags) {
    flagsByReason[flag.reason] = (flagsByReason[flag.reason] || 0) + 1;
    flagsBySeverity[flag.severity] = (flagsBySeverity[flag.severity] || 0) + 1;
    flagsByTier[flag.tier] = (flagsByTier[flag.tier] || 0) + 1;
    flagsByStatus[flag.status] = (flagsByStatus[flag.status] || 0) + 1;
  }
  
  const decisionsByAction: { [action: string]: number } = {};
  for (const decision of decisions) {
    decisionsByAction[decision.action] = (decisionsByAction[decision.action] || 0) + 1;
  }
  
  const appealsAccepted = appeals.filter(a => a.status === 'accepted').length;
  const appealsDenied = appeals.filter(a => a.status === 'denied').length;
  
  return {
    totalFlags: flags.length,
    flagsByReason,
    flagsBySeverity,
    flagsByTier,
    flagsByStatus,
    totalDecisions: decisions.length,
    decisionsByAction,
    totalAppeals: appeals.length,
    appealsAccepted,
    appealsDenied,
  };
}
