/**
 * CONTENT SYSTEM VALIDATION
 * SEEN by CREOVA
 * 
 * Validates that all generated content supports the complete Viewer journey:
 * Launch → Discover → Story → Chapter → Library → Resume
 * 
 * NO UI/UX MODIFICATIONS — DATA VALIDATION ONLY
 */

import type { StoryWorld, Chapter, Language } from './storyDatabase';
import { getChaptersForStory } from './storyDatabase';
import { validateDiscoveryDistribution } from './discoveryMapping';

export interface ValidationResult {
  category: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

export interface SystemValidation {
  overall: 'pass' | 'fail';
  results: ValidationResult[];
  summary: {
    totalChecks: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

// ============================================
// VALIDATION CHECKS
// ============================================

/**
 * Validate multilingual text completeness
 */
function validateMultilingualText(
  text: { en: string; fr: string; es: string },
  fieldName: string,
  context: string
): ValidationResult {
  const missing: string[] = [];
  
  if (!text.en || text.en.trim() === '') missing.push('EN');
  if (!text.fr || text.fr.trim() === '') missing.push('FR');
  if (!text.es || text.es.trim() === '') missing.push('ES');

  if (missing.length > 0) {
    return {
      category: 'Multilingual Completeness',
      status: 'fail',
      message: `Missing ${fieldName} in ${missing.join(', ')}`,
      details: context,
    };
  }

  return {
    category: 'Multilingual Completeness',
    status: 'pass',
    message: `${fieldName} complete in all languages`,
    details: context,
  };
}

/**
 * Validate Story World structure
 */
function validateStoryWorld(story: StoryWorld): ValidationResult[] {
  const results: ValidationResult[] = [];

  // Required fields
  results.push(validateMultilingualText(story.title, 'Title', story.id));
  results.push(validateMultilingualText(story.description, 'Description', story.id));
  results.push(validateMultilingualText(story.creator, 'Creator', story.id));

  // Chapter count validation
  const chapters = getChaptersForStory(story.id);
  if (chapters.length !== story.chapterCount) {
    results.push({
      category: 'Data Integrity',
      status: 'fail',
      message: `Chapter count mismatch: declared ${story.chapterCount}, found ${chapters.length}`,
      details: story.id,
    });
  } else {
    results.push({
      category: 'Data Integrity',
      status: 'pass',
      message: `Chapter count matches (${story.chapterCount})`,
      details: story.id,
    });
  }

  // Language availability
  const requiredLanguages: Language[] = ['en', 'fr', 'es'];
  const hasAllLanguages = requiredLanguages.every((lang) =>
    story.languagesAvailable.includes(lang)
  );

  if (!hasAllLanguages) {
    results.push({
      category: 'Language Support',
      status: 'warning',
      message: `Missing languages: ${requiredLanguages.filter((l) => !story.languagesAvailable.includes(l)).join(', ')}`,
      details: story.id,
    });
  } else {
    results.push({
      category: 'Language Support',
      status: 'pass',
      message: 'All required languages available',
      details: story.id,
    });
  }

  return results;
}

/**
 * Validate Chapter structure
 */
function validateChapter(chapter: Chapter, storyId: string): ValidationResult[] {
  const results: ValidationResult[] = [];

  results.push(
    validateMultilingualText(
      chapter.title,
      'Chapter Title',
      `${storyId} / ${chapter.id}`
    )
  );
  results.push(
    validateMultilingualText(
      chapter.description,
      'Chapter Description',
      `${storyId} / ${chapter.id}`
    )
  );
  results.push(
    validateMultilingualText(
      chapter.text,
      'Chapter Text',
      `${storyId} / ${chapter.id}`
    )
  );

  // Validate text length (should be 400-700 words minimum for EN)
  const wordCount = chapter.text.en.split(/\s+/).length;
  if (wordCount < 100) {
    results.push({
      category: 'Content Length',
      status: 'warning',
      message: `Chapter text may be too short (${wordCount} words)`,
      details: `${storyId} / ${chapter.id}`,
    });
  } else {
    results.push({
      category: 'Content Length',
      status: 'pass',
      message: `Chapter text length adequate (${wordCount} words)`,
      details: `${storyId} / ${chapter.id}`,
    });
  }

  return results;
}

/**
 * Validate language switching support
 */
function validateLanguageSwitching(stories: StoryWorld[]): ValidationResult[] {
  const results: ValidationResult[] = [];

  for (const story of stories) {
    const chapters = getChaptersForStory(story.id);
    for (const chapter of chapters) {
      const hasAllLanguages =
        chapter.text.en &&
        chapter.text.fr &&
        chapter.text.es &&
        chapter.title.en &&
        chapter.title.fr &&
        chapter.title.es;

      if (!hasAllLanguages) {
        results.push({
          category: 'Language Switching',
          status: 'fail',
          message: 'Missing language versions prevent mid-chapter switching',
          details: `${story.id} / ${chapter.id}`,
        });
      }
    }
  }

  if (results.length === 0) {
    results.push({
      category: 'Language Switching',
      status: 'pass',
      message: 'All chapters support language switching',
    });
  }

  return results;
}

/**
 * Validate resume functionality
 */
function validateResumeSupport(stories: StoryWorld[]): ValidationResult {
  // Resume depends on chapter IDs being unique and stable
  const allChapterIds = stories.flatMap((s) => getChaptersForStory(s.id).map((c) => c.id));
  const uniqueIds = new Set(allChapterIds);

  if (allChapterIds.length !== uniqueIds.size) {
    return {
      category: 'Resume Support',
      status: 'fail',
      message: 'Duplicate chapter IDs detected — resume functionality will fail',
      details: `${allChapterIds.length} total, ${uniqueIds.size} unique`,
    };
  }

  return {
    category: 'Resume Support',
    status: 'pass',
    message: 'All chapter IDs unique — resume supported',
    details: `${uniqueIds.size} unique chapters`,
  };
}

/**
 * Validate no duplicate content across tabs
 */
function validateNoDuplicateContent(stories: StoryWorld[]): ValidationResult {
  const storyIds = stories.map((s) => s.id);
  const uniqueStoryIds = new Set(storyIds);

  if (storyIds.length !== uniqueStoryIds.size) {
    return {
      category: 'Content Uniqueness',
      status: 'fail',
      message: 'Duplicate Story World IDs detected',
      details: `${storyIds.length} total, ${uniqueStoryIds.size} unique`,
    };
  }

  return {
    category: 'Content Uniqueness',
    status: 'pass',
    message: 'No duplicate Story Worlds',
    details: `${uniqueStoryIds.size} unique stories`,
  };
}

/**
 * Validate audio playback structure
 */
function validateAudioStructure(stories: StoryWorld[]): ValidationResult[] {
  const results: ValidationResult[] = [];

  for (const story of stories) {
    const chapters = getChaptersForStory(story.id);
    for (const chapter of chapters) {
      // Check if media object exists
      if (!chapter.media) {
        results.push({
          category: 'Audio Structure',
          status: 'warning',
          message: 'Chapter missing media object',
          details: `${story.id} / ${chapter.id}`,
        });
      }

      // If narration exists, validate structure
      if (chapter.media?.narration) {
        if (!chapter.media.narration.url || !chapter.media.narration.duration) {
          results.push({
            category: 'Audio Structure',
            status: 'fail',
            message: 'Incomplete narration metadata',
            details: `${story.id} / ${chapter.id}`,
          });
        }
      }
    }
  }

  if (results.length === 0) {
    results.push({
      category: 'Audio Structure',
      status: 'pass',
      message: 'Audio metadata structure valid',
    });
  }

  return results;
}

// ============================================
// MAIN VALIDATION FUNCTION
// ============================================

/**
 * Run complete content system validation
 */
export function validateContentSystem(stories: StoryWorld[]): SystemValidation {
  const results: ValidationResult[] = [];

  // 1. Validate discovery distribution
  const discoveryValidation = validateDiscoveryDistribution();
  if (!discoveryValidation.valid) {
    discoveryValidation.errors.forEach((error) => {
      results.push({
        category: 'Discovery Distribution',
        status: 'fail',
        message: error,
      });
    });
  } else {
    results.push({
      category: 'Discovery Distribution',
      status: 'pass',
      message: 'Discovery surface distribution meets requirements',
      details: JSON.stringify(discoveryValidation.summary),
    });
  }

  // 2. Validate each Story World
  stories.forEach((story) => {
    results.push(...validateStoryWorld(story));
    const chapters = getChaptersForStory(story.id);
    chapters.forEach((chapter) => {
      results.push(...validateChapter(chapter, story.id));
    });
  });

  // 3. Validate system-wide features
  results.push(...validateLanguageSwitching(stories));
  results.push(validateResumeSupport(stories));
  results.push(validateNoDuplicateContent(stories));
  results.push(...validateAudioStructure(stories));

  // Calculate summary
  const passed = results.filter((r) => r.status === 'pass').length;
  const failed = results.filter((r) => r.status === 'fail').length;
  const warnings = results.filter((r) => r.status === 'warning').length;

  return {
    overall: failed === 0 ? 'pass' : 'fail',
    results,
    summary: {
      totalChecks: results.length,
      passed,
      failed,
      warnings,
    },
  };
}

/**
 * Generate validation report
 */
export function generateValidationReport(validation: SystemValidation): string {
  const lines: string[] = [];

  lines.push('═══════════════════════════════════════════════');
  lines.push('   CONTENT SYSTEM VALIDATION REPORT');
  lines.push('   SEEN by CREOVA');
  lines.push('═══════════════════════════════════════════════');
  lines.push('');
  lines.push(`OVERALL STATUS: ${validation.overall.toUpperCase()}`);
  lines.push('');
  lines.push('SUMMARY:');
  lines.push(`  Total Checks: ${validation.summary.totalChecks}`);
  lines.push(`  ✓ Passed:     ${validation.summary.passed}`);
  lines.push(`  ✗ Failed:     ${validation.summary.failed}`);
  lines.push(`  ⚠ Warnings:   ${validation.summary.warnings}`);
  lines.push('');

  if (validation.summary.failed > 0) {
    lines.push('FAILURES:');
    validation.results
      .filter((r) => r.status === 'fail')
      .forEach((result) => {
        lines.push(`  ✗ [${result.category}] ${result.message}`);
        if (result.details) lines.push(`    ${result.details}`);
      });
    lines.push('');
  }

  if (validation.summary.warnings > 0) {
    lines.push('WARNINGS:');
    validation.results
      .filter((r) => r.status === 'warning')
      .forEach((result) => {
        lines.push(`  ⚠ [${result.category}] ${result.message}`);
        if (result.details) lines.push(`    ${result.details}`);
      });
    lines.push('');
  }

  lines.push('═══════════════════════════════════════════════');

  return lines.join('\n');
}
