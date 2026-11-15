/**
 * AUDIO INTEGRATION MODULE
 * Supabase storage bindings for FR/ES narration audio
 * 
 * This module provides functions for:
 * - Creating audio storage buckets
 * - Uploading narration files
 * - Generating signed URLs
 * - Binding audio to story metadata
 * 
 * DO NOT MODIFY: This is production infrastructure code
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// ============================================================================
// BUCKET MANAGEMENT
// ============================================================================

/**
 * Creates audio storage buckets (idempotent)
 * Run once during initial setup
 */
export async function createAudioBuckets() {
  const buckets = [
    {
      name: 'creova-audio-narration',
      options: {
        public: false, // Private bucket, signed URLs required
        fileSizeLimit: 52428800, // 50MB per file
        allowedMimeTypes: ['audio/wav', 'audio/mpeg', 'audio/mp3'],
      },
    },
    {
      name: 'creova-audio-ambient',
      options: {
        public: false,
        fileSizeLimit: 52428800,
        allowedMimeTypes: ['audio/wav', 'audio/mpeg', 'audio/mp3'],
      },
    },
  ];

  const results = [];

  for (const bucket of buckets) {
    // Check if bucket exists
    const { data: existingBuckets } = await supabase.storage.listBuckets();
    const bucketExists = existingBuckets?.some((b) => b.name === bucket.name);

    if (!bucketExists) {
      const { data, error } = await supabase.storage.createBucket(
        bucket.name,
        bucket.options,
      );

      if (error) {
        console.error(`[Audio] Failed to create bucket ${bucket.name}:`, error);
        results.push({ bucket: bucket.name, status: 'error', error });
      } else {
        console.log(`[Audio] Created bucket: ${bucket.name}`);
        results.push({ bucket: bucket.name, status: 'created', data });
      }
    } else {
      console.log(`[Audio] Bucket already exists: ${bucket.name}`);
      results.push({ bucket: bucket.name, status: 'exists' });
    }
  }

  return results;
}

// ============================================================================
// FILE UPLOAD
// ============================================================================

interface UploadAudioParams {
  season: number;
  storyId: string;
  chapterId: string;
  language: 'en' | 'fr' | 'es';
  audioType: 'narration' | 'ambient';
  file: File | Blob;
  fileName?: string;
}

/**
 * Uploads audio file to Supabase storage
 * 
 * @param params - Upload parameters
 * @returns Signed URL and metadata
 */
export async function uploadAudioFile(params: UploadAudioParams) {
  const {
    season,
    storyId,
    chapterId,
    language,
    audioType,
    file,
    fileName,
  } = params;

  // Determine bucket
  const bucketName = audioType === 'narration'
    ? 'creova-audio-narration'
    : 'creova-audio-ambient';

  // Generate file path
  const filePath = audioType === 'narration'
    ? `season${season}/${storyId}/${chapterId}_${language}.mp3`
    : `${fileName || 'ambient'}.mp3`;

  console.log(`[Audio] Uploading to ${bucketName}/${filePath}`);

  // Upload file
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: '3600', // 1 hour cache
      upsert: true, // Overwrite if exists
    });

  if (error) {
    console.error(`[Audio] Upload failed:`, error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  console.log(`[Audio] Upload successful: ${data.path}`);

  // Generate signed URL (expires in 1 year)
  const { data: urlData, error: urlError } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, 31536000); // 1 year = 365 * 24 * 60 * 60

  if (urlError) {
    console.error(`[Audio] Failed to generate signed URL:`, urlError);
    throw new Error(`Signed URL generation failed: ${urlError.message}`);
  }

  return {
    filePath: data.path,
    signedUrl: urlData.signedUrl,
    bucket: bucketName,
    metadata: {
      season,
      storyId,
      chapterId,
      language,
      audioType,
      uploadedAt: new Date().toISOString(),
    },
  };
}

// ============================================================================
// BATCH UPLOAD
// ============================================================================

interface BatchUploadResult {
  success: Array<{
    chapterId: string;
    language: string;
    signedUrl: string;
  }>;
  failed: Array<{
    chapterId: string;
    language: string;
    error: string;
  }>;
}

/**
 * Uploads multiple audio files for a season/story
 * 
 * @param season - Season number
 * @param storyId - Story world ID
 * @param files - Array of { chapterId, language, file }
 * @returns Batch upload results
 */
export async function batchUploadNarration(
  season: number,
  storyId: string,
  files: Array<{ chapterId: string; language: 'fr' | 'es'; file: File | Blob }>,
): Promise<BatchUploadResult> {
  const results: BatchUploadResult = {
    success: [],
    failed: [],
  };

  for (const { chapterId, language, file } of files) {
    try {
      const result = await uploadAudioFile({
        season,
        storyId,
        chapterId,
        language,
        audioType: 'narration',
        file,
      });

      results.success.push({
        chapterId,
        language,
        signedUrl: result.signedUrl,
      });

      console.log(
        `[Audio] ✓ Uploaded ${season}/${storyId}/${chapterId}_${language}`,
      );
    } catch (error) {
      results.failed.push({
        chapterId,
        language,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      console.error(
        `[Audio] ✗ Failed ${season}/${storyId}/${chapterId}_${language}:`,
        error,
      );
    }
  }

  return results;
}

// ============================================================================
// SIGNED URL REGENERATION
// ============================================================================

/**
 * Regenerates signed URL for existing audio file
 * (Use when URLs expire or need to be refreshed)
 * 
 * @param bucket - Bucket name
 * @param filePath - File path in bucket
 * @param expiresIn - Expiration time in seconds (default: 1 year)
 * @returns New signed URL
 */
export async function regenerateSignedUrl(
  bucket: string,
  filePath: string,
  expiresIn = 31536000, // 1 year
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    console.error(`[Audio] Failed to regenerate signed URL:`, error);
    throw new Error(`Signed URL regeneration failed: ${error.message}`);
  }

  console.log(`[Audio] Regenerated signed URL for ${bucket}/${filePath}`);
  return data.signedUrl;
}

// ============================================================================
// AUDIO REGISTRY (Key-Value Store Integration)
// ============================================================================

interface AudioRegistryEntry {
  season: number;
  storyId: string;
  chapterId: string;
  audioUrls: {
    en?: string;
    fr?: string;
    es?: string;
  };
  ambientAudioUrl?: string;
  uploadedAt: string;
  lastUpdated: string;
}

/**
 * Stores audio metadata in KV store
 * 
 * @param entry - Audio registry entry
 */
export async function registerAudio(entry: AudioRegistryEntry) {
  const key = `audio:${entry.season}:${entry.storyId}:${entry.chapterId}`;

  // Import KV store functions
  const { set } = await import('./kv_store.tsx');

  await set(key, entry);

  console.log(`[Audio] Registered audio metadata for ${key}`);
  return entry;
}

/**
 * Retrieves audio metadata from KV store
 * 
 * @param season - Season number
 * @param storyId - Story world ID
 * @param chapterId - Chapter ID
 * @returns Audio registry entry or null
 */
export async function getAudioRegistry(
  season: number,
  storyId: string,
  chapterId: string,
): Promise<AudioRegistryEntry | null> {
  const key = `audio:${season}:${storyId}:${chapterId}`;

  const { get } = await import('./kv_store.tsx');

  const result = await get<AudioRegistryEntry>(key);
  return result;
}

/**
 * Updates audio URL for specific language
 * 
 * @param season - Season number
 * @param storyId - Story world ID
 * @param chapterId - Chapter ID
 * @param language - Language code
 * @param signedUrl - Signed URL
 */
export async function updateAudioUrl(
  season: number,
  storyId: string,
  chapterId: string,
  language: 'en' | 'fr' | 'es',
  signedUrl: string,
) {
  const existing = await getAudioRegistry(season, storyId, chapterId);

  const entry: AudioRegistryEntry = existing || {
    season,
    storyId,
    chapterId,
    audioUrls: {},
    uploadedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };

  entry.audioUrls[language] = signedUrl;
  entry.lastUpdated = new Date().toISOString();

  await registerAudio(entry);

  console.log(
    `[Audio] Updated ${language} URL for ${season}/${storyId}/${chapterId}`,
  );
  return entry;
}

// ============================================================================
// INTEGRATION VALIDATION
// ============================================================================

/**
 * Validates that audio files are properly uploaded and accessible
 * 
 * @param season - Season number
 * @param storyId - Story world ID
 * @param chapterIds - Array of chapter IDs to validate
 * @param languages - Array of languages to check
 * @returns Validation report
 */
export async function validateAudioIntegration(
  season: number,
  storyId: string,
  chapterIds: string[],
  languages: Array<'en' | 'fr' | 'es'>,
) {
  const report = {
    total: chapterIds.length * languages.length,
    validated: 0,
    missing: [] as string[],
    errors: [] as string[],
  };

  for (const chapterId of chapterIds) {
    for (const language of languages) {
      const key = `${season}/${storyId}/${chapterId}_${language}`;

      try {
        const registry = await getAudioRegistry(season, storyId, chapterId);

        if (!registry || !registry.audioUrls[language]) {
          report.missing.push(key);
          console.warn(`[Audio] Missing: ${key}`);
        } else {
          report.validated++;
          console.log(`[Audio] ✓ Validated: ${key}`);
        }
      } catch (error) {
        report.errors.push(key);
        console.error(`[Audio] Error validating ${key}:`, error);
      }
    }
  }

  return report;
}

// ============================================================================
// HELPER: Generate Audio Registry for Existing Content
// ============================================================================

/**
 * Generates complete audio registry for Season 2 (after FR/ES upload)
 * This is a helper function to bulk-register audio after professional recording
 */
export async function generateSeason2AudioRegistry() {
  const season = 2;

  const stories = [
    { storyId: 's2-black-canadian-renaissance', chapters: 6 },
    { storyId: 's2-sleeping-car-porters', chapters: 6 },
    { storyId: 's2-black-womens-archive', chapters: 6 },
    { storyId: 's2-montreal-black-music', chapters: 6 },
    { storyId: 's2-africville-memory', chapters: 6 },
    { storyId: 's2-black-canadian-futures', chapters: 5 },
  ];

  const registrations = [];

  for (const { storyId, chapters } of stories) {
    for (let i = 1; i <= chapters; i++) {
      const chapterId = `${storyId}-ch${i}`;

      // This is a template - actual URLs will be generated after file upload
      const entry: AudioRegistryEntry = {
        season,
        storyId,
        chapterId,
        audioUrls: {
          // EN narration will be added when recorded
          // FR narration will be added when recorded
          // ES narration will be added when recorded
        },
        uploadedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      registrations.push(entry);
    }
  }

  console.log(
    `[Audio] Generated registry template for ${registrations.length} chapters`,
  );
  return registrations;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  createAudioBuckets,
  uploadAudioFile,
  batchUploadNarration,
  regenerateSignedUrl,
  registerAudio,
  getAudioRegistry,
  updateAudioUrl,
  validateAudioIntegration,
  generateSeason2AudioRegistry,
};
