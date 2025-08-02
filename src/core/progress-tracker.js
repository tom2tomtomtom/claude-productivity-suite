/**
 * Progress Tracker - Tracks and displays progress for long-running operations
 * Provides real-time feedback to users during command execution
 */

class ProgressTracker {
  constructor() {
    this.activeOperations = new Map();
    this.completedOperations = [];
    this.progressCallbacks = new Map();
  }

  /**
   * Start tracking a new operation
   * @param {string} operationId - Unique operation identifier
   * @param {Object} config - Operation configuration
   * @returns {Object} Operation tracking object
   */
  startOperation(operationId, config = {}) {
    const operation = {
      id: operationId,
      name: config.name || 'Operation',
      description: config.description || 'Processing...',
      startTime: Date.now(),
      currentStep: 0,
      totalSteps: config.totalSteps || 1,
      status: 'running',
      progress: 0,
      details: [],
      metadata: config.metadata || {}
    };
    
    this.activeOperations.set(operationId, operation);
    
    // Emit progress update
    this.emitProgress(operationId, {
      step: 0,
      message: `Starting ${operation.name}...`,
      progress: 0,
      status: 'started'
    });
    
    return operation;
  }

  /**
   * Update operation progress
   * @param {string} operationId - Operation identifier
   * @param {number} step - Current step number
   * @param {string} message - Progress message
   * @param {Object} details - Additional details
   */
  updateProgress(operationId, step, message, details = {}) {
    const operation = this.activeOperations.get(operationId);
    if (!operation) {
      console.warn(`Operation not found: ${operationId}`);
      return;
    }
    
    operation.currentStep = step;
    operation.progress = Math.min((step / operation.totalSteps) * 100, 100);
    
    const progressUpdate = {
      step,
      message,
      progress: operation.progress,
      status: 'running',
      timestamp: Date.now(),
      details
    };
    
    operation.details.push(progressUpdate);
    
    // Keep only last 20 progress updates to prevent memory issues
    if (operation.details.length > 20) {
      operation.details = operation.details.slice(-20);
    }
    
    // Emit progress update
    this.emitProgress(operationId, progressUpdate);
  }

  /**
   * Complete an operation
   * @param {string} operationId - Operation identifier
   * @param {Object} result - Operation result
   */
  completeOperation(operationId, result = {}) {
    const operation = this.activeOperations.get(operationId);
    if (!operation) {
      console.warn(`Operation not found: ${operationId}`);
      return;
    }
    
    operation.status = 'completed';
    operation.progress = 100;
    operation.endTime = Date.now();
    operation.duration = operation.endTime - operation.startTime;
    operation.result = result;
    
    const completionUpdate = {
      step: operation.totalSteps,
      message: result.message || `${operation.name} completed successfully`,
      progress: 100,
      status: 'completed',
      timestamp: Date.now(),
      duration: operation.duration
    };
    
    operation.details.push(completionUpdate);
    
    // Move to completed operations
    this.completedOperations.push(operation);
    this.activeOperations.delete(operationId);
    
    // Keep only last 100 completed operations
    if (this.completedOperations.length > 100) {
      this.completedOperations = this.completedOperations.slice(-100);
    }
    
    // Emit completion update
    this.emitProgress(operationId, completionUpdate);
  }

  /**
   * Fail an operation
   * @param {string} operationId - Operation identifier
   * @param {Error|string} error - Error details
   */
  failOperation(operationId, error) {
    const operation = this.activeOperations.get(operationId);
    if (!operation) {
      console.warn(`Operation not found: ${operationId}`);
      return;
    }
    
    operation.status = 'failed';
    operation.endTime = Date.now();
    operation.duration = operation.endTime - operation.startTime;
    operation.error = error instanceof Error ? error.message : error;
    
    const failureUpdate = {
      step: operation.currentStep,
      message: `${operation.name} failed: ${operation.error}`,
      progress: operation.progress,
      status: 'failed',
      timestamp: Date.now(),
      error: operation.error
    };
    
    operation.details.push(failureUpdate);
    
    // Move to completed operations (even failed ones)
    this.completedOperations.push(operation);
    this.activeOperations.delete(operationId);
    
    // Emit failure update
    this.emitProgress(operationId, failureUpdate);
  }

  /**
   * Get operation status
   * @param {string} operationId - Operation identifier
   * @returns {Object|null} Operation status or null if not found
   */
  getOperationStatus(operationId) {
    const activeOperation = this.activeOperations.get(operationId);
    if (activeOperation) {
      return {
        ...activeOperation,
        isActive: true
      };
    }
    
    const completedOperation = this.completedOperations.find(op => op.id === operationId);
    if (completedOperation) {
      return {
        ...completedOperation,
        isActive: false
      };
    }
    
    return null;
  }

  /**
   * Get all active operations
   * @returns {Array} Array of active operations
   */
  getActiveOperations() {
    return Array.from(this.activeOperations.values());
  }

  /**
   * Get recent completed operations
   * @param {number} limit - Maximum number of operations to return
   * @returns {Array} Array of completed operations
   */
  getCompletedOperations(limit = 10) {
    return this.completedOperations.slice(-limit);
  }

  /**
   * Register a progress callback
   * @param {string} operationId - Operation identifier (or 'all' for all operations)
   * @param {Function} callback - Progress callback function
   */
  onProgress(operationId, callback) {
    if (!this.progressCallbacks.has(operationId)) {
      this.progressCallbacks.set(operationId, []);
    }
    
    this.progressCallbacks.get(operationId).push(callback);
  }

  /**
   * Remove progress callback
   * @param {string} operationId - Operation identifier
   * @param {Function} callback - Callback to remove
   */
  offProgress(operationId, callback) {
    const callbacks = this.progressCallbacks.get(operationId);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit progress update to registered callbacks
   * @param {string} operationId - Operation identifier
   * @param {Object} update - Progress update
   */
  emitProgress(operationId, update) {
    // Emit to operation-specific callbacks
    const operationCallbacks = this.progressCallbacks.get(operationId) || [];
    for (const callback of operationCallbacks) {
      try {
        callback(update, operationId);
      } catch (error) {
        console.error('Progress callback error:', error);
      }
    }
    
    // Emit to global callbacks
    const globalCallbacks = this.progressCallbacks.get('all') || [];
    for (const callback of globalCallbacks) {
      try {
        callback(update, operationId);
      } catch (error) {
        console.error('Global progress callback error:', error);
      }
    }
  }

  /**
   * Create a progress reporter function for an operation
   * @param {string} operationId - Operation identifier
   * @returns {Function} Progress reporter function
   */
  createProgressReporter(operationId) {
    return (step, message, details = {}) => {
      this.updateProgress(operationId, step, message, details);
    };
  }

  /**
   * Create operation callbacks for agent execution
   * @param {string} operationId - Operation identifier
   * @returns {Object} Callback object with onProgress and onComplete
   */
  createOperationCallbacks(operationId) {
    return {
      onProgress: (step, message, details = {}) => {
        this.updateProgress(operationId, step, message, details);
      },
      onComplete: (result) => {
        this.completeOperation(operationId, result);
      },
      onError: (error) => {
        this.failOperation(operationId, error);
      }
    };
  }

  /**
   * Get operation statistics
   * @returns {Object} Operation statistics
   */
  getStats() {
    const now = Date.now();
    const activeOps = this.getActiveOperations();
    const completedOps = this.completedOperations;
    
    // Calculate average duration for completed operations
    const completedWithDuration = completedOps.filter(op => op.duration);
    const averageDuration = completedWithDuration.length > 0 
      ? completedWithDuration.reduce((sum, op) => sum + op.duration, 0) / completedWithDuration.length
      : 0;
    
    // Calculate success rate
    const successfulOps = completedOps.filter(op => op.status === 'completed').length;
    const successRate = completedOps.length > 0 ? successfulOps / completedOps.length : 0;
    
    return {
      activeOperations: activeOps.length,
      completedOperations: completedOps.length,
      totalOperations: activeOps.length + completedOps.length,
      successRate,
      averageDuration,
      longestRunningOperation: this.getLongestRunningOperation(),
      recentActivity: this.getRecentActivity()
    };
  }

  /**
   * Get longest running active operation
   * @returns {Object|null} Longest running operation or null
   */
  getLongestRunningOperation() {
    const activeOps = this.getActiveOperations();
    if (activeOps.length === 0) return null;
    
    return activeOps.reduce((longest, current) => {
      const currentDuration = Date.now() - current.startTime;
      const longestDuration = Date.now() - longest.startTime;
      return currentDuration > longestDuration ? current : longest;
    });
  }

  /**
   * Get recent activity summary
   * @param {number} timeWindow - Time window in milliseconds (default: 1 hour)
   * @returns {Object} Recent activity summary
   */
  getRecentActivity(timeWindow = 60 * 60 * 1000) {
    const cutoffTime = Date.now() - timeWindow;
    const recentOps = this.completedOperations.filter(op => op.endTime > cutoffTime);
    
    return {
      totalOperations: recentOps.length,
      successfulOperations: recentOps.filter(op => op.status === 'completed').length,
      failedOperations: recentOps.filter(op => op.status === 'failed').length,
      averageDuration: recentOps.length > 0 
        ? recentOps.reduce((sum, op) => sum + (op.duration || 0), 0) / recentOps.length
        : 0
    };
  }

  /**
   * Clean up old completed operations
   * @param {number} maxAge - Maximum age in milliseconds
   */
  cleanup(maxAge = 24 * 60 * 60 * 1000) { // Default: 24 hours
    const cutoffTime = Date.now() - maxAge;
    
    this.completedOperations = this.completedOperations.filter(op => 
      op.endTime > cutoffTime
    );
  }

  /**
   * Export operation data for analysis
   * @param {string} operationId - Specific operation ID (optional)
   * @returns {Object} Exportable operation data
   */
  exportData(operationId = null) {
    if (operationId) {
      return this.getOperationStatus(operationId);
    }
    
    return {
      activeOperations: this.getActiveOperations(),
      completedOperations: this.getCompletedOperations(50),
      stats: this.getStats(),
      exportTimestamp: Date.now()
    };
  }

  /**
   * Reset all progress tracking (useful for testing)
   */
  reset() {
    this.activeOperations.clear();
    this.completedOperations = [];
    this.progressCallbacks.clear();
  }

  /**
   * Get health status of the progress tracker
   * @returns {Object} Health status
   */
  getHealthStatus() {
    const activeOps = this.getActiveOperations();
    const stuckOperations = activeOps.filter(op => 
      (Date.now() - op.startTime) > 10 * 60 * 1000 // 10 minutes
    );
    
    return {
      status: stuckOperations.length === 0 ? 'healthy' : 'warning',
      activeOperations: activeOps.length,
      stuckOperations: stuckOperations.length,
      memoryUsage: {
        activeOpsMemory: this.estimateMemoryUsage(activeOps),
        completedOpsMemory: this.estimateMemoryUsage(this.completedOperations)
      },
      callbacksRegistered: Array.from(this.progressCallbacks.values())
        .reduce((total, callbacks) => total + callbacks.length, 0)
    };
  }

  /**
   * Estimate memory usage for operations
   * @param {Array} operations - Array of operations
   * @returns {number} Estimated memory usage in bytes
   */
  estimateMemoryUsage(operations) {
    return JSON.stringify(operations).length * 2; // Rough estimate
  }
}

module.exports = { ProgressTracker };