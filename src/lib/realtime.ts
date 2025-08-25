/**
 * Real-time subscription service for live updates
 * Phase 3: Enhanced real-time features using Supabase subscriptions
 */

import { supabase, createRealtimeSubscription, isFeatureEnabled, migrationTracker } from './supabase';
import type { Database, League, LeagueMember } from '../types/database';

// =====================================
// Real-time Event Types
// =====================================

export interface LeagueUpdateEvent {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: League | null;
  old: League | null;
  table: 'leagues';
}

export interface MemberUpdateEvent {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: LeagueMember | null;
  old: LeagueMember | null;
  table: 'league_members';
}

export type RealtimeEvent = LeagueUpdateEvent | MemberUpdateEvent;

// =====================================
// Subscription Management
// =====================================

class RealtimeSubscriptionManager {
  private subscriptions = new Map<string, any>();
  private callbacks = new Map<string, Set<(event: RealtimeEvent) => void>>();

  /**
   * Subscribe to league updates for a specific league
   */
  subscribeToLeague(leagueId: string, callback: (event: LeagueUpdateEvent) => void): () => void {
    if (!isFeatureEnabled('use_realtime_subscriptions')) {
      // Real-time subscriptions disabled, skipping league subscription
      return () => {};
    }

    migrationTracker.logRealtime('leagues', 'subscribe');

    const subscriptionKey = `league-${leagueId}`;
    
    // Add callback to set
    if (!this.callbacks.has(subscriptionKey)) {
      this.callbacks.set(subscriptionKey, new Set());
    }
    this.callbacks.get(subscriptionKey)!.add(callback as any);

    // Create subscription if it doesn't exist
    if (!this.subscriptions.has(subscriptionKey)) {
      const { subscription, unsubscribe } = createRealtimeSubscription(
        'leagues',
        (payload) => {
          const event: LeagueUpdateEvent = {
            eventType: payload.eventType,
            new: payload.new as League | null,
            old: payload.old as League | null,
            table: 'leagues',
          };
          
          // Notify all callbacks for this subscription
          const callbacks = this.callbacks.get(subscriptionKey);
          if (callbacks) {
            callbacks.forEach(cb => cb(event));
          }
        },
        `id=eq.${leagueId}`
      );
      
      this.subscriptions.set(subscriptionKey, { subscription, unsubscribe });
    }

    // Return unsubscribe function
    return () => {
      const callbacks = this.callbacks.get(subscriptionKey);
      if (callbacks) {
        callbacks.delete(callback as any);
        
        // If no more callbacks, unsubscribe completely
        if (callbacks.size === 0) {
          const sub = this.subscriptions.get(subscriptionKey);
          if (sub) {
            sub.unsubscribe();
            this.subscriptions.delete(subscriptionKey);
            this.callbacks.delete(subscriptionKey);
          }
        }
      }
    };
  }

  /**
   * Subscribe to league member updates for a specific league
   */
  subscribeToLeagueMembers(leagueId: string, callback: (event: MemberUpdateEvent) => void): () => void {
    if (!isFeatureEnabled('use_realtime_subscriptions')) {
      // Real-time subscriptions disabled, skipping member subscription
      return () => {};
    }

    migrationTracker.logRealtime('league_members', 'subscribe');

    const subscriptionKey = `members-${leagueId}`;
    
    // Add callback to set
    if (!this.callbacks.has(subscriptionKey)) {
      this.callbacks.set(subscriptionKey, new Set());
    }
    this.callbacks.get(subscriptionKey)!.add(callback as any);

    // Create subscription if it doesn't exist
    if (!this.subscriptions.has(subscriptionKey)) {
      const { subscription, unsubscribe } = createRealtimeSubscription(
        'league_members',
        (payload) => {
          const event: MemberUpdateEvent = {
            eventType: payload.eventType,
            new: payload.new as LeagueMember | null,
            old: payload.old as LeagueMember | null,
            table: 'league_members',
          };
          
          // Notify all callbacks for this subscription
          const callbacks = this.callbacks.get(subscriptionKey);
          if (callbacks) {
            callbacks.forEach(cb => cb(event));
          }
        },
        `league_id=eq.${leagueId}`
      );
      
      this.subscriptions.set(subscriptionKey, { subscription, unsubscribe });
    }

    // Return unsubscribe function
    return () => {
      const callbacks = this.callbacks.get(subscriptionKey);
      if (callbacks) {
        callbacks.delete(callback as any);
        
        // If no more callbacks, unsubscribe completely
        if (callbacks.size === 0) {
          const sub = this.subscriptions.get(subscriptionKey);
          if (sub) {
            sub.unsubscribe();
            this.subscriptions.delete(subscriptionKey);
            this.callbacks.delete(subscriptionKey);
          }
        }
      }
    };
  }

  /**
   * Subscribe to all league updates for the current user
   */
  subscribeToUserLeagues(userId: string, callback: (event: RealtimeEvent) => void): () => void {
    if (!isFeatureEnabled('use_realtime_subscriptions')) {
      // Real-time subscriptions disabled, skipping user leagues subscription
      return () => {};
    }

    migrationTracker.logRealtime('user_leagues', 'subscribe');

    const subscriptionKey = `user-leagues-${userId}`;
    
    // Subscribe to both league and member changes
    const unsubscribeLeagues = this.subscribeToAllLeagues(callback);
    const unsubscribeMembers = this.subscribeToAllMembers(callback, userId);

    return () => {
      unsubscribeLeagues();
      unsubscribeMembers();
    };
  }

  /**
   * Subscribe to all league changes
   */
  private subscribeToAllLeagues(callback: (event: RealtimeEvent) => void): () => void {
    const subscriptionKey = 'all-leagues';
    
    if (!this.callbacks.has(subscriptionKey)) {
      this.callbacks.set(subscriptionKey, new Set());
    }
    this.callbacks.get(subscriptionKey)!.add(callback);

    if (!this.subscriptions.has(subscriptionKey)) {
      const { subscription, unsubscribe } = createRealtimeSubscription(
        'leagues',
        (payload) => {
          const event: LeagueUpdateEvent = {
            eventType: payload.eventType,
            new: payload.new as League | null,
            old: payload.old as League | null,
            table: 'leagues',
          };
          
          const callbacks = this.callbacks.get(subscriptionKey);
          if (callbacks) {
            callbacks.forEach(cb => cb(event));
          }
        }
      );
      
      this.subscriptions.set(subscriptionKey, { subscription, unsubscribe });
    }

    return () => {
      const callbacks = this.callbacks.get(subscriptionKey);
      if (callbacks) {
        callbacks.delete(callback);
        
        if (callbacks.size === 0) {
          const sub = this.subscriptions.get(subscriptionKey);
          if (sub) {
            sub.unsubscribe();
            this.subscriptions.delete(subscriptionKey);
            this.callbacks.delete(subscriptionKey);
          }
        }
      }
    };
  }

  /**
   * Subscribe to member changes for a specific user
   */
  private subscribeToAllMembers(callback: (event: RealtimeEvent) => void, userId: string): () => void {
    const subscriptionKey = `user-members-${userId}`;
    
    if (!this.callbacks.has(subscriptionKey)) {
      this.callbacks.set(subscriptionKey, new Set());
    }
    this.callbacks.get(subscriptionKey)!.add(callback);

    if (!this.subscriptions.has(subscriptionKey)) {
      const { subscription, unsubscribe } = createRealtimeSubscription(
        'league_members',
        (payload) => {
          const event: MemberUpdateEvent = {
            eventType: payload.eventType,
            new: payload.new as LeagueMember | null,
            old: payload.old as LeagueMember | null,
            table: 'league_members',
          };
          
          const callbacks = this.callbacks.get(subscriptionKey);
          if (callbacks) {
            callbacks.forEach(cb => cb(event));
          }
        },
        `user_id=eq.${userId}`
      );
      
      this.subscriptions.set(subscriptionKey, { subscription, unsubscribe });
    }

    return () => {
      const callbacks = this.callbacks.get(subscriptionKey);
      if (callbacks) {
        callbacks.delete(callback);
        
        if (callbacks.size === 0) {
          const sub = this.subscriptions.get(subscriptionKey);
          if (sub) {
            sub.unsubscribe();
            this.subscriptions.delete(subscriptionKey);
            this.callbacks.delete(subscriptionKey);
          }
        }
      }
    };
  }

  /**
   * Unsubscribe from all subscriptions
   */
  unsubscribeAll(): void {
    this.subscriptions.forEach(({ unsubscribe }) => {
      unsubscribe();
    });
    
    this.subscriptions.clear();
    this.callbacks.clear();
  }

  /**
   * Get active subscription count
   */
  getActiveSubscriptionCount(): number {
    return this.subscriptions.size;
  }
}

// =====================================
// Singleton Instance
// =====================================

export const realtimeManager = new RealtimeSubscriptionManager();

// =====================================
// React Hook Helpers
// =====================================

/**
 * React hook for subscribing to league updates
 */
export function useLeagueRealtime(leagueId: string | null, callback: (event: LeagueUpdateEvent) => void) {
  return {
    subscribe: () => {
      if (!leagueId) return () => {};
      return realtimeManager.subscribeToLeague(leagueId, callback);
    },
    isEnabled: isFeatureEnabled('use_realtime_subscriptions'),
  };
}

/**
 * React hook for subscribing to league member updates
 */
export function useLeagueMembersRealtime(leagueId: string | null, callback: (event: MemberUpdateEvent) => void) {
  return {
    subscribe: () => {
      if (!leagueId) return () => {};
      return realtimeManager.subscribeToLeagueMembers(leagueId, callback);
    },
    isEnabled: isFeatureEnabled('use_realtime_subscriptions'),
  };
}

/**
 * React hook for subscribing to user's league updates
 */
export function useUserLeaguesRealtime(callback: (event: RealtimeEvent) => void) {
  return {
    subscribe: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return () => {};
      
      return realtimeManager.subscribeToUserLeagues(user.id, callback);
    },
    isEnabled: isFeatureEnabled('use_realtime_subscriptions'),
  };
}

// =====================================
// Cleanup on Window Unload
// =====================================

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    realtimeManager.unsubscribeAll();
  });
}

export default realtimeManager;
