/**
 * Token Budget Manager - Manages token budgets and cost control
 * Provides proactive token usage monitoring and budget enforcement
 */

class TokenBudgetManager {
  constructor(config = {}) {
    this.budgets = new Map();
    this.usage = new Map();
    this.alerts = new Map();
    
    // Default configuration
    this.config = {
      defaultDailyBudget: config.defaultDailyBudget || 10000,
      defaultMonthlyBudget: config.defaultMonthlyBudget || 300000,
      warningThreshold: config.warningThreshold || 0.8, // 80%
      criticalThreshold: config.criticalThreshold || 0.95, // 95%
      costPerToken: config.costPerToken || 0.000003, // Approximate cost per token
      ...config
    };
    
    this.initializeDefaultBudgets();
  }

  /**
   * Initialize default budgets for system operation
   */
  initializeDefaultBudgets() {
    const now = new Date();
    const today = this.getDateKey(now);
    const thisMonth = this.getMonthKey(now);
    
    // Set up default daily budget
    this.setBudget('daily', today, this.config.defaultDailyBudget);
    
    // Set up default monthly budget
    this.setBudget('monthly', thisMonth, this.config.defaultMonthlyBudget);
  }

  /**
   * Set a budget for a specific period
   * @param {string} type - Budget type ('daily', 'monthly', 'session', 'project')
   * @param {string} key - Budget key (date, month, session ID, etc.)
   * @param {number} amount - Token amount
   * @param {Object} metadata - Additional metadata
   */
  setBudget(type, key, amount, metadata = {}) {
    const budgetId = `${type}:${key}`;
    
    this.budgets.set(budgetId, {
      type,
      key,
      amount,
      remaining: amount,
      used: 0,
      created: Date.now(),
      metadata,
      alerts: {
        warning: false,
        critical: false
      }
    });
    
    // Initialize usage tracking
    if (!this.usage.has(budgetId)) {
      this.usage.set(budgetId, {
        transactions: [],
        totalUsed: 0,
        averagePerTransaction: 0
      });
    }
  }

  /**
   * Record token usage against budgets
   * @param {number} tokenCount - Number of tokens used
   * @param {Object} context - Usage context
   * @returns {Object} Budget status after usage
   */
  recordUsage(tokenCount, context = {}) {
    const now = new Date();
    const today = this.getDateKey(now);
    const thisMonth = this.getMonthKey(now);
    
    const transaction = {
      tokens: tokenCount,
      timestamp: Date.now(),
      context: {
        agentId: context.agentId,
        operationId: context.operationId,
        userId: context.userId || 'anonymous',
        type: context.type || 'unknown',
        ...context
      }
    };
    
    const affectedBudgets = [];
    
    // Update daily budget
    const dailyBudgetId = `daily:${today}`;
    if (this.budgets.has(dailyBudgetId)) {
      const impact = this.updateBudgetUsage(dailyBudgetId, tokenCount, transaction);
      affectedBudgets.push({ type: 'daily', ...impact });
    }
    
    // Update monthly budget
    const monthlyBudgetId = `monthly:${thisMonth}`;
    if (this.budgets.has(monthlyBudgetId)) {
      const impact = this.updateBudgetUsage(monthlyBudgetId, tokenCount, transaction);
      affectedBudgets.push({ type: 'monthly', ...impact });
    }
    
    // Update session budget if provided
    if (context.sessionId) {
      const sessionBudgetId = `session:${context.sessionId}`;
      if (this.budgets.has(sessionBudgetId)) {
        const impact = this.updateBudgetUsage(sessionBudgetId, tokenCount, transaction);
        affectedBudgets.push({ type: 'session', ...impact });
      }
    }
    
    // Update project budget if provided
    if (context.projectId) {
      const projectBudgetId = `project:${context.projectId}`;
      if (this.budgets.has(projectBudgetId)) {
        const impact = this.updateBudgetUsage(projectBudgetId, tokenCount, transaction);
        affectedBudgets.push({ type: 'project', ...impact });
      }
    }
    
    // Check for budget alerts
    this.checkBudgetAlerts(affectedBudgets);
    
    return {
      transaction,
      affectedBudgets,
      totalCost: this.calculateCost(tokenCount),
      status: this.getBudgetStatus()
    };
  }

  /**
   * Update budget usage
   * @param {string} budgetId - Budget identifier
   * @param {number} tokenCount - Tokens to deduct
   * @param {Object} transaction - Transaction details
   * @returns {Object} Budget impact
   */
  updateBudgetUsage(budgetId, tokenCount, transaction) {
    const budget = this.budgets.get(budgetId);
    const usage = this.usage.get(budgetId);
    
    // Update budget
    budget.used += tokenCount;
    budget.remaining = Math.max(0, budget.amount - budget.used);
    
    // Update usage tracking
    usage.transactions.push(transaction);
    usage.totalUsed += tokenCount;
    usage.averagePerTransaction = usage.totalUsed / usage.transactions.length;
    
    // Keep only last 1000 transactions per budget
    if (usage.transactions.length > 1000) {
      usage.transactions = usage.transactions.slice(-1000);
    }
    
    const utilizationRate = budget.used / budget.amount;
    
    return {
      budgetId,
      used: budget.used,
      remaining: budget.remaining,
      amount: budget.amount,
      utilizationRate,
      isOverBudget: budget.remaining === 0,
      cost: this.calculateCost(tokenCount)
    };
  }

  /**
   * Check if token usage is allowed within budget constraints
   * @param {number} estimatedTokens - Estimated token usage
   * @param {Object} context - Usage context
   * @returns {Object} Authorization result
   */
  checkUsageAuthorization(estimatedTokens, context = {}) {
    const now = new Date();
    const today = this.getDateKey(now);
    const thisMonth = this.getMonthKey(now);
    
    const authorizations = [];
    
    // Check daily budget
    const dailyBudgetId = `daily:${today}`;
    if (this.budgets.has(dailyBudgetId)) {
      const auth = this.checkBudgetAuthorization(dailyBudgetId, estimatedTokens);
      authorizations.push({ type: 'daily', ...auth });
    }
    
    // Check monthly budget
    const monthlyBudgetId = `monthly:${thisMonth}`;
    if (this.budgets.has(monthlyBudgetId)) {
      const auth = this.checkBudgetAuthorization(monthlyBudgetId, estimatedTokens);
      authorizations.push({ type: 'monthly', ...auth });
    }
    
    // Check session budget if applicable
    if (context.sessionId) {
      const sessionBudgetId = `session:${context.sessionId}`;
      if (this.budgets.has(sessionBudgetId)) {
        const auth = this.checkBudgetAuthorization(sessionBudgetId, estimatedTokens);
        authorizations.push({ type: 'session', ...auth });
      }
    }
    
    // Overall authorization (all budgets must allow)
    const authorized = authorizations.every(auth => auth.authorized);
    const warnings = authorizations.filter(auth => auth.warning);
    const blockers = authorizations.filter(auth => !auth.authorized);
    
    return {
      authorized,
      estimatedTokens,
      estimatedCost: this.calculateCost(estimatedTokens),
      authorizations,
      warnings: warnings.map(w => w.message),
      blockers: blockers.map(b => b.message)
    };
  }

  /**
   * Check authorization for a specific budget
   * @param {string} budgetId - Budget identifier
   * @param {number} estimatedTokens - Estimated token usage
   * @returns {Object} Authorization result
   */
  checkBudgetAuthorization(budgetId, estimatedTokens) {
    const budget = this.budgets.get(budgetId);
    
    if (!budget) {
      return { authorized: true, message: 'No budget constraint' };
    }
    
    const wouldExceed = (budget.used + estimatedTokens) > budget.amount;
    const wouldReachWarning = (budget.used + estimatedTokens) > (budget.amount * this.config.warningThreshold);
    
    return {
      budgetId,
      authorized: !wouldExceed,
      warning: wouldReachWarning && !wouldExceed,
      remaining: budget.remaining,
      wouldUse: estimatedTokens,
      wouldRemain: Math.max(0, budget.remaining - estimatedTokens),
      message: wouldExceed 
        ? `Would exceed ${budget.type} budget (${budget.remaining} tokens remaining)`
        : wouldReachWarning 
          ? `Would approach ${budget.type} budget limit`
          : 'Within budget limits'
    };
  }

  /**
   * Get current budget status
   * @param {string} type - Budget type filter (optional)
   * @returns {Object} Budget status
   */
  getBudgetStatus(type = null) {
    const status = {
      budgets: [],
      totalCost: 0,
      alerts: [],
      summary: {
        totalBudgets: 0,
        activeBudgets: 0,
        overBudgetCount: 0,
        warningCount: 0
      }
    };
    
    for (const [budgetId, budget] of this.budgets) {
      if (type && !budgetId.startsWith(`${type}:`)) continue;
      
      const utilizationRate = budget.used / budget.amount;
      const isOverBudget = budget.remaining === 0;
      const isWarning = utilizationRate >= this.config.warningThreshold;
      const isCritical = utilizationRate >= this.config.criticalThreshold;
      
      const budgetStatus = {
        id: budgetId,
        type: budget.type,
        key: budget.key,
        amount: budget.amount,
        used: budget.used,
        remaining: budget.remaining,
        utilizationRate,
        cost: this.calculateCost(budget.used),
        isOverBudget,
        isWarning,
        isCritical,
        created: budget.created
      };
      
      status.budgets.push(budgetStatus);
      status.totalCost += budgetStatus.cost;
      
      // Update summary counters
      status.summary.totalBudgets++;
      if (budget.used > 0) status.summary.activeBudgets++;
      if (isOverBudget) status.summary.overBudgetCount++;
      if (isWarning) status.summary.warningCount++;
      
      // Collect alerts
      if (isCritical) {
        status.alerts.push(`Critical: ${budget.type} budget at ${Math.round(utilizationRate * 100)}%`);
      } else if (isWarning) {
        status.alerts.push(`Warning: ${budget.type} budget at ${Math.round(utilizationRate * 100)}%`);
      }
    }
    
    return status;
  }

  /**
   * Check for budget alerts and trigger notifications
   * @param {Array} affectedBudgets - Budgets affected by recent usage
   */
  checkBudgetAlerts(affectedBudgets) {
    for (const budgetImpact of affectedBudgets) {
      const { budgetId, utilizationRate } = budgetImpact;
      const budget = this.budgets.get(budgetId);
      
      // Check for warning threshold
      if (utilizationRate >= this.config.warningThreshold && !budget.alerts.warning) {
        budget.alerts.warning = true;
        this.triggerAlert('warning', budgetId, utilizationRate);
      }
      
      // Check for critical threshold
      if (utilizationRate >= this.config.criticalThreshold && !budget.alerts.critical) {
        budget.alerts.critical = true;
        this.triggerAlert('critical', budgetId, utilizationRate);
      }
    }
  }

  /**
   * Trigger budget alert
   * @param {string} level - Alert level ('warning' or 'critical')
   * @param {string} budgetId - Budget identifier
   * @param {number} utilizationRate - Current utilization rate
   */
  triggerAlert(level, budgetId, utilizationRate) {
    const alert = {
      level,
      budgetId,
      utilizationRate,
      timestamp: Date.now(),
      message: `${level.toUpperCase()}: Budget ${budgetId} at ${Math.round(utilizationRate * 100)}%`
    };
    
    // Store alert
    if (!this.alerts.has(budgetId)) {
      this.alerts.set(budgetId, []);
    }
    this.alerts.get(budgetId).push(alert);
    
    // Log alert (in production, this would trigger notifications)
    console.warn(`🚨 Budget Alert: ${alert.message}`);
  }

  /**
   * Calculate cost for token usage
   * @param {number} tokens - Number of tokens
   * @returns {number} Cost in dollars
   */
  calculateCost(tokens) {
    return tokens * this.config.costPerToken;
  }

  /**
   * Get usage analytics
   * @param {string} budgetId - Budget identifier (optional)
   * @param {number} timeWindow - Time window in milliseconds (optional)
   * @returns {Object} Usage analytics
   */
  getUsageAnalytics(budgetId = null, timeWindow = null) {
    const analytics = {
      totalTransactions: 0,
      totalTokens: 0,
      totalCost: 0,
      averageTokensPerTransaction: 0,
      peakUsageHour: null,
      usageByAgent: {},
      usageByType: {},
      trends: []
    };
    
    const usageEntries = budgetId 
      ? [this.usage.get(budgetId)].filter(Boolean)
      : Array.from(this.usage.values());
    
    const cutoffTime = timeWindow ? Date.now() - timeWindow : 0;
    
    for (const usage of usageEntries) {
      const relevantTransactions = usage.transactions.filter(t => t.timestamp > cutoffTime);
      
      for (const transaction of relevantTransactions) {
        analytics.totalTransactions++;
        analytics.totalTokens += transaction.tokens;
        analytics.totalCost += this.calculateCost(transaction.tokens);
        
        // Track usage by agent
        const agentId = transaction.context.agentId || 'unknown';
        analytics.usageByAgent[agentId] = (analytics.usageByAgent[agentId] || 0) + transaction.tokens;
        
        // Track usage by type
        const type = transaction.context.type || 'unknown';
        analytics.usageByType[type] = (analytics.usageByType[type] || 0) + transaction.tokens;
      }
    }
    
    analytics.averageTokensPerTransaction = analytics.totalTransactions > 0 
      ? analytics.totalTokens / analytics.totalTransactions 
      : 0;
    
    return analytics;
  }

  /**
   * Get date key for daily budgets
   * @param {Date} date - Date object
   * @returns {string} Date key (YYYY-MM-DD)
   */
  getDateKey(date) {
    return date.toISOString().split('T')[0];
  }

  /**
   * Get month key for monthly budgets
   * @param {Date} date - Date object
   * @returns {string} Month key (YYYY-MM)
   */
  getMonthKey(date) {
    return date.toISOString().slice(0, 7);
  }

  /**
   * Export budget data for analysis
   * @returns {Object} Exportable budget data
   */
  exportData() {
    return {
      budgets: Object.fromEntries(this.budgets),
      usage: Object.fromEntries(this.usage),
      alerts: Object.fromEntries(this.alerts),
      config: this.config,
      analytics: this.getUsageAnalytics(),
      exportTimestamp: Date.now()
    };
  }

  /**
   * Reset all budgets and usage (useful for testing)
   */
  reset() {
    this.budgets.clear();
    this.usage.clear();
    this.alerts.clear();
    this.initializeDefaultBudgets();
  }

  /**
   * Get health status of budget manager
   * @returns {Object} Health status
   */
  getHealthStatus() {
    const status = this.getBudgetStatus();
    
    return {
      status: status.summary.overBudgetCount > 0 ? 'critical' : 
              status.summary.warningCount > 0 ? 'warning' : 'healthy',
      budgetCount: status.summary.totalBudgets,
      overBudgetCount: status.summary.overBudgetCount,
      warningCount: status.summary.warningCount,
      totalCost: status.totalCost,
      recentAlerts: this.getRecentAlerts(10),
      memoryUsage: {
        budgets: this.budgets.size,
        usageRecords: Array.from(this.usage.values())
          .reduce((total, usage) => total + usage.transactions.length, 0)
      }
    };
  }

  /**
   * Get recent alerts
   * @param {number} limit - Maximum number of alerts to return
   * @returns {Array} Recent alerts
   */
  getRecentAlerts(limit = 10) {
    const allAlerts = [];
    
    for (const alerts of this.alerts.values()) {
      allAlerts.push(...alerts);
    }
    
    return allAlerts
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }
}

module.exports = { TokenBudgetManager };