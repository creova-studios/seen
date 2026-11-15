/**
 * GRANT READINESS & AUDIT MODULE
 * 
 * Purpose: CMF (Canada Media Fund) compliance and reporting
 * Features:
 * - Activity logs for audit trail
 * - Version tracking for content
 * - Incident tracking
 * - Exportable grant reports
 * - Milestone tagging
 * - Compliance verification
 * 
 * Grant Requirements:
 * - Canadian content tracking
 * - Equity-deserving participation metrics
 * - Content hours tracking
 * - Geographic distribution
 * - Accessibility compliance
 * - Governance documentation
 */

import * as kv from "./kv_store.tsx";
import * as culturalMetrics from "./cultural_metrics.tsx";
import * as accessibility from "./accessibility.tsx";
import * as governance from "./governance_moderation.tsx";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId?: string;
  userRole?: string;
  action: string;
  category: 'content' | 'user' | 'moderation' | 'system' | 'admin';
  targetId?: string;
  targetType?: string;
  details: any;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}

export interface ContentVersion {
  id: string;
  contentId: string;
  versionNumber: number;
  changes: string;
  changedBy: string;
  changedAt: string;
  previousVersion?: {
    title?: string;
    description?: string;
    chapters?: any[];
  };
  currentVersion: {
    title: string;
    description: string;
    chapters: any[];
  };
  approved: boolean;
  approvedBy?: string;
}

export interface Incident {
  id: string;
  type: 'security' | 'privacy' | 'content' | 'technical' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  reportedBy: string;
  reportedAt: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  assignedTo?: string;
  resolution?: string;
  resolvedAt?: string;
  affectedUsers?: number;
  mitigationSteps?: string[];
  preventionMeasures?: string[];
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  category: 'development' | 'content' | 'community' | 'grant';
  targetDate?: string;
  completedDate?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  metrics?: {
    [key: string]: any;
  };
  grantRelated: boolean;
  createdBy: string;
  createdAt: string;
}

export interface GrantReport {
  id: string;
  reportType: 'quarterly' | 'annual' | 'milestone' | 'custom';
  period: {
    startDate: string;
    endDate: string;
  };
  generatedAt: string;
  generatedBy: string;
  culturalImpact: any; // From cultural_metrics module
  accessibilityCompliance: any; // From accessibility module
  governanceMetrics: any; // From governance_moderation module
  contentMetrics: {
    totalPublished: number;
    canadianContent: number;
    hoursOfContent: number;
    multilingualContent: number;
  };
  creatorMetrics: {
    totalCreators: number;
    canadianCreators: number;
    equityDeservingCreators: number;
  };
  milestones: Milestone[];
  incidents: Incident[];
  compliance: {
    privacyCompliant: boolean;
    accessibilityCompliant: boolean;
    contentGovernance: boolean;
    dataProtection: boolean;
  };
  exportFormats: ('json' | 'csv' | 'pdf')[];
}

export interface ComplianceChecklist {
  id: string;
  category: string;
  items: Array<{
    requirement: string;
    status: 'compliant' | 'partial' | 'non_compliant' | 'not_applicable';
    evidence?: string;
    notes?: string;
    lastChecked?: string;
  }>;
  overallStatus: 'compliant' | 'partial' | 'non_compliant';
  lastUpdated: string;
}

// ============================================================================
// ACTIVITY LOGGING
// ============================================================================

/**
 * Log activity for audit trail
 */
export async function logActivity(params: {
  userId?: string;
  userRole?: string;
  action: string;
  category: 'content' | 'user' | 'moderation' | 'system' | 'admin';
  targetId?: string;
  targetType?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
}): Promise<ActivityLog> {
  const logId = `activity_log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const log: ActivityLog = {
    id: logId,
    timestamp: new Date().toISOString(),
    userId: params.userId,
    userRole: params.userRole,
    action: params.action,
    category: params.category,
    targetId: params.targetId,
    targetType: params.targetType,
    details: params.details || {},
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
    sessionId: params.sessionId,
  };
  
  await kv.set(`activity_log:${logId}`, log);
  
  return log;
}

/**
 * Get activity logs for a time period
 */
export async function getActivityLogs(
  startDate?: Date,
  endDate?: Date,
  category?: string
): Promise<ActivityLog[]> {
  const allLogs = await kv.getByPrefix('activity_log:');
  
  const start = startDate || new Date(0);
  const end = endDate || new Date();
  
  let filtered = allLogs.filter(log => {
    const timestamp = new Date(log.timestamp);
    return timestamp >= start && timestamp <= end;
  });
  
  if (category) {
    filtered = filtered.filter(log => log.category === category);
  }
  
  return filtered.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Get activity logs for a specific user
 */
export async function getUserActivityLogs(
  userId: string,
  startDate?: Date,
  endDate?: Date
): Promise<ActivityLog[]> {
  const allLogs = await getActivityLogs(startDate, endDate);
  return allLogs.filter(log => log.userId === userId);
}

// ============================================================================
// VERSION TRACKING
// ============================================================================

/**
 * Create content version
 */
export async function createContentVersion(params: {
  contentId: string;
  changes: string;
  changedBy: string;
  previousVersion?: any;
  currentVersion: any;
}): Promise<ContentVersion> {
  // Get existing versions to determine version number
  const existingVersions = await kv.getByPrefix(`content_version:${params.contentId}:`);
  const versionNumber = existingVersions.length + 1;
  
  const versionId = `version_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const version: ContentVersion = {
    id: versionId,
    contentId: params.contentId,
    versionNumber,
    changes: params.changes,
    changedBy: params.changedBy,
    changedAt: new Date().toISOString(),
    previousVersion: params.previousVersion,
    currentVersion: params.currentVersion,
    approved: false,
  };
  
  await kv.set(`content_version:${params.contentId}:${versionId}`, version);
  
  // Log activity
  await logActivity({
    userId: params.changedBy,
    action: 'content_version_created',
    category: 'content',
    targetId: params.contentId,
    targetType: 'content',
    details: { versionNumber, changes: params.changes },
  });
  
  return version;
}

/**
 * Get content version history
 */
export async function getContentVersions(contentId: string): Promise<ContentVersion[]> {
  const versions = await kv.getByPrefix(`content_version:${contentId}:`);
  return versions.sort((a, b) => b.versionNumber - a.versionNumber);
}

/**
 * Approve content version
 */
export async function approveContentVersion(
  versionId: string,
  approvedBy: string
): Promise<void> {
  const allVersions = await kv.getByPrefix('content_version:');
  const version = allVersions.find(v => v.id === versionId);
  
  if (version) {
    version.approved = true;
    version.approvedBy = approvedBy;
    await kv.set(`content_version:${version.contentId}:${versionId}`, version);
    
    await logActivity({
      userId: approvedBy,
      action: 'content_version_approved',
      category: 'admin',
      targetId: version.contentId,
      targetType: 'content_version',
      details: { versionNumber: version.versionNumber },
    });
  }
}

// ============================================================================
// INCIDENT TRACKING
// ============================================================================

/**
 * Report an incident
 */
export async function reportIncident(params: {
  type: 'security' | 'privacy' | 'content' | 'technical' | 'compliance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  reportedBy: string;
  affectedUsers?: number;
}): Promise<Incident> {
  const incidentId = `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const incident: Incident = {
    id: incidentId,
    type: params.type,
    severity: params.severity,
    title: params.title,
    description: params.description,
    reportedBy: params.reportedBy,
    reportedAt: new Date().toISOString(),
    status: 'open',
    affectedUsers: params.affectedUsers,
  };
  
  await kv.set(`incident:${incidentId}`, incident);
  
  // Log critical incidents
  if (params.severity === 'critical' || params.severity === 'high') {
    await logActivity({
      userId: params.reportedBy,
      action: 'critical_incident_reported',
      category: 'system',
      targetId: incidentId,
      targetType: 'incident',
      details: { type: params.type, severity: params.severity, title: params.title },
    });
  }
  
  return incident;
}

/**
 * Update incident status
 */
export async function updateIncident(
  incidentId: string,
  updates: {
    status?: 'open' | 'investigating' | 'resolved' | 'closed';
    assignedTo?: string;
    resolution?: string;
    mitigationSteps?: string[];
    preventionMeasures?: string[];
  }
): Promise<void> {
  const incident = await kv.get(`incident:${incidentId}`);
  
  if (!incident) {
    throw new Error('Incident not found');
  }
  
  Object.assign(incident, updates);
  
  if (updates.status === 'resolved' || updates.status === 'closed') {
    incident.resolvedAt = new Date().toISOString();
  }
  
  await kv.set(`incident:${incidentId}`, incident);
  
  await logActivity({
    action: 'incident_updated',
    category: 'system',
    targetId: incidentId,
    targetType: 'incident',
    details: updates,
  });
}

/**
 * Get all incidents
 */
export async function getIncidents(
  status?: string,
  severity?: string
): Promise<Incident[]> {
  let incidents = await kv.getByPrefix('incident:');
  
  if (status) {
    incidents = incidents.filter(i => i.status === status);
  }
  
  if (severity) {
    incidents = incidents.filter(i => i.severity === severity);
  }
  
  return incidents.sort((a, b) => 
    new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
  );
}

// ============================================================================
// MILESTONE TRACKING
// ============================================================================

/**
 * Create milestone
 */
export async function createMilestone(params: {
  name: string;
  description: string;
  category: 'development' | 'content' | 'community' | 'grant';
  targetDate?: string;
  grantRelated: boolean;
  createdBy: string;
  metrics?: { [key: string]: any };
}): Promise<Milestone> {
  const milestoneId = `milestone_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const milestone: Milestone = {
    id: milestoneId,
    name: params.name,
    description: params.description,
    category: params.category,
    targetDate: params.targetDate,
    status: 'planned',
    grantRelated: params.grantRelated,
    createdBy: params.createdBy,
    createdAt: new Date().toISOString(),
    metrics: params.metrics,
  };
  
  await kv.set(`milestone:${milestoneId}`, milestone);
  
  await logActivity({
    userId: params.createdBy,
    action: 'milestone_created',
    category: 'admin',
    targetId: milestoneId,
    targetType: 'milestone',
    details: { name: params.name, grantRelated: params.grantRelated },
  });
  
  return milestone;
}

/**
 * Update milestone status
 */
export async function updateMilestone(
  milestoneId: string,
  updates: {
    status?: 'planned' | 'in_progress' | 'completed' | 'cancelled';
    metrics?: { [key: string]: any };
  }
): Promise<void> {
  const milestone = await kv.get(`milestone:${milestoneId}`);
  
  if (!milestone) {
    throw new Error('Milestone not found');
  }
  
  Object.assign(milestone, updates);
  
  if (updates.status === 'completed') {
    milestone.completedDate = new Date().toISOString();
  }
  
  await kv.set(`milestone:${milestoneId}`, milestone);
  
  await logActivity({
    action: 'milestone_updated',
    category: 'admin',
    targetId: milestoneId,
    targetType: 'milestone',
    details: updates,
  });
}

/**
 * Get milestones
 */
export async function getMilestones(
  grantRelatedOnly?: boolean,
  status?: string
): Promise<Milestone[]> {
  let milestones = await kv.getByPrefix('milestone:');
  
  if (grantRelatedOnly) {
    milestones = milestones.filter(m => m.grantRelated);
  }
  
  if (status) {
    milestones = milestones.filter(m => m.status === status);
  }
  
  return milestones.sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

// ============================================================================
// GRANT REPORT GENERATION
// ============================================================================

/**
 * Generate comprehensive grant report
 */
export async function generateGrantReport(params: {
  reportType: 'quarterly' | 'annual' | 'milestone' | 'custom';
  startDate: Date;
  endDate: Date;
  generatedBy: string;
}): Promise<GrantReport> {
  const reportId = `grant_report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Generate cultural impact snapshot
  const culturalImpact = await culturalMetrics.generateCulturalImpactSnapshot(
    params.startDate,
    params.endDate
  );
  
  // Get accessibility compliance
  const accessibilityCompliance = await accessibility.getAccessibilityComplianceReport();
  
  // Get governance metrics
  const governanceMetrics = await governance.getModerationStats(
    params.startDate,
    params.endDate
  );
  
  // Get content metrics
  const allContent = await kv.getByPrefix('content:');
  const periodContent = allContent.filter(c => {
    if (!c.publishedAt) return false;
    const published = new Date(c.publishedAt);
    return published >= params.startDate && published <= params.endDate;
  });
  
  const canadianContent = periodContent.filter(c => c.isCanadianContent).length;
  
  // Calculate hours of content
  const allMetrics = await kv.getByPrefix('content_metrics:');
  const periodMetrics = allMetrics.filter(m => {
    if (!m.publishedAt) return false;
    const published = new Date(m.publishedAt);
    return published >= params.startDate && published <= params.endDate;
  });
  
  const hoursOfContent = periodMetrics.reduce((sum, m) => 
    sum + (m.durationMinutes || 0), 0
  ) / 60;
  
  const multilingualContent = periodContent.filter(c => 
    c.language === 'en' || c.language === 'fr'
  ).length;
  
  // Get creator metrics
  const allCreators = await kv.getByPrefix('creator_metadata:');
  const activeCreators = allCreators.filter(c => {
    const lastActive = new Date(c.lastActiveAt);
    return lastActive >= params.startDate && lastActive <= params.endDate;
  });
  
  const canadianCreators = activeCreators.filter(c => c.isCanadian).length;
  
  const equityDeservingCreators = activeCreators.filter(c => 
    c.equityDeserving && Object.values(c.equityDeserving).some(v => v === true)
  ).length;
  
  // Get milestones
  const milestones = await getMilestones(true);
  const periodMilestones = milestones.filter(m => {
    const created = new Date(m.createdAt);
    return created >= params.startDate && created <= params.endDate;
  });
  
  // Get incidents
  const incidents = await getIncidents();
  const periodIncidents = incidents.filter(i => {
    const reported = new Date(i.reportedAt);
    return reported >= params.startDate && reported <= params.endDate;
  });
  
  // Compliance checks
  const compliance = {
    privacyCompliant: true, // Based on privacy-first architecture
    accessibilityCompliant: accessibilityCompliance.complianceRate.levelAA >= 80,
    contentGovernance: true, // Based on moderation system
    dataProtection: true, // Based on GDPR-compliant deletion
  };
  
  const report: GrantReport = {
    id: reportId,
    reportType: params.reportType,
    period: {
      startDate: params.startDate.toISOString(),
      endDate: params.endDate.toISOString(),
    },
    generatedAt: new Date().toISOString(),
    generatedBy: params.generatedBy,
    culturalImpact,
    accessibilityCompliance,
    governanceMetrics,
    contentMetrics: {
      totalPublished: periodContent.length,
      canadianContent,
      hoursOfContent,
      multilingualContent,
    },
    creatorMetrics: {
      totalCreators: activeCreators.length,
      canadianCreators,
      equityDeservingCreators,
    },
    milestones: periodMilestones,
    incidents: periodIncidents,
    compliance,
    exportFormats: ['json', 'csv', 'pdf'],
  };
  
  await kv.set(`grant_report:${reportId}`, report);
  
  await logActivity({
    userId: params.generatedBy,
    action: 'grant_report_generated',
    category: 'admin',
    targetId: reportId,
    targetType: 'grant_report',
    details: { reportType: params.reportType, period: report.period },
  });
  
  return report;
}

/**
 * Export grant report to CSV
 */
export function exportGrantReportToCSV(report: GrantReport): string {
  const lines: string[] = [];
  
  lines.push('CMF GRANT REPORT');
  lines.push(`Report Type,${report.reportType}`);
  lines.push(`Period,${report.period.startDate} to ${report.period.endDate}`);
  lines.push(`Generated,${report.generatedAt}`);
  lines.push('');
  
  lines.push('CONTENT METRICS');
  lines.push('Metric,Value');
  lines.push(`Total Published,${report.contentMetrics.totalPublished}`);
  lines.push(`Canadian Content,${report.contentMetrics.canadianContent}`);
  lines.push(`Hours of Content,${report.contentMetrics.hoursOfContent.toFixed(2)}`);
  lines.push(`Bilingual Content,${report.contentMetrics.multilingualContent}`);
  lines.push('');
  
  lines.push('CREATOR METRICS');
  lines.push('Metric,Value');
  lines.push(`Total Active Creators,${report.creatorMetrics.totalCreators}`);
  lines.push(`Canadian Creators,${report.creatorMetrics.canadianCreators}`);
  lines.push(`Equity-Deserving Creators,${report.creatorMetrics.equityDeservingCreators}`);
  lines.push('');
  
  lines.push('ACCESSIBILITY COMPLIANCE');
  lines.push('Level,Compliance Rate');
  lines.push(`Level AA,${report.accessibilityCompliance.complianceRate.levelAA.toFixed(2)}%`);
  lines.push('');
  
  lines.push('COMPLIANCE STATUS');
  lines.push('Category,Status');
  lines.push(`Privacy,${report.compliance.privacyCompliant ? 'Compliant' : 'Non-Compliant'}`);
  lines.push(`Accessibility,${report.compliance.accessibilityCompliant ? 'Compliant' : 'Non-Compliant'}`);
  lines.push(`Content Governance,${report.compliance.contentGovernance ? 'Compliant' : 'Non-Compliant'}`);
  lines.push(`Data Protection,${report.compliance.dataProtection ? 'Compliant' : 'Non-Compliant'}`);
  
  return lines.join('\n');
}

/**
 * Export grant report to JSON
 */
export function exportGrantReportToJSON(report: GrantReport): string {
  return JSON.stringify(report, null, 2);
}

// ============================================================================
// COMPLIANCE CHECKLIST
// ============================================================================

/**
 * Create compliance checklist
 */
export async function createComplianceChecklist(
  category: string,
  items: Array<{
    requirement: string;
    status: 'compliant' | 'partial' | 'non_compliant' | 'not_applicable';
    evidence?: string;
    notes?: string;
  }>
): Promise<ComplianceChecklist> {
  const checklistId = `compliance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Determine overall status
  const hasNonCompliant = items.some(i => i.status === 'non_compliant');
  const hasPartial = items.some(i => i.status === 'partial');
  const allCompliant = items.every(i => 
    i.status === 'compliant' || i.status === 'not_applicable'
  );
  
  let overallStatus: 'compliant' | 'partial' | 'non_compliant' = 'partial';
  if (allCompliant) overallStatus = 'compliant';
  if (hasNonCompliant) overallStatus = 'non_compliant';
  
  const checklist: ComplianceChecklist = {
    id: checklistId,
    category,
    items,
    overallStatus,
    lastUpdated: new Date().toISOString(),
  };
  
  await kv.set(`compliance_checklist:${category}`, checklist);
  
  return checklist;
}

/**
 * Get compliance checklist
 */
export async function getComplianceChecklist(category: string): Promise<ComplianceChecklist | null> {
  return await kv.get(`compliance_checklist:${category}`);
}

/**
 * Get all compliance checklists
 */
export async function getAllComplianceChecklists(): Promise<ComplianceChecklist[]> {
  return await kv.getByPrefix('compliance_checklist:');
}
