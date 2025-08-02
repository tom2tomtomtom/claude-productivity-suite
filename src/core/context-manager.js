/**
 * Context Manager - Manages session context and user state across interactions
 * Provides context persistence, optimization, and intelligent context building
 */

class ContextManager {
  constructor() {
    this.sessions = new Map();
    this.contextCache = new Map();
    this.maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
    this.maxContextSize = 50000; // Maximum context size in characters
  }

  /**
   * Get or create session context
   * @param {string} sessionId - Session identifier
   * @param {Object} initialContext - Initial context data
   * @returns {Object} Session context
   */
  getSessionContext(sessionId, initialContext = {}) {
    if (!this.sessions.has(sessionId)) {
      this.createSession(sessionId, initialContext);
    }
    
    const session = this.sessions.get(sessionId);
    
    // Check if session is expired
    if (this.isSessionExpired(session)) {
      this.createSession(sessionId, initialContext);
      return this.sessions.get(sessionId);
    }
    
    // Update last accessed time
    session.lastAccessed = Date.now();
    
    return session;
  }

  /**
   * Create a new session
   * @param {string} sessionId - Session identifier
   * @param {Object} initialContext - Initial context data
   */
  createSession(sessionId, initialContext = {}) {
    const session = {
      id: sessionId,
      created: Date.now(),
      lastAccessed: Date.now(),
      context: {
        user: {
          preferences: {},
          history: [],
          patterns: []
        },
        project: {
          type: null,
          requirements: [],
          progress: [],
          technologies: []
        },
        conversation: {
          commands: [],
          agents: [],
          patterns: [],
          optimizations: []
        },
        system: {
          tokenUsage: 0,
          optimizations: [],
          performance: {}
        },
        ...initialContext
      }
    };
    
    this.sessions.set(sessionId, session);
    
    // Clean up old sessions periodically
    this.cleanupExpiredSessions();
  }

  /**
   * Update session context
   * @param {string} sessionId - Session identifier
   * @param {Object} updates - Context updates
   */
  updateSessionContext(sessionId, updates) {
    const session = this.getSessionContext(sessionId);
    
    // Deep merge updates into existing context
    session.context = this.deepMerge(session.context, updates);
    session.lastAccessed = Date.now();
    
    // Optimize context size if needed
    if (this.getContextSize(session.context) > this.maxContextSize) {
      session.context = this.optimizeContextSize(session.context);
    }
  }

  /**
   * Add command to conversation history
   * @param {string} sessionId - Session identifier
   * @param {Object} command - Command details
   */
  addCommand(sessionId, command) {
    const session = this.getSessionContext(sessionId);
    
    session.context.conversation.commands.push({
      timestamp: Date.now(),
      command: command.type || command.command,
      input: command.input,
      agent: command.selectedAgent,
      success: command.success,
      tokenUsage: command.tokenUsage
    });
    
    // Keep only last 50 commands to prevent memory issues
    if (session.context.conversation.commands.length > 50) {
      session.context.conversation.commands = session.context.conversation.commands.slice(-50);
    }
    
    // Update system token usage
    if (command.tokenUsage) {
      session.context.system.tokenUsage += command.tokenUsage;
    }
  }

  /**
   * Add agent usage to context
   * @param {string} sessionId - Session identifier
   * @param {Object} agentUsage - Agent usage details
   */
  addAgentUsage(sessionId, agentUsage) {
    const session = this.getSessionContext(sessionId);
    
    session.context.conversation.agents.push({
      timestamp: Date.now(),
      agentId: agentUsage.agentId,
      taskType: agentUsage.taskType,
      executionTime: agentUsage.executionTime,
      success: agentUsage.success,
      tokenUsage: agentUsage.tokenUsage
    });
    
    // Keep only last 30 agent usages
    if (session.context.conversation.agents.length > 30) {
      session.context.conversation.agents = session.context.conversation.agents.slice(-30);
    }
  }

  /**
   * Add pattern recognition result to context
   * @param {string} sessionId - Session identifier
   * @param {Object} pattern - Pattern details
   */
  addPattern(sessionId, pattern) {
    const session = this.getSessionContext(sessionId);
    
    session.context.conversation.patterns.push({
      timestamp: Date.now(),
      type: pattern.type,
      confidence: pattern.confidence,
      reasoning: pattern.reasoning
    });
    
    // Update user patterns for learning
    this.updateUserPatterns(session, pattern);
  }

  /**
   * Update user patterns for learning
   * @param {Object} session - Session object
   * @param {Object} pattern - Pattern details
   */
  updateUserPatterns(session, pattern) {
    const userPatterns = session.context.user.patterns;
    const existingPattern = userPatterns.find(p => p.type === pattern.type);
    
    if (existingPattern) {
      existingPattern.count++;
      existingPattern.lastSeen = Date.now();
      existingPattern.averageConfidence = 
        (existingPattern.averageConfidence * (existingPattern.count - 1) + pattern.confidence) / existingPattern.count;
    } else {
      userPatterns.push({
        type: pattern.type,
        count: 1,
        firstSeen: Date.now(),
        lastSeen: Date.now(),
        averageConfidence: pattern.confidence
      });
    }
  }

  /**
   * Get user preferences
   * @param {string} sessionId - Session identifier
   * @returns {Object} User preferences
   */
  getUserPreferences(sessionId) {
    const session = this.getSessionContext(sessionId);
    return session.context.user.preferences;
  }

  /**
   * Update user preferences
   * @param {string} sessionId - Session identifier
   * @param {Object} preferences - Preference updates
   */
  updateUserPreferences(sessionId, preferences) {
    const session = this.getSessionContext(sessionId);
    session.context.user.preferences = { ...session.context.user.preferences, ...preferences };
  }

  /**
   * Get project context
   * @param {string} sessionId - Session identifier
   * @returns {Object} Project context
   */
  getProjectContext(sessionId) {
    const session = this.getSessionContext(sessionId);
    return session.context.project;
  }

  /**
   * Update project context
   * @param {string} sessionId - Session identifier
   * @param {Object} project - Project updates
   */
  updateProjectContext(sessionId, project) {
    const session = this.getSessionContext(sessionId);
    session.context.project = { ...session.context.project, ...project };
  }

  /**
   * Get conversation history
   * @param {string} sessionId - Session identifier
   * @param {number} limit - Maximum number of entries to return
   * @returns {Object} Conversation history
   */
  getConversationHistory(sessionId, limit = 10) {
    const session = this.getSessionContext(sessionId);
    const conversation = session.context.conversation;
    
    return {
      commands: conversation.commands.slice(-limit),
      agents: conversation.agents.slice(-limit),
      patterns: conversation.patterns.slice(-limit)
    };
  }

  /**
   * Get optimization context for token efficiency
   * @param {string} sessionId - Session identifier
   * @returns {Object} Optimization context
   */
  getOptimizationContext(sessionId) {
    const session = this.getSessionContext(sessionId);
    
    return {
      userPatterns: session.context.user.patterns,
      recentCommands: session.context.conversation.commands.slice(-5),
      projectType: session.context.project.type,
      tokenUsage: session.context.system.tokenUsage,
      optimizations: session.context.system.optimizations
    };
  }

  /**
   * Add optimization result to context
   * @param {string} sessionId - Session identifier
   * @param {Object} optimization - Optimization details
   */
  addOptimization(sessionId, optimization) {
    const session = this.getSessionContext(sessionId);
    
    session.context.system.optimizations.push({
      timestamp: Date.now(),
      type: optimization.type,
      tokensReduced: optimization.tokensReduced,
      strategy: optimization.strategy
    });
    
    // Keep only last 20 optimizations
    if (session.context.system.optimizations.length > 20) {
      session.context.system.optimizations = session.context.system.optimizations.slice(-20);
    }
  }

  /**
   * Get session statistics
   * @param {string} sessionId - Session identifier
   * @returns {Object} Session statistics
   */
  getSessionStats(sessionId) {
    const session = this.getSessionContext(sessionId);
    const context = session.context;
    
    return {
      duration: Date.now() - session.created,
      totalCommands: context.conversation.commands.length,
      uniqueAgents: new Set(context.conversation.agents.map(a => a.agentId)).size,
      totalTokenUsage: context.system.tokenUsage,
      averageTokensPerCommand: context.conversation.commands.length > 0 
        ? context.system.tokenUsage / context.conversation.commands.length 
        : 0,
      patternTypes: new Set(context.conversation.patterns.map(p => p.type)).size,
      optimizations: context.system.optimizations.length
    };
  }

  /**
   * Export session data for analysis
   * @param {string} sessionId - Session identifier
   * @returns {Object} Exportable session data
   */
  exportSession(sessionId) {
    const session = this.getSessionContext(sessionId);
    
    return {
      sessionId,
      created: session.created,
      lastAccessed: session.lastAccessed,
      stats: this.getSessionStats(sessionId),
      context: {
        userPatterns: session.context.user.patterns,
        projectType: session.context.project.type,
        conversationSummary: {
          totalCommands: session.context.conversation.commands.length,
          agentUsage: this.summarizeAgentUsage(session.context.conversation.agents),
          patternDistribution: this.summarizePatterns(session.context.conversation.patterns)
        },
        optimizations: session.context.system.optimizations
      }
    };
  }

  summarizeAgentUsage(agents) {
    const usage = {};
    for (const agent of agents) {
      usage[agent.agentId] = (usage[agent.agentId] || 0) + 1;
    }
    return usage;
  }

  summarizePatterns(patterns) {
    const distribution = {};
    for (const pattern of patterns) {
      distribution[pattern.type] = (distribution[pattern.type] || 0) + 1;
    }
    return distribution;
  }

  /**
   * Check if session is expired
   * @param {Object} session - Session object
   * @returns {boolean} True if expired
   */
  isSessionExpired(session) {
    return (Date.now() - session.lastAccessed) > this.maxSessionAge;
  }

  /**
   * Clean up expired sessions
   */
  cleanupExpiredSessions() {
    const now = Date.now();
    
    for (const [sessionId, session] of this.sessions) {
      if ((now - session.lastAccessed) > this.maxSessionAge) {
        this.sessions.delete(sessionId);
        this.contextCache.delete(sessionId);
      }
    }
  }

  /**
   * Deep merge two objects
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} Merged object
   */
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  /**
   * Get context size in characters
   * @param {Object} context - Context object
   * @returns {number} Size in characters
   */
  getContextSize(context) {
    return JSON.stringify(context).length;
  }

  /**
   * Optimize context size by removing or compressing old data
   * @param {Object} context - Context to optimize
   * @returns {Object} Optimized context
   */
  optimizeContextSize(context) {
    const optimized = { ...context };
    
    // Reduce conversation history
    if (optimized.conversation.commands.length > 25) {
      optimized.conversation.commands = optimized.conversation.commands.slice(-25);
    }
    
    if (optimized.conversation.agents.length > 15) {
      optimized.conversation.agents = optimized.conversation.agents.slice(-15);
    }
    
    if (optimized.conversation.patterns.length > 20) {
      optimized.conversation.patterns = optimized.conversation.patterns.slice(-20);
    }
    
    // Compress user history
    if (optimized.user.history.length > 20) {
      optimized.user.history = optimized.user.history.slice(-20);
    }
    
    return optimized;
  }

  /**
   * Get system health status
   * @returns {Object} Health status
   */
  getHealthStatus() {
    const activeSessions = this.sessions.size;
    const totalMemoryUsage = Array.from(this.sessions.values())
      .reduce((total, session) => total + this.getContextSize(session.context), 0);
    
    return {
      status: activeSessions < 100 ? 'healthy' : 'warning',
      activeSessions,
      totalMemoryUsage,
      averageSessionSize: activeSessions > 0 ? totalMemoryUsage / activeSessions : 0,
      cacheSize: this.contextCache.size,
      lastCleanup: Date.now()
    };
  }

  /**
   * Reset all sessions (useful for testing)
   */
  reset() {
    this.sessions.clear();
    this.contextCache.clear();
  }
}

module.exports = { ContextManager };