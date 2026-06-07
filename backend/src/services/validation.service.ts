import { STATE_FORBIDDEN_TERMS } from '../data/states';
import { ValidationResult } from '../types';

export function validatePromptIsNameFree(prompt: string, stateId: string): ValidationResult {
  const forbidden = STATE_FORBIDDEN_TERMS[stateId] || [];
  const lower = prompt.toLowerCase();
  const foundTerms = forbidden.filter(term => lower.includes(term));
  return {
    isValid: foundTerms.length === 0,
    foundTerms,
    attempts: 0,
  };
}

export function validateAllContent(
  content: { prompt: string; clues: string[]; shareText: string },
  stateId: string
): { allValid: boolean; results: Record<string, ValidationResult> } {
  const results: Record<string, ValidationResult> = {
    prompt: validatePromptIsNameFree(content.prompt, stateId),
    clue0: validatePromptIsNameFree(content.clues[0] || '', stateId),
    clue1: validatePromptIsNameFree(content.clues[1] || '', stateId),
    clue2: validatePromptIsNameFree(content.clues[2] || '', stateId),
    shareText: validatePromptIsNameFree(content.shareText, stateId),
  };
  const allValid = Object.values(results).every(r => r.isValid);
  return { allValid, results };
}
