#!/bin/bash

###############################################################################
# Nginx Setup Script for Expense Analyzer
# This script installs and configures Nginx on Ubuntu/Debian systems
###############################################################################

set -e

echo "=================================="
echo "Nginx Setup for Expense Analyzer"
echo "=================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Update system packages
echo "Updating system packages..."
apt-get update

# Install Nginx
echo "Installing Nginx..."
apt-get install -y nginx

# Stop Nginx temporarily
systemctl stop nginx

# Backup existing configuration
echo "Backing up existing Nginx configuration..."
if [ -f /etc/nginx/nginx.conf ]; then
    cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)
fi

# Copy our nginx configuration
echo "Installing Nginx configuration..."
cp infrastructure/nginx/nginx.conf /etc/nginx/nginx.conf

# Create sites-available and sites-enabled directories if they don't exist
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

# Copy site configuration
cp infrastructure/nginx/sites-available/expense-analyzer /etc/nginx/sites-available/expense-analyzer

# Create symbolic link to enable site
if [ -f /etc/nginx/sites-enabled/expense-analyzer ]; then
    rm /etc/nginx/sites-enabled/expense-analyzer
fi
ln -s /etc/nginx/sites-available/expense-analyzer /etc/nginx/sites-enabled/expense-analyzer

# Remove default site if it exists
if [ -f /etc/nginx/sites-enabled/default ]; then
    echo "Removing default Nginx site..."
    rm /etc/nginx/sites-enabled/default
fi

# Create log directories
echo "Creating log directories..."
mkdir -p /var/log/nginx
touch /var/log/nginx/expense-analyzer-access.log
touch /var/log/nginx/expense-analyzer-error.log

# Test Nginx configuration
echo "Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "Nginx configuration is valid!"
    
    # Start Nginx
    echo "Starting Nginx..."
    systemctl start nginx
    systemctl enable nginx
    
    echo ""
    echo "=================================="
    echo "Nginx setup completed successfully!"
    echo "=================================="
    echo ""
    echo "Next steps:"
    echo "1. Update server_name in /etc/nginx/sites-available/expense-analyzer"
    echo "2. Ensure your application is running on ports 3000-3003"
    echo "3. For SSL/HTTPS, install certbot:"
    echo "   sudo apt-get install certbot python3-certbot-nginx"
    echo "   sudo certbot --nginx -d your-domain.com"
    echo ""
    echo "Useful commands:"
    echo "  sudo nginx -t                  # Test configuration"
    echo "  sudo systemctl reload nginx    # Reload configuration"
    echo "  sudo systemctl status nginx    # Check status"
    echo "  sudo tail -f /var/log/nginx/expense-analyzer-error.log"
    echo ""
else
    echo "Nginx configuration test failed. Please check the error messages above."
    exit 1
fi
