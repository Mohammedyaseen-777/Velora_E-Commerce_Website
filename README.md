# 🛍️ Velora — Full-Stack E-Commerce Website

A modern full-stack e-commerce platform built with **Next.js, TypeScript, Prisma, and PostgreSQL**, featuring product browsing, authentication, cart management, wishlist functionality, order processing, and an admin dashboard.

## 🚀 Live Demo

**[Visit Velora Live Demo](https://velora-e-commerce-website-five.vercel.app)**

## 💻 GitHub Repository

**[View Source Code on GitHub](https://github.com/Mohammedyaseen-777/Velora_E-Commerce_Website)**

---

## ✨ Features

* 🛒 Product browsing and product details
* 🔐 User registration and login
* 🛍️ Shopping cart management
* ❤️ Wishlist functionality
* 📦 Order placement and order history
* 💳 Cash on Delivery (COD) payment option
* 👤 User account management
* 🛠️ Admin dashboard
* 📊 Admin analytics
* 📦 Product management
* 👥 User management
* 🚚 Order management
* 📱 Responsive user interface
* 🔒 Server-side API routes
* 🗄️ PostgreSQL database integration
* ⚡ Prisma ORM
* 🚀 Production deployment with Vercel

---

## 🧑‍💻 Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* CSS Modules

### Backend

* Next.js API Routes
* TypeScript
* Prisma ORM

### Database

* PostgreSQL
* Neon PostgreSQL

### Authentication

* Custom session-based authentication
* Secure HTTP cookies

### Deployment

* Vercel

### Development Tools

* Git
* GitHub
* npm
* VS Code

---

## 🏗️ Project Architecture

```text
Velora
│
├── src/
│   ├── app/
│   │   ├── account/
│   │   ├── admin/
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── cart/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   └── wishlist/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── login/
│   │   ├── products/
│   │   ├── signup/
│   │   └── wishlist/
│   │
│   └── lib/
│       ├── auth.ts
│       ├── admin.ts
│       └── prisma.ts
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── package.json
├── prisma.config.ts
├── next.config.ts
└── tsconfig.json
```

---

## 🔑 Core API Modules

| Module                 | Purpose                       |
| ---------------------- | ----------------------------- |
| `/api/auth`            | User authentication           |
| `/api/products`        | Product operations            |
| `/api/cart`            | Shopping cart operations      |
| `/api/wishlist`        | Wishlist operations           |
| `/api/orders`          | Order creation and processing |
| `/api/admin/products`  | Admin product management      |
| `/api/admin/orders`    | Admin order management        |
| `/api/admin/users`     | Admin user management         |
| `/api/admin/analytics` | Store analytics               |

---

## 🛠️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Mohammedyaseen-777/Velora_E-Commerce_Website.git
```

### 2. Navigate to the Project

```bash
cd Velora_E-Commerce_Website
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` or `.env.local` file and configure the required environment variables.

Example:

```env
DATABASE_URL="your-postgresql-database-url"
```

> Never commit your `.env` or `.env.local` files to GitHub.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🏭 Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

---

## 🚀 Deployment

Velora is deployed using **Vercel**.

### Production Deployment

```text
GitHub Repository
        ↓
     Vercel
        ↓
Production Build
        ↓
Velora Live Website
```

**Live Website:**
https://velora-e-commerce-website-five.vercel.app

---

## 🗄️ Database

Velora uses **PostgreSQL** as its database and **Prisma ORM** for database access.

The application manages data including:

* Users
* Products
* Cart items
* Wishlist items
* Orders
* Order items
* Product inventory

Prisma Client is generated during installation/deployment to ensure the application has access to the generated database client.

---

## 🔐 Security

The application includes:

* Authentication-protected routes
* Session-based user authentication
* HTTP cookie-based sessions
* Server-side validation
* Stock validation before order creation
* Admin access control
* Environment variables for sensitive configuration

---

## 📱 Responsive Design

Velora is designed to provide a consistent shopping experience across:

* 💻 Desktop
* 💻 Laptop
* 📱 Mobile
* 📟 Tablet

---

## 🎯 Project Goals

The project was developed to demonstrate practical full-stack development skills including:

* Frontend development
* Backend API development
* Database design
* Authentication
* CRUD operations
* E-commerce workflows
* Inventory management
* Admin dashboard development
* Production deployment
* Git and GitHub workflow

---

## 📸 Project Preview

### Homepage

Visit the live application to explore the complete Velora shopping experience:

**[🚀 Open Velora](https://velora-e-commerce-website-five.vercel.app)**

---

## 🔮 Future Improvements

Potential future improvements include:

* Online payment gateway integration
* Product reviews and ratings
* Advanced product filtering
* Search optimization
* Coupon and discount system
* Order tracking
* Email notifications
* Product recommendations
* Advanced analytics
* Improved caching and performance optimization

---

## 👨‍💻 Developer

**Mohammed Yaseen Mujib Kureshi**

Aspiring software engineer focused on building practical, scalable, and production-ready applications.

### 🔗 Links

* **Live Demo:** https://velora-e-commerce-website-five.vercel.app
* **GitHub:** https://github.com/Mohammedyaseen-777/Velora_E-Commerce_Website

---

## ⭐ If You Like This Project

If you found this project interesting, consider giving the repository a ⭐ on GitHub.

---

## 📄 License

This project was created for educational, portfolio, and development purposes.
