class TaskManager {
    constructor() {
        this.tasks = [];
        this.taskIdCounter = 1;
        this.priorityWeights = {
            urgency: 0.4,    // How soon is the deadline
            importance: 0.3, // How critical is this task
            complexity: 0.2, // How much effort required
            dependencies: 0.1 // How many other tasks depend on this
        };
    }

    // Create a new task with intelligent priority calculation
    createTask(taskData) {
        const task = {
            id: this.taskIdCounter++,
            title: taskData.title,
            description: taskData.description || '',
            category: taskData.category || 'general',
            importance: taskData.importance || 3, // 1-5 scale
            complexity: taskData.complexity || 3, // 1-5 scale (effort required)
            deadline: taskData.deadline ? new Date(taskData.deadline) : null,
            createdAt: new Date(),
            updatedAt: new Date(),
            completed: false,
            dependencies: taskData.dependencies || [],
            tags: taskData.tags || [],
            estimatedMinutes: taskData.estimatedMinutes || 30,
            priority: 0 // Will be calculated
        };

        // Calculate intelligent priority score
        task.priority = this.calculatePriority(task);
        
        this.tasks.push(task);
        this.sortTasksByPriority();
        return task;
    }

    // Intelligent priority calculation algorithm
    calculatePriority(task) {
        let score = 0;

        // Urgency component (deadline-based)
        const urgencyScore = this.calculateUrgencyScore(task);
        score += urgencyScore * this.priorityWeights.urgency;

        // Importance component (user-defined)
        const importanceScore = (task.importance / 5) * 100;
        score += importanceScore * this.priorityWeights.importance;

        // Complexity component (inverse - simpler tasks get slight boost)
        const complexityScore = ((6 - task.complexity) / 5) * 100;
        score += complexityScore * this.priorityWeights.complexity;

        // Dependencies component (tasks that others depend on get boost)
        const dependencyScore = this.calculateDependencyScore(task);
        score += dependencyScore * this.priorityWeights.dependencies;

        return Math.round(score);
    }

    // Calculate urgency based on deadline proximity
    calculateUrgencyScore(task) {
        if (!task.deadline) return 50; // Medium urgency if no deadline

        const now = new Date();
        const deadline = new Date(task.deadline);
        const diffHours = (deadline - now) / (1000 * 60 * 60);

        if (diffHours < 0) return 100; // Overdue = max urgency
        if (diffHours < 2) return 95;  // Due in 2 hours
        if (diffHours < 8) return 85;  // Due today
        if (diffHours < 24) return 70; // Due tomorrow
        if (diffHours < 72) return 55; // Due this week
        if (diffHours < 168) return 40; // Due next week
        return 25; // Due later
    }

    // Calculate how many other tasks depend on this one
    calculateDependencyScore(task) {
        const dependentTasks = this.tasks.filter(t => 
            t.dependencies.includes(task.id)
        ).length;
        return Math.min(dependentTasks * 20, 100); // Max 100 points
    }

    // Get tasks sorted by intelligent priority
    getTasksByPriority() {
        return [...this.tasks]
            .filter(task => !task.completed)
            .sort((a, b) => b.priority - a.priority);
    }

    // Get tasks by category
    getTasksByCategory(category) {
        return this.tasks.filter(task => 
            task.category === category && !task.completed
        );
    }

    // Get tasks due today
    getTasksDueToday() {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        
        return this.tasks.filter(task => 
            task.deadline && 
            task.deadline <= today && 
            !task.completed
        );
    }

    // Get overdue tasks
    getOverdueTasks() {
        const now = new Date();
        return this.tasks.filter(task => 
            task.deadline && 
            task.deadline < now && 
            !task.completed
        );
    }

    // Smart task recommendations
    getRecommendedTasks(timeAvailable = 60) {
        const availableTasks = this.getTasksByPriority();
        const recommended = [];
        let totalTime = 0;

        for (const task of availableTasks) {
            if (totalTime + task.estimatedMinutes <= timeAvailable) {
                // Check if dependencies are completed
                const dependenciesMet = task.dependencies.every(depId => {
                    const depTask = this.tasks.find(t => t.id === depId);
                    return depTask && depTask.completed;
                });

                if (dependenciesMet) {
                    recommended.push(task);
                    totalTime += task.estimatedMinutes;
                }
            }
        }

        return recommended;
    }

    // Update task and recalculate priority
    updateTask(taskId, updates) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return null;

        const task = this.tasks[taskIndex];
        Object.assign(task, updates, { updatedAt: new Date() });
        
        // Recalculate priority if relevant fields changed
        if (['importance', 'complexity', 'deadline', 'dependencies'].some(field => 
            updates.hasOwnProperty(field))) {
            task.priority = this.calculatePriority(task);
            this.sortTasksByPriority();
        }

        return task;
    }

    // Mark task as completed
    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = true;
            task.completedAt = new Date();
            task.updatedAt = new Date();
            return task;
        }
        return null;
    }

    // Delete task
    deleteTask(taskId) {
        const index = this.tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            return this.tasks.splice(index, 1)[0];
        }
        return null;
    }

    // Sort all tasks by priority
    sortTasksByPriority() {
        this.tasks.sort((a, b) => {
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;
            return b.priority - a.priority;
        });
    }

    // Get productivity insights
    getInsights() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const overdue = this.getOverdueTasks().length;
        const dueToday = this.getTasksDueToday().length;
        
        const categoryStats = {};
        this.tasks.forEach(task => {
            if (!categoryStats[task.category]) {
                categoryStats[task.category] = { total: 0, completed: 0 };
            }
            categoryStats[task.category].total++;
            if (task.completed) {
                categoryStats[task.category].completed++;
            }
        });

        return {
            totalTasks: total,
            completedTasks: completed,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
            overdueTasks: overdue,
            tasksDueToday: dueToday,
            categoryStats,
            averagePriority: this.tasks.length > 0 ? 
                Math.round(this.tasks.reduce((sum, t) => sum + t.priority, 0) / this.tasks.length) : 0
        };
    }

    // Export tasks data
    exportTasks(format = 'json') {
        if (format === 'json') {
            return JSON.stringify(this.tasks, null, 2);
        }
        // Could add CSV, markdown export later
        return this.tasks;
    }

    // Import tasks data
    importTasks(data) {
        try {
            const importedTasks = Array.isArray(data) ? data : JSON.parse(data);
            importedTasks.forEach(taskData => {
                this.createTask(taskData);
            });
            return true;
        } catch (error) {
            console.error('Import failed:', error);
            return false;
        }
    }
}

module.exports = TaskManager;