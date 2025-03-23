# Roberto Save Dreams Foundation - Deployment Guide

## Table of Contents
1. [Initial Server Setup](#initial-server-setup)
2. [Application Deployment](#application-deployment)
3. [Database Management](#database-management)
4. [Updating the Application](#updating-the-application)
5. [Troubleshooting](#troubleshooting)

## Initial Server Setup

### Server Requirements
- Ubuntu Server (Latest LTS version)
- Node.js 18.x or higher
- PostgreSQL 14 or higher
- Nginx
- PM2 (Node.js process manager)

### Basic Server Setup
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2 globally
sudo npm install -p pm2@latest -g
```

### PostgreSQL Setup
```bash
# Access PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE roberto_save_dreams;
CREATE USER roberto_admin WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE roberto_save_dreams TO roberto_admin;

# Exit PostgreSQL
\q
```

## Application Deployment

### 1. Clone and Setup Application
```bash
# Create application directory
mkdir -p /var/www/roberto-save-dreams
cd /var/www/roberto-save-dreams

# Clone repository (if using git)
git clone your_repository_url .

# Install dependencies
npm install
```

### 2. Environment Setup
```bash
# Create .env file
cat > .env << EOL
DATABASE_URL="postgresql://roberto_admin:your_password@localhost:5432/roberto_save_dreams"
NEXT_PUBLIC_API_URL="https://robertosavedreamsfoundation.org"
# Add other environment variables as needed
EOL
```

### 3. Database Migration
```bash
# Run Prisma migrations
npx prisma generate
npx prisma migrate deploy
```

### 4. Build and Start Application
```bash
# Build the application
npm run build

# Start with PM2
pm2 start npm --name "roberto-save-dreams" -- start
pm2 save
pm2 startup systemd
```

### 5. Nginx Configuration
```bash
# Create Nginx configuration
sudo nano /etc/nginx/conf.d/robertosavedreamsfoundation.org.conf

# Add the following configuration
server {
    listen 80;
    server_name robertosavedreamsfoundation.org www.robertosavedreamsfoundation.org;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

## Updating the Application

### 1. Code Updates
```bash
# Navigate to application directory
cd /var/www/roberto-save-dreams

# If using git, pull latest changes
git pull origin main

# If manually updating, upload new files using SCP
scp -r /path/to/local/files root@69.62.109.183:/var/www/roberto-save-dreams/

# Install dependencies if needed
npm install

# Rebuild the application
npm run build

# Restart the application
pm2 restart roberto-save-dreams
```

### 2. Database Updates
```bash
# Generate new Prisma client if schema changed
npx prisma generate

# Run migrations
npx prisma migrate deploy

# If you need to reset the database (CAUTION: This will delete all data)
npx prisma migrate reset

# To create a new migration
npx prisma migrate dev --name your_migration_name
```

## Troubleshooting

### Common Commands

#### PM2 Commands
```bash
# Check application status
pm2 status

# View logs
pm2 logs roberto-save-dreams

# Monitor resources
pm2 monit

# Restart application
pm2 restart roberto-save-dreams
```

#### Nginx Commands
```bash
# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx

# View logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

#### Database Commands
```bash
# Access PostgreSQL
sudo -u postgres psql

# List databases
\l

# Connect to database
\c roberto_save_dreams

# List tables
\dt

# Exit PostgreSQL
\q
```

### Common Issues

1. **Application Not Starting**
   - Check PM2 logs: `pm2 logs`
   - Verify environment variables
   - Check Node.js version: `node -v`

2. **Database Connection Issues**
   - Verify PostgreSQL is running: `sudo systemctl status postgresql`
   - Check database credentials in .env file
   - Ensure database exists and user has proper permissions

3. **Nginx Issues**
   - Check Nginx status: `sudo systemctl status nginx`
   - Verify configuration syntax: `sudo nginx -t`
   - Check error logs: `sudo tail -f /var/log/nginx/error.log`

## Security Notes

1. Always keep system packages updated
2. Use strong passwords for database and user accounts
3. Consider implementing SSL/TLS using Let's Encrypt
4. Regularly backup your database
5. Monitor server resources and logs

## Backup Procedures

### Database Backup
```bash
# Create backup
pg_dump -U roberto_admin roberto_save_dreams > backup.sql

# Restore from backup
psql -U roberto_admin roberto_save_dreams < backup.sql
```

### Application Backup
```bash
# Backup application files
tar -czf roberto_save_dreams_backup.tar.gz /var/www/roberto-save-dreams

# Backup environment variables
cp /var/www/roberto-save-dreams/.env /var/www/roberto-save-dreams/.env.backup
```

## Contact Information

For support or questions, contact:
- Technical Support: [Your Contact Information]
- Emergency Contact: [Emergency Contact Information] 