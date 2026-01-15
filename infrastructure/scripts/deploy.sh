#!/bin/bash

###############################################################################
# Deployment Script for Expense Analyzer
# This script handles the complete deployment process
###############################################################################

set -e

# Configuration
APP_NAME="expense-analyzer"
DEPLOY_USER="${DEPLOY_USER:-deploy}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/expense-analyzer}"
BRANCH="${BRANCH:-main}"

echo "======================================="
echo "Deploying Expense Analyzer"
echo "======================================="
echo "Branch: $BRANCH"
echo "Deploy Path: $DEPLOY_PATH"
echo ""

# Navigate to deployment directory
cd "$DEPLOY_PATH"

# Pull latest changes
echo "Pulling latest changes from Git..."
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

# Install dependencies
echo "Installing dependencies..."
npm ci --omit=dev

# Build application
echo "Building application..."
npm run build

# Run database migrations (if applicable)
# Uncomment if you have migrations
# echo "Running database migrations..."
# npm run migrate

# Reload PM2 processes
echo "Reloading PM2 processes..."
pm2 reload infrastructure/pm2/ecosystem.config.js --env production

# Wait for application to start
echo "Waiting for application to start..."
sleep 5

# Health check
echo "Performing health check..."
HEALTH_CHECK_URL="${HEALTH_CHECK_URL:-http://localhost:3000/health}"
response=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_CHECK_URL")

if [ "$response" = "200" ]; then
    echo "✓ Health check passed!"
else
    echo "✗ Health check failed with status code: $response"
    echo "Rolling back..."
    git checkout HEAD~1
    npm ci --omit=dev
    npm run build
    pm2 reload infrastructure/pm2/ecosystem.config.js --env production
    exit 1
fi

# Clear PM2 logs (optional)
echo "Clearing old PM2 logs..."
pm2 flush

# Show PM2 status
echo ""
echo "Current PM2 status:"
pm2 list

echo ""
echo "======================================="
echo "Deployment completed successfully!"
echo "======================================="
echo ""
echo "Deployment time: $(date)"
echo ""
