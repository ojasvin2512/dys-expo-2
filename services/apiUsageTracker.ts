// API Usage Tracker - Monitors API calls and warns when approaching limits

export type APIUsageStats = {
  geminiCalls: number;
  openRouterCalls: number;
  lastReset: string; // ISO date string
  warningThreshold: number; // percentage (e.g., 80 for 80%)
  estimatedDailyLimit: number;
};

const STORAGE_KEY = 'dyslearn_api_usage';
const DEFAULT_DAILY_LIMIT = 1500; // Conservative estimate for free tier
const WARNING_THRESHOLD = 80; // Warn at 80% usage

/**
 * Get current usage stats from localStorage
 */
export function getUsageStats(): APIUsageStats {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const stats = JSON.parse(stored) as APIUsageStats;
      
      // Reset if it's a new day
      const lastReset = new Date(stats.lastReset);
      const now = new Date();
      if (lastReset.toDateString() !== now.toDateString()) {
        return resetUsageStats();
      }
      
      return stats;
    }
  } catch (err) {
    console.error('Error reading API usage stats:', err);
  }
  
  return resetUsageStats();
}

/**
 * Reset usage stats for a new day
 */
export function resetUsageStats(): APIUsageStats {
  const stats: APIUsageStats = {
    geminiCalls: 0,
    openRouterCalls: 0,
    lastReset: new Date().toISOString(),
    warningThreshold: WARNING_THRESHOLD,
    estimatedDailyLimit: DEFAULT_DAILY_LIMIT,
  };
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Error saving API usage stats:', err);
  }
  
  return stats;
}

/**
 * Track a Gemini API call
 */
export function trackGeminiCall(): void {
  const stats = getUsageStats();
  stats.geminiCalls++;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Error tracking Gemini call:', err);
  }
  
  // Check if we should warn
  checkAndWarn(stats);
}

/**
 * Track an OpenRouter API call
 */
export function trackOpenRouterCall(): void {
  const stats = getUsageStats();
  stats.openRouterCalls++;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Error tracking OpenRouter call:', err);
  }
  
  checkAndWarn(stats);
}

/**
 * Check if usage is approaching limit and warn if needed
 */
function checkAndWarn(stats: APIUsageStats): void {
  const totalCalls = stats.geminiCalls + stats.openRouterCalls;
  const usagePercent = (totalCalls / stats.estimatedDailyLimit) * 100;
  
  if (usagePercent >= stats.warningThreshold) {
    const remaining = stats.estimatedDailyLimit - totalCalls;
    console.warn(`⚠️ API Usage Warning: ${usagePercent.toFixed(1)}% of daily limit used. Approximately ${remaining} calls remaining.`);
  }
}

/**
 * Get usage percentage
 */
export function getUsagePercentage(): number {
  const stats = getUsageStats();
  const totalCalls = stats.geminiCalls + stats.openRouterCalls;
  return Math.min(100, (totalCalls / stats.estimatedDailyLimit) * 100);
}

/**
 * Get remaining calls estimate
 */
export function getRemainingCalls(): number {
  const stats = getUsageStats();
  const totalCalls = stats.geminiCalls + stats.openRouterCalls;
  return Math.max(0, stats.estimatedDailyLimit - totalCalls);
}

/**
 * Check if usage is in warning zone
 */
export function isInWarningZone(): boolean {
  return getUsagePercentage() >= WARNING_THRESHOLD;
}

/**
 * Update the estimated daily limit
 */
export function updateDailyLimit(newLimit: number): void {
  const stats = getUsageStats();
  stats.estimatedDailyLimit = newLimit;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Error updating daily limit:', err);
  }
}
