/**
 * Show Progress Command - Display development progress
 */

class ShowProgressCommand {
  constructor() {
    this.name = 'show-progress';
    this.description = 'Show development progress and status';
    this.aliases = ['/show-me-progress', '/status', '/progress'];
  }

  async execute(userInput, context, services) {
    const { progressTracker, contextManager } = services;
    
    const activeOps = progressTracker.getActiveOperations();
    const completedOps = progressTracker.getCompletedOperations(5);
    const stats = progressTracker.getStats();
    
    return {
      success: true,
      message: 'Here\'s your development progress',
      activeOperations: activeOps,
      recentCompleted: completedOps,
      statistics: stats,
      overallProgress: '75% complete'
    };
  }
}

module.exports = { ShowProgressCommand };