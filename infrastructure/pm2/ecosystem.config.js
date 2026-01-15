/**
 * PM2 Ecosystem Configuration for Expense Analyzer
 * 
 * This file configures PM2 to manage multiple instances of the application
 * for load balancing and high availability.
 * 
 * Usage:
 *   pm2 start infrastructure/pm2/ecosystem.config.js --env production
 *   pm2 start infrastructure/pm2/ecosystem.config.js --env development
 */

module.exports = {
    apps: [
        {
            // Application name
            name: 'expense-analyzer-api',

            // Script to start
            script: './dist/index.js',

            // Number of instances (cluster mode)
            // Set to 0 or 'max' to spawn as many workers as CPU cores
            instances: 4,

            // Cluster mode for load balancing
            exec_mode: 'cluster',

            // Watch for file changes (disable in production)
            watch: false,

            // Maximum memory restart threshold
            max_memory_restart: '500M',

            // Environment variables for all environments
            env: {
                NODE_ENV: 'development',
                PORT: 3000,
            },

            // Production environment
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000,
            },

            // Development environment
            env_development: {
                NODE_ENV: 'development',
                PORT: 3000,
            },

            // Logging
            error_file: './logs/pm2/error.log',
            out_file: './logs/pm2/out.log',
            log_file: './logs/pm2/combined.log',
            time: true,

            // Advanced features
            merge_logs: true,
            autorestart: true,

            // Restart delay
            restart_delay: 4000,

            // Exponential backoff restart delay
            exp_backoff_restart_delay: 100,

            // Maximum number of restarts within a minute
            max_restarts: 10,

            // Minimum uptime before considering the app as stable
            min_uptime: '10s',

            // Listen timeout for app to be considered ready
            listen_timeout: 3000,

            // Kill timeout
            kill_timeout: 5000,

            // Source map support
            source_map_support: true,

            // Instance variables (for multi-instance setup with Nginx)
            instance_var: 'INSTANCE_ID',

            // Graceful shutdown
            wait_ready: true,

            // Automation
            post_update: ['npm install', 'npm run build'],

            // Cron restart (optional - restart every day at 3 AM)
            // cron_restart: '0 3 * * *',
        },

        // Separate instance for specific port (if needed for Nginx upstream)
        {
            name: 'expense-analyzer-api-3001',
            script: './dist/index.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 3001,
            },
            error_file: './logs/pm2/error-3001.log',
            out_file: './logs/pm2/out-3001.log',
            max_memory_restart: '500M',
            autorestart: true,
            watch: false,
        },

        {
            name: 'expense-analyzer-api-3002',
            script: './dist/index.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 3002,
            },
            error_file: './logs/pm2/error-3002.log',
            out_file: './logs/pm2/out-3002.log',
            max_memory_restart: '500M',
            autorestart: true,
            watch: false,
        },

        {
            name: 'expense-analyzer-api-3003',
            script: './dist/index.js',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 3003,
            },
            error_file: './logs/pm2/error-3003.log',
            out_file: './logs/pm2/out-3003.log',
            max_memory_restart: '500M',
            autorestart: true,
            watch: false,
        },
    ],

    // Deployment configuration
    deploy: {
        production: {
            user: 'deploy',
            host: ['your-server-ip'],
            ref: 'origin/main',
            repo: 'git@github.com:yourusername/expense_analyzer.git',
            path: '/var/www/expense-analyzer',
            'post-deploy': 'npm install && npm run build && pm2 reload infrastructure/pm2/ecosystem.config.js --env production',
            'pre-setup': 'apt-get update && apt-get install -y git',
        },

        staging: {
            user: 'deploy',
            host: ['your-staging-server-ip'],
            ref: 'origin/develop',
            repo: 'git@github.com:yourusername/expense_analyzer.git',
            path: '/var/www/expense-analyzer-staging',
            'post-deploy': 'npm install && npm run build && pm2 reload infrastructure/pm2/ecosystem.config.js --env development',
        },
    },
};
