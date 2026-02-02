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

## 📖 User Guide

### Accessing the Dashboard

1.  Navigate to `/login`.
2.  Enter your admin credentials.

### Development Mode (Fallback Login)

If you are running the project locally (`npm run dev`) and **do not** have a database configured (no `.env` file or `DB_HOST` unset), the system enables a **Demo Mode**.

*   **URL**: `http://localhost:4321/login`
*   **Email**: `admin@example.com`
*   **Password**: `password`

*Note: This mode is strictly disabled in production environments for security.*

### Managing Profiles

Once logged in to the dashboard:

1.  **View Profiles**: You will see a list of all your link profiles.
2.  **Edit Profile**: Click "Edit" on a profile card/row.
3.  **Update Details**:
    *   **Slug**: Change the URL of your public profile (e.g., `example.com/l/myslug`).
    *   **Display Name & Bio**: Update your personal information.
    *   **Theme**: Enter Tailwind CSS classes for background (e.g., `bg-slate-900`, `bg-gradient-to-r from-blue-500 to-purple-600`) and text color.
4.  **Manage Links**:
    *   **Add Link**: Click "+ Add Link" to create a new entry.
    *   **Reorder**: Use the Up/Down arrows to change the order of links.
    *   **Toggle**: Use the toggle switch to hide/show links without deleting them.
    *   **Remove**: Click "Remove" to delete a link.
5.  **Save**: Click "Save Changes" at the top or bottom of the editor.

### Creating an Admin User (Production)

To create a real admin user in your MariaDB database:

1.  **Generate a Password Hash**:
    Run the included utility script locally:
    ```bash
    node scripts/hash-password.js your_secure_password
    ```
    *Output example:* `$2a$10$X7...`

2.  **Insert User into Database**:
    Access your database (via CLI or phpMyAdmin) and run:
    ```sql
    INSERT INTO users (email, password_hash) VALUES ('your@email.com', '$2a$10$X7...');
    ```

## 🧞 Development Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```env
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=link_bio
    DB_PORT=3306
    ```

3.  **Setup Database**:
    Ensure MariaDB is running and create the `link_bio` database.
    (Schema is defined in `src/db/schema.ts`).

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

-- Create the admin user (replace hash with one generated from scripts/hash-password.js)
USE link_bio;
-- Note: You must run the schema migration or create tables first (see below) before inserting!
EXIT;
```

*Tip: Use `drizzle-kit push` from your local machine (connected to remote DB via SSH tunnel) or manually create tables based on `src/db/schema.ts`.*

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
