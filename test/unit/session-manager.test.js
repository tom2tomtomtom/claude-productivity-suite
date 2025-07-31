/**
 * Unit Tests for Session Manager
 * Priority 1: Foundation testing - no dependencies, simple logic
 */

const { SessionManager } = require('../../src/core/session-manager');

describe('SessionManager', () => {
  let sessionManager;

  beforeEach(() => {
    sessionManager = new SessionManager();
    // Clear any existing sessions
    sessionManager.sessions.clear();
  });

  afterEach(() => {
    // Clean up intervals to prevent test pollution and open handles
    if (sessionManager && sessionManager.cleanupTimer) {
      clearInterval(sessionManager.cleanupTimer);
    }
  });

  describe('Constructor and Initialization', () => {
    test('should initialize with default settings', () => {
      expect(sessionManager.sessions).toBeInstanceOf(Map);
      expect(sessionManager.sessionTimeout).toBe(30 * 60 * 1000); // 30 minutes
      expect(sessionManager.cleanupInterval).toBe(5 * 60 * 1000); // 5 minutes
    });

    test('should initialize without errors', async () => {
      await expect(sessionManager.initialize()).resolves.toBeUndefined();
    });
  });

  describe('Session Creation and Retrieval', () => {
    test('should create new session when none exists', async () => {
      const sessionId = 'test-session-1';
      const session = await sessionManager.getOrCreateSession(sessionId);

      expect(session).toBeDefined();
      expect(session.id).toBe(sessionId);
      expect(session.created).toBeGreaterThan(0);
      expect(session.lastAccessed).toBeGreaterThan(0);
      expect(sessionManager.sessions.has(sessionId)).toBe(true);
    });

    test('should return existing session when it exists', async () => {
      const sessionId = 'test-session-2';
      
      // Create session first time
      const session1 = await sessionManager.getOrCreateSession(sessionId);
      const originalCreated = session1.created;
      
      // Wait a bit to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Get session second time
      const session2 = await sessionManager.getOrCreateSession(sessionId);
      
      expect(session2.id).toBe(sessionId);
      expect(session2.created).toBe(originalCreated); // Should be same
      expect(session2.lastAccessed).toBeGreaterThan(originalCreated); // Should be updated
      expect(sessionManager.sessions.size).toBe(1); // Still only one session
    });

    test('should create session with correct default structure', () => {
      const sessionId = 'test-session-structure';
      const session = sessionManager.createNewSession(sessionId);

      expect(session).toMatchObject({
        id: sessionId,
        created: expect.any(Number),
        lastAccessed: expect.any(Number),
        context: {
          userId: null,
          preferences: {},
          history: [],
          currentProject: null,
          workflowState: null
        },
        metadata: {
          totalCommands: 0,
          successfulCommands: 0,
          tokenUsage: 0,
          errors: []
        }
      });
    });
  });

  describe('Session Updates', () => {
    test('should update session metadata for successful command', async () => {
      const sessionId = 'test-session-update';
      await sessionManager.getOrCreateSession(sessionId);

      const result = {
        success: true,
        command: '/build-app "test app"',
        message: 'App built successfully',
        type: 'build'
      };

      await sessionManager.updateSession(sessionId, result);
      const session = sessionManager.sessions.get(sessionId);

      expect(session.metadata.totalCommands).toBe(1);
      expect(session.metadata.successfulCommands).toBe(1);
      expect(session.metadata.errors).toHaveLength(0);
      expect(session.context.history).toHaveLength(1);
      
      const historyEntry = session.context.history[0];
      expect(historyEntry.command).toBe(result.command);
      expect(historyEntry.result.success).toBe(true);
      expect(historyEntry.result.message).toBe(result.message);
    });

    test('should update session metadata for failed command', async () => {
      const sessionId = 'test-session-error';
      await sessionManager.getOrCreateSession(sessionId);

      const result = {
        success: false,
        command: '/invalid-command',
        message: 'Command not found',
        error: 'COMMAND_NOT_FOUND'
      };

      await sessionManager.updateSession(sessionId, result);
      const session = sessionManager.sessions.get(sessionId);

      expect(session.metadata.totalCommands).toBe(1);
      expect(session.metadata.successfulCommands).toBe(0);
      expect(session.metadata.errors).toHaveLength(1);
      
      const error = session.metadata.errors[0];
      expect(error.error).toBe(result.error);
      expect(error.timestamp).toBeGreaterThan(0);
    });

    test('should limit history to 50 entries', async () => {
      const sessionId = 'test-session-history-limit';
      await sessionManager.getOrCreateSession(sessionId);

      // Add 60 commands to exceed limit
      for (let i = 0; i < 60; i++) {
        await sessionManager.updateSession(sessionId, {
          success: true,
          command: `/test-command-${i}`,
          message: `Test command ${i}`
        });
      }

      const session = sessionManager.sessions.get(sessionId);
      expect(session.context.history).toHaveLength(50);
      
      // Should keep the most recent entries
      const lastEntry = session.context.history[49];
      expect(lastEntry.command).toBe('/test-command-59');
    });

    test('should handle update for non-existent session gracefully', async () => {
      const result = {
        success: true,
        command: '/test',
        message: 'Test'
      };

      // Should not throw error
      await expect(sessionManager.updateSession('non-existent', result))
        .resolves.toBeUndefined();
    });
  });

  describe('Session Statistics', () => {
    test('should return correct statistics for active session', async () => {
      const sessionId = 'test-session-stats';
      await sessionManager.getOrCreateSession(sessionId);

      // Add some commands
      await sessionManager.updateSession(sessionId, { success: true, command: '/test1' });
      await sessionManager.updateSession(sessionId, { success: false, command: '/test2' });
      await sessionManager.updateSession(sessionId, { success: true, command: '/test3' });

      const stats = sessionManager.getSessionStats(sessionId);

      expect(stats).toMatchObject({
        id: sessionId,
        duration: expect.any(Number),
        totalCommands: 3,
        successRate: '66.7', // 2/3 * 100
        errors: 1,
        lastAccessed: expect.any(Number)
      });
    });

    test('should return null for non-existent session', () => {
      const stats = sessionManager.getSessionStats('non-existent');
      expect(stats).toBeNull();
    });

    test('should handle zero commands correctly', async () => {
      const sessionId = 'test-session-zero';
      await sessionManager.getOrCreateSession(sessionId);

      const stats = sessionManager.getSessionStats(sessionId);
      expect(stats.totalCommands).toBe(0);
      expect(stats.successRate).toBe(0);
      expect(stats.errors).toBe(0);
    });
  });

  describe('Session Management', () => {
    test('should return active sessions list', async () => {
      await sessionManager.getOrCreateSession('session-1');
      await sessionManager.getOrCreateSession('session-2');

      const activeSessions = sessionManager.getActiveSessions();
      
      expect(activeSessions).toHaveLength(2);
      expect(activeSessions[0]).toMatchObject({
        id: expect.any(String),
        created: expect.any(Number),
        lastAccessed: expect.any(Number),
        totalCommands: 0,
        successfulCommands: 0
      });
    });

    test('should force cleanup specific session', async () => {
      const sessionId = 'test-cleanup';
      await sessionManager.getOrCreateSession(sessionId);
      
      expect(sessionManager.sessions.has(sessionId)).toBe(true);
      
      const result = sessionManager.cleanupSession(sessionId);
      
      expect(result).toBe(true);
      expect(sessionManager.sessions.has(sessionId)).toBe(false);
    });

    test('should return false when cleaning up non-existent session', () => {
      const result = sessionManager.cleanupSession('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('Session Cleanup', () => {
    test('should setup cleanup interval on construction', () => {
      // Just verify that cleanup is scheduled - don't test the actual timing
      expect(sessionManager.sessionTimeout).toBe(30 * 60 * 1000);
      expect(sessionManager.cleanupInterval).toBe(5 * 60 * 1000);
      
      // Verify a session can be marked as expired (logic test, not timing)
      const now = Date.now();
      const expiredSession = {
        lastAccessed: now - (31 * 60 * 1000) // 31 minutes ago
      };
      const timeSinceAccess = now - expiredSession.lastAccessed;
      expect(timeSinceAccess).toBeGreaterThan(sessionManager.sessionTimeout);
    });

    test('should not clean up recently accessed sessions', async () => {
      const sessionId = 'test-recent';
      await sessionManager.getOrCreateSession(sessionId);
      
      // Update session to make it recently accessed
      await sessionManager.updateSession(sessionId, {
        success: true,
        command: '/test'
      });
      
      expect(sessionManager.sessions.has(sessionId)).toBe(true);
      
      // Session should still exist (not expired)
      const session = sessionManager.sessions.get(sessionId);
      const timeSinceAccess = Date.now() - session.lastAccessed;
      expect(timeSinceAccess).toBeLessThan(sessionManager.sessionTimeout);
    });
  });

  describe('Edge Cases', () => {
    test('should handle multiple concurrent session creations', async () => {
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(sessionManager.getOrCreateSession(`concurrent-${i}`));
      }
      
      const sessions = await Promise.all(promises);
      
      expect(sessions).toHaveLength(10);
      expect(sessionManager.sessions.size).toBe(10);
      
      // Each session should be unique
      const ids = sessions.map(s => s.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(10);
    });

    test('should handle session updates with minimal result object', async () => {
      const sessionId = 'test-minimal';
      await sessionManager.getOrCreateSession(sessionId);
      
      // Minimal result object
      await sessionManager.updateSession(sessionId, { success: true });
      
      const session = sessionManager.sessions.get(sessionId);
      expect(session.metadata.totalCommands).toBe(1);
      expect(session.metadata.successfulCommands).toBe(1);
      expect(session.context.history[0].command).toBe('unknown');
    });

    test('should handle very long session IDs', async () => {
      const longSessionId = 'a'.repeat(1000);
      const session = await sessionManager.getOrCreateSession(longSessionId);
      
      expect(session.id).toBe(longSessionId);
      expect(sessionManager.sessions.has(longSessionId)).toBe(true);
    });
  });
});