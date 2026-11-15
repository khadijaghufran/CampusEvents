/**
 * ============================================================================
 * FRONTEND THREAD: HTML5 Web Worker
 * File: public/workers/eventSearchWorker.js
 * ============================================================================
 * 
 * Runs search and multi-criteria filtering on a background thread in the browser
 * so the main UI thread never freezes or stutters during user keystrokes.
 */

self.onmessage = function (e) {
  const { events, searchQuery, selectedCategory, statusFilter } = e.data;
  const startTime = performance.now();

  const query = (searchQuery || '').trim().toLowerCase();

  const filtered = events.filter((evt) => {
    // 1. Category Filter
    if (selectedCategory && selectedCategory !== 'All' && evt.category !== selectedCategory) {
      return false;
    }

    // 2. Status Filter
    if (statusFilter && statusFilter !== 'all' && evt.status !== statusFilter) {
      return false;
    }

    // 3. Search text query across title, description, venue, society, and tags
    if (query) {
      const matchTitle = (evt.title || '').toLowerCase().includes(query);
      const matchDesc = (evt.description || '').toLowerCase().includes(query);
      const matchVenue = (evt.venue || '').toLowerCase().includes(query);
      const matchSociety = (evt.societyName || '').toLowerCase().includes(query);
      const matchTags = (evt.tags || []).some((t) => t.toLowerCase().includes(query));

      if (!matchTitle && !matchDesc && !matchVenue && !matchSociety && !matchTags) {
        return false;
      }
    }

    return true;
  });

  const durationMs = (performance.now() - startTime).toFixed(2);

  self.postMessage({
    filtered,
    count: filtered.length,
    durationMs,
    workerThread: 'Browser WebWorker (Background Thread)',
  });
};

