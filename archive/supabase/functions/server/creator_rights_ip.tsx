/**
 * CREATOR RIGHTS & IP PROTECTION MODULE
 * 
 * Purpose: Protect creator intellectual property and manage licensing
 * Principles:
 * - Creators retain full ownership by default
 * - Transparent licensing states
 * - Immutable attribution records
 * - Content export capability
 * - No platform ownership claims
 * 
 * Licensing States:
 * - Private: Only creator can view
 * - Community: Visible to authenticated users only
 * - Public: Visible to all, shareable
 */

import * as kv from "./kv_store.tsx";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type LicenseType = 'private' | 'community' | 'public';

export type ContentRights = 
  | 'all_rights_reserved'
  | 'creative_commons_by'
  | 'creative_commons_by_sa'
  | 'creative_commons_by_nc'
  | 'creative_commons_by_nc_sa'
  | 'public_domain';

export interface IPOwnership {
  contentId: string;
  creatorId: string;
  creatorName: string;
  createdAt: string;
  registeredAt: string;
  ownershipClaim: {
    statement: string; // "I am the original creator of this work"
    agreedToTerms: boolean;
    ipDeclarationVersion: string; // Version of IP terms they agreed to
  };
  collaborators?: Array<{
    userId: string;
    name: string;
    role: string; // e.g., "co-author", "editor", "translator"
    contributionDescription: string;
    addedAt: string;
  }>;
  immutableHash?: string; // Content hash for proof of creation date
}

export interface ContentLicense {
  contentId: string;
  licenseType: LicenseType;
  rights: ContentRights;
  customTerms?: string;
  allowDownload: boolean;
  allowRemix: boolean;
  allowCommercialUse: boolean;
  attributionRequired: boolean;
  shareAlikeRequired: boolean;
  updatedAt: string;
  previousLicenses?: Array<{
    licenseType: LicenseType;
    rights: ContentRights;
    changedAt: string;
  }>;
}

export interface AttributionRecord {
  id: string;
  contentId: string;
  originalCreatorId: string;
  originalCreatorName: string;
  derivativeContentId?: string; // If this is a remix/derivative
  attributionChain: Array<{
    creatorId: string;
    creatorName: string;
    contributionType: string;
    timestamp: string;
  }>;
  createdAt: string;
  immutable: boolean; // Once created, cannot be modified
}

export interface ContentExport {
  exportId: string;
  contentId: string;
  requestedBy: string;
  requestedAt: string;
  format: 'json' | 'markdown' | 'pdf' | 'epub';
  includeMetadata: boolean;
  includeAttribution: boolean;
  status: 'pending' | 'processing' | 'complete' | 'failed';
  downloadUrl?: string;
  expiresAt?: string; // Link expiry for security
  completedAt?: string;
}

export interface IPTransferRequest {
  id: string;
  contentId: string;
  currentOwnerId: string;
  proposedNewOwnerId: string;
  reason: string;
  requestedAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  respondedAt?: string;
  responseNotes?: string;
}

// ============================================================================
// IP OWNERSHIP MANAGEMENT
// ============================================================================

/**
 * Register IP ownership for new content
 */
export async function registerIPOwnership(params: {
  contentId: string;
  creatorId: string;
  creatorName: string;
  ownershipStatement: string;
  ipDeclarationVersion: string;
}): Promise<IPOwnership> {
  // Generate content hash for immutability proof
  const content = await kv.get(`content:${params.contentId}`);
  const contentString = JSON.stringify(content);
  const immutableHash = await generateHash(contentString);
  
  const ownership: IPOwnership = {
    contentId: params.contentId,
    creatorId: params.creatorId,
    creatorName: params.creatorName,
    createdAt: content?.createdAt || new Date().toISOString(),
    registeredAt: new Date().toISOString(),
    ownershipClaim: {
      statement: params.ownershipStatement,
      agreedToTerms: true,
      ipDeclarationVersion: params.ipDeclarationVersion,
    },
    immutableHash,
  };
  
  await kv.set(`ip_ownership:${params.contentId}`, ownership);
  
  // Create immutable attribution record
  await createAttributionRecord({
    contentId: params.contentId,
    originalCreatorId: params.creatorId,
    originalCreatorName: params.creatorName,
  });
  
  return ownership;
}

/**
 * Add collaborator to content
 */
export async function addCollaborator(
  contentId: string,
  requestorId: string,
  collaborator: {
    userId: string;
    name: string;
    role: string;
    contributionDescription: string;
  }
): Promise<void> {
  const ownership = await kv.get(`ip_ownership:${contentId}`);
  
  if (!ownership) {
    throw new Error('IP ownership record not found');
  }
  
  // Only original creator can add collaborators
  if (ownership.creatorId !== requestorId) {
    throw new Error('Only the original creator can add collaborators');
  }
  
  ownership.collaborators = ownership.collaborators || [];
  ownership.collaborators.push({
    ...collaborator,
    addedAt: new Date().toISOString(),
  });
  
  await kv.set(`ip_ownership:${contentId}`, ownership);
  
  // Update attribution record
  const attribution = await kv.get(`attribution:${contentId}`);
  if (attribution) {
    attribution.attributionChain.push({
      creatorId: collaborator.userId,
      creatorName: collaborator.name,
      contributionType: collaborator.role,
      timestamp: new Date().toISOString(),
    });
    await kv.set(`attribution:${contentId}`, attribution);
  }
}

/**
 * Request IP ownership transfer (e.g., for estate transfers, organizational handoff)
 */
export async function requestIPTransfer(params: {
  contentId: string;
  currentOwnerId: string;
  proposedNewOwnerId: string;
  reason: string;
}): Promise<IPTransferRequest> {
  const ownership = await kv.get(`ip_ownership:${params.contentId}`);
  
  if (!ownership) {
    throw new Error('IP ownership record not found');
  }
  
  if (ownership.creatorId !== params.currentOwnerId) {
    throw new Error('Only the current owner can request transfer');
  }
  
  const transferId = `ip_transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const transferRequest: IPTransferRequest = {
    id: transferId,
    contentId: params.contentId,
    currentOwnerId: params.currentOwnerId,
    proposedNewOwnerId: params.proposedNewOwnerId,
    reason: params.reason,
    requestedAt: new Date().toISOString(),
    status: 'pending',
  };
  
  await kv.set(`ip_transfer:${transferId}`, transferRequest);
  
  return transferRequest;
}

/**
 * Respond to IP transfer request
 */
export async function respondToIPTransfer(
  transferId: string,
  responderId: string,
  accept: boolean,
  notes?: string
): Promise<void> {
  const transfer = await kv.get(`ip_transfer:${transferId}`);
  
  if (!transfer) {
    throw new Error('Transfer request not found');
  }
  
  if (transfer.proposedNewOwnerId !== responderId) {
    throw new Error('Only the proposed new owner can respond');
  }
  
  transfer.status = accept ? 'accepted' : 'rejected';
  transfer.respondedAt = new Date().toISOString();
  transfer.responseNotes = notes;
  
  await kv.set(`ip_transfer:${transferId}`, transfer);
  
  // If accepted, update ownership
  if (accept) {
    const ownership = await kv.get(`ip_ownership:${transfer.contentId}`);
    if (ownership) {
      // Store previous owner in history
      const previousOwner = {
        creatorId: ownership.creatorId,
        creatorName: ownership.creatorName,
        transferredAt: new Date().toISOString(),
        transferReason: transfer.reason,
      };
      
      ownership.previousOwners = ownership.previousOwners || [];
      ownership.previousOwners.push(previousOwner);
      
      // Update to new owner
      const newOwnerProfile = await kv.get(`user_profile:${transfer.proposedNewOwnerId}`);
      ownership.creatorId = transfer.proposedNewOwnerId;
      ownership.creatorName = newOwnerProfile?.name || 'Unknown';
      
      await kv.set(`ip_ownership:${transfer.contentId}`, ownership);
    }
  }
}

// ============================================================================
// LICENSING MANAGEMENT
// ============================================================================

/**
 * Set content license
 */
export async function setContentLicense(
  contentId: string,
  creatorId: string,
  license: {
    licenseType: LicenseType;
    rights: ContentRights;
    customTerms?: string;
    allowDownload: boolean;
    allowRemix: boolean;
    allowCommercialUse: boolean;
  }
): Promise<ContentLicense> {
  const ownership = await kv.get(`ip_ownership:${contentId}`);
  
  if (!ownership) {
    throw new Error('IP ownership record not found');
  }
  
  if (ownership.creatorId !== creatorId) {
    throw new Error('Only the content owner can set licensing');
  }
  
  // Get existing license for history
  const existingLicense = await kv.get(`content_license:${contentId}`);
  
  const contentLicense: ContentLicense = {
    contentId,
    licenseType: license.licenseType,
    rights: license.rights,
    customTerms: license.customTerms,
    allowDownload: license.allowDownload,
    allowRemix: license.allowRemix,
    allowCommercialUse: license.allowCommercialUse,
    attributionRequired: license.rights !== 'public_domain',
    shareAlikeRequired: license.rights.includes('_sa'),
    updatedAt: new Date().toISOString(),
    previousLicenses: existingLicense?.previousLicenses || [],
  };
  
  // Add previous license to history
  if (existingLicense) {
    contentLicense.previousLicenses?.push({
      licenseType: existingLicense.licenseType,
      rights: existingLicense.rights,
      changedAt: new Date().toISOString(),
    });
  }
  
  await kv.set(`content_license:${contentId}`, contentLicense);
  
  // Update content visibility based on license type
  const content = await kv.get(`content:${contentId}`);
  if (content) {
    content.visibility = license.licenseType;
    await kv.set(`content:${contentId}`, content);
  }
  
  return contentLicense;
}

/**
 * Get content license
 */
export async function getContentLicense(contentId: string): Promise<ContentLicense | null> {
  return await kv.get(`content_license:${contentId}`);
}

/**
 * Check if user can access content based on license
 */
export async function canAccessContent(
  contentId: string,
  userId?: string
): Promise<{ canAccess: boolean; reason?: string }> {
  const license = await kv.get(`content_license:${contentId}`);
  
  if (!license) {
    // Default to private if no license set
    return { canAccess: false, reason: 'No license set' };
  }
  
  switch (license.licenseType) {
    case 'public':
      return { canAccess: true };
      
    case 'community':
      if (!userId) {
        return { canAccess: false, reason: 'Authentication required for community content' };
      }
      return { canAccess: true };
      
    case 'private':
      const ownership = await kv.get(`ip_ownership:${contentId}`);
      if (!userId) {
        return { canAccess: false, reason: 'Private content' };
      }
      if (ownership && ownership.creatorId === userId) {
        return { canAccess: true };
      }
      // Check if user is a collaborator
      if (ownership?.collaborators?.some(c => c.userId === userId)) {
        return { canAccess: true };
      }
      return { canAccess: false, reason: 'Private content - owner only' };
      
    default:
      return { canAccess: false, reason: 'Unknown license type' };
  }
}

// ============================================================================
// ATTRIBUTION RECORDS
// ============================================================================

/**
 * Create immutable attribution record
 */
export async function createAttributionRecord(params: {
  contentId: string;
  originalCreatorId: string;
  originalCreatorName: string;
  derivativeContentId?: string;
}): Promise<AttributionRecord> {
  const attributionId = `attribution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const record: AttributionRecord = {
    id: attributionId,
    contentId: params.contentId,
    originalCreatorId: params.originalCreatorId,
    originalCreatorName: params.originalCreatorName,
    derivativeContentId: params.derivativeContentId,
    attributionChain: [
      {
        creatorId: params.originalCreatorId,
        creatorName: params.originalCreatorName,
        contributionType: 'original_creator',
        timestamp: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    immutable: true,
  };
  
  await kv.set(`attribution:${params.contentId}`, record);
  
  return record;
}

/**
 * Get attribution record with full chain
 */
export async function getAttributionRecord(contentId: string): Promise<AttributionRecord | null> {
  return await kv.get(`attribution:${contentId}`);
}

/**
 * Generate attribution text for display
 */
export async function generateAttributionText(contentId: string): Promise<string> {
  const attribution = await kv.get(`attribution:${contentId}`);
  const license = await kv.get(`content_license:${contentId}`);
  
  if (!attribution) {
    return '';
  }
  
  const creators = attribution.attributionChain
    .map(c => `${c.creatorName} (${c.contributionType})`)
    .join(', ');
  
  const licenseText = license ? getLicenseText(license.rights) : 'All Rights Reserved';
  
  return `Created by ${creators}. ${licenseText}`;
}

function getLicenseText(rights: ContentRights): string {
  const licenseMap: { [key in ContentRights]: string } = {
    all_rights_reserved: 'All Rights Reserved',
    creative_commons_by: 'CC BY - Attribution Required',
    creative_commons_by_sa: 'CC BY-SA - Attribution & Share-Alike',
    creative_commons_by_nc: 'CC BY-NC - Attribution, Non-Commercial',
    creative_commons_by_nc_sa: 'CC BY-NC-SA - Attribution, Non-Commercial, Share-Alike',
    public_domain: 'Public Domain',
  };
  
  return licenseMap[rights];
}

// ============================================================================
// CONTENT EXPORT
// ============================================================================

/**
 * Request content export
 */
export async function requestContentExport(params: {
  contentId: string;
  userId: string;
  format: 'json' | 'markdown' | 'pdf' | 'epub';
  includeMetadata: boolean;
  includeAttribution: boolean;
}): Promise<ContentExport> {
  // Verify user can access content
  const access = await canAccessContent(params.contentId, params.userId);
  if (!access.canAccess) {
    throw new Error(`Cannot export: ${access.reason}`);
  }
  
  const exportId = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const exportRequest: ContentExport = {
    exportId,
    contentId: params.contentId,
    requestedBy: params.userId,
    requestedAt: new Date().toISOString(),
    format: params.format,
    includeMetadata: params.includeMetadata,
    includeAttribution: params.includeAttribution,
    status: 'pending',
  };
  
  await kv.set(`content_export:${exportId}`, exportRequest);
  
  // Process export asynchronously (in real implementation)
  // For now, we'll just mark it as processing
  exportRequest.status = 'processing';
  await kv.set(`content_export:${exportId}`, exportRequest);
  
  return exportRequest;
}

/**
 * Generate export data
 */
export async function generateExportData(exportId: string): Promise<any> {
  const exportRequest = await kv.get(`content_export:${exportId}`);
  
  if (!exportRequest) {
    throw new Error('Export request not found');
  }
  
  const content = await kv.get(`content:${exportRequest.contentId}`);
  const ownership = await kv.get(`ip_ownership:${exportRequest.contentId}`);
  const license = await kv.get(`content_license:${exportRequest.contentId}`);
  const attribution = await kv.get(`attribution:${exportRequest.contentId}`);
  
  const exportData: any = {
    content: {
      id: content.id,
      title: content.title,
      description: content.description,
      chapters: content.chapters,
      language: content.language,
      tags: content.tags,
      createdAt: content.createdAt,
      publishedAt: content.publishedAt,
    },
  };
  
  if (exportRequest.includeMetadata) {
    exportData.metadata = {
      author: content.authorName,
      ownership: ownership,
      license: license,
    };
  }
  
  if (exportRequest.includeAttribution) {
    exportData.attribution = {
      text: await generateAttributionText(exportRequest.contentId),
      chain: attribution?.attributionChain,
    };
  }
  
  exportData.exportedAt = new Date().toISOString();
  exportData.exportFormat = exportRequest.format;
  
  return exportData;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate hash for content immutability proof
 */
async function generateHash(content: string): Promise<string> {
  // Simple hash function (in production, use proper cryptographic hash)
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `hash_${Math.abs(hash).toString(36)}_${Date.now()}`;
}

/**
 * Verify content hasn't been tampered with
 */
export async function verifyContentIntegrity(contentId: string): Promise<{
  valid: boolean;
  originalHash?: string;
  currentHash?: string;
}> {
  const ownership = await kv.get(`ip_ownership:${contentId}`);
  
  if (!ownership || !ownership.immutableHash) {
    return { valid: false };
  }
  
  const content = await kv.get(`content:${contentId}`);
  const currentHash = await generateHash(JSON.stringify(content));
  
  return {
    valid: ownership.immutableHash === currentHash,
    originalHash: ownership.immutableHash,
    currentHash,
  };
}
