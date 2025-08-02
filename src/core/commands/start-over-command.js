/**
 * Start Over Command - Reset and start fresh
 */

class StartOverCommand {
  constructor() {
    this.name = 'start-over';
    this.description = 'Reset everything and start fresh';
    this.aliases = ['/start-over', '/reset', '/fresh-start'];
  }

  async execute(userInput, context, services) {
    const { contextManager, progressTracker } = services;
    
    // Reset session context
    if (context.sessionId) {
      contextManager.reset();
    }
    
    return {
      success: true,
      message: 'Everything has been reset. Ready for a fresh start!',
      resetItems: [
        'Session context cleared',
        'Progress history reset',
        'Cache cleared',
        'Ready for new project'
      ]
    };
  }
}

module.exports = { StartOverCommand };