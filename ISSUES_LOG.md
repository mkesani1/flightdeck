# Issues Log - FlightDeck

**Test Date:** 2026-02-04
**Tester:** QA Tester Skill
**Environment:** Local (localhost:5173)
**Build/Version:** Development

## Summary
- Critical: ~~1 issue~~ 0 (1 resolved)
- High: ~~2 issues~~ 0 (2 resolved)
- Medium: ~~1 issue~~ 0 (1 resolved)
- Low: ~~1 issue~~ 0 (1 resolved)

**All issues resolved! Ready for deployment.**

---

## Critical Issues (Blocks Launch)

### ISSUE-001: Missing Route Causes Blank White Page
- **Flow:** Navigation / Routing
- **Steps to reproduce:**
  1. Navigate to `http://localhost:5173/onboarding`
  2. Page shows completely blank white screen
  3. No error message or redirect
- **Expected:** Either show Onboarding page or redirect to valid route with helpful message
- **Actual:** Blank white page with no indication of error
- **Root cause:** Route is defined as `/onboard` in App.tsx but users naturally expect `/onboarding`
- **Screenshot:** Blank white page captured
- **Status:** ✅ RESOLVED - Added `/onboarding` route alias in App.tsx

---

## High Priority Issues

### ISSUE-002: Design Spec Deviations in LiveOps.tsx (LOCKED DESIGN VIOLATION)
- **Flow:** Live Operations Page
- **Steps to reproduce:**
  1. Compare LiveOps.tsx code against PROJECT_DESIGN.md locked specifications
  2. Multiple padding and font size values differ from locked specs
- **Expected:** Code matches locked design specs exactly
- **Actual:** Code has different values:
  - Stats bar: `py-10 px-8` (spec says `py-8 px-6`)
  - Stats numbers: `text-[42px]` (spec says `text-4xl` = 36px)
  - Agent cards: `padding: 28px` (spec says `p-6` = 24px)
  - Feed items: `padding: 22px 26px` (spec says `p-5` = 20px)
  - Intervention cards: `padding: 32px` (spec says `p-6` = 24px)
- **Impact:** Locked design was modified without explicit approval
- **Status:** ✅ RESOLVED - All values corrected to match locked specs:
  - Stats bar: `py-8 px-6`, `text-4xl`, dividers `top-5 bottom-5`
  - Agent cards: `p-6`
  - Feed items: `p-5`
  - Intervention cards: `p-6`

### ISSUE-003: Theme Inconsistency Between Pages
- **Flow:** Onboarding → Live Operations transition
- **Steps to reproduce:**
  1. Navigate to `/onboard` - Page has light/white theme
  2. Navigate to `/live-ops` - Page has dark theme
  3. Navigate to `/workflows` - Page has dark theme
- **Expected:** Consistent theme across all pages (dark theme per design system)
- **Actual:** Onboarding uses light theme, other pages use dark theme
- **Impact:** Jarring visual experience when transitioning between pages
- **Status:** ✅ RESOLVED - Onboarding page redesigned with dark theme matching design system

---

## Medium Priority Issues

### ISSUE-004: Workflows Page - Incomplete Onboarding Flow Visualization
- **Flow:** Workflows page
- **Steps to reproduce:**
  1. Navigate to `/workflows`
  2. Look at "STARTUP ONBOARDING FLOW" section
  3. Only "Add Startup" step is visible with arrows pointing to empty space
- **Expected:** Full onboarding flow steps visible
- **Actual:** Only first step shown, rest appears cut off or not rendering
- **Screenshot:** Only "Add Startup" with arrows to empty boxes
- **Status:** ✅ RESOLVED - Redesigned OnboardingFlow component with grid layout and colored step icons. All 6 steps now visible.

---

## Low Priority Issues

### ISSUE-005: Route Naming Convention
- **Flow:** Navigation
- **Steps to reproduce:**
  1. File is named `Onboarding.tsx`
  2. Route is `/onboard`
- **Expected:** Consistent naming: either `Onboard.tsx` + `/onboard` OR `Onboarding.tsx` + `/onboarding`
- **Actual:** Mixed naming convention
- **Impact:** Minor developer confusion
- **Recommendation:** Rename route to `/onboarding` to match file name
- **Status:** ✅ RESOLVED - Both `/onboard` and `/onboarding` routes now work (alias added)

---

## Passed Tests

### Live Operations Page
- [x] Happy path: Page loads correctly
- [x] Stats bar displays all 4 metrics
- [x] Agent cards show with proper green left border for active agents
- [x] Typing dots animation works on active agents
- [x] Activity feed updates with new items
- [x] Intervention cards display with proper styling
- [x] Urgent intervention shows orange glow border
- [x] "Approve Change" button resolves intervention (badge count decreases)
- [x] "Yes, Focus LinkedIn" button resolves intervention
- [x] Navigation bar shows correctly with logo and green badge
- [x] No console errors

### Workflows Page
- [x] Happy path: Page loads correctly
- [x] Startup cards display by stage (IDEA, PLAN, DESIGN, BUILD, TEST, etc.)
- [x] Agent tasks show with proper status indicators
- [x] Navigation works between pages
- [x] No console errors

### Onboarding Page
- [x] Happy path: Page loads at /onboard
- [x] Form accepts input
- [x] Color picker works
- [x] Preview updates with business name
- [x] Continue button advances steps
- [x] Progress bar updates
- [x] No console errors

---

## Test Environment Details
- Browser: Chrome (via Claude in Chrome)
- Resolution: 1111x1014
- Server: Vite dev server (localhost:5173)
- Date: February 4, 2026
