/**
 * Session Manager
 * Manages user sessions and context preservation for Claude Productivity Suite
 */

class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.cleanupInterval = 5 * 60 * 1000; // 5 minutes
    
    // Start cleanup process
    this.startCleanup();
  }

  async initialize() {
    console.log('📝 Session Manager initialized');
  }

  /**
   * Get existing session or create new one
   * @param {string} sessionId - Session identifier
   * @returns {Object} Session context
   */
  async getOrCreateSession(sessionId) {
    let session = this.sessions.get(sessionId);
    
    if (!session) {
      session = this.createNewSession(sessionId);
      this.sessions.set(sessionId, session);
      console.log(`✨ Created new session: ${sessionId}`);
    } else {
      // Update last accessed time
      session.lastAccessed = Date.now();
      console.log(`🔄 Resumed session: ${sessionId}`);
    }
    
    return session;
  }

  /**
   * Create new session with default context
   * @param {string} sessionId - Session identifier
   * @returns {Object} New session object
   */
  createNewSession(sessionId) {
    return {
      id: sessionId,
      created: Date.now(),
      lastAccessed: Date.now(),
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
    };
  }

  /**
   * Update session with new information
   * @param {string} sessionId - Session identifier
   * @param {Object} result - Command result to incorporate
   */
  async updateSession(sessionId, result) {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Update metadata
    session.metadata.totalCommands++;
    if (result.success) {
      session.metadata.successfulCommands++;
    } else {
      session.metadata.errors.push({
        timestamp: Date.now(),
        error: result.error || result.message
      });
    }

    // Add to history
    session.context.history.push({
      timestamp: Date.now(),
      command: result.command || 'unknown',
      result: {
        success: result.success,
        message: result.message,
        type: result.type
      }
    });

    // Limit history size
    if (session.context.history.length > 50) {
      session.context.history = session.context.history.slice(-50);
    }

    session.lastAccessed = Date.now();
  }

  /**
   * Get session statistics
   * @param {string} sessionId - Session identifier
   * @returns {Object} Session statistics
   */
  getSessionStats(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    return {
      id: sessionId,
      duration: Date.now() - session.created,
      totalCommands: session.metadata.totalCommands,
      successRate: session.metadata.totalCommands > 0 
        ? (session.metadata.successfulCommands / session.metadata.totalCommands * 100).toFixed(1)
        : 0,
      errors: session.metadata.errors.length,
      lastAccessed: session.lastAccessed
    };
  }

  /**
   * Clean up expired sessions
   */
  startCleanup() {
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      const expiredSessions = [];

      for (const [sessionId, session] of this.sessions.entries()) {
        if (now - session.lastAccessed > this.sessionTimeout) {
          expiredSessions.push(sessionId);
        }
      }

      expiredSessions.forEach(sessionId => {
        this.sessions.delete(sessionId);
        console.log(`🧹 Cleaned up expired session: ${sessionId}`);
      });

      if (expiredSessions.length > 0) {
        console.log(`🧹 Cleaned up ${expiredSessions.length} expired sessions`);
      }
    }, this.cleanupInterval);
  }

  /**
   * Get all active sessions (for monitoring)
   * @returns {Array} Active session summaries
   */
  getActiveSessions() {
    const sessions = [];
    
    for (const [sessionId, session] of this.sessions.entries()) {
      sessions.push({
        id: sessionId,
        created: session.created,
        lastAccessed: session.lastAccessed,
        totalCommands: session.metadata.totalCommands,
        successfulCommands: session.metadata.successfulCommands
      });
    }

    return sessions;
  }

  /**
   * Force cleanup session
   * @param {string} sessionId - Session to cleanup
   */
  cleanupSession(sessionId) {
    if (this.sessions.has(sessionId)) {
      this.sessions.delete(sessionId);
      console.log(`🧹 Force cleaned session: ${sessionId}`);
      return true;
    }
    return false;
  }
}

module.exports = { SessionManager };