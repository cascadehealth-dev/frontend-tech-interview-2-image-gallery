# Image Gallery Uploader — Interviewer Notes

> **CONFIDENTIAL** — For interviewer use only. Do not share with candidates.

## Exercise Overview

The candidate builds an image gallery uploader from a bare Vite + React scaffold. The mock API provides CRUD endpoints with simulated delays and a ~20% delete failure rate. Sample images are pre-loaded.

This exercise tests: component organization, state management, async patterns (upload progress, cancellation, optimistic updates), URL state management, error handling, and prioritization under time pressure.

## What to Watch For

### Organization (first 5-10 minutes are most telling)
- Do they read all the requirements before coding, or start immediately?
- Do they create a component structure up front, or build monolithically and refactor later?
- Do they create separate files/directories for components, or put everything in App.tsx?

### Prioritization
The requirements are deliberately more than can be completed in 35 minutes. A strong candidate will:
1. Identify the core loop first (list images → upload → delete)
2. Add filtering/URL state after the core works
3. Leave accessibility and stretch goals for last (or mention them as "what I'd do next")

A weaker candidate will:
- Get stuck on one feature (often upload progress) and not deliver the full loop
- Over-invest in styling or polish before functionality works
- Tackle requirements in order without triaging

### Upload Handling
**Strong signals:**
- Uses `URL.createObjectURL()` for immediate client-side preview
- Uses `XMLHttpRequest` with `upload.onprogress` or a fetch wrapper for progress tracking
- Implements cancel via `AbortController` (fetch) or `xhr.abort()`
- Rolls back the optimistic preview card on failure

**Weak signals:**
- Waits for upload to complete before showing any preview
- No progress indicator
- No cancel support
- Doesn't clean up `URL.createObjectURL()` (memory leak — acceptable to mention in discussion)

### Optimistic Delete
**Strong signals:**
- Removes the image from UI immediately
- On API failure (20% rate), restores the image and shows an error
- State remains consistent after rollback

**Weak signals:**
- Waits for API response before removing from UI
- No rollback on failure — image disappears even when API returns 500
- State becomes inconsistent after failed delete (e.g., image partially removed)

### URL State
**Strong signals:**
- Uses `URLSearchParams` or `useSearchParams` (if they add React Router)
- Filters persist on page refresh
- Debounces search input to avoid excessive API calls

**Weak signals:**
- Filters only in local state — refresh loses context
- No debounce on search (acceptable to mention in discussion)

### Code Quality
- Variable naming: are components and state variables clearly named?
- TypeScript: do they define types for the API response, or use `any`?
- Error boundaries: do they handle loading and error states, or just the happy path?

## Extension / Curveball Questions (45-55 min)

Pick one or more based on time:

1. **Scaling:** "What if we had 10,000 images?" Look for: virtualization (`react-window`), infinite scrolling, server-side pagination.

2. **Persistence:** "How would you persist this gallery across reloads?" Look for: localStorage for quick persistence, backend API discussion for real storage.

3. **Testing:** "What tests would you write?" Look for:
   - Unit: filtering logic, upload hook behavior, optimistic rollback
   - Integration: full upload flow with mock API, error handling, URL persistence

4. **Real-world extension:** "How would you integrate this with S3 or a real backend?" Look for: presigned URLs, multipart uploads, auth tokens, retry strategies.

5. **Performance:** "What performance pitfalls could show up?" Look for: memory leaks from `URL.createObjectURL()`, unbounded state growth, non-virtualized grid with many items.

## Wrap-up Discussion Questions (55-60 min)

- "What would you refactor if this were production code?"
- "How would you structure this so multiple engineers can contribute safely?"
- "If you were using Next.js with React Server Components, what would you push server-side and why?"
- "If you had to add CI tests, which scenarios are most critical to cover first?"

## Scoring Reference

This is a reference for the interviewer's notes — the Ashby feedback form uses abstract categories.

| Area | Strong (3-4) | Meets Bar (2-3) | Below Bar (1-2) |
|------|-------------|-----------------|-----------------|
| **Architecture** | Clean component breakdown, custom hooks, types defined | Reasonable structure, some monolithic code | Everything in one file, no separation |
| **Upload handling** | Preview + progress + cancel + rollback | Preview works, some progress, partial error handling | No preview until upload completes, no error handling |
| **Optimistic patterns** | Delete with rollback, consistent state | Optimistic delete but incomplete rollback | No optimistic UI |
| **URL state** | Filters in URL, persists on refresh, debounced | Filters work but not in URL | No filtering implemented |
| **Prioritization** | Core loop first, then enhancements | Reasonable order but got stuck on one feature | No clear prioritization, incomplete core |
| **Communication** | Explains tradeoffs, asks clarifying questions | Explains what they're doing | Codes silently |
