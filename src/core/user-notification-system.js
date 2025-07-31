/**
 * User Notification System
 * Handles user-friendly notifications and progress updates
 */

class UserNotificationSystem {
  constructor() {
    this.notifications = [];
    this.subscribers = new Map();
    this.notificationTypes = {
      'info': '💡',
      'success': '✅',
      'warning': '⚠️',
      'error': '❌',
      'progress': '⏳',
      'celebration': '🎉'
    };
  }

  /**
   * Send notification to user
   * @param {string} type - Notification type
   * @param {string} message - Notification message
   * @param {Object} options - Additional options
   */
  notify(type, message, options = {}) {
    const notification = {
      id: this.generateId(),
      type,
      message,
      timestamp: Date.now(),
      icon: this.notificationTypes[type] || '📢',
      ...options
    };

    this.notifications.push(notification);
    
    // Limit notification history
    if (this.notifications.length > 100) {
      this.notifications = this.notifications.slice(-100);
    }

    // Notify subscribers
    this.notifySubscribers(notification);

    return notification;
  }

  /**
   * Subscribe to notifications
   * @param {string} subscriberId - Subscriber ID
   * @param {Function} callback - Callback function
   */
  subscribe(subscriberId, callback) {
    this.subscribers.set(subscriberId, callback);
  }

  /**
   * Unsubscribe from notifications
   * @param {string} subscriberId - Subscriber ID
   */
  unsubscribe(subscriberId) {
    this.subscribers.delete(subscriberId);
  }

  /**
   * Notify all subscribers
   * @param {Object} notification - Notification to send
   */
  notifySubscribers(notification) {
    for (const [subscriberId, callback] of this.subscribers.entries()) {
      try {
        callback(notification);
      } catch (error) {
        console.error(`Notification callback error for ${subscriberId}:`, error);
      }
    }
  }

  /**
   * Get recent notifications
   * @param {number} limit - Number of notifications to return
   * @returns {Array} Recent notifications
   */
  getRecentNotifications(limit = 10) {
    return this.notifications.slice(-limit);
  }

  /**
   * Clear all notifications
   */
  clearNotifications() {
    this.notifications = [];
  }

  /**
   * Generate unique notification ID
   * @returns {string} Unique ID
   */
  generateId() {
    return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Convenience methods for common notification types

  info(message, options = {}) {
    return this.notify('info', message, options);
  }

  success(message, options = {}) {
    return this.notify('success', message, options);
  }

  warning(message, options = {}) {
    return this.notify('warning', message, options);
  }

  error(message, options = {}) {
    return this.notify('error', message, options);
  }

  progress(message, percentage = null, options = {}) {
    return this.notify('progress', message, { percentage, ...options });
  }

  celebrate(message, options = {}) {
    return this.notify('celebration', message, options);
  }
}

module.exports = { UserNotificationSystem };