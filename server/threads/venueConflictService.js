/**
 * ============================================================================
 * THREAD SERVICE MANAGER: Spawns and supervises Worker Threads
 * File: server/threads/venueConflictService.js
 * ============================================================================
 */

import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';
import { Event } from '../models/Event.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workerPath = path.resolve(__dirname, 'venueConflictWorker.js');

/**
 * Executes venue clash detection inside a Node.js Worker Thread
 *
 * @param {Object} params
 * @param {string} params.targetVenue
 * @param {string} params.targetDate
 * @param {string} params.targetStartTime
 * @param {string} params.targetEndTime
 * @param {string} [params.excludeEventId]
 * @returns {Promise<Object>}
 */
export async function checkVenueConflictInThread({
  targetVenue,
  targetDate,
  targetStartTime,
  targetEndTime,
  excludeEventId = null,
}) {
  // Fetch existing scheduled events from MongoDB
  const existingEvents = await Event.find({
    venue: targetVenue,
    date: targetDate,
    status: { $in: ['pending', 'approved', 'published'] },
  }).lean();

  return new Promise((resolve, reject) => {
    const worker = new Worker(workerPath, {
      workerData: {
        targetVenue,
        targetDate,
        targetStartTime,
        targetEndTime,
        existingEvents,
        excludeEventId,
      },
    });

    worker.on('message', (result) => {
      resolve(result);
    });

    worker.on('error', (err) => {
      console.error('Worker thread error:', err);
      // Resilient fallback in case worker crashes
      reject(new Error(`Worker thread execution error: ${err.message}`));
    });

    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

