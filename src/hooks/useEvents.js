import { useState, useEffect, useCallback } from 'react';
import { eventService } from '../api/eventService';

/**
 * Custom hook to fetch and manage published events with loading and error states.
 *
 * @returns {{ events: Array, loading: boolean, error: string|null, refetch: Function }}
 */
export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.getPublishedEvents();
      setEvents(data);
    } catch (err) {
      setError(
        err.message ||
          'Failed to load upcoming events. Please check your connection or try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const data = await eventService.getPublishedEvents();
        if (active) {
          setEvents(data);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError(
            err.message ||
              'Failed to load upcoming events. Please check your connection or try again.'
          );
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
  };
}
