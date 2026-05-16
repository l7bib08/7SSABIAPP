# 7SSABI — Shop Management App 

> A mobile-first web application for small shop owners to manage 
> sales, credit clients, expenses, and daily reports.

Built in **6 months** as a real solution for a real person —
a small shop owner who was tracking everything on paper.

---

## Problem

Small shop owners in Morocco manage:
- Client debts on paper notebooks
- Sales with no tracking
- Expenses with no record
- Profit by estimation

**7SSABI solves all of this from a single mobile screen.**

---

## Features

| Feature | Description |
|---|---|
| Cash Sales | Record sales with multiple items instantly |
| Credit Sales | Link sales to clients and auto-update their debt |
| Expenses | Track all daily expenses with notes |
| Client Payments | Record payments and reduce client debt automatically |
| Daily Reports | Full report: sales, expenses, profit, debtors |
| PDF Export | Export any day's report as a structured PDF |
| CSV Backup | Download all data as a CSV file |
| Arabic RTL | Full Arabic version with RTL layout |
| PWA | Installable on mobile like a native app |

---

## Tech Stack

**Backend**
- PHP 8 (no framework)
- MySQL with PDO
- REST API architecture
- Session-based authentication

**Frontend**
- Vanilla JavaScript (ES6 modules)
- Single Page Application
- Mobile-first CSS
- Progressive Web App (PWA)

**Database**
- 7 linked tables
- Foreign keys with cascade
- Atomic transactions

---

## Database Schema

users
└── commerce (1 per user)
└── clients
└── sales (credit)
└── sale_items
└── payments
└── sales (cash)
└── sale_items
└── expenses

---

## 📂 Project Structure

```text
7SSABIAPP/
│
├── index.php              # Main SPA entry point (FR)
├── index_ar.php           # Arabic RTL version
├── style.css              # Main stylesheet
├── style_ar.css           # RTL overrides
├── manifest.json          # PWA manifest
├── sw.js                  # Service Worker
│
├── jibi_php/
│   ├── db.php             # PDO connection
│   ├── login.php          # Authentication
│   └── signup.php         # Registration
│
├── api/
│   ├── auth/
│   │   ├── session.php
│   │   └── logout.php
│   │
│   ├── sales/
│   │   └── create.php
│   │
│   ├── clients/
│   │   ├── index.php
│   │   ├── create.php
│   │   ├── update.php
│   │   └── delete.php
│   │
│   ├── expenses/
│   │   └── create.php
│   │
│   ├── payments/
│   │   └── create.php
│   │
│   ├── commerce/
│   │   ├── get.php
│   │   └── save.php
│   │
│   └── reports/
│       ├── today.php
│       └── export.php
│
├── js/
│   ├── main.js
│   ├── state.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   └── validators.js
│   │
│   ├── screens/
│   │   ├── home.js
│   │   ├── cash.js
│   │   ├── credit.js
│   │   ├── expense.js
│   │   ├── clients.js
│   │   ├── reports.js
│   │   ├── profile.js
│   │   └── auth.js
│   │
│   ├── overlay/
│   │   └── overlay.js
│   │
│   └── ui/
│       ├── navigation.js
│       └── notifications.js
```

---

## 🚀 Installation (Local)

**Requirements**
- XAMPP (Apache + MySQL + PHP 8)

**Steps**

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/7ssabi.git

# 2. Move to XAMPP htdocs
mv 7ssabi /xampp/htdocs/

# 3. Import the database
# Open phpMyAdmin → Create database "gestion_boutique"
# Import the file: database/gestion_boutique.sql

# 4. Configure db.php
# Edit jibi_php/db.php with your MySQL credentials

# 5. Open in browser
# http://localhost/7ssabi/index.php
```

---

## 🗃️ Database Setup

Run this SQL to create all tables:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_complet VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE commerce (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    nom VARCHAR(255) NOT NULL DEFAULT '',
    adresse VARCHAR(255) NOT NULL DEFAULT '',
    telephone VARCHAR(50) NOT NULL DEFAULT '',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nom_complet VARCHAR(255) NOT NULL,
    telephone VARCHAR(50),
    credit_limit DECIMAL(10,2) DEFAULT 0,
    dette DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    client_id INT DEFAULT NULL,
    type ENUM('cash','credit') NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);

CREATE TABLE sale_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE
);

CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    client_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);
```

---

## Author

**Mouad Lahbib Arbaoui**
Software Engineering Student — System Engineering & Digital Transformation

[LinkedIn](www.linkedin.com/in/mouad-lahbib-arbaoui-698865394) • [GitHub](https://github.com/l7bib08)

---

## License

This project is open source and available under the [MIT License](LICENSE).
