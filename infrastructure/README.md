# Infrastructure Documentation for Expense Analyzer

This folder contains all the infrastructure configuration files for deploying and managing the Expense Analyzer application. No application code has been modified.

## 📁 Directory Structure

```
infrastructure/
├── nginx/
│   ├── nginx.conf                          # Main Nginx configuration
│   └── sites-available/
│       └── expense-analyzer                # Site-specific configuration
├── pm2/
│   └── ecosystem.config.js                 # PM2 process management config
├── scripts/
│   ├── server-setup.sh                     # Initial server setup
│   ├── setup-nginx.sh                      # Nginx installation & config
│   ├── setup-pm2.sh                        # PM2 installation & setup
│   └── deploy.sh                           # Deployment script
└── README.md                               # This file

.github/
└── workflows/
    ├── ci-cd.yml                           # CI/CD pipeline
    └── docker-deploy.yml                   # Docker deployment (optional)
```

## 🚀 Quick Start Guide

### Prerequisites

- Ubuntu/Debian server (20.04 LTS or newer)
- Root or sudo access
- Node.js 20.x or newer
- Domain name (optional, for SSL)

### 1. Initial Server Setup

Run this script on a fresh server to install all dependencies:

```bash
sudo bash infrastructure/scripts/server-setup.sh
```

This script will:
- Update system packages
- Install Node.js, npm, PM2, and Nginx
- Create a deployment user
- Configure firewall (UFW)
- Set up log rotation
- Optimize system settings

### 2. Setup PM2

```bash
bash infrastructure/scripts/setup-pm2.sh
```

This will:
- Install PM2 globally
- Build your application
- Start the application with PM2
- Configure PM2 to start on system boot

### 3. Setup Nginx

```bash
sudo bash infrastructure/scripts/setup-nginx.sh
```

This will:
- Install and configure Nginx
- Set up reverse proxy and load balancing
- Configure rate limiting
- Set up logging

### 4. Configure SSL (Optional but Recommended)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 📋 Configuration Details

### Nginx Configuration

**Main Features:**
- **Reverse Proxy**: Routes traffic from port 80/443 to your Node.js app
- **Load Balancing**: Distributes traffic across 4 PM2 instances (ports 3000-3003)
- **Rate Limiting**: 
  - API endpoints: 10 requests/second
  - Auth endpoints: 5 requests/second
- **Security Headers**: X-Frame-Options, X-XSS-Protection, etc.
- **Gzip Compression**: Enabled for better performance

**Configuration Files:**
- `nginx/nginx.conf`: Main Nginx configuration
- `nginx/sites-available/expense-analyzer`: Site-specific configuration

**Customize:**
1. Edit `/etc/nginx/sites-available/expense-analyzer`
2. Update `server_name` with your domain
3. Test: `sudo nginx -t`
4. Reload: `sudo systemctl reload nginx`

### PM2 Configuration

**Main Features:**
- **Cluster Mode**: 4 instances for load balancing
- **Auto Restart**: Automatically restarts on crashes
- **Memory Management**: Restarts if memory exceeds 500MB
- **Log Management**: Centralized logging
- **Zero-Downtime Reload**: Graceful restarts

**Configuration File:**
- `pm2/ecosystem.config.js`

**Cluster Setup:**
The configuration includes two approaches:

1. **Cluster Mode** (Recommended): Single app with multiple workers
2. **Fork Mode**: Separate apps on different ports (for fine-grained control)

**Commands:**
```bash
# Start
pm2 start infrastructure/pm2/ecosystem.config.js --env production

# View status
pm2 list
pm2 monit

# View logs
pm2 logs
pm2 logs expense-analyzer-api

# Restart (zero-downtime)
pm2 reload expense-analyzer-api

# Stop
pm2 stop expense-analyzer-api

# Delete from PM2
pm2 delete expense-analyzer-api

# Save configuration
pm2 save
```

### GitHub Actions CI/CD

**Workflow Files:**
- `.github/workflows/ci-cd.yml`: Main CI/CD pipeline
- `.github/workflows/docker-deploy.yml`: Docker-based deployment (optional)

**Pipeline Stages:**

1. **Lint & Type Check**: ESLint and TypeScript validation
2. **Build**: Compile TypeScript to JavaScript
3. **Test**: Run test suite (if available)
4. **Deploy**: Deploy to production/staging

**Required GitHub Secrets:**

For SSH Deployment:
- `SSH_PRIVATE_KEY`: SSH private key for server access
- `SERVER_HOST`: Server IP or hostname
- `SERVER_USER`: SSH username (default: deploy)
- `DEPLOY_PATH`: Deployment directory path

For Staging (optional):
- `SSH_PRIVATE_KEY_STAGING`
- `STAGING_SERVER_HOST`
- `STAGING_SERVER_USER`
- `STAGING_DEPLOY_PATH`

**Setup GitHub Secrets:**
1. Go to your repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret with appropriate values

**Generate SSH Key for Deployment:**
```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy
cat ~/.ssh/github_deploy      # Copy this to SSH_PRIVATE_KEY secret
cat ~/.ssh/github_deploy.pub  # Add this to server's authorized_keys
```

## 🔧 Deployment

### Manual Deployment

```bash
bash infrastructure/scripts/deploy.sh
```

This script will:
1. Pull latest changes from Git
2. Install dependencies
3. Build the application
4. Reload PM2 processes
5. Perform health check
6. Rollback on failure

### Automated Deployment (GitHub Actions)

Push to `main` branch to trigger automatic deployment:

```bash
git add .
git commit -m "Deploy changes"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Run tests and linting
2. Build the application
3. Deploy to production
4. Run health checks

## 🔒 Security Considerations

### Nginx Security

- Rate limiting enabled on all API endpoints
- Security headers configured
- SSL/TLS encryption (when configured with certbot)
- Request size limits (20MB max)

### Server Security

- Firewall (UFW) configured
- Non-root deployment user
- SSH key-based authentication recommended
- Regular security updates

### Application Security

- JWT authentication (already in your app)
- Environment variables for secrets
- No sensitive data in logs

## 📊 Monitoring and Logs

### PM2 Logs

```bash
# Real-time logs
pm2 logs

# Specific app logs
pm2 logs expense-analyzer-api

# Clear logs
pm2 flush
```

Log files location: `logs/pm2/`

### Nginx Logs

```bash
# Access logs
tail -f /var/log/nginx/expense-analyzer-access.log

# Error logs
tail -f /var/log/nginx/expense-analyzer-error.log
```

### PM2 Monitoring

```bash
# Terminal monitoring
pm2 monit

# Web dashboard (optional)
pm2 plus
```

## 🔄 Load Balancing Strategy

**Nginx Upstream Configuration:**
- Algorithm: `least_conn` (least connections)
- 4 backend servers (ports 3000-3003)
- Health checks enabled
- Max failures: 3
- Fail timeout: 30 seconds

**Alternative Algorithms:**
- `round-robin`: Default, distributes evenly
- `ip_hash`: Same client → same server
- `least_conn`: Routes to server with fewest connections (current)

To change, edit `nginx/nginx.conf`:
```nginx
upstream expense_analyzer_backend {
    ip_hash;  # or round-robin, or remove for default
    server 127.0.0.1:3000;
    # ... other servers
}
```

## 🛠️ Troubleshooting

### PM2 Issues

**App won't start:**
```bash
pm2 logs expense-analyzer-api --err
cd /var/www/expense-analyzer
npm run build
```

**Memory issues:**
```bash
pm2 list  # Check memory usage
# Adjust max_memory_restart in ecosystem.config.js
```

### Nginx Issues

**Configuration test fails:**
```bash
sudo nginx -t  # Shows exact error
```

**502 Bad Gateway:**
```bash
# Check if PM2 apps are running
pm2 list

# Check Nginx error logs
sudo tail -f /var/log/nginx/expense-analyzer-error.log

# Verify ports are listening
sudo netstat -tlnp | grep -E '3000|3001|3002|3003'
```

**Port conflicts:**
```bash
sudo lsof -i :3000  # Check what's using port 3000
```

### GitHub Actions Issues

**Deployment fails:**
1. Check GitHub Actions logs
2. Verify SSH connection: `ssh deploy@your-server`
3. Verify secrets are configured correctly
4. Check server logs: `pm2 logs`

## 📝 Customization

### Change Port Numbers

1. Edit `pm2/ecosystem.config.js`:
```javascript
env: {
    PORT: 3000,  // Change this
}
```

2. Edit `nginx/nginx.conf`:
```nginx
upstream expense_analyzer_backend {
    server 127.0.0.1:3000;  // Update ports here
}
```

3. Restart services:
```bash
pm2 reload ecosystem.config.js
sudo systemctl reload nginx
```

### Add More Instances

1. Edit `pm2/ecosystem.config.js`:
```javascript
instances: 8,  // Increase number
```

2. Add to Nginx upstream:
```nginx
server 127.0.0.1:3004;
server 127.0.0.1:3005;
```

### Custom Domain

1. Edit `/etc/nginx/sites-available/expense-analyzer`
2. Update `server_name your-domain.com www.your-domain.com`
3. Run `sudo certbot --nginx -d your-domain.com`
4. Reload Nginx: `sudo systemctl reload nginx`

## 🔗 Useful Links

- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Let's Encrypt / Certbot](https://certbot.eff.org/)

## 📞 Support

For issues related to:
- **Infrastructure**: Check this README and troubleshooting section
- **Application**: Check your main application documentation
- **Deployment**: Review GitHub Actions logs and server logs

## 🔄 Update Instructions

### Update Infrastructure Configuration

1. Modify configuration files in `infrastructure/` directory
2. Test locally (if applicable)
3. Deploy changes:

```bash
# For Nginx changes
sudo bash infrastructure/scripts/setup-nginx.sh
sudo systemctl reload nginx

# For PM2 changes
pm2 reload infrastructure/pm2/ecosystem.config.js --env production
```

### Update Application

Use the deployment script:
```bash
bash infrastructure/scripts/deploy.sh
```

Or push to main branch for automatic deployment via GitHub Actions.

## ⚡ Performance Tips

1. **Enable HTTP/2**: Uncomment HTTPS configuration in Nginx
2. **Adjust Worker Processes**: Set to number of CPU cores in `nginx.conf`
3. **Tune PM2 Instances**: Set to CPU cores or CPU cores - 1
4. **Enable Caching**: Add caching rules to Nginx
5. **Use CDN**: For static assets (if any)
6. **Database Connection Pooling**: Already in your app
7. **Monitor**: Use `pm2 monit` and Nginx logs regularly

## 📄 License

This infrastructure configuration is part of the Expense Analyzer project.
