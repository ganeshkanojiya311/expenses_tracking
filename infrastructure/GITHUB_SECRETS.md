# GitHub Secrets Configuration Guide

This document lists all the GitHub Secrets you need to configure for the CI/CD pipeline.

## Required Secrets for Production Deployment

### SSH Configuration
- **`SSH_PRIVATE_KEY`**: Private SSH key for server access
- **`SERVER_HOST`**: Production server IP address or hostname (e.g., `192.168.1.100` or `api.example.com`)
- **`SERVER_USER`**: SSH username (default: `deploy`)
- **`DEPLOY_PATH`**: Absolute path to deployment directory (e.g., `/var/www/expense-analyzer`)

### Optional: Staging Environment
- **`SSH_PRIVATE_KEY_STAGING`**: Private SSH key for staging server
- **`STAGING_SERVER_HOST`**: Staging server IP or hostname
- **`STAGING_SERVER_USER`**: SSH username for staging
- **`STAGING_DEPLOY_PATH`**: Deployment path for staging

## How to Generate SSH Keys

On your local machine:

```bash
# Generate a new SSH key pair
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy

# This creates two files:
# - github_deploy (private key) - Copy content to GitHub Secret
# - github_deploy.pub (public key) - Add to server's authorized_keys
```

## How to Add SSH Public Key to Server

On your server:

```bash
# Login to your server as the deployment user
ssh deploy@your-server-ip

# Add the public key to authorized_keys
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "YOUR_PUBLIC_KEY_CONTENT" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

## How to Add Secrets to GitHub

1. Go to your GitHub repository
2. Click on **Settings** tab
3. Navigate to **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret:
   - **Name**: Secret name (e.g., `SSH_PRIVATE_KEY`)
   - **Value**: Secret value (paste the entire content)
6. Click **Add secret**

## Testing SSH Connection

Before setting up the workflow, test your SSH connection:

```bash
# Test with the private key
ssh -i ~/.ssh/github_deploy deploy@your-server-ip

# If successful, you should be logged into the server
```

## Example Configuration

### Production Setup
```
SSH_PRIVATE_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
[Your private key content]
-----END OPENSSH PRIVATE KEY-----

SERVER_HOST=192.168.1.100
SERVER_USER=deploy
DEPLOY_PATH=/var/www/expense-analyzer
```

### Staging Setup (Optional)
```
SSH_PRIVATE_KEY_STAGING=-----BEGIN OPENSSH PRIVATE KEY-----
[Your staging private key content]
-----END OPENSSH PRIVATE KEY-----

STAGING_SERVER_HOST=staging.example.com
STAGING_SERVER_USER=deploy
STAGING_DEPLOY_PATH=/var/www/expense-analyzer-staging
```

## Environment Variables on Server

Make sure your `.env` file is present on the server at the deployment path:

```bash
# On the server
cd /var/www/expense-analyzer
nano .env  # Add your environment variables
chmod 600 .env  # Secure the file
```

## Security Best Practices

1. **Use Separate Keys**: Different keys for production and staging
2. **Limit Key Access**: Restrict SSH key to specific IP addresses if possible
3. **Rotate Keys**: Regularly rotate SSH keys
4. **Principle of Least Privilege**: Deployment user should have minimal permissions
5. **Secure .env Files**: Never commit .env files to version control
6. **Use Strong Passwords**: For database and other services
7. **Regular Updates**: Keep server and dependencies updated

## Troubleshooting

### SSH Connection Fails
```bash
# Test SSH with verbose output
ssh -vvv -i ~/.ssh/github_deploy deploy@your-server-ip

# Check SSH key permissions
chmod 600 ~/.ssh/github_deploy
```

### Deployment Fails
1. Check GitHub Actions logs for detailed error messages
2. Verify all secrets are correctly configured
3. Test SSH connection manually
4. Ensure deployment path exists on server
5. Check server logs: `pm2 logs`

### Permission Denied
```bash
# On server, fix ownership
sudo chown -R deploy:deploy /var/www/expense-analyzer

# Fix permissions
chmod -R 755 /var/www/expense-analyzer
```

## Next Steps

After configuring secrets:
1. Push changes to trigger the workflow
2. Monitor GitHub Actions tab for deployment status
3. Check server logs if deployment fails
4. Verify application is running: `pm2 list`
