#!/bin/bash

###############################################################################
# PM2 Setup Script for Expense Analyzer
# This script installs PM2 and sets up the application
###############################################################################

set -e

echo "==============================="
echo "PM2 Setup for Expense Analyzer"
echo "==============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm first."
    exit 1
fi

echo "npm version: $(npm --version)"

# Install PM2 globally
echo "Installing PM2 globally..."
npm install -g pm2

# Check PM2 version
echo "PM2 version: $(pm2 --version)"

# Create logs directory
echo "Creating logs directory..."
mkdir -p logs/pm2

# Install application dependencies
echo "Installing application dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "Build failed. dist directory not found."
    exit 1
fi

# Start application with PM2
echo "Starting application with PM2..."
pm2 start infrastructure/pm2/ecosystem.config.js --env production

# Save PM2 process list
echo "Saving PM2 process list..."
pm2 save

# Setup PM2 to start on system boot
echo "Setting up PM2 startup script..."
pm2 startup

echo ""
echo "==============================="
echo "PM2 setup completed!"
echo "==============================="
echo ""
echo "Your application is now running with PM2."
echo ""
echo "Useful PM2 commands:"
echo "  pm2 list                           # List all processes"
echo "  pm2 logs                           # View logs"
echo "  pm2 logs expense-analyzer-api      # View logs for specific app"
echo "  pm2 monit                          # Monitor processes"
echo "  pm2 restart expense-analyzer-api   # Restart app"
echo "  pm2 reload expense-analyzer-api    # Zero-downtime reload"
echo "  pm2 stop expense-analyzer-api      # Stop app"
echo "  pm2 delete expense-analyzer-api    # Remove app from PM2"
echo "  pm2 save                           # Save process list"
echo ""
echo "To view PM2 web dashboard:"
echo "  pm2 plus                           # Register for PM2 Plus (optional)"
echo ""
