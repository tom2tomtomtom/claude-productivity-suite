const express = require('express');
const TaskManager = require('../core/task-manager');

class TaskAPI {
    constructor() {
        this.router = express.Router();
        this.taskManager = new TaskManager();
        this.setupRoutes();
    }

    setupRoutes() {
        // Get all tasks with smart sorting
        this.router.get('/tasks', (req, res) => {
            try {
                const { sort = 'priority', category, status } = req.query;
                let tasks;

                switch (sort) {
                    case 'priority':
                        tasks = this.taskManager.getTasksByPriority();
                        break;
                    case 'deadline':
                        tasks = this.taskManager.getTasksByPriority()
                            .sort((a, b) => {
                                if (!a.deadline && !b.deadline) return 0;
                                if (!a.deadline) return 1;
                                if (!b.deadline) return -1;
                                return new Date(a.deadline) - new Date(b.deadline);
                            });
                        break;
                    case 'created':
                        tasks = [...this.taskManager.tasks].sort((a, b) => 
                            new Date(b.createdAt) - new Date(a.createdAt));
                        break;
                    default:
                        tasks = this.taskManager.getTasksByPriority();
                }

                // Filter by category if specified
                if (category && category !== 'all') {
                    tasks = tasks.filter(task => task.category === category);
                }

                // Filter by status if specified
                if (status) {
                    if (status === 'completed') {
                        tasks = tasks.filter(task => task.completed);
                    } else if (status === 'pending') {
                        tasks = tasks.filter(task => !task.completed);
                    } else if (status === 'overdue') {
                        tasks = this.taskManager.getOverdueTasks();
                    } else if (status === 'due-today') {
                        tasks = this.taskManager.getTasksDueToday();
                    }
                }

                res.json({
                    success: true,
                    data: tasks,
                    meta: {
                        total: tasks.length,
                        insights: this.taskManager.getInsights()
                    }
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to fetch tasks',
                    details: error.message
                });
            }
        });

        // Get task recommendations based on available time
        this.router.get('/tasks/recommendations', (req, res) => {
            try {
                const timeAvailable = parseInt(req.query.time) || 60;
                const recommendations = this.taskManager.getRecommendedTasks(timeAvailable);
                
                res.json({
                    success: true,
                    data: recommendations,
                    meta: {
                        timeAvailable,
                        totalEstimatedTime: recommendations.reduce((sum, task) => 
                            sum + task.estimatedMinutes, 0)
                    }
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to get recommendations',
                    details: error.message
                });
            }
        });

        // Get specific task by ID
        this.router.get('/tasks/:id', (req, res) => {
            try {
                const taskId = parseInt(req.params.id);
                const task = this.taskManager.tasks.find(t => t.id === taskId);
                
                if (!task) {
                    return res.status(404).json({
                        success: false,
                        error: 'Task not found'
                    });
                }

                res.json({
                    success: true,
                    data: task
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to fetch task',
                    details: error.message
                });
            }
        });

        // Create new task
        this.router.post('/tasks', (req, res) => {
            try {
                const taskData = this.validateTaskData(req.body);
                const newTask = this.taskManager.createTask(taskData);
                
                res.status(201).json({
                    success: true,
                    data: newTask,
                    message: 'Task created successfully'
                });
            } catch (error) {
                res.status(400).json({
                    success: false,
                    error: 'Failed to create task',
                    details: error.message
                });
            }
        });

        // Update existing task
        this.router.put('/tasks/:id', (req, res) => {
            try {
                const taskId = parseInt(req.params.id);
                const updates = this.validateTaskData(req.body, false);
                const updatedTask = this.taskManager.updateTask(taskId, updates);
                
                if (!updatedTask) {
                    return res.status(404).json({
                        success: false,
                        error: 'Task not found'
                    });
                }

                res.json({
                    success: true,
                    data: updatedTask,
                    message: 'Task updated successfully'
                });
            } catch (error) {
                res.status(400).json({
                    success: false,
                    error: 'Failed to update task',
                    details: error.message
                });
            }
        });

        // Mark task as completed
        this.router.patch('/tasks/:id/complete', (req, res) => {
            try {
                const taskId = parseInt(req.params.id);
                const completedTask = this.taskManager.completeTask(taskId);
                
                if (!completedTask) {
                    return res.status(404).json({
                        success: false,
                        error: 'Task not found'
                    });
                }

                res.json({
                    success: true,
                    data: completedTask,
                    message: 'Task marked as completed! 🎉'
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to complete task',
                    details: error.message
                });
            }
        });

        // Delete task
        this.router.delete('/tasks/:id', (req, res) => {
            try {
                const taskId = parseInt(req.params.id);
                const deletedTask = this.taskManager.deleteTask(taskId);
                
                if (!deletedTask) {
                    return res.status(404).json({
                        success: false,
                        error: 'Task not found'
                    });
                }

                res.json({
                    success: true,
                    data: deletedTask,
                    message: 'Task deleted successfully'
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to delete task',
                    details: error.message
                });
            }
        });

        // Get productivity insights and analytics
        this.router.get('/analytics/insights', (req, res) => {
            try {
                const insights = this.taskManager.getInsights();
                const overdueTasks = this.taskManager.getOverdueTasks();
                const dueToday = this.taskManager.getTasksDueToday();
                
                res.json({
                    success: true,
                    data: {
                        ...insights,
                        upcomingDeadlines: dueToday,
                        overdueItems: overdueTasks,
                        timeRecommendations: this.generateTimeRecommendations()
                    }
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to generate insights',
                    details: error.message
                });
            }
        });

        // Export tasks
        this.router.get('/export', (req, res) => {
            try {
                const format = req.query.format || 'json';
                const exportData = this.taskManager.exportTasks(format);
                
                res.setHeader('Content-Disposition', `attachment; filename=tasks-export.${format}`);
                res.setHeader('Content-Type', 'application/json');
                res.send(exportData);
            } catch (error) {
                res.status(500).json({
                    success: false,
                    error: 'Failed to export tasks',
                    details: error.message
                });
            }
        });

        // Import tasks
        this.router.post('/import', (req, res) => {
            try {
                const success = this.taskManager.importTasks(req.body.tasks);
                
                if (success) {
                    res.json({
                        success: true,
                        message: 'Tasks imported successfully',
                        data: this.taskManager.getInsights()
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        error: 'Failed to import tasks'
                    });
                }
            } catch (error) {
                res.status(400).json({
                    success: false,
                    error: 'Failed to import tasks',
                    details: error.message
                });
            }
        });

        // Bulk operations
        this.router.post('/tasks/bulk', (req, res) => {
            try {
                const { action, taskIds } = req.body;
                const results = [];

                for (const taskId of taskIds) {
                    switch (action) {
                        case 'complete':
                            results.push(this.taskManager.completeTask(parseInt(taskId)));
                            break;
                        case 'delete':
                            results.push(this.taskManager.deleteTask(parseInt(taskId)));
                            break;
                        default:
                            throw new Error(`Unknown bulk action: ${action}`);
                    }
                }

                res.json({
                    success: true,
                    data: results.filter(r => r !== null),
                    message: `Bulk ${action} completed successfully`
                });
            } catch (error) {
                res.status(400).json({
                    success: false,
                    error: 'Bulk operation failed',
                    details: error.message
                });
            }
        });
    }

    // Validate task data with smart defaults
    validateTaskData(data, requireTitle = true) {
        const validCategories = ['work', 'personal', 'health', 'learning', 'finance', 'general'];
        
        if (requireTitle && (!data.title || data.title.trim() === '')) {
            throw new Error('Task title is required');
        }

        const validated = {};
        
        if (data.title) validated.title = data.title.trim();
        if (data.description) validated.description = data.description.trim();
        
        // Category validation with smart categorization
        if (data.category) {
            validated.category = validCategories.includes(data.category) 
                ? data.category 
                : this.autoCategorizTask(data.title || '');
        }

        // Importance validation (1-5 scale)
        if (data.importance !== undefined) {
            validated.importance = Math.max(1, Math.min(5, parseInt(data.importance) || 3));
        }

        // Complexity validation (1-5 scale)
        if (data.complexity !== undefined) {
            validated.complexity = Math.max(1, Math.min(5, parseInt(data.complexity) || 3));
        }

        // Deadline validation
        if (data.deadline) {
            const deadline = new Date(data.deadline);
            if (!isNaN(deadline.getTime())) {
                validated.deadline = deadline;
            }
        }

        // Estimated time validation
        if (data.estimatedMinutes !== undefined) {
            validated.estimatedMinutes = Math.max(5, parseInt(data.estimatedMinutes) || 30);
        }

        // Dependencies validation
        if (data.dependencies && Array.isArray(data.dependencies)) {
            validated.dependencies = data.dependencies.map(id => parseInt(id)).filter(id => !isNaN(id));
        }

        // Tags validation
        if (data.tags && Array.isArray(data.tags)) {
            validated.tags = data.tags.map(tag => tag.toString().trim()).filter(tag => tag.length > 0);
        }

        return validated;
    }

    // Auto-categorize task based on title keywords
    autoCategorizTask(title) {
        const titleLower = title.toLowerCase();
        
        if (/meeting|call|email|presentation|project|deadline|report/.test(titleLower)) {
            return 'work';
        }
        if (/exercise|gym|doctor|health|meditation|diet/.test(titleLower)) {
            return 'health';
        }
        if (/learn|study|course|read|research|tutorial/.test(titleLower)) {
            return 'learning';
        }
        if (/pay|bill|budget|money|finance|bank|tax/.test(titleLower)) {
            return 'finance';
        }
        if (/family|friend|personal|home|clean|shopping/.test(titleLower)) {
            return 'personal';
        }
        
        return 'general';
    }

    // Generate time-based recommendations
    generateTimeRecommendations() {
        const currentHour = new Date().getHours();
        let recommendations = [];

        if (currentHour >= 9 && currentHour <= 11) {
            recommendations.push("🌅 Peak focus time! Tackle your most complex tasks now.");
        } else if (currentHour >= 14 && currentHour <= 16) {
            recommendations.push("⚡ Afternoon energy boost! Good time for collaborative tasks.");
        } else if (currentHour >= 17 && currentHour <= 19) {
            recommendations.push("📝 Wind-down time! Perfect for planning and organizing tasks.");
        } else {
            recommendations.push("🎯 Any time is productive time! Focus on priority tasks.");
        }

        const overdueTasks = this.taskManager.getOverdueTasks().length;
        if (overdueTasks > 0) {
            recommendations.push(`⚠️ You have ${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''}. Consider tackling them first!`);
        }

        const dueToday = this.taskManager.getTasksDueToday().length;
        if (dueToday > 0) {
            recommendations.push(`📅 ${dueToday} task${dueToday > 1 ? 's are' : ' is'} due today. Stay on track!`);
        }

        return recommendations;
    }

    getRouter() {
        return this.router;
    }

    getTaskManager() {
        return this.taskManager;
    }
}

module.exports = TaskAPI;