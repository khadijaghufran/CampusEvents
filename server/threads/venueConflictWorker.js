/**
 * ============================================================================
 * THREADS IMPLEMENTATION: Node.js worker_threads
 * File: server/threads/venueConflictWorker.js
 * ============================================================================
 * 
 * Purpose:
 * Runs in an isolated Node.js Worker Thread.
 * Evaluates venue schedule conflicts and time overlaps without blocking
 * the main Express.js HTTP event loop.
 * 
 * Algorithm:
 * Converts 12-hour AM/PM time strings into absolute minute intervals:
 *   e.g. "09:30 AM" -> 570 mins, "11:45 AM" -> 705 mins
 * Two bookings on the same venue and date clash if:
 *   Max(Start_A, Start_B) < Min(End_A, End_B)
 */

import { parentPort, workerData, threadId } from 'worker_threads';

// Helper to convert "HH:MM AM/PM" to minutes from 00:00
function timeStringToMinutes(timeStr) {
  if (!timeStr) return 0;
  const match = String(timeStr).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = (match[3] || 'AM').toUpperCase();

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function checkConflict() {
  const startTime = performance.now();
  const { targetVenue, targetDate, targetStartTime, targetEndTime, existingEvents, excludeEventId } =
    workerData;

  const targetStartMin = timeStringToMinutes(targetStartTime);
  const targetEndMin = timeStringToMinutes(targetEndTime);

  // Validate start < end
  if (targetStartMin >= targetEndMin) {
    const totalTimeMs = (performance.now() - startTime).toFixed(3);
    parentPort.postMessage({
      hasConflict: true,
      conflictReason: 'Invalid time slot: Event end time must be later than start time.',
      threadId,
      processingTimeMs: totalTimeMs,
    });
    return;
  }

  // Find overlapping approved or published events on the same venue and date
  let conflictingEvent = null;

  for (const event of existingEvents) {
    if (excludeEventId && event.id === excludeEventId) continue;

    // Only compare same venue and same date
    const sameVenue = String(event.venue).trim().toLowerCase() === String(targetVenue).trim().toLowerCase();
    const sameDate = String(event.date).trim() === String(targetDate).trim();

    // Ignore rejected or cancelled events
    const isActive = ['pending', 'approved', 'published'].includes(event.status);

    if (sameVenue && sameDate && isActive) {
      const eventStartMin = timeStringToMinutes(event.startTime);
      const eventEndMin = timeStringToMinutes(event.endTime);

      // Overlap formula: max(startA, startB) < min(endA, endB)
      const overlapStart = Math.max(targetStartMin, eventStartMin);
      const overlapEnd = Math.min(targetEndMin, eventEndMin);

      if (overlapStart < overlapEnd) {
        conflictingEvent = event;
        break;
      }
    }
  }

  const totalTimeMs = (performance.now() - startTime).toFixed(3);

  if (conflictingEvent) {
    parentPort.postMessage({
      hasConflict: true,
      conflictReason: `Venue clash detected! "${targetVenue}" is already booked on ${targetDate} for "${conflictingEvent.title}" (${conflictingEvent.startTime} – ${conflictingEvent.endTime}).`,
      conflictingEvent: {
        id: conflictingEvent.id,
        title: conflictingEvent.title,
        startTime: conflictingEvent.startTime,
        endTime: conflictingEvent.endTime,
        status: conflictingEvent.status,
      },
      threadId,
      processingTimeMs: totalTimeMs,
    });
  } else {
    parentPort.postMessage({
      hasConflict: false,
      conflictReason: null,
      message: `Venue "${targetVenue}" is completely available on ${targetDate} between ${targetStartTime} and ${targetEndTime}.`,
      threadId,
      processingTimeMs: totalTimeMs,
    });
  }
}

// Execute in worker thread
checkConflict();

