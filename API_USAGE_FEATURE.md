# API Usage Monitoring Feature

## Overview
Added a comprehensive API usage tracking system that monitors API calls and warns users when approaching daily limits.

## Features Added

### 1. API Usage Tracker Service (`services/apiUsageTracker.ts`)
- **Tracks API calls** for both Gemini and OpenRouter
- **Daily reset** - Automatically resets usage at midnight
- **Warning system** - Alerts when usage reaches 80% of estimated limit
- **localStorage persistence** - Saves usage data across sessions
- **Configurable limits** - Can adjust estimated daily limits

### 2. Settings Modal Integration
Added a new "API Usage Monitor" section in the Settings modal that displays:

#### Visual Usage Bar
- **Color-coded progress bar**:
  - 🟢 Green (0-59%): Safe usage
  - 🟡 Yellow (60-79%): Moderate usage
  - 🟠 Orange (80-89%): Warning zone
  - 🔴 Red (90-100%): Critical usage

#### Real-time Statistics
- **Total usage percentage** - Shows how much of daily quota is used
- **Calls made** - Total API calls today
- **Remaining calls** - Estimated calls left
- **Breakdown by provider**:
  - Gemini calls count
  - OpenRouter calls count

#### Warning Alert
When usage reaches 80% or higher, displays:
- ⚠️ Warning icon
- "Approaching Daily Limit" message
- Suggestion to take a break
- Current usage percentage

### 3. Automatic Tracking
The system automatically tracks:
- ✅ Every successful Gemini API call
- ✅ Every successful OpenRouter API call
- ❌ Failed calls are NOT counted (to avoid false positives)

## How It Works

### Tracking Flow
```
User sends message
    ↓
API call made
    ↓
Call succeeds → trackGeminiCall() or trackOpenRouterCall()
    ↓
Usage stats updated in localStorage
    ↓
Check if warning threshold reached (80%)
    ↓
If yes → Console warning + UI indicator in settings
```

### Daily Reset
- Usage automatically resets at midnight (local time)
- Compares `lastReset` date with current date
- If different day → reset counters to 0

### Storage
```json
{
  "geminiCalls": 245,
  "openRouterCalls": 12,
  "lastReset": "2026-04-21T00:00:00.000Z",
  "warningThreshold": 80,
  "estimatedDailyLimit": 1500
}
```

## User Experience

### Normal Usage (< 80%)
- Green/yellow progress bar
- Shows current usage percentage
- No warnings displayed

### Warning Zone (80-89%)
- Orange progress bar
- Warning message appears
- Suggests taking a break
- Still allows continued use

### Critical Zone (90-100%)
- Red progress bar
- Strong warning message
- App continues working but user is informed
- May automatically switch to fallback providers

## Configuration

### Adjusting Daily Limit
```typescript
import { updateDailyLimit } from './services/apiUsageTracker';

// Set custom daily limit
updateDailyLimit(2000); // 2000 calls per day
```

### Adjusting Warning Threshold
Edit `services/apiUsageTracker.ts`:
```typescript
const WARNING_THRESHOLD = 80; // Change to 70 for earlier warnings
```

## Benefits

1. **Prevents unexpected quota exhaustion** - Users know when they're approaching limits
2. **Encourages healthy usage** - Reminds users to take breaks
3. **Transparency** - Users can see exactly how many calls they've made
4. **No surprises** - Warning appears before hitting actual limits
5. **Multi-provider awareness** - Tracks both Gemini and OpenRouter separately

## Technical Details

### Files Modified
- ✅ `services/apiUsageTracker.ts` (new file)
- ✅ `services/geminiService.ts` (added tracking calls)
- ✅ `components/SettingsModal.tsx` (added UI section)

### Dependencies
- Uses browser `localStorage` API
- No external dependencies required
- Works offline (tracks locally)

### Performance Impact
- Minimal: Only updates localStorage on each API call
- No network requests
- Lightweight JSON storage (~200 bytes)

## Future Enhancements

Possible improvements:
- [ ] Add hourly usage graphs
- [ ] Export usage history as CSV
- [ ] Set custom warning thresholds per user
- [ ] Show estimated time until reset
- [ ] Add usage predictions based on patterns
- [ ] Email notifications when approaching limits
- [ ] Integration with actual API quota endpoints

## Testing

To test the feature:
1. Open Settings modal
2. Look for "API Usage Monitor" section
3. Send several messages to increment usage
4. Refresh settings to see updated counts
5. Manually set high usage in localStorage to test warnings:
```javascript
localStorage.setItem('dyslearn_api_usage', JSON.stringify({
  geminiCalls: 1200,
  openRouterCalls: 100,
  lastReset: new Date().toISOString(),
  warningThreshold: 80,
  estimatedDailyLimit: 1500
}));
```

## Notes

- Estimates are conservative (1500 calls/day for free tier)
- Actual limits may vary by API key and account type
- Usage tracking is client-side only (privacy-friendly)
- Data resets automatically each day
