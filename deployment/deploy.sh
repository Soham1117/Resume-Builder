#!/bin/bash

# Resume Builder Deployment Script for AWS EC2
# This script sets up the Spring Boot application with nginx and PostgreSQL

set -e  # Exit on any error

echo "🚀 Starting Resume Builder deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Please run as a regular user with sudo privileges."
   exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages
print_status "Installing required packages..."
sudo apt install -y \
    openjdk-21-jdk \
    nginx \
    postgresql \
    postgresql-contrib \
    curl \
    wget \
    unzip \
    git \
    maven \
    certbot \
    python3-certbot-nginx

# Create application user
print_status "Creating application user..."
sudo useradd -r -s /bin/false resume-app || print_warning "User resume-app already exists"

# Create application directory
print_status "Creating application directory..."
sudo mkdir -p /opt/resume-builder
sudo mkdir -p /opt/resume-builder/generated-pdfs
sudo mkdir -p /opt/resume-builder/logs
sudo chown -R resume-app:resume-app /opt/resume-builder

# Set up PostgreSQL
print_status "Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE DATABASE resumedb;" || print_warning "Database resumedb might already exist"
sudo -u postgres psql -c "CREATE USER resumeuser WITH PASSWORD 'your_secure_password_here';" || print_warning "User resumeuser might already exist"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE resumedb TO resumeuser;"
sudo -u postgres psql -c "ALTER USER resumeuser CREATEDB;"

# Configure PostgreSQL for remote connections (if needed)
print_status "Configuring PostgreSQL..."
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = 'localhost'/" /etc/postgresql/*/main/postgresql.conf
sudo systemctl restart postgresql

# Build the application
print_status "Building the Spring Boot application..."
cd /tmp
git clone https://github.com/your-username/resume-builder.git || print_warning "Repository might already exist"
cd resume-builder
mvn clean package -DskipTests

# Copy the JAR file
print_status "Installing the application..."
sudo cp target/resume-updater-1.0.0.jar /opt/resume-builder/resume-updater.jar
sudo chown resume-app:resume-app /opt/resume-builder/resume-updater.jar

# Copy nginx configuration
print_status "Configuring nginx..."
sudo cp deployment/nginx.conf /etc/nginx/sites-available/resume-builder
sudo ln -sf /etc/nginx/sites-available/resume-builder /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default  # Remove default site

# Test nginx configuration
sudo nginx -t

# Copy systemd service file
print_status "Setting up systemd service..."
sudo cp deployment/systemd-service.conf /etc/systemd/system/resume-builder.service

# Reload systemd and enable services
sudo systemctl daemon-reload
sudo systemctl enable resume-builder
sudo systemctl enable nginx

# Create environment file
print_status "Creating environment configuration..."
sudo tee /opt/resume-builder/.env > /dev/null <<EOF
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resumedb
DB_USERNAME=resumeuser
DB_PASSWORD=your_secure_password_here

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_here

# LLM Configuration
LLM_API_KEY=your_llm_api_key_here
LLM_PROVIDER=groq
LLM_MODEL=llama3-8b-8192

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

# Server Configuration
SERVER_PORT=8080
SERVER_CONTEXT_PATH=/api

# Logging
LOG_LEVEL_ROOT=INFO
LOG_LEVEL_APP=INFO
EOF

sudo chown resume-app:resume-app /opt/resume-builder/.env
sudo chmod 600 /opt/resume-builder/.env

# Start services
print_status "Starting services..."
sudo systemctl start resume-builder
sudo systemctl start nginx

# Wait for application to start
print_status "Waiting for application to start..."
sleep 10

# Check if application is running
if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    print_status "✅ Application is running successfully!"
else
    print_error "❌ Application failed to start. Check logs with: sudo journalctl -u resume-builder -f"
    exit 1
fi

# Configure firewall
print_status "Configuring firewall..."
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw --force enable

# Set up SSL with Let's Encrypt (optional)
read -p "Do you want to set up SSL with Let's Encrypt? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter your domain name: " domain_name
    if [ ! -z "$domain_name" ]; then
        print_status "Setting up SSL for domain: $domain_name"
        sudo certbot --nginx -d $domain_name --non-interactive --agree-tos --email your-email@example.com
    fi
fi

# Create health check script
print_status "Creating health check script..."
sudo tee /opt/resume-builder/health-check.sh > /dev/null <<'EOF'
#!/bin/bash
if curl -f http://localhost:8080/api/health > /dev/null 2>&1; then
    echo "Application is healthy"
    exit 0
else
    echo "Application is not responding"
    exit 1
fi
EOF

sudo chmod +x /opt/resume-builder/health-check.sh
sudo chown resume-app:resume-app /opt/resume-builder/health-check.sh

# Create backup script
print_status "Creating backup script..."
sudo tee /opt/resume-builder/backup.sh > /dev/null <<'EOF'
#!/bin/bash
BACKUP_DIR="/opt/backups/resume-builder"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
pg_dump -h localhost -U resumeuser -d resumedb > $BACKUP_DIR/db_backup_$DATE.sql

# Backup generated PDFs
tar -czf $BACKUP_DIR/pdfs_backup_$DATE.tar.gz -C /opt/resume-builder generated-pdfs

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

sudo chmod +x /opt/resume-builder/backup.sh
sudo chown resume-app:resume-app /opt/resume-builder/backup.sh

# Set up daily backup cron job
print_status "Setting up daily backup..."
echo "0 2 * * * /opt/resume-builder/backup.sh" | sudo crontab -

print_status "🎉 Deployment completed successfully!"
print_status "Your application is now running at: http://your-domain.com/api"
print_status ""
print_status "Useful commands:"
print_status "  Check application status: sudo systemctl status resume-builder"
print_status "  View application logs: sudo journalctl -u resume-builder -f"
print_status "  Restart application: sudo systemctl restart resume-builder"
print_status "  Check nginx status: sudo systemctl status nginx"
print_status "  View nginx logs: sudo tail -f /var/log/nginx/error.log"
print_status ""
print_warning "⚠️  Don't forget to:"
print_warning "  1. Update the domain name in nginx.conf"
print_warning "  2. Set secure passwords in the .env file"
print_warning "  3. Configure your API keys"
print_warning "  4. Set up monitoring and alerting" 