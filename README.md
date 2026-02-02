# LinkBio - Professional Link in Bio Portfolio

A self-hosted Link-in-Bio platform built with Astro, TailwindCSS, and MariaDB. Designed for performance and easy deployment on VPS (e.g., Hostinger).

## 🚀 Features

- **Public Profile Pages**: Fast, mobile-first profiles (`/l/[slug]`).
- **Admin Dashboard**: Manage profiles, links, and themes (`/dashboard`).
- **Customizable Themes**: Backgrounds, buttons, and fonts.
- **Self-Hosted**: Full control over your data.
- **SSR**: Server-Side Rendering for dynamic content.

## 🛠 Tech Stack

- **Framework**: Astro (Node.js Adapter)
- **Styling**: Tailwind CSS v4
- **Database**: MariaDB (MySQL compatible)
- **ORM**: Drizzle ORM
- **Runtime**: Node.js

## 📦 Project Structure

```text
/
├── public/           # Static assets
├── src/
│   ├── components/   # UI components
│   ├── db/           # Database schema and client
│   ├── layouts/      # Page layouts
│   ├── pages/        # Routes
│   │   ├── api/      # API endpoints (Auth)
│   │   ├── dashboard/# Admin interface
│   │   └── l/        # Public link profiles
│   └── styles/       # Global styles
└── astro.config.mjs  # Astro configuration
```

## 🧞 Development

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Environment**:
    Create a `.env` file in the root directory (optional for dev if using fallback/mock mode, required for DB connection):
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=link_bio
    DB_PORT=3306
    ```

3.  **Setup Database**:
    Ensure you have MariaDB running and create the database `link_bio`.
    (Schema is defined in `src/db/schema.ts`. Use Drizzle Kit to push schema changes if you have a local DB).

    To generate a password hash for your admin user:
    ```bash
    node scripts/hash-password.js your_secure_password
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## ☁️ Deployment on Hostinger VPS

Follow these steps to deploy your application to a Hostinger VPS (or any Ubuntu/Debian server).

### 1. VPS Setup & Dependencies

Connect to your VPS via SSH:
```bash
ssh root@your_vps_ip
```

Update system and install Node.js (v18+) and MariaDB:
```bash
# Update system
apt update && apt upgrade -y

# Install Node.js (using nvm or setup_node)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install MariaDB
apt install -y mariadb-server
```

### 2. Database Configuration

Secure MariaDB and create a database:
```bash
mysql_secure_installation
```

Log in to MySQL and create the database and user:
```sql
sudo mysql -u root -p

CREATE DATABASE link_bio;
CREATE USER 'link_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON link_bio.* TO 'link_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Application Deployment

Navigate to `/var/www` and clone your repository or upload files:
```bash
cd /var/www
git clone https://github.com/your-username/your-repo.git linkbio
cd linkbio
```

Install dependencies and build:
```bash
npm install
npm run build
```

The build output will be in `dist/`.

### 4. Running the Application (PM2)

Install PM2 to keep the app running:
```bash
npm install -g pm2
```

Start the app:
```bash
# Set environment variables inline or use ecosystem.config.js
# NOTE: Replace the values with your actual database credentials
DB_HOST=localhost DB_USER=link_user DB_PASSWORD=your_secure_password DB_NAME=link_bio PORT=4321 pm2 start dist/server/entry.mjs --name "linkbio"
```

Save the process list:
```bash
pm2 save
pm2 startup
```

### 5. Setup Nginx Reverse Proxy

Install Nginx:
```bash
apt install -y nginx
```

Create a site configuration:
```bash
nano /etc/nginx/sites-available/linkbio
```

Add the following (replace `yourdomain.com` with your domain):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:
```bash
ln -s /etc/nginx/sites-available/linkbio /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 6. SSL (HTTPS)

Secure your site with Certbot:
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com
```

Your site is now live!
