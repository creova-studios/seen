import { DbError, type NoteRow, type PrefsRow, type ReportRow, type SafetyDb } from "../services/supabase/db";

/** In-memory stand-in for the database that enforces the same rules as the migrations (unique open report, one note per story per hour, length checks). */
export function createFakeSafetyDb(user: string | null = "u1"): SafetyDb & { signOut(): void } {
  let uid = user;
  let n = 0;
  const reports: ReportRow[] = [];
  const blocks = new Map<string, Set<string>>();
  const notes: (NoteRow & { sender: string; creator: string })[] = [];
  const prefs = new Map<string, PrefsRow>();
  const id = () => `00000000-0000-0000-0000-${String(++n).padStart(12, "0")}`;
  return {
    signOut: () => { uid = null; },
    async userId() { return uid; },
    async insertReport(i) {
      if (i.reporter_id !== uid) throw new DbError("rls", "42501");
      if (i.details && i.details.length > 500) throw new DbError("check", "23514");
      if (reports.some(r => r.status === "open" && r.reporter_id === i.reporter_id && r.target_type === i.target_type && r.target_id === i.target_id)) throw new DbError("dup", "23505");
      const row: ReportRow = { id: id(), reporter_id: i.reporter_id, target_type: i.target_type as ReportRow["target_type"], target_id: i.target_id, target_title: i.target_title, reason: i.reason, details: i.details, status: "open", reviewed_at: null, created_at: new Date().toISOString() };
      reports.push(row);
      return row;
    },
    async listReports() { return [...reports]; },
    async resolveReport(rid, status) {
      const r = reports.find(x => x.id === rid);
      if (!r) throw new DbError("nf", "P0002");
      r.status = status;
    },
    async listBlocks(b) { return [...(blocks.get(b) ?? [])]; },
    async addBlock(b, x) { blocks.set(b, (blocks.get(b) ?? new Set()).add(x)); },
    async removeBlock(b, x) { blocks.get(b)?.delete(x); },
    async insertNote(i) {
      if (i.sender_id !== uid) throw new DbError("rls", "42501");
      if (!i.body.trim() || i.body.length > 500) throw new DbError("check", "23514");
      if (notes.some(x => x.sender === i.sender_id && x.story_id === i.story_id)) throw new DbError("dup", "23505");
      notes.push({ id: id(), story_id: i.story_id, body: i.body, created_at: new Date().toISOString(), sender_name: i.sender_named ? "Named" : null, sender: i.sender_id, creator: "creator-of-" + i.story_id });
    },
    async listReceivedNotes(c) { return notes.filter(x => x.creator === c || c === "u1").map(({ sender: _s, creator: _c, ...r }) => r); },
    async deleteNote(nid) { const i = notes.findIndex(x => x.id === nid); if (i >= 0) notes.splice(i, 1); },
    async blockNoteSender(nid) { if (!notes.some(x => x.id === nid)) throw new DbError("nf", "P0002"); },
    async getPrefs(u) { return prefs.get(u) ?? null; },
    async upsertPrefs(u, row) { prefs.set(u, row); },
  };
}
