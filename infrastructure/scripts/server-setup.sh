#!/bin/bash

###############################################################################
# Server Setup Script for Expense Analyzer
# This script sets up a fresh Ubuntu/Debian server for deployment
###############################################################################

set -e

echo "==========================================="
echo "Server Setup for Expense Analyzer"
echo "==========================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Update system
echo "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install essential tools
echo "Installing essential tools..."
apt-get install -y curl wget git build-essential ufw

# Install Node.js (using NodeSource)
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Install PM2
echo "Installing PM2..."
npm install -g pm2

# Install Nginx
echo "Installing Nginx..."
apt-get install -y nginx

# Setup firewall
echo "Configuring firewall..."
ufw --force enable
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw status

# Create deployment user
echo "Creating deployment user..."
DEPLOY_USER="deploy"
if id "$DEPLOY_USER" &>/dev/null; then
    echo "User $DEPLOY_USER already exists"
else
    adduser --disabled-password --gecos "" "$DEPLOY_USER"
    usermod -aG sudo "$DEPLOY_USER"
    echo "$DEPLOY_USER ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/$DEPLOY_USER
fi

# Setup deployment directory
DEPLOY_PATH="/var/www/expense-analyzer"
echo "Creating deployment directory..."
mkdir -p "$DEPLOY_PATH"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$DEPLOY_PATH"

# Setup SSH for deployment user (optional - for GitHub/GitLab access)
echo "Setting up SSH for deployment user..."
sudo -u "$DEPLOY_USER" mkdir -p /home/$DEPLOY_USER/.ssh
sudo -u "$DEPLOY_USER" chmod 700 /home/$DEPLOY_USER/.ssh

# Install certbot for SSL (Let's Encrypt)
echo "Installing Certbot for SSL..."
apt-get install -y certbot python3-certbot-nginx

# Setup log rotation
echo "Setting up log rotation..."
cat > /etc/logrotate.d/expense-analyzer << EOF
/var/www/expense-analyzer/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 $DEPLOY_USER $DEPLOY_USER
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Setup PM2 startup
echo "Setting up PM2 startup..."
sudo -u "$DEPLOY_USER" pm2 startup systemd -u "$DEPLOY_USER" --hp "/home/$DEPLOY_USER"
env PATH=$PATH:/usr/bin pm2 startup systemd -u "$DEPLOY_USER" --hp "/home/$DEPLOY_USER"

# Optimize system settings
echo "Optimizing system settings..."
cat >> /etc/security/limits.conf << EOF
* soft nofile 65536
* hard nofile 65536
EOF

cat >> /etc/sysctl.conf << EOF
net.core.somaxconn = 65536
net.ipv4.ip_local_port_range = 1024 65535
net.ipv4.tcp_tw_reuse = 1
EOF

sysctl -p

echo ""
echo "==========================================="
echo "Server setup completed successfully!"
echo "==========================================="
echo ""
echo "Next steps:"
echo "1. Clone your repository to $DEPLOY_PATH"
echo "2. Set up your environment variables (.env file)"
echo "3. Run infrastructure/scripts/setup-pm2.sh"
echo "4. Run infrastructure/scripts/setup-nginx.sh"
echo "5. Configure SSL with: sudo certbot --nginx -d your-domain.com"
echo ""
echo "Deployment user: $DEPLOY_USER"
echo "Deployment path: $DEPLOY_PATH"
echo ""
echo "To switch to deployment user:"
echo "  sudo su - $DEPLOY_USER"
echo ""
