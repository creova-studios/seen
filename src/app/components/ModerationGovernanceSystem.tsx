import { motion } from "motion/react";
import { useState, useMemo, useEffect } from "react";
import { ArrowLeft, Shield, CheckCircle, XCircle, Clock, User, AlertTriangle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { api, type Report } from "../services";
import { ReportsPanel } from "./ReportsPanel";
import { translate } from "../i18n/strings";
import { useStoryState } from "../contexts/StoryStateContext";
import {
  getModerationQueue,
  getModerationActions,
  moderateResponse,
  type QueuedResponse,
  type ModerationActionRecord,
} from "../data/adminService";

/**
 * MODERATION & GOVERNANCE SYSTEM
 * Human-review moderation with audit trails and role-based permissions
 */

export type ModerationStatus = "pending" | "approved" | "rejected" | "flagged";
export type UserRole = "contributor" | "creator" | "moderator" | "institutional_admin";

export interface CommunityResponse {
  id: string;
  chapterId: string;
  storyId: string;
  contributorId: string;
  contributorName: string;
  type: "text" | "audio" | "image";
  content: string; // URL for media, text for text
  language: "en" | "fr" | "es";
  timestamp: Date;
  status: ModerationStatus;
  moderatorId?: string;
  moderatorNotes?: string;
  reviewedAt?: Date;
  flagReason?: string;
}

export interface ModerationAction {
  id: string;
  responseId: string;
  moderatorId: string;
  moderatorName: string;
  action: "approve" | "reject" | "flag";
  reason?: string;
  timestamp: Date;
  notes?: string;
}

export interface PermissionMatrix {
  role: UserRole;
  permissions: {
    submitResponse: boolean;
    createStory: boolean;
    moderateOwnStories: boolean;
    moderateAllStories: boolean;
    manageInstitutionalCollection: boolean;
    viewAuditLogs: boolean;
    editUserRoles: boolean;
  };
}

/**
 * ROLE-BASED PERMISSIONS
 */
export const PERMISSION_MATRIX: PermissionMatrix[] = [
  {
    role: "contributor",
    permissions: {
      submitResponse: true,
      createStory: false,
      moderateOwnStories: false,
      moderateAllStories: false,
      manageInstitutionalCollection: false,
      viewAuditLogs: false,
      editUserRoles: false
    }
  },
  {
    role: "creator",
    permissions: {
      submitResponse: true,
      createStory: true,
      moderateOwnStories: true, // Can moderate responses to their stories
      moderateAllStories: false,
      manageInstitutionalCollection: false,
      viewAuditLogs: false,
      editUserRoles: false
    }
  },
  {
    role: "moderator",
    permissions: {
      submitResponse: true,
      createStory: true,
      moderateOwnStories: true,
      moderateAllStories: true, // Can moderate any community response
      manageInstitutionalCollection: false,
      viewAuditLogs: true,
      editUserRoles: false
    }
  },
  {
    role: "institutional_admin",
    permissions: {
      submitResponse: true,
      createStory: true,
      moderateOwnStories: true,
      moderateAllStories: false, // Only institutional stories
      manageInstitutionalCollection: true,
      viewAuditLogs: true,
      editUserRoles: true // Within their institution only
    }
  }
];

/**
 * MODERATION GUIDELINES
 */
export const MODERATION_GUIDELINES = {
  approve_criteria: [
    "Respectful and thoughtful response",
    "Relates to the story/chapter content",
    "No harassment, hate speech, or threats",
    "No spam or promotional content",
    "Appropriate language for all ages (if story is family-friendly)"
  ],
  
  reject_criteria: [
    "Contains hate speech or discrimination",
    "Harasses or targets individuals",
    "Contains spam or promotional links",
    "Off-topic or unrelated to story",
    "Violates community guidelines"
  ],
  
  flag_criteria: [
    "Requires additional review",
    "Potential cultural sensitivity issue",
    "Unclear intent or context needed",
    "Language barrier (translation needed)"
  ],

  response_time: "24-48 hours for initial review",
  
  appeal_process: "Contributors can appeal rejected responses via email to moderation team"
};

/**
 * VISUAL COMPONENT: Moderation Queue Interface
 */
interface ModerationQueueProps {
  responses: CommunityResponse[];
  onApprove: (responseId: string, notes?: string) => void;
  onReject: (responseId: string, reason: string) => void;
  onFlag: (responseId: string, reason: string) => void;
  userRole: UserRole;
}

export function ModerationQueue({
  responses,
  onApprove,
  onReject,
  onFlag,
  userRole
}: ModerationQueueProps) {
  const pendingResponses = responses.filter(r => r.status === "pending");
  const flaggedResponses = responses.filter(r => r.status === "flagged");

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl tracking-tight text-white mb-1">Moderation Queue</h2>
          <p className="text-sm text-white/60">
            Review community responses before public display
          </p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30">
            <span className="text-sm text-amber-300 whitespace-nowrap">{pendingResponses.length} pending</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-400/30">
            <span className="text-sm text-red-300 whitespace-nowrap">{flaggedResponses.length} flagged</span>
          </div>
        </div>
      </div>

      {/* Flagged items (priority) */}
      {flaggedResponses.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-300" />
            <h3 className="text-sm tracking-wider uppercase text-red-300">Flagged for Review</h3>
          </div>
          {flaggedResponses.map((response) => (
            <ModerationCard
              key={response.id}
              response={response}
              onApprove={onApprove}
              onReject={onReject}
              onFlag={onFlag}
              priority
            />
          ))}
        </div>
      )}

      {/* Pending items */}
      <div className="space-y-3">
        <h3 className="text-sm tracking-wider uppercase text-white/55">Pending Review</h3>
        {pendingResponses.length > 0 ? (
          pendingResponses.map((response) => (
            <ModerationCard
              key={response.id}
              response={response}
              onApprove={onApprove}
              onReject={onReject}
              onFlag={onFlag}
            />
          ))
        ) : (
          <div className="p-8 rounded-xl bg-white/5 border border-white/10 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <p className="text-sm text-white/60">All caught up! No pending responses.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * VISUAL COMPONENT: Individual Moderation Card
 */
interface ModerationCardProps {
  response: CommunityResponse;
  onApprove: (responseId: string, notes?: string) => void;
  onReject: (responseId: string, reason: string) => void;
  onFlag: (responseId: string, reason: string) => void;
  priority?: boolean;
}

function ModerationCard({
  response,
  onApprove,
  onReject,
  onFlag,
  priority = false
}: ModerationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        p-5 rounded-xl border
        ${priority 
          ? 'bg-red-500/5 border-red-400/20' 
          : 'bg-white/5 border-white/10'
        }
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <User className="w-5 h-5 text-white/60" />
          </div>
          <div>
            <h4 className="text-sm text-white">{response.contributorName}</h4>
            <div className="flex items-center gap-2 text-xs text-white/55">
              <Clock className="w-3 h-3" />
              <span>{formatRelativeTime(response.timestamp)}</span>
              <span>•</span>
              <span className="uppercase">{response.language}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={`
            px-2 py-1 rounded text-xs
            ${response.type === 'text' ? 'bg-green-500/20 text-green-300' : ''}
            ${response.type === 'audio' ? 'bg-purple-500/20 text-purple-300' : ''}
            ${response.type === 'image' ? 'bg-blue-500/20 text-blue-300' : ''}
          `}>
            {response.type}
          </div>
        </div>
      </div>

      {/* Content preview */}
      <div className="mb-4 p-4 rounded-lg bg-white/5 border border-white/10">
        {response.type === "text" ? (
          <p className="text-sm text-white/80 leading-relaxed line-clamp-4">
            {response.content}
          </p>
        ) : response.type === "audio" ? (
          <audio src={response.content} controls className="w-full" />
        ) : (
          <img src={response.content} alt="Response" className="w-full rounded-lg" />
        )}
      </div>

      {/* Flag reason if exists */}
      {response.flagReason && (
        <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-400/20">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-3 h-3 text-amber-300" />
            <span className="text-xs text-amber-300">Flag Reason</span>
          </div>
          <p className="text-xs text-amber-200/70">{response.flagReason}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onApprove(response.id)}
          className="flex-1 min-h-11 py-2 rounded-lg bg-green-500/20 border border-green-400/30 text-sm text-green-300 hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Approve
        </button>
        
        <button
          onClick={() => {
            const reason = prompt("Rejection reason:");
            if (reason) onReject(response.id, reason);
          }}
          className="flex-1 min-h-11 py-2 rounded-lg bg-red-500/20 border border-red-400/30 text-sm text-red-300 hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
        >
          <XCircle className="w-4 h-4" />
          Reject
        </button>
        
        <button
          onClick={() => {
            const reason = prompt("Flag reason:");
            if (reason) onFlag(response.id, reason);
          }}
          className="px-4 min-h-11 py-2 rounded-lg bg-amber-500/20 border border-amber-400/30 text-sm text-amber-300 hover:bg-amber-500/30 transition-colors"
        >
          Flag
        </button>
      </div>
    </motion.div>
  );
}

/**
 * VISUAL COMPONENT: Audit Log Viewer
 */
interface AuditLogViewerProps {
  actions: ModerationAction[];
  userRole: UserRole;
}

export function AuditLogViewer({ actions, userRole }: AuditLogViewerProps) {
  const canView = userRole === "moderator" || userRole === "institutional_admin";

  if (!canView) {
    return (
      <div className="p-8 rounded-xl bg-red-500/10 border border-red-400/20 text-center">
        <Shield className="w-8 h-8 text-red-300 mx-auto mb-3" />
        <p className="text-sm text-red-300">Access denied. Moderator role required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl tracking-tight text-white mb-1">Audit Log</h2>
        <p className="text-sm text-white/60">Complete moderation history with timestamps</p>
      </div>

      {actions.length === 0 && (
        <p className="text-sm text-white/60 rounded-xl border border-white/10 bg-white/5 p-4" role="status">
          No moderation actions yet. Approvals, rejections and flags you make appear here.
        </p>
      )}

      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-xl bg-white/5 border border-white/10"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {action.action === "approve" && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                  {action.action === "reject" && (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  {action.action === "flag" && (
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                  )}
                  <span className={`
                    text-sm font-medium capitalize
                    ${action.action === "approve" ? 'text-green-300' : ''}
                    ${action.action === "reject" ? 'text-red-300' : ''}
                    ${action.action === "flag" ? 'text-amber-300' : ''}
                  `}>
                    {action.action}
                  </span>
                </div>

                <p className="text-xs text-white/60 mb-1">
                  by {action.moderatorName}
                </p>

                {action.reason && (
                  <p className="text-xs text-white/55 mb-2">
                    Reason: {action.reason}
                  </p>
                )}

                {action.notes && (
                  <p className="text-xs text-white/55 italic">
                    Notes: {action.notes}
                  </p>
                )}
              </div>

              <div className="text-xs text-white/55">
                {formatRelativeTime(action.timestamp)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/**
 * VISUAL COMPONENT: Governance Guidelines Display
 */
export function GovernanceGuidelines() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl tracking-tight text-white mb-1">Moderation Guidelines</h2>
        <p className="text-sm text-white/60">Human-review standards for community responses</p>
      </div>

      <div className="space-y-4">
        {/* Approve criteria */}
        <div className="p-5 rounded-xl bg-green-500/5 border border-green-400/20">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h3 className="text-base text-green-300">Approval Criteria</h3>
          </div>
          <ul className="space-y-2 text-sm text-green-200/70">
            {MODERATION_GUIDELINES.approve_criteria.map((item, i) => (
              <li key={i}>✓ {item}</li>
            ))}
          </ul>
        </div>

        {/* Reject criteria */}
        <div className="p-5 rounded-xl bg-red-500/5 border border-red-400/20">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5 text-red-400" />
            <h3 className="text-base text-red-300">Rejection Criteria</h3>
          </div>
          <ul className="space-y-2 text-sm text-red-200/70">
            {MODERATION_GUIDELINES.reject_criteria.map((item, i) => (
              <li key={i}>✗ {item}</li>
            ))}
          </ul>
        </div>

        {/* Flag criteria */}
        <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-400/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base text-amber-300">Flag for Review</h3>
          </div>
          <ul className="space-y-2 text-sm text-amber-200/70">
            {MODERATION_GUIDELINES.flag_criteria.map((item, i) => (
              <li key={i}>⚠ {item}</li>
            ))}
          </ul>
        </div>

        {/* Process notes */}
        <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-400/20">
          <h3 className="text-base text-blue-300 mb-3">Process Notes</h3>
          <div className="space-y-2 text-sm text-blue-200/70">
            <p>• Response time: {MODERATION_GUIDELINES.response_time}</p>
            <p>• Appeal process: {MODERATION_GUIDELINES.appeal_process}</p>
            <p>• All actions are logged with timestamps and moderator IDs</p>
            <p>• Cultural sensitivity training required for moderators</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * HELPER FUNCTIONS
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

/**
 * MAIN MODERATION GOVERNANCE SCREEN
 * Combines all moderation components into a complete interface
 */
interface ModerationGovernanceSystemProps {
  onBack: () => void;
}

export function ModerationGovernanceSystem({ onBack }: ModerationGovernanceSystemProps) {
  const [activeTab, setActiveTab] = useState<"queue" | "reports" | "audit" | "guidelines">("queue");
  const [refreshKey, setRefreshKey] = useState(0);
  const { state: authState } = useAuth();
  const lang = useStoryState().state.language;

  const moderatorId = authState.user?.id ?? "mod-demo";
  const moderatorName = authState.user?.name ?? "Moderator";

  // Persisted queue (localStorage-backed, seeded with sample submissions on first load)
  const queuedResponses = useMemo<QueuedResponse[]>(() => getModerationQueue(), [refreshKey]);
  const queuedActions = useMemo<ModerationActionRecord[]>(() => getModerationActions(), [refreshKey]);
  const [reports, setReports] = useState<Report[]>([]);
  useEffect(() => {
    let live = true;
    api.reports.list().then(r => live && setReports(r)).catch(() => live && toast.error("Couldn't load reports."));
    return () => { live = false; };
  }, [refreshKey]);
  const handleResolveReport = async (id: string, status: "action_taken" | "dismissed") => {
    try {
      await api.reports.resolve(id, status);
      setRefreshKey(k => k + 1);
    } catch {
      toast.error("Couldn't update the report. Try again.");
    }
  };

  // Adapt string timestamps -> Date for the presentational components below
  const responses: CommunityResponse[] = queuedResponses.map(r => ({
    ...r,
    timestamp: new Date(r.timestamp),
    reviewedAt: r.reviewedAt ? new Date(r.reviewedAt) : undefined,
  }));
  const actions: ModerationAction[] = queuedActions.map(a => ({
    ...a,
    timestamp: new Date(a.timestamp),
  }));

  const handleApprove = (id: string) => {
    moderateResponse(id, "approve", moderatorId, moderatorName);
    setRefreshKey(k => k + 1);
  };

  const handleReject = (id: string, reason: string) => {
    moderateResponse(id, "reject", moderatorId, moderatorName, reason);
    setRefreshKey(k => k + 1);
  };

  const handleFlag = (id: string, reason: string) => {
    moderateResponse(id, "flag", moderatorId, moderatorName, reason);
    setRefreshKey(k => k + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-dvh bg-black"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-(--seen-content-max) mx-auto px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              aria-label="Back"
              className="w-11 h-11 flex-shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-5 h-5 text-blue-400" />
                <h1 className="text-lg font-semibold text-white">Moderation Panel</h1>
              </div>
              <p className="text-xs text-white/55">Review community contributions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-[73px] z-10 bg-black/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-(--seen-content-max) mx-auto px-5">
          <div className="flex gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab("queue")}
              className={`flex-1 min-h-11 px-2 py-3 text-sm whitespace-nowrap transition-all ${
                activeTab === "queue"
                  ? "text-white border-b-2 border-blue-400"
                  : "text-white/55 hover:text-white/70"
              }`}
            >
              Queue ({responses.length})
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`flex-1 min-h-11 px-2 py-3 text-sm whitespace-nowrap transition-all ${
                activeTab === "reports"
                  ? "text-white border-b-2 border-blue-400"
                  : "text-white/55 hover:text-white/70"
              }`}
            >
              {translate("reports.tab", lang)} ({reports.filter(r => r.status === "open").length})
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`flex-1 min-h-11 px-2 py-3 text-sm whitespace-nowrap transition-all ${
                activeTab === "audit"
                  ? "text-white border-b-2 border-blue-400"
                  : "text-white/55 hover:text-white/70"
              }`}
            >
              Audit Log
            </button>
            <button
              onClick={() => setActiveTab("guidelines")}
              className={`flex-1 min-h-11 px-2 py-3 text-sm whitespace-nowrap transition-all ${
                activeTab === "guidelines"
                  ? "text-white border-b-2 border-blue-400"
                  : "text-white/55 hover:text-white/70"
              }`}
            >
              Guidelines
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-(--seen-content-max) mx-auto pb-20">
        {activeTab === "queue" && (
          <div className="px-5 pt-5">
          <ModerationQueue
            responses={responses}
            onApprove={handleApprove}
            onReject={handleReject}
            onFlag={handleFlag}
            userRole="moderator"
          />
          </div>
        )}
        {activeTab === "reports" && <ReportsPanel reports={reports} onResolve={handleResolveReport} />}
        {activeTab === "audit" && (
          <div className="px-5 pt-5">
            <AuditLogViewer
              actions={actions}
              userRole="moderator"
            />
          </div>
        )}
        {activeTab === "guidelines" && <GovernanceGuidelines />}
      </div>
    </motion.div>
  );
}