const express = require('express');
const path = require('path');
const fs = require('fs');
const TaskAPI = require('./api/task-api');
const chalk = require('chalk');

class TaskAppServer {
    constructor(port = 3000) {
        this.app = express();
        this.port = port;
        this.taskAPI = new TaskAPI();
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }

    setupMiddleware() {
        // Parse JSON bodies
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));

        // CORS for development
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            } else {
                next();
            }
        });

        // Request logging
        this.app.use((req, res, next) => {
            console.log(chalk.gray(`${new Date().toISOString()} - ${req.method} ${req.path}`));
            next();
        });
    }

    setupRoutes() {
        // Task API routes
        this.app.use('/api/tasks', this.taskAPI.getRouter());

        // Serve the task app frontend
        this.app.get('/tasks', (req, res) => {
            const htmlPath = path.join(__dirname, 'frontend', 'task-app.html');
            if (fs.existsSync(htmlPath)) {
                res.sendFile(htmlPath);
            } else {
                res.status(404).json({
                    success: false,
                    error: 'Task app frontend not found',
                    message: 'The task app HTML file is missing. Please ensure it exists at src/frontend/task-app.html'
                });
            }
        });

        // Root route with app selection
        this.app.get('/', (req, res) => {
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>🎯 Claude Productivity Suite</title>
                    <style>
                        body {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            min-height: 100vh;
                            margin: 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                        }
                        .container {
                            text-align: center;
                            max-width: 600px;
                            padding: 40px;
                        }
                        h1 {
                            font-size: 3rem;
                            margin-bottom: 20px;
                            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        }
                        p {
                            font-size: 1.2rem;
                            margin-bottom: 40px;
                            opacity: 0.9;
                        }
                        .app-card {
                            background: rgba(255,255,255,0.1);
                            border-radius: 20px;
                            padding: 30px;
                            margin: 20px 0;
                            backdrop-filter: blur(10px);
                            border: 1px solid rgba(255,255,255,0.2);
                            transition: all 0.3s ease;
                            text-decoration: none;
                            color: white;
                            display: block;
                        }
                        .app-card:hover {
                            transform: translateY(-5px);
                            background: rgba(255,255,255,0.2);
                        }
                        .app-icon {
                            font-size: 3rem;
                            margin-bottom: 15px;
                        }
                        .app-title {
                            font-size: 1.5rem;
                            font-weight: 600;
                            margin-bottom: 10px;
                        }
                        .app-description {
                            opacity: 0.8;
                            line-height: 1.5;
                        }
                        .stats {
                            margin-top: 40px;
                            display: grid;
                            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                            gap: 20px;
                        }
                        .stat {
                            background: rgba(255,255,255,0.1);
                            border-radius: 15px;
                            padding: 20px;
                            backdrop-filter: blur(10px);
                        }
                        .stat-number {
                            font-size: 2rem;
                            font-weight: 700;
                            display: block;
                        }
                        .stat-label {
                            font-size: 0.9rem;
                            opacity: 0.8;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>🎯 Claude Productivity Suite</h1>
                        <p>Your AI-powered productivity companion</p>
                        
                        <a href="/tasks" class="app-card">
                            <div class="app-icon">📋</div>
                            <div class="app-title">Smart Task Manager</div>
                            <div class="app-description">
                                Intelligent task prioritization with AI-powered insights. 
                                Automatically sorts your daily tasks by urgency, importance, 
                                and complexity to maximize your productivity.
                            </div>
                        </a>
                        
                        <div class="stats">
                            <div class="stat">
                                <span class="stat-number" id="task-count">0</span>
                                <span class="stat-label">Tasks</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number" id="completion-rate">0%</span>
                                <span class="stat-label">Complete</span>
                            </div>
                            <div class="stat">
                                <span class="stat-number" id="priority-score">0</span>
                                <span class="stat-label">Priority</span>
                            </div>
                        </div>
                    </div>
                    
                    <script>
                        // Load quick stats
                        fetch('/api/tasks/analytics/insights')
                            .then(res => res.json())
                            .then(data => {
                                if (data.success) {
                                    document.getElementById('task-count').textContent = data.data.totalTasks;
                                    document.getElementById('completion-rate').textContent = data.data.completionRate + '%';
                                    document.getElementById('priority-score').textContent = data.data.averagePriority;
                                }
                            })
                            .catch(err => console.log('Stats loading failed:', err));
                    </script>
                </body>
                </html>
            `);
        });

        // Health check endpoint
        this.app.get('/health', (req, res) => {
            const taskManager = this.taskAPI.getTaskManager();
            const insights = taskManager.getInsights();
            
            res.json({
                success: true,
                status: 'healthy',
                timestamp: new Date().toISOString(),
                services: {
                    taskAPI: 'operational',
                    taskManager: 'operational'
                },
                data: {
                    totalTasks: insights.totalTasks,
                    completionRate: insights.completionRate
                }
            });
        });

        // API documentation endpoint
        this.app.get('/api', (req, res) => {
            res.json({
                name: 'Claude Productivity Suite - Task Manager API',
                version: '1.0.0',
                description: 'Intelligent task management with AI-powered prioritization',
                endpoints: {
                    tasks: {
                        'GET /api/tasks': 'Get all tasks with smart sorting',
                        'POST /api/tasks': 'Create a new task',
                        'GET /api/tasks/:id': 'Get specific task',
                        'PUT /api/tasks/:id': 'Update task',
                        'PATCH /api/tasks/:id/complete': 'Mark task as completed',
                        'DELETE /api/tasks/:id': 'Delete task',
                        'POST /api/tasks/bulk': 'Bulk operations on tasks'
                    },
                    analytics: {
                        'GET /api/tasks/analytics/insights': 'Get productivity insights',
                        'GET /api/tasks/recommendations': 'Get AI recommendations'
                    },
                    dataManagement: {
                        'GET /api/tasks/export': 'Export tasks data',
                        'POST /api/tasks/import': 'Import tasks data'
                    }
                },
                frontend: {
                    'GET /': 'Main dashboard',
                    'GET /tasks': 'Task management interface'
                },
                features: [
                    'Intelligent priority calculation',
                    'Smart task categorization',
                    'Deadline-based urgency scoring',
                    'AI-powered recommendations',
                    'Real-time insights and analytics',
                    'Bulk operations',
                    'Data import/export',
                    'Responsive mobile design'
                ]
            });
        });
    }

    setupErrorHandling() {
        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                error: 'Endpoint not found',
                message: `The requested endpoint ${req.method} ${req.path} does not exist`,
                availableEndpoints: [
                    'GET /',
                    'GET /tasks',
                    'GET /api',
                    'GET /health',
                    'GET /api/tasks'
                ]
            });
        });

        // General error handler
        this.app.use((error, req, res, next) => {
            console.error(chalk.red('Server Error:'), error);
            
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: 'Something went wrong on our end. Please try again.',
                timestamp: new Date().toISOString()
            });
        });
    }

    async start() {
        try {
            const server = this.app.listen(this.port, () => {
                console.log(chalk.blue.bold(`
╔═══════════════════════════════════════════════════════════════╗
║               🎯 Smart Task Manager Server v1.0               ║
║                  Ready to boost your productivity!            ║
╚═══════════════════════════════════════════════════════════════╝
                `));
                
                console.log(chalk.green(`🚀 Server running on http://localhost:${this.port}`));
                console.log(chalk.cyan(`📋 Task Manager: http://localhost:${this.port}/tasks`));
                console.log(chalk.yellow(`📊 API Docs: http://localhost:${this.port}/api`));
                console.log(chalk.gray(`🏥 Health Check: http://localhost:${this.port}/health`));
                console.log();
                
                console.log(chalk.white('✨ Features Available:'));
                console.log(chalk.dim('  • Intelligent task prioritization'));
                console.log(chalk.dim('  • Smart deadline management'));
                console.log(chalk.dim('  • AI-powered recommendations'));
                console.log(chalk.dim('  • Real-time productivity insights'));
                console.log(chalk.dim('  • Mobile-responsive interface'));
                console.log();
                
                console.log(chalk.blue('Ready for your first task! 🎉'));
            });

            // Graceful shutdown
            process.on('SIGTERM', () => {
                console.log(chalk.yellow('\n🛑 Received SIGTERM, shutting down gracefully...'));
                server.close(() => {
                    console.log(chalk.green('✅ Server closed successfully'));
                    process.exit(0);
                });
            });

            process.on('SIGINT', () => {
                console.log(chalk.yellow('\n🛑 Received SIGINT, shutting down gracefully...'));
                server.close(() => {
                    console.log(chalk.green('✅ Server closed successfully'));
                    process.exit(0);
                });
            });

            return server;
            
        } catch (error) {
            console.error(chalk.red('❌ Failed to start server:'), error.message);
            process.exit(1);
        }
    }

    getApp() {
        return this.app;
    }

    getTaskAPI() {
        return this.taskAPI;
    }
}

// Export for use in other modules
module.exports = TaskAppServer;

// Run server if called directly
if (require.main === module) {
    const port = process.env.PORT || 3000;
    const server = new TaskAppServer(port);
    server.start();
}